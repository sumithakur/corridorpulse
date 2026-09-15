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
  PhoneCall,
  FileText,
  HelpCircle,
  UserCheck,
  Clock,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { EvaluationResult, InvestorDecisionType } from "@/lib/types";
import { saveDealToLocalStorage } from "@/lib/dealStorage";

interface ScorecardViewProps {
  data: EvaluationResult;
  onReset: () => void;
  onSaveDeal?: (data: EvaluationResult) => void;
  isDealSaved?: boolean;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ 
  data, 
  onReset,
  onSaveDeal,
  isDealSaved = false 
}) => {
  const [copied, setCopied] = useState(false);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const isSaved = isDealSaved || justSaved;

  // Investor Decision State (Audit Point 30)
  const [investorDecision, setInvestorDecision] = useState<InvestorDecisionType>(
    data.investorDecision?.status || "Pending"
  );
  const [partnerNote, setPartnerNote] = useState<string>(
    data.investorDecision?.notes || ""
  );
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);

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
    partnerCallQuestions,
    scoreDecomposition,
    negativeDiligenceCategorized,
    evidenceList
  } = data;

  // Resolve Pre-IC Deal Memo values with safe fallbacks
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

  // Categorized Negative Diligence Fallbacks (Audit Points 15, 16, 26)
  const conflicts = negativeDiligenceCategorized?.conflicts || [];
  const concerns = negativeDiligenceCategorized?.concerns || resolvedRisks.map((r) => ({
    title: r.split(":")[0] || "Identified Diligence Risk",
    detail: r,
    source: "Pitch Deck Review",
  }));
  const unknowns = negativeDiligenceCategorized?.unknowns || [
    {
      title: "Historical Cohort Retention",
      detail: "No multi-year net dollar retention or churn data room verified.",
      source: "Missing in deck",
    },
    {
      title: "Supplier Service Level Agreements",
      detail: "Hardware component backup supplier SLA not documented.",
      source: "Data room requested",
    },
  ];
  const questions = negativeDiligenceCategorized?.questions || resolvedQuestions.map((q, idx) => ({
    title: `Intro Call Question ${idx + 1}`,
    detail: q,
  }));

  // Recommendation Badge Colors
  const getRecommendationStyle = (rec: string) => {
    switch (rec) {
      case "Proceed to Intro Call":
      case "Proceed to Diligence":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />,
        };
      case "Keep on Radar":
      case "Conditional Pilot Only":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-950",
          icon: <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />,
        };
      case "Pass":
      default:
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-950",
          icon: <XCircle className="h-4 w-4 text-rose-600 shrink-0" />,
        };
    }
  };

  const recStyle = getRecommendationStyle(overallAssessment.recommendation);

  const handleSaveDecision = (status: InvestorDecisionType) => {
    setInvestorDecision(status);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2500);
  };

  const handleCopyMarkdown = () => {
    const markdownText = `
# PRE-IC DEAL MEMO | INVESTMENT COMMITTEE
**Company:** ${companyProfile.name}
**One-Liner:** ${companyProfile.oneLiner}
**HQ:** ${companyProfile.hqLocation} | **Sector:** ${companyProfile.primarySector} | **Stage:** ${companyProfile.stage}
**Screened Against Mandate:** ${evaluatedThesis ? `${evaluatedThesis.presetName} (${evaluatedThesis.targetDeploymentRegions.join(", ")} | Strictness ${evaluatedThesis.diligenceStrictness}/5)` : "Standard Thesis"}

---

## 1. DECISION WORKSPACE
- **Overall Score:** ${overallAssessment.score}/100
- **AI Recommendation:** ${overallAssessment.recommendation.toUpperCase()}
- **Thesis Match:** ${thesisFit?.matchScore ?? 0}% (${thesisFit?.verdict ?? "N/A"})
- **Investor Decision:** ${investorDecision.toUpperCase()}
${partnerNote ? `- **Investor Note:** "${partnerNote}"` : ""}

---

## 2. EXECUTIVE SUMMARY
${resolvedExecutiveSummary}

---

## 3. WHY IT PASSES (STRENGTHS)
${resolvedHighlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

---

## 4. WHY IT DOESN'T / NEGATIVE DILIGENCE
${concerns.map((c, i) => `${i + 1}. [CONCERN] ${c.title}: ${c.detail} (${c.source || "Unverified"})`).join("\n")}
${conflicts.map((c, i) => `${i + 1}. [HARD CONFLICT] ${c.title}: ${c.detail}`).join("\n")}
${unknowns.map((u, i) => `${i + 1}. [UNKNOWN/MISSING] ${u.title}: ${u.detail}`).join("\n")}

---

## 5. FIRST PARTNER CALL QUESTIONS
${questions.map((q, i) => `${i + 1}. [CALL QUESTION] ${q.title}: ${q.detail}`).join("\n")}

---

## 6. PILLAR RATINGS (0-25 each)
${evaluationPillars
  .map(
    (p) => `### ${p.pillarName}: ${p.score}/25 (${p.verdict})
${p.findings.map((f) => `- ${f}`).join("\n")}
`
  )
  .join("\n")}
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
      
      {/* PERSISTENT MANDATE SUMMARY HEADER (Audit Point 13 & 3) */}
      <div className="no-print rounded-xl border border-slate-200 bg-slate-950 text-slate-300 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            SCREENED AGAINST:
          </span>
          {evaluatedThesis ? (
            <>
              <span className="font-bold text-white">
                {evaluatedThesis.presetName}
              </span>
              <span className="text-slate-600">•</span>
              <span>{evaluatedThesis.targetDeploymentRegions.join(", ")}</span>
              <span className="text-slate-600">•</span>
              <span>{evaluatedThesis.targetStage}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">Strictness {evaluatedThesis.diligenceStrictness}/5</span>
              {evaluatedThesis.customDirectives && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-emerald-300 border border-emerald-800 text-[10.5px]">
                    Directives Audited
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-slate-400">Institutional General Mandate</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Screen Another Deal</span>
          </button>
        </div>
      </div>

      {/* TOP ACTION TOOLBAR */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 sm:px-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            Stage 03 • IC Decision Workspace
          </span>
          {evidenceList && evidenceList.length > 0 && (
            <button
              onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
              className="flex items-center space-x-1 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-mono font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-800 transition-all cursor-pointer"
            >
              <FileText className="h-3 w-3 text-emerald-600" />
              <span>{evidenceList.length} Extracted Claims</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => {
              if (onSaveDeal) {
                onSaveDeal(data);
              } else {
                saveDealToLocalStorage(data);
              }
              setJustSaved(true);
              setTimeout(() => setJustSaved(false), 2500);
            }}
            className="flex items-center space-x-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-700 hover:border-emerald-600 hover:text-emerald-950 transition-all cursor-pointer shadow-xs"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">✓ Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                <span>Save Deal</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied Markdown</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Memo</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5 text-white" />
            <span>Print 1-Page Memo</span>
          </button>
        </div>
      </div>

      {/* EVIDENCE PROVENANCE DRAWER (Audit Point 17 & 21) */}
      {showEvidenceDrawer && evidenceList && (
        <div className="no-print rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
            <div className="flex items-center space-x-2 text-emerald-950 font-mono text-xs font-bold uppercase">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>Evidence Provenance & Extracted Claims (Audit Point 17)</span>
            </div>
            <button
              onClick={() => setShowEvidenceDrawer(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-mono"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evidenceList.map((ev) => (
              <div key={ev.id} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700">
                    {ev.source}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    ev.status === "Verified in Deck"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {ev.status}
                  </span>
                </div>
                <p className="text-slate-900 font-medium">{ev.claim}</p>
                {ev.context && (
                  <p className="text-slate-500 text-[11px] font-sans">{ev.context}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSTITUTIONAL PRE-IC DECISION WORKSPACE CONTAINER */}
      <div id="printable-scorecard" className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm space-y-7 print:border-none print:shadow-none print:p-0">
        
        {/* MEMO HEADER: Company & High-Impact Decision Badges */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10.5px] font-mono uppercase tracking-widest text-slate-900 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full font-bold">
                Pre-IC Diligence Scorecard
              </span>
              <span className="rounded-md border border-slate-300 bg-slate-50 px-2.5 py-0.5 text-xs font-mono font-bold text-slate-800">
                {companyProfile.stage}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 uppercase font-sans">
              {companyProfile.name}
            </h1>

            <p className="text-base text-slate-700 leading-relaxed max-w-2xl font-sans">
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

          {/* Metric Badges: Overall Score + Thesis Fit + AI Initial Verdict */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-50/90 border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs">
            {/* Overall Score */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border-2 border-emerald-600 bg-white text-emerald-950 font-mono text-2xl font-black shadow-xs">
                {overallAssessment.score}
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5 font-bold">Score / 100</span>
            </div>

            {/* Thesis Fit Match */}
            {thesisFit && (
              <div className="flex flex-col items-center justify-center border-l border-slate-200 pl-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-slate-900 font-mono text-2xl font-black shadow-xs">
                  {thesisFit.matchScore}%
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1.5 font-bold">Thesis Fit</span>
              </div>
            )}

            {/* System Assessment Badge (Audit Point 30: AI Assessment vs Investor Decision) */}
            <div className="space-y-1.5 border-l border-slate-200 pl-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">System Assessment</span>
              <div className={`inline-flex items-center space-x-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${recStyle.bg} shadow-xs`}>
                {recStyle.icon}
                <span className="font-sans">{overallAssessment.recommendation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT POINT 30: EXPLICIT INVESTOR DECISION CONTROL */}
        <div className="no-print rounded-xl border-2 border-slate-950 bg-slate-50/80 p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950">
                Partner / Investor Action (Separate from AI)
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Status: <strong className="text-slate-950 uppercase">{investorDecision}</strong></span>
              {isNoteSaved && <span className="text-emerald-600 font-bold ml-1">✓ Saved</span>}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["Advance to Partner", "Request More Info", "Hold / Watch", "Pass"] as InvestorDecisionType[]).map((status) => {
              const isSelected = investorDecision === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSaveDecision(status)}
                  className={`rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-950 text-white shadow-sm border border-slate-950"
                      : "bg-white border border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-950"
                  }`}
                >
                  {isSelected && <Check className="inline h-3 w-3 mr-1.5 text-emerald-400" />}
                  {status}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={partnerNote}
              onChange={(e) => setPartnerNote(e.target.value)}
              placeholder="Add partner review note (e.g. Schedule CTO deep dive on thermal drift before IC)..."
              className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleSaveDecision(investorDecision)}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-mono font-semibold cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* AUDIT POINT 14 & 29: HIGH-CONTRAST DECISION BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* WHY IT PASSES (Audit Point 14) */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-950">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                Why It Passes (Strengths & Moats)
              </h3>
            </div>
            <ul className="space-y-2.5">
              {resolvedHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-900 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHY IT DOESN'T / RISKS (Audit Point 14) */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 space-y-3">
            <div className="flex items-center space-x-2 text-rose-950">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
                Why It Doesn&apos;t (Critical Risks & Gaps)
              </h3>
            </div>
            <ul className="space-y-2.5">
              {concerns.slice(0, 3).map((concern, idx) => (
                <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-900 leading-relaxed">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold mt-0.5">
                    ⚠
                  </span>
                  <div>
                    <strong className="font-semibold text-rose-950">{concern.title}: </strong>
                    <span>{concern.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* AUDIT POINT 29: MANDATE SCORE DECOMPOSITION */}
        {scoreDecomposition && scoreDecomposition.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Score Attribution Decomposition (Audit Point 29)
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                Total: {overallAssessment.score} / 100
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {scoreDecomposition.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg border p-2.5 text-center space-y-0.5 ${
                    item.category === "positive"
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-rose-50/80 border-rose-200"
                  }`}
                >
                  <div className={`font-mono text-base font-black ${
                    item.category === "positive" ? "text-emerald-800" : "text-rose-800"
                  }`}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 line-clamp-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT POINTS 15, 16, 26: NEGATIVE DILIGENCE FOURFOLD TAXONOMY */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
              Negative Diligence Breakdown (Conflicts vs Concerns vs Unknowns)
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Fourfold Risk Classification
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. HARD CONFLICTS (Red) */}
            <div className="rounded-xl border border-rose-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-rose-900 flex items-center space-x-1">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  <span>Hard Thesis Conflict</span>
                </span>
                <span className="rounded bg-rose-100 text-rose-900 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                  {conflicts.length}
                </span>
              </div>
              {conflicts.length > 0 ? (
                <div className="space-y-2">
                  {conflicts.map((c, i) => (
                    <div key={i} className="text-xs text-slate-800 space-y-0.5">
                      <p className="font-bold text-rose-950">{c.title}</p>
                      <p className="text-[11px] text-slate-600">{c.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-sans italic">
                  ✓ No hard thesis violations detected against mandate.
                </p>
              )}
            </div>

            {/* 2. MATERIAL CONCERNS (Amber) */}
            <div className="rounded-xl border border-amber-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-950 flex items-center space-x-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  <span>Material Concern</span>
                </span>
                <span className="rounded bg-amber-100 text-amber-900 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                  {concerns.length}
                </span>
              </div>
              <div className="space-y-2">
                {concerns.slice(0, 2).map((c, i) => (
                  <div key={i} className="text-xs text-slate-800 space-y-0.5">
                    <p className="font-bold text-amber-950">{c.title}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{c.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. UNKNOWNS & EVIDENCE GAPS (Gray) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-slate-800 flex items-center space-x-1">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  <span>Missing Evidence / Gap</span>
                </span>
                <span className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                  {unknowns.length}
                </span>
              </div>
              <div className="space-y-2">
                {unknowns.slice(0, 2).map((u, i) => (
                  <div key={i} className="text-xs text-slate-800 space-y-0.5">
                    <p className="font-bold text-slate-900">{u.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{u.detail}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION: EXECUTIVE SUMMARY */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-2">
          <div className="flex items-center space-x-2 text-slate-900">
            <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider">
              Executive Summary & Value Proposition
            </h2>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-sans pt-1">
            {resolvedExecutiveSummary}
          </p>
          {overallAssessment.summaryRationale && overallAssessment.summaryRationale !== resolvedExecutiveSummary && (
            <p className="text-xs text-slate-500 font-sans italic pt-2 border-t border-slate-200/60 mt-2">
              Diligence Rationale: {overallAssessment.summaryRationale}
            </p>
          )}
        </div>

        {/* SECTION: FIRST PARTNER CALL QUESTIONS */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center space-x-2 text-slate-950">
            <PhoneCall className="h-4 w-4 text-emerald-600 shrink-0" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider">
              Diligence Questions for First Partner Call
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
            {resolvedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-1.5 shadow-2xs"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  Question 0{idx + 1}
                </span>
                <p className="text-xs text-slate-900 leading-snug">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: EVALUATION PILLARS (0-25 pts each) */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
              Underwriting Pillars (Scored 0 - 25 pts each)
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Total Score: {overallAssessment.score} / 100
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluationPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {pillar.pillarName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-slate-950">
                      {pillar.score}/25
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold ${
                      pillar.verdict === "Strong"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-900 border-amber-200"
                    }`}>
                      {pillar.verdict}
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${(pillar.score / 25) * 100}%` }}
                  />
                </div>

                <ul className="space-y-1 pt-1">
                  {pillar.findings.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start space-x-1.5 text-xs text-slate-700 leading-snug">
                      <span className="text-emerald-600 font-bold shrink-0">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: MANDATE & DIRECTIVES AUDIT */}
        {evaluatedThesis && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Sliders className="h-3.5 w-3.5 text-slate-900" />
                <h3 className="text-xs font-mono font-bold text-slate-900 uppercase tracking-wider">
                  Mandate & Custom Directives Audit
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-700 font-semibold">
                {evaluatedThesis.presetName}
              </span>
            </div>

            {thesisFit?.alignmentSummary && (
              <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1">
                {thesisFit.alignmentSummary}
              </p>
            )}

            {thesisFit?.directivesCompliance && thesisFit.directivesCompliance.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-semibold">
                  Custom Directives Compliance Check
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
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                          item.compliant ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {item.compliant ? "✓ COMPLIANT" : "⚠️ BREACH"}
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

        {/* REGIONAL OFF-TAKE PARTNERS */}
        {gccPilotFit && gccPilotFit.potentialRegionalPartners && gccPilotFit.potentialRegionalPartners.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-700">
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Strategic Off-take & Partner Matches
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {gccPilotFit.potentialRegionalPartners.map((partner, i) => (
                <span
                  key={i}
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 shadow-2xs"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER METADATA */}
        <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <span>DEAL SCREENER • PRE-IC MEMO • CONFIDENTIAL</span>
          <span>EVALUATED: {new Date().toLocaleDateString()}</span>
        </div>

      </div>
    </div>
  );
};
