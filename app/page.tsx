"use client";

import React, { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { IngestionForm } from "@/components/IngestionForm";
import { ScorecardView } from "@/components/ScorecardView";
import { ThesisConfigPanel } from "@/components/ThesisConfigPanel";
import { DealflowQueue } from "@/components/DealflowQueue";
import { EvaluationResult, ThesisConfig, SavedDealRecord } from "@/lib/types";
import { DEFAULT_THESIS_CONFIG } from "@/lib/thesisPresets";
import { SAMPLE_DEAL_MEMO } from "@/lib/sampleData";
import { 
  getSavedDeals, 
  saveDealToLocalStorage, 
  deleteSavedDealFromLocalStorage, 
  clearAllLocalStorage,
  LOCAL_KEY_STORAGE 
} from "@/lib/dealStorage";
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Sliders, 
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  const [apiKey, setApiKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(LOCAL_KEY_STORAGE) || "";
    }
    return "";
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [thesisConfig, setThesisConfig] = useState<ThesisConfig>(DEFAULT_THESIS_CONFIG);
  
  // Navigation: Workspace vs Dealflow Queue (Required Item 2)
  const [activeView, setActiveView] = useState<"workspace" | "queue">("workspace");
  const [savedDeals, setSavedDeals] = useState<SavedDealRecord[]>(() => {
    if (typeof window !== "undefined") {
      return getSavedDeals();
    }
    return [];
  });

  const ingestSectionRef = useRef<HTMLDivElement>(null);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    setIsRateLimited(false);
    if (typeof window !== "undefined") {
      if (key) {
        localStorage.setItem(LOCAL_KEY_STORAGE, key);
      } else {
        localStorage.removeItem(LOCAL_KEY_STORAGE);
      }
    }
  };

  // Dedicated Sample Evaluation handler
  const handleViewSampleEvaluation = () => {
    setEvaluationResult(SAMPLE_DEAL_MEMO);
    setActiveView("workspace");
    setErrorMessage(null);
    setIsRateLimited(false);
    setIsModalOpen(false);
  };

  // Save deal manually or on evaluation finish (Required Item 1)
  const handleSaveDeal = (dealData: EvaluationResult) => {
    const savedRecord = saveDealToLocalStorage(dealData);
    setSavedDeals((prev) => {
      const remaining = prev.filter(
        (d) => d.id !== savedRecord.id && d.companyName.toLowerCase() !== savedRecord.companyName.toLowerCase()
      );
      return [savedRecord, ...remaining];
    });
  };

  const handleDeleteDeal = (id: string) => {
    const updated = deleteSavedDealFromLocalStorage(id);
    setSavedDeals(updated);
  };

  const handleClearAllStorage = () => {
    clearAllLocalStorage();
    setApiKey("");
    setSavedDeals([]);
    setIsRateLimited(false);
  };

  const handleLoadSampleDeal = () => {
    const record = saveDealToLocalStorage(SAMPLE_DEAL_MEMO);
    setSavedDeals((prev) => {
      const remaining = prev.filter(
        (d) => d.companyName.toLowerCase() !== record.companyName.toLowerCase()
      );
      return [record, ...remaining];
    });
  };

  const handleEvaluate = async (
    inputText: string, 
    inputType: "pdf" | "text" | "url", 
    sourceName?: string,
    currentThesis: ThesisConfig = thesisConfig
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsRateLimited(false);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey.trim()) {
        headers["X-Custom-API-Key"] = apiKey.trim();
      }

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputText,
          inputType,
          sourceName,
          customApiKey: apiKey.trim() || undefined,
          thesisConfig: currentThesis,
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        setIsRateLimited(true);
        setIsModalOpen(true);
        throw new Error(
          data.error || "Free trial limit reached (5 screens/hr). Click Settings to add your free Gemini API key."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete deal evaluation.");
      }

      if (data.result) {
        const fullResult: EvaluationResult = {
          ...data.result,
          evaluatedThesis: currentThesis,
        };
        setEvaluationResult(fullResult);

        // Auto-save evaluated deal to browser's localStorage (Required Item 1)
        handleSaveDeal(fullResult);
      } else {
        throw new Error("No evaluation result returned from API.");
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "An error occurred during evaluation.";
      setErrorMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEvaluationResult(null);
    setErrorMessage(null);
    setActiveView("workspace");
  };

  const handleOpenSettings = () => {
    setIsRateLimited(false);
    setIsModalOpen(true);
  };

  const scrollToIngest = () => {
    ingestSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-dot-grid text-slate-900 selection:bg-emerald-500/20 selection:text-slate-950 font-sans antialiased flex flex-col">
      
      {/* Navbar Header with Workspace vs Queue Switcher */}
      <Header
        hasCustomKey={Boolean(apiKey.trim())}
        onOpenSettings={handleOpenSettings}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
        }}
        queueCount={savedDeals.length}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        
        {/* VIEW 1: DEALFLOW QUEUE TAB (Required Item 2) */}
        {activeView === "queue" ? (
          <DealflowQueue
            deals={savedDeals}
            onSelectDeal={(memo) => {
              setEvaluationResult(memo);
              setActiveView("workspace");
            }}
            onDeleteDeal={handleDeleteDeal}
            onNewScreen={() => {
              setEvaluationResult(null);
              setActiveView("workspace");
            }}
            onLoadSampleDeal={handleLoadSampleDeal}
          />
        ) : evaluationResult ? (
          /* VIEW 2: IC DECISION WORKSPACE (Audit Point 14) */
          <div className="py-6">
            <ScorecardView 
              data={evaluationResult} 
              onReset={handleReset} 
              onSaveDeal={handleSaveDeal}
              isDealSaved={savedDeals.some(
                (d) => d.companyName.toLowerCase() === evaluationResult.companyProfile?.name?.toLowerCase()
              )}
            />
          </div>
        ) : (
          /* VIEW 3: THREE-STAGE WORKSPACE & HERO (Audit Points 1, 2, 31, 34) */
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-9">
            
            {/* HERO SECTION MATCHING SCREENSHOT REFERENCE */}
            <section className="text-center space-y-4 pt-2">
              <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-300 bg-white/90 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-emerald-800 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operator Diligence Lab • Pre-IC Engine</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 uppercase max-w-4xl mx-auto leading-[1.08] font-sans">
                Smarter Dealflow. <br className="hidden sm:inline" />
                <span className="text-slate-950">Stronger Decisions.</span>
              </h1>

              <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
                An AI-powered screening tool for venture capital funds that brings structure, objectivity, and negative diligence to the first mile of dealflow.
              </p>

              {/* Callout & Dual Dominant CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={scrollToIngest}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white px-7 py-3 text-xs font-mono font-bold uppercase tracking-widest shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <span>Screen a Deal Now</span>
                  <ArrowRight className="h-4 w-4 text-emerald-400" />
                </button>

                <button
                  type="button"
                  onClick={handleViewSampleEvaluation}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-800 hover:border-emerald-600 hover:text-emerald-950 hover:bg-emerald-50/30 transition-all shadow-2xs cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Try Sample Evaluation (Instant)</span>
                </button>
              </div>

              {/* Subtitle Highlight */}
              <div className="pt-1">
                <span className="font-mono text-xs text-slate-500 font-medium">
                  Turn unstructured pitch decks into <strong className="text-emerald-700 font-bold">structured insights.</strong>
                </span>
              </div>

              {/* 3 VALUE PROP PILLARS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-left">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center space-x-2.5 text-slate-950">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-sans font-bold text-sm">1. Ingest</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Drop a PDF deck, paste founder notes, or enter a live URL — zero manual reformatting required.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center space-x-2.5 text-slate-950">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      <Sliders className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-sans font-bold text-sm">2. Configure Mandate</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Set your fund&apos;s mandate (region, stage, tech depth hurdle, strictness level, and hard exclusions).
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-2 shadow-2xs">
                  <div className="flex items-center space-x-2.5 text-slate-950">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-sans font-bold text-sm">3. Audit & Memo</span>
                  </div>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    AI runs negative diligence, decomposes score drivers, and generates a structured 1-page Pre-IC memo.
                  </p>
                </div>
              </div>
            </section>

            {/* THREE-STAGE WORKSPACE PROGRESS TRACKER */}
            <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs font-mono">
              <div className="flex items-center space-x-2 text-slate-950 font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">
                  01
                </span>
                <span>Define Mandate</span>
              </div>
              <span className="text-slate-300">━━━━━</span>
              <div className="flex items-center space-x-2 text-slate-950 font-bold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white text-[10px]">
                  02
                </span>
                <span>Ingest Deal</span>
              </div>
              <span className="text-slate-300">━━━━━</span>
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-[10px]">
                  03
                </span>
                <span>Review Findings</span>
              </div>
            </div>

            {/* STAGE 01: MANDATE CONFIGURATOR */}
            <ThesisConfigPanel
              config={thesisConfig}
              onChange={setThesisConfig}
            />

            {/* STAGE 02: INGESTION FORM */}
            <div ref={ingestSectionRef}>
              <IngestionForm
                onEvaluate={handleEvaluate}
                onViewSampleEvaluation={handleViewSampleEvaluation}
                isLoading={isLoading}
                errorMessage={errorMessage}
                thesisConfig={thesisConfig}
                onThesisChange={setThesisConfig}
              />
            </div>

            {/* FOOTER CALLOUT */}
            <div className="border-t border-slate-200 pt-6 text-center space-y-2">
              <div className="inline-flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
                <span className="h-1 w-6 bg-emerald-500 rounded-full" />
                <span>BUILT FOR INVESTORS. BACKED BY REAL DEALFLOW.</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                TEST IT. SHARE YOUR FEEDBACK. HELP US IMPROVE.
              </p>
            </div>

          </div>
        )}

      </main>

      {/* Settings / API Key Modal with Privacy Disclosure & Clear Local Storage */}
      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsRateLimited(false);
        }}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        rateLimitExceeded={isRateLimited}
        onViewSampleEvaluation={handleViewSampleEvaluation}
        onClearAllLocalStorage={handleClearAllStorage}
      />
    </div>
  );
}
