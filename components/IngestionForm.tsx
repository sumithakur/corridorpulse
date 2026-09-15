"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  FileCheck,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { SAMPLE_PITCH_DECK } from "@/lib/sampleData";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { ThesisConfig } from "@/lib/types";

interface IngestionFormProps {
  onEvaluate: (
    inputText: string, 
    inputType: "pdf" | "text" | "url", 
    sourceName?: string,
    thesisConfig?: ThesisConfig
  ) => void;
  onViewSampleEvaluation: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
  thesisConfig: ThesisConfig;
  onThesisChange: (newConfig: ThesisConfig) => void;
}

export const IngestionForm: React.FC<IngestionFormProps> = ({
  onEvaluate,
  onViewSampleEvaluation,
  isLoading,
  errorMessage,
  thesisConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"pdf" | "text" | "url">("pdf");
  
  // Tab states
  const [rawText, setRawText] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfExtractedText, setPdfExtractedText] = useState("");
  const [pdfExtracting, setPdfExtracting] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);

  // Legible Loading Progress Step (Audit Point 24)
  const [loadingStep, setLoadingStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading) {
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1400);
    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  // Load sample deck
  const handleLoadSample = () => {
    setActiveTab("text");
    setRawText(SAMPLE_PITCH_DECK);
    setIsSampleLoaded(true);
    setTimeout(() => setIsSampleLoaded(false), 3000);
  };

  // PDF Upload & Extraction
  const handleFileChange = async (file: File) => {
    if (!file || file.type !== "application/pdf") {
      setPdfError("Please upload a valid PDF file (.pdf)");
      return;
    }

    setPdfFile(file);
    setPdfError(null);
    setPdfExtracting(true);

    try {
      const extracted = await extractTextFromPDF(file);
      setPdfExtractedText(extracted);
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Failed to parse text from PDF.";
      setPdfError(errMsg);
    } finally {
      setPdfExtracting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "pdf") {
      if (!pdfExtractedText) {
        setPdfError("No extracted text found in PDF. Please select or upload a valid pitch deck PDF.");
        return;
      }
      onEvaluate(pdfExtractedText, "pdf", pdfFile?.name || "Pitch_Deck.pdf", thesisConfig);
    } else if (activeTab === "text") {
      if (!rawText.trim()) return;
      onEvaluate(rawText, "text", "Founder_Notes.txt", thesisConfig);
    } else if (activeTab === "url") {
      if (!urlInput.trim()) return;
      const textFromUrl = `URL TO EVALUATE: ${urlInput.trim()}\n\nNote: Please evaluate the company from the URL provided and infer deeptech / operational attributes based on available public venture intelligence data for this domain.`;
      onEvaluate(textFromUrl, "url", urlInput.trim(), thesisConfig);
    }
  };

  const LOADING_STEPS = [
    { label: "Ingesting collateral & parsing slides", sub: "Reading raw structure & claims" },
    { label: "Extracting company claims & unit economics", sub: "Isolating traction, BOM, and moats" },
    { label: "Testing mandate fit against active thesis", sub: `Checking against ${thesisConfig.presetName}` },
    { label: "Running negative diligence & surfacing blindspots", sub: "Differentiating conflicts, risks, and missing data" },
    { label: "Synthesizing institutional Pre-IC memo", sub: "Structuring executive findings for partner review" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm overflow-hidden backdrop-blur-md">
      {/* Module Header Bar (Audit Point 9: ADD A DEAL / INGEST DEAL) */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3.5 sm:px-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-xs border border-slate-800">
            <Upload className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 font-sans">
                Add a Deal • Ingest Collateral
              </h3>
              <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                Stage 02 • Ingest Deal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Provide pitch collateral in any format—our engine parses, audits, and generates the Pre-IC memo
            </p>
          </div>
        </div>

        {/* Ingestion Mode Segmented Pills (Audit Point 9) */}
        <div className="flex items-center space-x-1 rounded-full bg-slate-200/70 p-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pdf"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider">PDF Pitch Deck</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "text"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Raw Text / Notes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "url"
                ? "bg-slate-950 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-950"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Website URL</span>
          </button>
        </div>
      </div>

      {/* Continuity Banner: psychological connection to active thesis (Audit Point 10) */}
      <div className="bg-emerald-50/50 px-4 py-2 sm:px-6 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span className="font-sans">
            Ready to evaluate against <strong className="font-semibold">{thesisConfig.presetName}</strong> ({thesisConfig.targetDeploymentRegions.join(", ")} · {thesisConfig.targetStage} · Strictness {thesisConfig.diligenceStrictness}/5)
          </span>
        </div>
        <span className="hidden md:inline font-mono text-[10px] text-emerald-700 uppercase tracking-widest font-bold">
          Mandate Active
        </span>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        
        {/* PDF TAB (Audit Point 10: Drag-and-drop answers What, Formats, and Next Steps) */}
        {activeTab === "pdf" && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-8 sm:p-10 text-center hover:border-emerald-600 hover:bg-emerald-50/20 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              
              {pdfExtracting ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">Parsing PDF Slides & Extracting Text...</p>
                  <p className="text-xs text-slate-500 font-mono">Reading client-side via pdfjs-dist</p>
                </div>
              ) : pdfFile && pdfExtractedText ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{pdfFile.name}</p>
                    <p className="text-xs text-emerald-700 font-mono mt-0.5">
                      ✓ Extracted {pdfExtractedText.length.toLocaleString()} characters ({pdfExtractedText.split(/\s+/).length} words)
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 underline hover:text-emerald-700 font-mono">
                    Click to replace PDF
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-700 group-hover:bg-slate-950 group-hover:text-emerald-400 transition-all shadow-xs border border-slate-200">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Drop your pitch deck PDF here, or <span className="underline decoration-emerald-500 text-emerald-700 font-bold">browse files</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-sans">
                      Supports startup presentation slides up to 50MB (PDF format)
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span>1. Ingest PDF</span>
                    <span>→</span>
                    <span>2. AI Negative Diligence</span>
                    <span>→</span>
                    <span>3. Pre-IC Memo</span>
                  </div>
                </div>
              )}
            </div>

            {pdfError && (
              <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{pdfError}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="shrink-0 underline font-mono text-rose-900 hover:text-rose-950 ml-2 cursor-pointer"
                >
                  Load Sample Notes Instead
                </button>
              </div>
            )}
          </div>
        )}

        {/* RAW TEXT TAB */}
        {activeTab === "text" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                Founder Raw Pitch & Operational Notes
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-slate-500">
                  {rawText.length.toLocaleString()} chars
                </span>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-xs font-mono text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer"
                >
                  {isSampleLoaded ? "✓ Loaded Aegis Notes" : "Load Sample Notes"}
                </button>
              </div>
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={11}
              placeholder="Paste founder pitch transcript, executive summary, BOM specifications, traction metrics, or partner intro notes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed transition-all"
            />
          </div>
        )}

        {/* URL TAB */}
        {activeTab === "url" && (
          <div className="space-y-3 py-3">
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
              Company Website or Virtual Data Room URL
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Globe className="h-4 w-4" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://aeroedge-robotics.tech"
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-xs"
              />
            </div>
            <p className="text-xs text-slate-500 font-sans">
              The diligence engine will crawl public venture intelligence and technical documentation for this domain.
            </p>
          </div>
        )}

        {/* FIRST-CLASS ACTIONABLE ERROR STATES (Audit Point 25) */}
        {errorMessage && (
          <div className="rounded-xl border border-rose-300 bg-rose-50/90 p-4 text-xs text-rose-900 space-y-3">
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-950">Screening Pipeline Error</p>
                <p className="text-rose-800 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/80">
              <span className="font-mono text-[10.5px] uppercase font-bold text-rose-700">Suggested Next Steps:</span>
              <button
                type="button"
                onClick={onViewSampleEvaluation}
                className="rounded-lg bg-white border border-rose-300 px-3 py-1 text-[11px] font-mono font-bold text-rose-900 hover:bg-rose-100 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Sparkles className="h-3 w-3 text-emerald-600" />
                <span>View Sample Memo</span>
              </button>
              <button
                type="button"
                onClick={handleLoadSample}
                className="rounded-lg bg-white border border-rose-300 px-3 py-1 text-[11px] font-mono font-bold text-rose-900 hover:bg-rose-100 transition-all cursor-pointer"
              >
                Load Raw Notes
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-white border border-rose-300 px-3 py-1 text-[11px] font-mono font-bold text-rose-900 hover:bg-rose-100 transition-all cursor-pointer"
              >
                Try Another PDF
              </button>
            </div>
          </div>
        )}

        {/* LEGIBLE MULTI-STEP LOADING STATE (Audit Point 24) */}
        {isLoading && (
          <div className="rounded-xl border border-emerald-200 bg-slate-950 p-6 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-emerald-400">
                  Screening Deal Against Mandate...
                </span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                Stage {loadingStep + 1} of {LOADING_STEPS.length}
              </span>
            </div>

            {/* Legible Process Steps (Audit Point 24) */}
            <div className="space-y-2.5">
              {LOADING_STEPS.map((step, idx) => {
                const isDone = idx < loadingStep;
                const isCurrent = idx === loadingStep;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-start space-x-3 text-xs transition-opacity duration-300 ${
                      isDone ? "text-emerald-400" : isCurrent ? "text-white font-bold" : "text-slate-600"
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-mono text-[10px] font-black animate-pulse">
                          →
                        </span>
                      ) : (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-slate-500 font-mono text-[10px]">
                          {idx + 1}
                        </span>
                      )}
                    </span>
                    <div>
                      <p className="font-mono">{step.label}</p>
                      <p className="text-[10.5px] text-slate-400 font-sans font-normal">{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTION HIERARCHY: DOMINANT DUAL CTAs (Audit Point 11 & 12) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          {/* Secondary CTA: Try Sample Evaluation */}
          <button
            type="button"
            onClick={onViewSampleEvaluation}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 hover:border-slate-900 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Try Sample Evaluation (Instant)</span>
          </button>

          {/* Primary CTA: Run Institutional Diligence */}
          <button
            type="submit"
            disabled={
              isLoading ||
              (activeTab === "pdf" && !pdfExtractedText) ||
              (activeTab === "text" && !rawText.trim()) ||
              (activeTab === "url" && !urlInput.trim())
            }
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-xs font-mono font-bold uppercase tracking-widest shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Screening Deal...</span>
              </>
            ) : (
              <>
                <span>Run Institutional Diligence</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
