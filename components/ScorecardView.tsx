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
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 print:text-emerald-700 print:border-emerald-500 print:bg-emerald-50",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-400 print:text-emerald-700 shrink-0" />,
        };
      case "Keep on Radar":
      case "Conditional Pilot Only":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400 print:text-amber-800 print:border-amber-500 print:bg-amber-50",
          icon: <AlertTriangle className="h-4 w-4 text-amber-400 print:text-amber-800 shrink-0" />,
        };
      case "Pass":
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400 print:text-rose-800 print:border-rose-500 print:bg-rose-50",
          icon: <XCircle className="h-4 w-4 text-rose-400 print:text-rose-800 shrink-0" />,
        };
    }
  };

  // Thesis Fit Badge Colors
  const getThesisFitStyle = (verdict: string) => {
    switch (verdict) {
      case "High Alignment":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          scoreBg: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10 print:border-emerald-500 print:text-emerald-800",
        };
      case "Moderate Fit":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          scoreBg: "text-amber-400 border-amber-500/40 bg-amber-500/10 print:border-amber-500 print:text-amber-800",
        };
      case "Misaligned":
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          scoreBg: "text-rose-400 border-rose-500/40 bg-rose-500/10 print:border-rose-500 print:text-rose-800",
        };
    }
  };

  // Verdict Badge Colors
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "Strong":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Moderate":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Critical Risk":
      default:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
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
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-zinc-400" />
          <span>Screen Another Deal / Adjust Thesis</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied Memo Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Deal Memo</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/10 hover:from-emerald-400 hover:to-teal-500 transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print 1-Page Memo</span>
          </button>
        </div>
      </div>

      {/* INSTITUTIONAL PRE-IC DEAL MEMO CONTAINER */}
      <div id="printable-scorecard" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-4 print:bg-white print:text-zinc-900">
        
        {/* MEMO HEADER: Title & Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6 print:border-zinc-300">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full print:border-emerald-600 print:text-emerald-800">
                Institutional Pre-IC Deal Memo
              </span>
              {evaluatedThesis && (
                <span className="text-[10px] font-mono text-zinc-500 print:text-zinc-600">
                  {evaluatedThesis.presetName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 print:text-zinc-900">
                {companyProfile.name}
              </h1>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-0.5 text-xs font-mono text-zinc-300 print:border-zinc-300 print:bg-zinc-100 print:text-zinc-800">
                {companyProfile.stage}
              </span>
            </div>

            <p className="text-sm font-medium text-zinc-300 print:text-zinc-700">
              {companyProfile.oneLiner}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono print:text-zinc-600 pt-1">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                <span>HQ: {companyProfile.hqLocation}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                <span>Sector: {companyProfile.primarySector}</span>
              </span>
            </div>
          </div>

          {/* Metric Badges: Score + Thesis Match + Verdict */}
          <div className="flex flex-wrap items-center gap-4 bg-zinc-900/70 border border-zinc-800 p-4 rounded-2xl print:border-zinc-300 print:bg-zinc-50">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-xl font-black shadow-inner print:text-emerald-800 print:border-emerald-600">
                {overallAssessment.score}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1 print:text-zinc-600">Score</span>
            </div>

            {/* Thesis Fit Match */}
            {thesisFit && (
              <div className="flex flex-col items-center justify-center border-l border-zinc-800 pl-4 print:border-zinc-300">
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-xl font-black shadow-inner ${fitStyle.scoreBg}`}>
                  {thesisFit.matchScore}%
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1 print:text-zinc-600">Match</span>
              </div>
            )}

            {/* Initial Verdict Badge */}
            <div className="space-y-1.5 border-l border-zinc-800 pl-4 print:border-zinc-300">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block print:text-zinc-600">Initial Verdict</span>
              <div className={`inline-flex items-center space-x-2 rounded-xl border px-3 py-1.5 text-xs font-bold ${recStyle.bg}`}>
                {recStyle.icon}
                <span>{overallAssessment.recommendation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE SUMMARY */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-2 print:border-zinc-300 print:bg-zinc-50">
          <div className="flex items-center space-x-2 text-emerald-400 print:text-emerald-700">
            <FileText className="h-4 w-4 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
              1. Executive Summary & Core Value Proposition
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 print:text-zinc-800 leading-relaxed font-sans">
            {resolvedExecutiveSummary}
          </p>
          {overallAssessment.summaryRationale && overallAssessment.summaryRationale !== resolvedExecutiveSummary && (
            <p className="text-xs text-zinc-400 print:text-zinc-600 pt-1 italic">
              IC Note: {overallAssessment.summaryRationale}
            </p>
          )}
        </div>

        {/* SECTION 2 & 3: 2-COLUMN HIGHLIGHTS VS RISKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Key Highlights (Top 3) */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3 print:border-emerald-300 print:bg-emerald-50">
            <div className="flex items-center space-x-2 text-emerald-400 print:text-emerald-800">
              <Sparkles className="h-4 w-4 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                2. Key Highlights & Strengths (3 Points)
              </h3>
            </div>
            <ul className="space-y-2.5">
              {resolvedHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-200 print:text-zinc-800 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 print:bg-emerald-600 print:text-white font-mono text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Risks & Gaps in Deck (Top 3) */}
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5 space-y-3 print:border-rose-300 print:bg-rose-50">
            <div className="flex items-center space-x-2 text-rose-400 print:text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                3. Key Risks & Gaps in the Deck (3 Points)
              </h3>
            </div>
            <ul className="space-y-2.5">
              {resolvedRisks.map((risk, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-zinc-200 print:text-zinc-800 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 print:bg-rose-600 print:text-white font-mono text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECTION 4: FIRST PARTNER CALL QUESTIONS */}
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 space-y-3 print:border-teal-300 print:bg-teal-50">
          <div className="flex items-center space-x-2 text-teal-400 print:text-teal-800">
            <PhoneCall className="h-4 w-4 shrink-0" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              4. Diligence Questions for First Partner Call
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resolvedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-teal-500/20 bg-zinc-950/60 p-3 space-y-1.5 print:border-teal-200 print:bg-white"
              >
                <div className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-teal-400 print:text-teal-700">
                  <span>Question {idx + 1}</span>
                </div>
                <p className="text-xs text-zinc-300 print:text-zinc-800 leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: EVALUATION PILLARS (0-25 pts each) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 print:border-zinc-300">
            <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider print:text-zinc-900">
              5. Diligence Pillars (Scored 0 - 25 pts each)
            </h3>
            <span className="text-[11px] font-mono text-zinc-500 print:text-zinc-600">
              Total Score: {overallAssessment.score} / 100
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {evaluationPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-2.5 print:border-zinc-300 print:bg-white"
              >
                {/* Pillar Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 print:text-zinc-900">
                    {pillar.pillarName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 print:text-emerald-700">
                      {pillar.score}/25
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${getVerdictBadge(pillar.verdict)}`}>
                      {pillar.verdict}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden print:bg-zinc-200">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${(pillar.score / 25) * 100}%` }}
                  />
                </div>

                {/* Findings Bullet List */}
                <ul className="space-y-1 pt-0.5">
                  {pillar.findings.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-1.5 text-xs text-zinc-400 print:text-zinc-700 leading-snug">
                      <span className="text-emerald-400 print:text-emerald-600 shrink-0">•</span>
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-3 print:border-zinc-300 print:bg-zinc-50">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2 print:border-zinc-200">
              <div className="flex items-center space-x-2">
                <Sliders className="h-3.5 w-3.5 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider print:text-zinc-900">
                  6. Active Mandate & Directives Audit
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 print:text-emerald-700">
                {evaluatedThesis.presetName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 font-mono">Constraints:</span>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300 print:border-zinc-300 print:bg-white print:text-zinc-800">
                Stage: {evaluatedThesis.targetStage}
              </span>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300 print:border-zinc-300 print:bg-white print:text-zinc-800">
                Regions: {evaluatedThesis.targetDeploymentRegions.join(", ")}
              </span>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300 print:border-zinc-300 print:bg-white print:text-zinc-800">
                Strictness: {evaluatedThesis.diligenceStrictness}/5
              </span>
            </div>

            {thesisFit?.alignmentSummary && (
              <p className="text-xs text-zinc-400 print:text-zinc-700 leading-relaxed">
                {thesisFit.alignmentSummary}
              </p>
            )}

            {/* Custom Directives Compliance */}
            {thesisFit?.directivesCompliance && thesisFit.directivesCompliance.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                  Directives Compliance Check
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {thesisFit.directivesCompliance.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-2.5 text-xs space-y-1 ${
                        item.compliant
                          ? "border-emerald-500/30 bg-emerald-500/5 print:border-emerald-300 print:bg-emerald-50"
                          : "border-rose-500/30 bg-rose-500/5 print:border-rose-300 print:bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-200 print:text-zinc-900 line-clamp-1">
                          {item.directive}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${item.compliant ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                          {item.compliant ? "✓ PASS" : "⚠️ BREACH"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 print:text-zinc-600 leading-snug">
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
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-2 print:border-zinc-300 print:bg-zinc-50">
            <div className="flex items-center space-x-2 text-zinc-400 print:text-zinc-700">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Strategic Off-take & Partner Matches
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gccPilotFit.potentialRegionalPartners.map((partner, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 print:border-emerald-300 print:bg-emerald-50 print:text-emerald-900"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER METADATA */}
        <div className="border-t border-zinc-800 pt-3 flex flex-wrap items-center justify-between text-[10px] font-mono text-zinc-500 print:border-zinc-300 print:text-zinc-600">
          <span>CORRIDORPULSE DEAL SCREENER • PRE-IC MEMO • CONFIDENTIAL</span>
          <span>DATE: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

