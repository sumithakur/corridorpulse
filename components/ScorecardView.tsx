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
  ShieldAlert, 
  Building2, 
  MapPin, 
  HelpCircle,
  Zap,
  Sliders
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
    evaluatedThesis 
  } = data;

  // Recommendation Badge Colors
  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "Proceed to Diligence":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
        };
      case "Conditional Pilot Only":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
        };
      case "Pass":
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          icon: <XCircle className="h-5 w-5 text-rose-400" />,
        };
    }
  };

  // Thesis Fit Badge Colors
  const getThesisFitStyle = (verdict: string) => {
    switch (verdict) {
      case "High Alignment":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          scoreBg: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
        };
      case "Moderate Fit":
        return {
          bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
          scoreBg: "text-amber-400 border-amber-500/40 bg-amber-500/10",
        };
      case "Misaligned":
      default:
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-400",
          scoreBg: "text-rose-400 border-rose-500/40 bg-rose-500/10",
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

  // Data Residency Friction Colors
  const getResidencyStyle = (friction: string) => {
    switch (friction) {
      case "Low":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "High":
      default:
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    }
  };

  const recStyle = getRecommendationStyle(overallAssessment.recommendation);
  const fitStyle = getThesisFitStyle(thesisFit?.verdict || "Moderate Fit");

  const handleCopyMarkdown = () => {
    const markdownText = `
# VENTURE DILIGENCE & THESIS SCORECARD
**Company:** ${companyProfile.name}
**One-Liner:** ${companyProfile.oneLiner}
**HQ:** ${companyProfile.hqLocation} | **Sector:** ${companyProfile.primarySector} | **Stage:** ${companyProfile.stage}

## OVERALL SCORE: ${overallAssessment.score}/100
**Recommendation:** ${overallAssessment.recommendation}
**Thesis Fit Match:** ${thesisFit?.matchScore ?? 0}% (${thesisFit?.verdict ?? "N/A"})
**Rationale:** ${overallAssessment.summaryRationale}

---

## CONFIGURED INVESTMENT THESIS EVALUATED
${evaluatedThesis ? `
- **Preset:** ${evaluatedThesis.presetName}
- **Stage:** ${evaluatedThesis.targetStage} | **Regions:** ${evaluatedThesis.targetDeploymentRegions.join(", ")}
- **Tech Depth Hurdle:** ${evaluatedThesis.techDepthHurdle}
- **Strategic Mandate:** ${evaluatedThesis.strategicMandate}
- **Min Target Margin:** ≥${evaluatedThesis.minTargetGrossMargin}%
- **Diligence Strictness:** Level ${evaluatedThesis.diligenceStrictness}/5
${evaluatedThesis.customDirectives ? `- **Custom Directives:** "${evaluatedThesis.customDirectives}"` : ""}
` : "Default thesis criteria"}

## THESIS COMPLIANCE & DIRECTIVES AUDIT
**Alignment Summary:** ${thesisFit?.alignmentSummary ?? "N/A"}
${thesisFit?.directivesCompliance?.map((d) => `- [${d.compliant ? "COMPLIANT" : "BREACH"}] ${d.directive}\n  * Analysis: ${d.analysis}`).join("\n") || "No custom negative exclusions configured."}

---

## EVALUATION PILLARS (0-25 each)
${evaluationPillars
  .map(
    (p) => `### ${p.pillarName}: ${p.score}/25 (${p.verdict})
${p.findings.map((f) => `- ${f}`).join("\n")}
`
  )
  .join("\n")}

---

## REGIONAL FIT & DATA RESIDENCY
- **Data Residency Friction:** ${gccPilotFit.dataResidencyFriction}
- **Target Sectors:** ${gccPilotFit.targetSectors.join(", ")}
- **Potential Regional Partners:** ${gccPilotFit.potentialRegionalPartners.join(", ")}

---

## RED FLAGS
${redFlags.map((r) => `- ⚠️ ${r}`).join("\n")}

## KEY QUESTIONS FOR FOUNDERS
${keyQuestionsForFounder.map((q, i) => `${i + 1}. ❓ ${q}`).join("\n")}
`.trim();

    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 print:p-0 print:m-0 print:max-w-none">
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
                <span>Copied Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-400" />
                <span>Copy Markdown Report</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-emerald-500/10 hover:from-emerald-400 hover:to-teal-500 transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* INSTITUTIONAL SCORECARD CONTAINER */}
      <div id="printable-scorecard" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* SCORECARD HEADER BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-6 print:border-zinc-300">
          {/* Company Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-100 print:text-zinc-900">
                {companyProfile.name}
              </h1>
              <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs font-mono text-zinc-300 print:border-zinc-300 print:bg-zinc-100 print:text-zinc-800">
                {companyProfile.stage}
              </span>
            </div>
            <p className="text-sm font-medium text-emerald-400 print:text-emerald-700">
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

          {/* Metric Badges: Overall Readiness + Thesis Fit Match + VC Verdict */}
          <div className="flex flex-wrap items-center gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl print:border-zinc-300 print:bg-zinc-50">
            {/* Overall Score Gauge */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-2xl font-black shadow-inner">
                {overallAssessment.score}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">Readiness Score</span>
            </div>

            {/* Thesis Fit Match Gauge */}
            {thesisFit && (
              <div className="flex flex-col items-center justify-center border-l border-zinc-800 pl-4 print:border-zinc-300">
                <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 font-mono text-2xl font-black shadow-inner ${fitStyle.scoreBg}`}>
                  {thesisFit.matchScore}%
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">Thesis Match</span>
              </div>
            )}

            {/* Verdict & Alignment Badges */}
            <div className="space-y-2 border-l border-zinc-800 pl-4 print:border-zinc-300">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">VC Verdict</span>
                <div className={`inline-flex items-center space-x-2 rounded-xl border px-3 py-1 text-xs font-bold ${recStyle.bg}`}>
                  {recStyle.icon}
                  <span>{overallAssessment.recommendation}</span>
                </div>
              </div>

              {thesisFit && (
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Thesis Status</span>
                  <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[11px] font-mono font-bold ${fitStyle.bg}`}>
                    {thesisFit.verdict}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* THESIS CONFIGURATION & DIRECTIVES AUDIT PANEL */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4 print:border-zinc-300 print:bg-zinc-50">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 print:border-zinc-200">
            <div className="flex items-center space-x-2">
              <Sliders className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider print:text-zinc-900">
                Active Thesis Mandate & Compliance Audit
              </h3>
            </div>
            {evaluatedThesis && (
              <span className="text-xs font-mono text-emerald-400">
                {evaluatedThesis.presetName}
              </span>
            )}
          </div>

          {/* Configured Criteria Strip */}
          {evaluatedThesis && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-500 font-mono">Criteria:</span>
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300">
                Stage: {evaluatedThesis.targetStage}
              </span>
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300">
                Regions: {evaluatedThesis.targetDeploymentRegions.join(", ")}
              </span>
              <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-mono text-zinc-300">
                Tech Depth: {evaluatedThesis.techDepthHurdle}
              </span>
              <span className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 font-mono text-teal-300">
                Min Margin: ≥{evaluatedThesis.minTargetGrossMargin}%
              </span>
              <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 font-mono text-amber-300">
                Strictness: {evaluatedThesis.diligenceStrictness}/5
              </span>
            </div>
          )}

          {/* Thesis Alignment Summary */}
          {thesisFit?.alignmentSummary && (
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3 text-xs text-zinc-300 print:bg-white print:border-zinc-200">
              <span className="font-mono text-zinc-400 block mb-1 uppercase text-[10px] tracking-wider">
                Thesis Fit Analysis
              </span>
              <p className="leading-relaxed">{thesisFit.alignmentSummary}</p>
            </div>
          )}

          {/* Custom Directives Compliance Breakdown */}
          {thesisFit?.directivesCompliance && thesisFit.directivesCompliance.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono text-zinc-400 block uppercase tracking-wider">
                Custom Directives & Non-Negotiables Check ({thesisFit.directivesCompliance.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {thesisFit.directivesCompliance.map((item, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl border p-3 text-xs space-y-1 ${
                      item.compliant
                        ? "border-emerald-500/30 bg-emerald-500/5 print:border-emerald-300 print:bg-emerald-50"
                        : "border-rose-500/30 bg-rose-500/5 print:border-rose-300 print:bg-rose-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-200 print:text-zinc-900 line-clamp-1">
                        {item.directive}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold shrink-0 ${
                          item.compliant
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        }`}
                      >
                        {item.compliant ? "✓ COMPLIANT" : "⚠️ BREACH"}
                      </span>
                    </div>
                    <p className="text-zinc-400 print:text-zinc-700 leading-snug">
                      {item.analysis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* EXECUTIVE SUMMARY RATIONALE */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-5 print:border-zinc-200 print:bg-zinc-50">
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2 print:text-zinc-700">
            Executive Partner Diligence Rationale
          </h3>
          <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed print:text-zinc-800 font-sans">
            {overallAssessment.summaryRationale}
          </p>
        </div>

        {/* 2X2 PILLARS EVALUATION GRID */}
        <div>
          <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-3 print:text-zinc-700">
            Institutional Evaluation Pillars (0 - 25 pts each)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluationPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3 print:border-zinc-300 print:bg-white"
              >
                {/* Pillar Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 print:text-zinc-900">
                    {pillar.pillarName}
                  </span>
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${getVerdictBadge(pillar.verdict)}`}>
                    {pillar.verdict}
                  </span>
                </div>

                {/* Score Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Pillar Score</span>
                    <span className="font-bold text-emerald-400 print:text-emerald-700">{pillar.score} / 25</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden print:bg-zinc-200">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${(pillar.score / 25) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Findings Bullet List */}
                <ul className="space-y-1.5 pt-1">
                  {pillar.findings.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-2 text-xs text-zinc-300 print:text-zinc-700 leading-snug">
                      <span className="text-emerald-400 print:text-emerald-600 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* REGIONAL FIT & DATA RESIDENCY SECTION */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 space-y-4 print:border-zinc-300 print:bg-zinc-50">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3 print:border-zinc-200">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider print:text-zinc-900">
                Deployment Feasibility & Data Residency Audit
              </h3>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-zinc-400 font-mono">Data Residency Friction:</span>
              <span className={`rounded-md border px-2.5 py-0.5 font-mono font-bold ${getResidencyStyle(gccPilotFit.dataResidencyFriction)}`}>
                {gccPilotFit.dataResidencyFriction} Friction
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Sectors */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">Identified Target Sectors</span>
              <div className="flex flex-wrap gap-1.5">
                {gccPilotFit.targetSectors.map((sector, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300 print:border-zinc-300 print:bg-white print:text-zinc-800"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Potential Partners */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">Matches for Off-take & Strategic Co-build</span>
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
          </div>
        </div>

        {/* DILIGENCE & RED FLAGS CHECKLIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Red Flags */}
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3 print:border-rose-300 print:bg-rose-50">
            <div className="flex items-center space-x-2 text-rose-400 print:text-rose-700">
              <ShieldAlert className="h-4 w-4" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                Critical Red Flags & Investment Risks ({redFlags.length})
              </h4>
            </div>
            <ul className="space-y-2">
              {redFlags.map((flag, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300 print:text-zinc-800">
                  <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Questions for Founder */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-4 space-y-3 print:border-teal-300 print:bg-teal-50">
            <div className="flex items-center space-x-2 text-teal-400 print:text-teal-700">
              <HelpCircle className="h-4 w-4" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                Key Diligence Questions for Founder
              </h4>
            </div>
            <ol className="space-y-2">
              {keyQuestionsForFounder.map((q, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-zinc-300 print:text-zinc-800">
                  <span className="font-mono font-bold text-teal-400 print:text-teal-700 shrink-0">{idx + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* FOOTER METADATA */}
        <div className="border-t border-zinc-800 pt-4 flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-500 print:border-zinc-300 print:text-zinc-600">
          <span>DEAL SCREENER INSTITUTIONAL REPORT • CONFIDENTIAL</span>
          <span>EVALUATED AT: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
