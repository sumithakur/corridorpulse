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
    3: "STRICTNESS LEVEL 3 (Institutional VC Partner): Standard tier-1 VC partner rigor. Require clear technical defensibility, sound business model viability, and defensible go-to-market assumptions.",
    4: "STRICTNESS LEVEL 4 (High-Hurdle Diligence): Demanding institutional hurdle. Aggressively audit technical moats, unit economics viability, and operational deployment friction.",
    5: "STRICTNESS LEVEL 5 (Ruthless Institutional IC Audit): ZERO FLUFF TOLERANCE. Heavily penalize unsubstantiated traction claims, hand-waving technical architectures, poor unit economics, or any violation of custom directives. Reject generic wrappers immediately.",
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

  const isGeneralDiscovery =
    thesis.presetId === "preset-general" ||
    (thesis.presetName && thesis.presetName.toLowerCase().includes("general discovery"));

  const sectorOrFirstPrinciplesGuidance = isGeneralDiscovery
    ? `
GENERAL DISCOVERY & FIRST-PRINCIPLES EVALUATION MODE:
- The user is screening an unknown or sector-agnostic startup.
- DO NOT force an India-GCC corridor, sovereign AI, or deeptech lens unless the startup's deck explicitly states or targets it.
- Evaluate the startup objectively on first principles across 4 core dimensions:
  1) Core Value Proposition & Problem Solved: Is this solving a real, burning, high-value problem with an unmistakable solution?
  2) Team & Execution Credibility: Does the founding team exhibit domain expertise, technical depth, or unfair distribution advantages?
  3) Market Opportunity & Sizing: Is the TAM sufficiently large ($1B+) or expanding rapidly?
  4) Known Risks, Blindspots, or Missing Information: What key data or proof points are missing from the deck?
`
    : `
TARGETED THESIS ALIGNMENT MODE:
- Active Mandate: ${thesis.presetName}
- Target Deployment Regions: ${thesis.targetDeploymentRegions.join(", ")}
- Sourcing / R&D Origin: ${thesis.sourcingRndOrigin}
- Core Sector Focus: ${thesis.coreSectorFocus.join(", ")}
- Tech Depth Hurdle: ${thesis.techDepthHurdle}
- Strategic Mandate: ${thesis.strategicMandate}
`;

  return `
You are an institutional Venture Capital Partner and Senior Investment Committee Diligence Lead.
Your evaluation directly powers an executive Pre-IC Deal Memo for the investment committee.

INVESTMENT CONTEXT & CONSTRAINTS:
- Target Investment Stage: ${thesis.targetStage}
- Diligence Strictness Calibration: ${strictnessGuide}
${sectorOrFirstPrinciplesGuidance}
${customDirectivesSection}

CRITICAL RULES ON GROSS MARGINS:
- DO NOT penalize early-stage startups or treat missing unit gross margins as a negative red flag.
- In early-stage decks (Pre-Seed, Seed, Series A), unit margin figures are rarely stated and are largely theoretical.
- Focus your commercial review on overall business model, pricing viability, and revenue mechanics rather than penalizing missing margin metrics.

PRE-IC DEAL MEMO REQUIREMENTS:
1. \`executiveSummary\`: Write a crisp, 2-3 sentence summary explaining what the startup actually does, their core target customer, and their monetization mechanism. Zero marketing fluff.
2. \`keyHighlights\`: Provide EXACTLY 3 high-impact bullet points detailing the startup's greatest strengths, competitive moats, or execution traction.
3. \`keyRisksAndGaps\`: Provide EXACTLY 3 high-impact bullet points detailing the biggest unverified claims, blindspots, or structural risks in the deck.
4. \`partnerCallQuestions\`: Provide EXACTLY 3 sharp, penetrating diligence questions for the deal team to ask the founders on their first partner intro call.
5. RECOMMENDATION RULES:
   - "Proceed to Intro Call": Strong proposition, credible team signals, or unique wedge worth taking an intro call (score typically >= 70).
   - "Keep on Radar": Promising market or tech, but too early, lacks product traction, unproven validation, or needs key milestones first (score 50-69).
   - "Pass": Critical red flags, unviable economics/business model, trivial wrapper, or fundamental thesis mismatch (score < 50).

EVALUATION PILLARS (Must total 0-100 overall, each scored 0-25):
- Mandate & Thesis Alignment (0-25): Alignment with investment stage, sector, and strategic intent.
- Technical & IP Defensibility (0-25): Defensibility against the Tech Depth Hurdle; proprietary software/hardware depth vs easily replicable wrapper.
- Operational & Deployment Viability (0-25): Execution complexity, customer friction, distribution scaling, and implementation feasibility.
- Unit Economics & BOM Feasibility (0-25): Business model viability, pricing power, customer payback timeline, and commercial scalability (without penalizing unstated early-stage margin numbers).

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
    executiveSummary: {
      type: Type.STRING,
      description: "2-3 sentences clearly explaining what the company actually does, who they sell to, and how they make money.",
    },
    keyHighlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 concise bullet points detailing the strongest highlights & strengths",
    },
    keyRisksAndGaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 concise bullet points detailing critical risks, blindspots, or missing deck data",
    },
    partnerCallQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 sharp diligence questions for the first partner call",
    },
    overallAssessment: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER, description: "Overall score from 0 to 100" },
        recommendation: { 
          type: Type.STRING, 
          enum: ["Proceed to Intro Call", "Keep on Radar", "Pass"] 
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
    "executiveSummary",
    "keyHighlights",
    "keyRisksAndGaps",
    "partnerCallQuestions",
    "overallAssessment",
    "thesisFit",
    "evaluationPillars",
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
      // Normalize recommendation if model returns an older variant
      const rec = parsedResult.overallAssessment.recommendation as string;
      if (rec === "Proceed to Diligence") {
        parsedResult.overallAssessment.recommendation = "Proceed to Intro Call";
      } else if (rec === "Conditional Pilot Only") {
        parsedResult.overallAssessment.recommendation = "Keep on Radar";
      } else if (rec !== "Proceed to Intro Call" && rec !== "Keep on Radar" && rec !== "Pass") {
        parsedResult.overallAssessment.recommendation = parsedResult.overallAssessment.score >= 70 ? "Proceed to Intro Call" : parsedResult.overallAssessment.score >= 50 ? "Keep on Radar" : "Pass";
      }
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

    // Ensure Pre-IC Deal Memo fields are always populated
    if (!parsedResult.executiveSummary) {
      parsedResult.executiveSummary = parsedResult.companyProfile?.oneLiner || parsedResult.overallAssessment?.summaryRationale || "";
    }
    if (!Array.isArray(parsedResult.keyHighlights) || parsedResult.keyHighlights.length === 0) {
      parsedResult.keyHighlights = parsedResult.evaluationPillars?.flatMap((p) => p.findings).slice(0, 3) || [];
    }
    if (!Array.isArray(parsedResult.keyRisksAndGaps) || parsedResult.keyRisksAndGaps.length === 0) {
      parsedResult.keyRisksAndGaps = parsedResult.redFlags?.slice(0, 3) || [];
    }
    if (!Array.isArray(parsedResult.partnerCallQuestions) || parsedResult.partnerCallQuestions.length === 0) {
      parsedResult.partnerCallQuestions = parsedResult.keyQuestionsForFounder?.slice(0, 3) || [];
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
