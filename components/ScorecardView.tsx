"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  Copy, 
  Check, 
  RotateCcw, 
  Building2, 
  MapPin, 
  Zap,
  Sliders,
  Sparkles,
  PhoneCall,
  FileText,
  AlertCircle
} from "lucide-react";
import { EvaluationResult } from "@/lib/types";

interface ScorecardViewProps {
  data: EvaluationResult;
  onReset: () => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ data, onReset }) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const { 
    companyProfile, 
    overallAssessment, 
    thesisFit, 
    evaluationPillars, 
    gccPilotFit, 
    redFlags, 
    keyQuestionsForFounder, 
    evaluatedThesis,
    executiveSummary,
    keyHighlights,
    keyRisksAndGaps,
    partnerCallQuestions
  } = data;

  // Resolve Pre-IC Deal Memo values with fallbacks
  const resolvedExecutiveSummary =
    executiveSummary?.trim() ||
    companyProfile?.oneLiner ||
    overallAssessment?.summaryRationale ||
    "Executive summary not generated.";

  const resolvedHighlights =
    Array.isArray(keyHighlights) && keyHighlights.length > 0
      ? keyHighlights.slice(0, 3)
      : evaluationPillars?.flatMap((p) => p.findings).slice(0, 3) || [];

  const resolvedRisks =
    Array.isArray(keyRisksAndGaps) && keyRisksAndGaps.length > 0
      ? keyRisksAndGaps.slice(0, 3)
      : redFlags?.slice(0, 3) || [];

  const resolvedQuestions =
    Array.isArray(partnerCallQuestions) && partnerCallQuestions.length > 0
      ? partnerCallQuestions.slice(0, 3)
      : keyQuestionsForFounder?.slice(0, 3) || [];

  // Recommendation Badge Colors
  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "Proceed to Intro Call":
      case "Proceed to Diligence":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-800",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />,
        };
      case "Keep on Radar":
      case "Conditional Pilot Only":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-900",
          icon: <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />,
        };
      case "Pass":
      default:
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-800",
          icon: <XCircle className="h-4 w-4 text-rose-700 shrink-0" />,
        };
    }
  };

  // Thesis Fit Badge Colors
  const getThesisFitStyle = (verdict: string) => {
    switch (verdict) {
      case "High Alignment":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          scoreBg: "text-emerald-800 border-emerald-300 bg-emerald-50/50",
        };
      case "Moderate Fit":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          scoreBg: "text-amber-900 border-amber-300 bg-amber-50/50",
        };
      case "Misaligned":
      default:
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          scoreBg: "text-rose-800 border-rose-300 bg-rose-50/50",
        };
    }
  };

  // Verdict Badge Colors
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Strong":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Moderate":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "Critical Risk":
      default:
        return "bg-rose-50 text-rose-800 border-rose-200";
    }
  };

  const recStyle = getRecommendationStyle(overallAssessment.recommendation);
  const fitStyle = getThesisFitStyle(thesisFit?.verdict || "Moderate Fit");

  const handleCopyMarkdown = () => {
    const markdownText = `
# PRE-IC DEAL MEMO | INVESTMENT COMMITTEE
**Company:** ${companyProfile.name}
**One-Liner:** ${companyProfile.oneLiner}
**HQ:** ${companyProfile.hqLocation} | **Sector:** ${companyProfile.primarySector} | **Stage:** ${companyProfile.stage}

## INITIAL VERDICT: ${overallAssessment.recommendation.toUpperCase()}
- **Overall Score:** ${overallAssessment.score}/100
- **Thesis Match:** ${thesisFit?.matchScore ?? 0}% (${thesisFit?.verdict ?? "N/A"})
- **Diligence Rationale:** ${overallAssessment.summaryRationale}

---

## 1. EXECUTIVE SUMMARY & VALUE PROPOSITION
${resolvedExecutiveSummary}

---

## 2. KEY HIGHLIGHTS & STRENGTHS (TOP 3)
${resolvedHighlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

---

## 3. KEY RISKS & GAPS IN THE DECK (TOP 3)
${resolvedRisks.map((r, i) => `${i + 1}. ${r}`).join("\n")}

---

## 4. FIRST PARTNER CALL QUESTIONS
${resolvedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

---

## 5. EVALUATION PILLARS (0-25 each)
${evaluationPillars
  .map(
    (p) => `### ${p.pillarName}: ${p.score}/25 (${p.verdict})
${p.findings.map((f) => `- ${f}`).join("\n")}
`
  )
  .join("\n")}

---

## 6. ACTIVE THESIS CONSTRAINTS AUDIT
${evaluatedThesis ? `
- Mandate: ${evaluatedThesis.presetName}
- Target Stage: ${evaluatedThesis.targetStage}
- Target Regions: ${evaluatedThesis.targetDeploymentRegions.join(", ")}
- Tech Depth Hurdle: ${evaluatedThesis.techDepthHurdle}
- Strictness Level: ${evaluatedThesis.diligenceStrictness}/5
${evaluatedThesis.customDirectives ? `- Custom Directives: "${evaluatedThesis.customDirectives}"` : ""}
` : "Default thesis criteria"}
${thesisFit?.directivesCompliance && thesisFit.directivesCompliance.length > 0 ? `
### Custom Directives Compliance:
${thesisFit.directivesCompliance.map((d) => `- [${d.compliant ? "COMPLIANT" : "BREACH"}] ${d.directive}: ${d.analysis}`).join("\n")}
` : ""}
`.trim();

    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6 print:p-0 print:m-0 print:max-w-none">
      {/* Top Action Toolbar matching sumitkt.com */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-sm backdrop-blur-md">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Screen Another Deal</span>
        </button>

        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Deal Memo</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-full brass-btn px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-white" />
            <span>Print 1-Page Memo</span>
          </button>
        </div>
      </div>

      {/* INSTITUTIONAL PRE-IC DEAL MEMO CONTAINER */}
      <div id="printable-scorecard" className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-7 print:border-none print:shadow-none print:p-0">
        
        {/* MEMO HEADER: Title & Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-900 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full font-bold">
                Institutional Pre-IC Deal Memo
              </span>
              {evaluatedThesis && (
                <span className="text-[11px] font-mono text-slate-500">
                  {evaluatedThesis.presetName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase font-sans">
                {companyProfile.name}
              </h1>
              <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800">
                {companyProfile.stage}
              </span>
            </div>

            <p className="text-base font-editorial italic text-slate-700 leading-relaxed max-w-2xl">
              &ldquo;{companyProfile.oneLiner}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-1">
              <span className="flex items-center space-x-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>HQ: {companyProfile.hqLocation}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>Sector: {companyProfile.primarySector}</span>
              </span>
            </div>
          </div>

          {/* Metric Badges: Score + Thesis Match + Verdict */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50/90 border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-950 bg-white text-slate-950 font-mono text-2xl font-black shadow-xs">
                {overallAssessment.score}
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5 font-semibold">Score / 100</span>
            </div>

            {/* Thesis Fit Match */}
            {thesisFit && (
              <div className="flex flex-col items-center justify-center border-l border-slate-200 pl-4">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-xl border-2 font-mono text-2xl font-black shadow-xs ${fitStyle.scoreBg}`}>
                  {thesisFit.matchScore}%
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5 font-semibold">Thesis Fit</span>
              </div>
            )}

            {/* Initial Verdict Badge */}
            <div className="space-y-1.5 border-l border-slate-200 pl-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">Initial Verdict</span>
              <div className={`inline-flex items-center space-x-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${recStyle.bg} shadow-xs`}>
                {recStyle.icon}
                <span className="font-sans">{overallAssessment.recommendation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900">
            <FileText className="h-4 w-4 text-[#b89047] shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
              1. Executive Summary & Core Value Proposition
            </h2>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-sans pt-1">
            {resolvedExecutiveSummary}
          </p>
          {overallAssessment.summaryRationale && overallAssessment.summaryRationale !== resolvedExecutiveSummary && (
            <p className="text-xs text-slate-500 font-editorial italic pt-2 border-t border-slate-200/60 mt-2">
              Diligence Rationale: {overallAssessment.summaryRationale}
            </p>
          )}
        </div>

        {/* SECTION 2 & 3: 2-COLUMN HIGHLIGHTS VS RISKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Highlights (Top 3) */}
          <div className="rounded-xl border border-emerald-200/90 bg-emerald-50/40 p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center space-x-2 text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                2. Key Highlights & Strengths (Top 3)
              </h3>
            </div>
            <ul className="space-y-3">
              {resolvedHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-900 leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white font-mono text-[11px] font-bold mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Risks & Gaps in Deck (Top 3) */}
          <div className="rounded-xl border border-rose-200/90 bg-rose-50/40 p-5 sm:p-6 space-y-3.5">
            <div className="flex items-center space-x-2 text-rose-900">
              <AlertCircle className="h-4 w-4 text-rose-700 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                3. Key Risks & Gaps in the Deck (Top 3)
              </h3>
            </div>
            <ul className="space-y-3">
              {resolvedRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-900 leading-relaxed">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-700 text-white font-mono text-[11px] font-bold mt-0.5 shadow-xs">
                    {idx + 1}
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 4: FIRST PARTNER CALL QUESTIONS */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-5 sm:p-6 space-y-3.5">
          <div className="flex items-center space-x-2 text-amber-950">
            <PhoneCall className="h-4 w-4 text-[#b89047] shrink-0" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              4. Diligence Questions for First Partner Call
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {resolvedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-amber-200/70 bg-white p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-[#b89047] uppercase tracking-wider">
                  <span>Question {idx + 1}</span>
                </div>
                <p className="text-xs text-slate-800 leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: EVALUATION PILLARS (0-25 pts each) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              5. Diligence Pillars (Scored 0 - 25 pts each)
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Total Score: {overallAssessment.score} / 100
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluationPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 shadow-xs"
              >
                {/* Pillar Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {pillar.pillarName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-slate-950">
                      {pillar.score}/25
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${getVerdictBadge(pillar.verdict)}`}>
                      {pillar.verdict}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full"
                    style={{ width: `${(pillar.score / 25) * 100}%` }}
                  />
                </div>

                {/* Findings Bullet List */}
                <ul className="space-y-1 pt-1">
                  {pillar.findings.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-1.5 text-xs text-slate-700 leading-snug">
                      <span className="text-[#b89047] font-bold shrink-0">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: ACTIVE THESIS MANDATE & DIRECTIVES AUDIT */}
        {evaluatedThesis && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Sliders className="h-3.5 w-3.5 text-slate-900" />
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  6. Active Mandate & Directives Audit
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-700 font-semibold">
                {evaluatedThesis.presetName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono uppercase text-[11px]">Constraints:</span>
              <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 font-mono text-slate-800 text-xs">
                Stage: {evaluatedThesis.targetStage}
              </span>
              <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 font-mono text-slate-800 text-xs">
                Regions: {evaluatedThesis.targetDeploymentRegions.join(", ")}
              </span>
              <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 font-mono text-slate-800 text-xs">
                Strictness: {evaluatedThesis.diligenceStrictness}/5
              </span>
            </div>

            {thesisFit?.alignmentSummary && (
              <p className="text-xs text-slate-700 leading-relaxed font-editorial italic pt-1">
                {thesisFit.alignmentSummary}
              </p>
            )}

            {/* Custom Directives Compliance */}
            {thesisFit?.directivesCompliance && thesisFit.directivesCompliance.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                  Directives Compliance Check
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {thesisFit.directivesCompliance.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-2.5 text-xs space-y-1 ${
                        item.compliant
                          ? "border-emerald-200 bg-emerald-50/50"
                          : "border-rose-200 bg-rose-50/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 line-clamp-1">
                          {item.directive}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${item.compliant ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {item.compliant ? "✓ PASS" : "⚠️ BREACH"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {item.analysis}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* REGIONAL OFF-TAKE (Only if GCC Pilot fit is defined and relevant) */}
        {gccPilotFit && gccPilotFit.potentialRegionalPartners && gccPilotFit.potentialRegionalPartners.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Zap className="h-3.5 w-3.5 text-[#b89047]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Strategic Off-take & Partner Matches
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gccPilotFit.potentialRegionalPartners.map((partner, i) => (
                <span
                  key={i}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-xs"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER METADATA */}
        <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <span>CORRIDORPULSE DEAL SCREENER • PRE-IC MEMO • CONFIDENTIAL</span>
          <span>EVALUATED AT: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
