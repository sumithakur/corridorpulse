import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult, ThesisConfig } from "@/lib/types";
import { DEFAULT_THESIS_CONFIG } from "@/lib/thesisPresets";
import { checkRateLimit } from "@/lib/ratelimit";

export const maxDuration = 60; // Allow 60s timeout for deep LLM evaluation

function buildDynamicSystemPrompt(thesis: ThesisConfig): string {
  const strictnessDescriptions: Record<number, string> = {
    1: "STRICTNESS LEVEL 1 (Lenient / Founder-Friendly): Give the startup the benefit of the doubt on early stage execution gaps. Prioritize upside vision, explore creative commercialization pathways, and offer constructive feedback.",
    2: "STRICTNESS LEVEL 2 (Early Exploration): Balance early-stage upside with basic technical execution and team feasibility risks.",
    3: "STRICTNESS LEVEL 3 (Institutional VC Partner): Standard tier-1 VC partner rigor. Require clear technical defensibility, sound unit economics, and defensible go-to-market assumptions.",
    4: "STRICTNESS LEVEL 4 (High-Hurdle Diligence): Demanding institutional hurdle. Aggressively audit technical moats, margin viability against the hurdle, and operational deployment friction.",
    5: "STRICTNESS LEVEL 5 (Ruthless Institutional IC Audit): ZERO FLUFF TOLERANCE. Heavily penalize any unsubstantiated traction claims, hand-waving technical architectures, low gross margins below hurdle, or any violation of custom directives. Reject generic wrappers or unvalidated claims immediately.",
  };

  const strictnessGuide = strictnessDescriptions[thesis.diligenceStrictness] || strictnessDescriptions[3];

  const customDirectivesSection = thesis.customDirectives?.trim()
    ? `
MANDATORY USER-DEFINED IC DIRECTIVES & HARD EXCLUSIONS:
The user/investment committee has mandated the following non-negotiable criteria:
"${thesis.customDirectives.trim()}"

AUDIT INSTRUCTION FOR DIRECTIVES:
Evaluate whether the startup strictly complies with each part of the user's directives. In the JSON output under \`thesisFit.directivesCompliance\`, create an entry for each directive component, specifying \`directive\` (the rule), \`compliant\` (boolean), and \`analysis\` (concise explanation).
`
    : `
MANDATORY USER-DEFINED IC DIRECTIVES:
No custom negative exclusions provided. Evaluate standard sector benchmarks and defensibility criteria.
`;

  return `
You are an institutional Venture Capital Partner and Senior Investment Committee Diligence Lead.

CURRENT INVESTMENT THESIS CONSTRAINTS CONFIGURED FOR THIS EVALUATION:
- Target Investment Stage: ${thesis.targetStage}
- Target Deployment Regions: ${thesis.targetDeploymentRegions.join(", ")}
- Sourcing / R&D Origin: ${thesis.sourcingRndOrigin}
- Core Sector Focus: ${thesis.coreSectorFocus.join(", ")}
- Tech Depth Hurdle: ${thesis.techDepthHurdle}
- Strategic Mandate: ${thesis.strategicMandate}
- Minimum Target Gross Margin: ≥${thesis.minTargetGrossMargin}%
- Diligence Strictness Calibration: ${strictnessGuide}

${customDirectivesSection}

CRITICAL EVALUATION GUIDELINES:
1. BAN GENERIC FLUFF. Provide blunt, direct, critical, highly quantitative, and actionable feedback calibrated to the Strictness Level (${thesis.diligenceStrictness}/5).
2. THESIS FIT AUDIT: Explicitly grade alignment against the configured Target Regions (${thesis.targetDeploymentRegions.join(", ")}), Sector Focus (${thesis.coreSectorFocus.join(", ")}), Stage (${thesis.targetStage}), and Tech Depth Hurdle (${thesis.techDepthHurdle}).
3. UNIT ECONOMICS & MARGIN BENCHMARK: Test whether the startup's current or projected gross margin meets the target hurdle of ≥${thesis.minTargetGrossMargin}%. Penalize hardware or service drag that erodes margin.
4. SOVEREIGN & REGULATORY AUDIT: Check compliance with regional data residency (e.g. UAE DESC, Saudi NCA ECC if GCC is selected) or relevant enterprise data privacy standards.

EVALUATION PILLARS (Must total 0-100 overall, each pillar scored 0-25):
- Mandate & Thesis Alignment (0-25): Direct alignment with configured target regions, stage (${thesis.targetStage}), sector focus, and strategic procurement intent.
- Technical & IP Defensibility (0-25): Defensibility against the configured Tech Depth Hurdle (${thesis.techDepthHurdle}). Genuine hardware-software integration or proprietary algorithmic moat vs superficial wrapper.
- Operational & Deployment Viability (0-25): Reliability in harsh physical environments (extreme heat, dust, desert) or enterprise scale-out conditions; maintenance footprint.
- Unit Economics & BOM Feasibility (0-25): Hardware gross margins, software ARR add-on viability, customer payback timeline, and compliance with the ≥${thesis.minTargetGrossMargin}% gross margin target.

RECOMMENDATION RULES:
- "Proceed to Diligence": Overall score >= 75 with thesisFit.matchScore >= 70% and no unaddressed catastrophic red flags.
- "Conditional Pilot Only": Overall score 50-74, or strong tech/regional potential but unproven margins or partial thesis misalignment.
- "Pass": Overall score < 50, thesis fit < 50%, or severe unaddressed red flags / directive violations.

OUTPUT REQUIREMENTS:
You MUST respond with valid JSON ONLY conforming strictly to the requested JSON schema.
`.trim();
}

