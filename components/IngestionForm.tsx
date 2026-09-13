"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  Upload, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  FileCheck
} from "lucide-react";
import { SAMPLE_PITCH_DECK } from "@/lib/sampleData";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { ThesisConfig } from "@/lib/types";
import { ThesisConfigPanel } from "./ThesisConfigPanel";

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
  onThesisChange,
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Section matching sumitkt.com aesthetic */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center space-x-2 rounded-full border border-slate-300 bg-white/90 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-slate-700 shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b89047]" />
          <span>Operator Diligence Lab • Pre-IC Engine</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 uppercase max-w-3xl mx-auto leading-tight font-sans">
          Institutional Deal Screener & Pre-IC Memo Engine.
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-editorial italic leading-relaxed">
          Bridge the gap between raw startup collateral and institutional-grade investment committee memos. Evaluated dynamically against user-defined thesis constraints.
        </p>

        {/* Quick Sample Action */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onViewSampleEvaluation}
            className="inline-flex items-center space-x-2 rounded-full border border-slate-300/90 bg-white px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 hover:border-slate-900 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#b89047]" />
            <span>View Sample Evaluation (No API Key Required)</span>
          </button>
        </div>
      </div>

      {/* 1. Thesis Configuration Panel */}
      <ThesisConfigPanel
        config={thesisConfig}
        onChange={onThesisChange}
      />

      {/* 2. Collateral Ingestion Form Container */}
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm overflow-hidden backdrop-blur-md">
        {/* Top Control Bar with Segmented Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 sm:px-6 gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 rounded-full bg-slate-200/70 p-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("pdf")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
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
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "url"
                  ? "bg-slate-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Website URL</span>
            </button>
          </div>

          {/* Sample Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onViewSampleEvaluation}
              className="flex items-center space-x-1.5 rounded-full border border-slate-900 bg-slate-950 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="h-3 w-3 text-[#b89047]" />
              <span>View Sample Evaluation</span>
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              title="Populate raw notes with sample pitch deck text"
              className="flex items-center justify-center space-x-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all shadow-xs cursor-pointer"
            >
              <span>{isSampleLoaded ? "✓ Notes Loaded" : "Load Notes"}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* PDF Tab */}
          {activeTab === "pdf" && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 sm:p-10 text-center hover:border-slate-800 hover:bg-slate-50 transition-all"
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
                    <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                    <p className="text-sm font-semibold text-slate-900">Parsing PDF Slides & Extracting Text...</p>
                    <p className="text-xs text-slate-500 font-mono">Reading client-side via pdfjs-dist</p>
                  </div>
                ) : pdfFile && pdfExtractedText ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-950">{pdfFile.name}</p>
                      <p className="text-xs text-emerald-700 font-mono mt-0.5">
                        ✓ Extracted {pdfExtractedText.length.toLocaleString()} characters
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 underline hover:text-slate-900 font-mono">
                      Click to replace PDF
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200/80 text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-xs">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Drag & Drop pitch deck PDF here, or <span className="underline decoration-slate-400 font-bold">browse</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 font-editorial italic">
                        Supports standard startup presentation slides (PDF format up to 25MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {pdfError && (
                <div className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{pdfError}</span>
                </div>
              )}
            </div>
          )}

          {/* Raw Text Tab */}
          {activeTab === "text" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                  Founder Raw Pitch & Operational Notes
                </label>
                <span className="text-xs font-mono text-slate-500">
                  {rawText.length.toLocaleString()} chars | ~{rawText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                placeholder="Paste startup overview, technical specs, BOM details, traction metrics, or pitch transcript..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-4 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed transition-all"
              />
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="space-y-3 py-4">
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
                  placeholder="https://aegis-robotics.tech"
                  className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-xs"
                />
              </div>
              <p className="text-xs text-slate-500 font-editorial italic">
                The evaluation engine will synthesize domain intelligence and technical positioning for the specified company.
              </p>
            </div>
          )}

          {/* API Error Notification */}
          {errorMessage && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <div className="flex-1">{errorMessage}</div>
              </div>
              <button
                type="button"
                onClick={onViewSampleEvaluation}
                className="shrink-0 flex items-center space-x-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-900 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-[#b89047]" />
                <span>View Sample Memo</span>
              </button>
            </div>
          )}

          {/* Submit Action: Signature Metallic Brass Button & View Sample Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onViewSampleEvaluation}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 hover:border-slate-900 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#b89047]" />
              <span>View Sample Evaluation</span>
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                (activeTab === "pdf" && !pdfExtractedText) ||
                (activeTab === "text" && !rawText.trim()) ||
                (activeTab === "url" && !urlInput.trim())
              }
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 rounded-xl brass-btn px-7 py-3 text-xs font-mono font-bold uppercase tracking-widest shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Evaluating Deal with Gemini...</span>
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
    </div>
  );
};
