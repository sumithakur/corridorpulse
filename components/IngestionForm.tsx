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
  isLoading: boolean;
  errorMessage?: string | null;
  thesisConfig: ThesisConfig;
  onThesisChange: (newConfig: ThesisConfig) => void;
}

export const IngestionForm: React.FC<IngestionFormProps> = ({
  onEvaluate,
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
      // Synthesize URL pitch deck evaluation text context
      const textFromUrl = `URL TO EVALUATE: ${urlInput.trim()}\n\nNote: Please evaluate the company from the URL provided and infer deeptech / operational attributes based on available public venture intelligence data for this domain.`;
      onEvaluate(textFromUrl, "url", urlInput.trim(), thesisConfig);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Banner Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Dynamic Venture Diligence & Thesis Scoring</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
          Screen Deals & Pilot Feasibility Against Your Thesis
        </h2>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-400">
          Configure your investment criteria, then upload startup collateral (PDF deck, notes, or URL) to generate an objective, partner-level IC Scorecard.
        </p>
      </div>

      {/* 1. Thesis Configuration Panel */}
      <ThesisConfigPanel
        config={thesisConfig}
        onChange={onThesisChange}
      />

      {/* 2. Collateral Ingestion Form Container */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-4 py-3 sm:px-6 gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 rounded-xl bg-zinc-900 p-1 border border-zinc-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("pdf")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "pdf"
                  ? "bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload PDF Deck</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("text")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "text"
                  ? "bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Text / Founder Notes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "url"
                  ? "bg-zinc-800 text-emerald-400 shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>Website / URL</span>
            </button>
          </div>

          {/* Sample Deck Loader Button */}
          <button
            type="button"
            onClick={handleLoadSample}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-teal-300 hover:border-teal-400/50 hover:bg-teal-500/20 transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>{isSampleLoaded ? "✓ Sample Deck Loaded!" : "Load Sample Pitch Deck"}</span>
          </button>
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
                className="group cursor-pointer flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950/40 p-8 sm:p-10 text-center hover:border-emerald-500/60 hover:bg-zinc-950/80 transition-all"
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
                    <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
                    <p className="text-sm font-medium text-zinc-300">Parsing PDF Slides & Extracting Text...</p>
                    <p className="text-xs text-zinc-500">Reading client-side via pdfjs-dist</p>
                  </div>
                ) : pdfFile && pdfExtractedText ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{pdfFile.name}</p>
                      <p className="text-xs text-emerald-400 font-mono mt-0.5">
                        ✓ Extracted {pdfExtractedText.length.toLocaleString()} characters
                      </p>
                    </div>
                    <span className="text-xs text-zinc-500 underline hover:text-zinc-300">
                      Click to replace PDF
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Drag & Drop pitch deck PDF here, or <span className="text-emerald-400 font-semibold underline">browse</span>
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        Supports standard startup presentation slides (PDF format up to 25MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {pdfError && (
                <div className="flex items-center space-x-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{pdfError}</span>
                </div>
              )}
            </div>
          )}

          {/* Raw Text Tab */}
          {activeTab === "text" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Founder Raw Pitch & Operational Notes
                </label>
                <span className="text-xs font-mono text-zinc-400">
                  {rawText.length.toLocaleString()} chars | ~{rawText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                placeholder="Paste startup overview, technical specs, BOM details, traction metrics, or pitch transcript..."
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* URL Tab */}
          {activeTab === "url" && (
            <div className="space-y-3 py-4">
              <label className="block text-xs font-mono font-medium text-zinc-300">
                Company Website or Virtual Data Room URL
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-500">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://aegis-robotics.tech"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 pl-10 pr-4 py-3 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-zinc-400">
                The evaluation engine will synthesize domain intelligence and technical positioning for the specified company.
              </p>
            </div>
          )}

          {/* API Error Notification */}
          {errorMessage && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={
                isLoading ||
                (activeTab === "pdf" && !pdfExtractedText) ||
                (activeTab === "text" && !rawText.trim()) ||
                (activeTab === "url" && !urlInput.trim())
              }
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-zinc-950" />
                  <span>Evaluating Deal with Gemini...</span>
                </>
              ) : (
                <>
                  <span>Evaluate Deal Readiness</span>
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
