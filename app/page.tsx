"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { IngestionForm } from "@/components/IngestionForm";
import { ScorecardView } from "@/components/ScorecardView";
import { EvaluationResult, ThesisConfig } from "@/lib/types";
import { DEFAULT_THESIS_CONFIG } from "@/lib/thesisPresets";
import { SAMPLE_DEAL_MEMO } from "@/lib/sampleData";

const LOCAL_KEY_STORAGE = "DEAL_SCREENER_GEMINI_KEY";

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

  // Dedicated Sample Evaluation handler: Bypasses API key validation and /api/evaluate network calls completely
  const handleViewSampleEvaluation = () => {
    setEvaluationResult(SAMPLE_DEAL_MEMO);
    setErrorMessage(null);
    setIsRateLimited(false);
    setIsModalOpen(false);
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

      // Pass custom API key in request header if configured
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

      // Gracefully handle 429 Rate Limit
      if (response.status === 429) {
        setIsRateLimited(true);
        setIsModalOpen(true);
        throw new Error(
          data.error || "Free trial limit reached (5 screens/hr). Click the Settings gear to add your free Gemini API key to continue."
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete deal evaluation.");
      }

      if (data.result) {
        // Attach evaluated thesis to result for UI display
        setEvaluationResult({
          ...data.result,
          evaluatedThesis: currentThesis,
        });
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
  };

  const handleOpenSettings = () => {
    setIsRateLimited(false);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-dot-grid text-slate-900 selection:bg-[#b89047]/25 selection:text-slate-950 font-sans antialiased">
      {/* Navbar Header */}
      <Header
        hasCustomKey={Boolean(apiKey.trim())}
        onOpenSettings={handleOpenSettings}
      />

      {/* Main View Router */}
      <main className="pb-16">
        {evaluationResult ? (
          <ScorecardView data={evaluationResult} onReset={handleReset} />
        ) : (
          <IngestionForm
            onEvaluate={handleEvaluate}
            onViewSampleEvaluation={handleViewSampleEvaluation}
            isLoading={isLoading}
            errorMessage={errorMessage}
            thesisConfig={thesisConfig}
            onThesisChange={setThesisConfig}
          />
        )}
      </main>

      {/* Settings / API Key Modal */}
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
      />
    </div>
  );
}