const JSON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    companyProfile: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        oneLiner: { type: Type.STRING },
        hqLocation: { type: Type.STRING },
        primarySector: { type: Type.STRING },
        stage: { type: Type.STRING },
      },
      required: ["name", "oneLiner", "hqLocation", "primarySector", "stage"],
    },
    overallAssessment: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Overall score from 0 to 100" },
        recommendation: { 
          type: Type.STRING, 
          enum: ["Proceed to Diligence", "Conditional Pilot Only", "Pass"] 
        },
        summaryRationale: { type: Type.STRING },
      },
      required: ["score", "recommendation", "summaryRationale"],
    },
    thesisFit: {
      type: Type.OBJECT,
      properties: {
        matchScore: { type: Type.NUMBER, description: "Thesis match score from 0 to 100 percentage" },
        verdict: {
          type: Type.STRING,
          enum: ["High Alignment", "Moderate Fit", "Misaligned"],
        },
        alignmentSummary: { type: Type.STRING, description: "Concise summary of thesis alignment and whether it complies with user custom directives" },
        directivesCompliance: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              directive: { type: Type.STRING },
              compliant: { type: Type.BOOLEAN },
              analysis: { type: Type.STRING },
            },
            required: ["directive", "compliant", "analysis"],
          },
        },
      },
      required: ["matchScore", "verdict", "alignmentSummary", "directivesCompliance"],
    },
    evaluationPillars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pillarName: { 
            type: Type.STRING, 
            enum: [
              "Mandate & Thesis Alignment", 
              "Technical & IP Defensibility", 
              "Operational & Deployment Viability", 
              "Unit Economics & BOM Feasibility"
            ] 
          },
          score: { type: Type.NUMBER, description: "Pillar score from 0 to 25" },
          verdict: { type: Type.STRING, enum: ["Strong", "Moderate", "Critical Risk"] },
          findings: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Bullet points detailing quantitative & technical findings" 
          },
        },
        required: ["pillarName", "score", "verdict", "findings"],
      },
    },
    gccPilotFit: {
      type: Type.OBJECT,
      properties: {
        targetSectors: { type: Type.ARRAY, items: { type: Type.STRING } },
        dataResidencyFriction: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
        potentialRegionalPartners: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["targetSectors", "dataResidencyFriction", "potentialRegionalPartners"],
    },
    redFlags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    keyQuestionsForFounder: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    "companyProfile",
    "overallAssessment",
    "thesisFit",
    "evaluationPillars",
    "gccPilotFit",
    "redFlags",
    "keyQuestionsForFounder",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { inputText, inputType, sourceName, customApiKey, thesisConfig } = body;

    if (!inputText || typeof inputText !== "string" || !inputText.trim()) {
      return NextResponse.json(
        { error: "Please provide valid pitch deck content or raw notes for evaluation." },
        { status: 400 }
      );
    }

    // Dual API Key Architecture: Check header first, then fallback to request body
    const headerCustomKey = req.headers.get("x-custom-api-key")?.trim();
    const resolvedCustomKey = headerCustomKey || (typeof customApiKey === "string" ? customApiKey.trim() : undefined);

    let apiKey: string | undefined;

    if (resolvedCustomKey) {
      // 1. Client provided a custom API key: execute with user key and NO rate limits
      apiKey = resolvedCustomKey;
    } else {
      // 2. No custom key provided: apply IP-based rate limit (5 evaluations per IP per hour)
      const forwardedFor = req.headers.get("x-forwarded-for");
      const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

      const { success } = await checkRateLimit(clientIp);

      if (!success) {
        return NextResponse.json(
          { 
            error: "Free trial limit reached (5 screens/hr). Click the Settings gear to add your free Gemini API key to continue." 
          },
          { status: 429 }
        );
      }

      // Use the server's environment key for the free trial tier
      apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { 
            error: "No Gemini API key detected. Please click the Settings gear in the top navigation to input your Google Gemini API key or configure GEMINI_API_KEY." 
          },
          { status: 401 }
        );
      }
    }

    const activeThesis: ThesisConfig = thesisConfig && typeof thesisConfig === "object"
      ? {
          ...DEFAULT_THESIS_CONFIG,
          ...thesisConfig,
        }
      : DEFAULT_THESIS_CONFIG;

    const systemPrompt = buildDynamicSystemPrompt(activeThesis);

    const ai = new GoogleGenAI({ apiKey });

    // Primary model: gemini-3.6-flash, fallback: gemini-3.7-flash
    const candidateModels = ["gemini-3.6-flash", "gemini-3.7-flash"];

    const promptText = `
EVALUATE THE FOLLOWING STARTUP DECK / PITCH MATERIAL AGAINST CONFIGURED THESIS:
Source Type: ${inputType || "raw_text"} ${sourceName ? `(${sourceName})` : ""}

PITCH CONTENT:
${inputText}

Perform an institutional partner-level evaluation strictly according to the configured system instructions and thesis criteria. Output pure valid JSON matching the response schema.
`.trim();

    let responseText: string | undefined;
    let evaluationError: unknown = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: promptText,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: JSON_SCHEMA,
            temperature: 0.2, // Low temperature for consistent quantitative analysis
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: unknown) {
        evaluationError = err;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`Model ${model} attempt failed:`, errMsg);
      }
    }

    if (!responseText) {
      if (evaluationError instanceof Error) {
        throw evaluationError;
      }
      throw new Error("Received empty response from Gemini API.");
    }

    let parsedResult: EvaluationResult;
    try {
      parsedResult = JSON.parse(responseText);
    } catch (err) {
      console.error("JSON parsing error:", err, "Raw response:", responseText);
      throw new Error("Failed to parse Gemini evaluation output as valid JSON format.");
    }

    // Sanitize and ensure numeric constraints
    if (parsedResult.overallAssessment) {
      parsedResult.overallAssessment.score = Math.min(100, Math.max(0, Math.round(parsedResult.overallAssessment.score || 0)));
    }
    if (parsedResult.thesisFit) {
      parsedResult.thesisFit.matchScore = Math.min(100, Math.max(0, Math.round(parsedResult.thesisFit.matchScore || 0)));
    }
    if (Array.isArray(parsedResult.evaluationPillars)) {
      parsedResult.evaluationPillars = parsedResult.evaluationPillars.map((p) => ({
        ...p,
        score: Math.min(25, Math.max(0, Math.round(p.score || 0))),
      }));
    }

    // Attach the thesis configuration evaluated against
    parsedResult.evaluatedThesis = activeThesis;

    return NextResponse.json({ success: true, result: parsedResult });
  } catch (error: unknown) {
    console.error("Error in /api/evaluate route:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred during LLM evaluation.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
