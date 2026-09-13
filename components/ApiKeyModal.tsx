"use client";

import React, { useState } from "react";
import { X, Settings, ExternalLink, Check, AlertCircle, Zap, ShieldAlert } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  rateLimitExceeded?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  rateLimitExceeded = false,
}) => {
  const [prevApiKey, setPrevApiKey] = useState(apiKey);
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (prevApiKey !== apiKey) {
    setPrevApiKey(apiKey);
    setInputKey(apiKey);
  }

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setInputKey("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 font-sans">Settings & API Access</h3>
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Dual API Key Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rate Limit Alert Banner (when 429 occurs) */}
        {rateLimitExceeded && (
          <div className="flex items-start space-x-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950">Free Trial Limit Reached (5 screens/hr)</p>
              <p className="text-slate-700 leading-relaxed font-editorial italic">
                Add your own free Gemini API key below to unlock <strong>unlimited screenings</strong> with zero rate limits.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Google Gemini API Key
              </label>
              <span className="text-[10px] font-mono font-semibold text-[#b89047] uppercase">Unlimited Tier</span>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Stored securely in your browser&apos;s localStorage and passed via the <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">X-Custom-API-Key</code> header.
            </p>
            <div className="mt-2 relative">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 font-mono text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-xs"
              />
            </div>
            {inputKey.trim().startsWith("AQ.") && (
              <div className="mt-2 flex items-start space-x-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                <span>
                  Keys starting with <code className="font-mono font-bold text-amber-900">AQ.</code> are Google Cloud OAuth tokens, not Gemini API keys. Gemini keys from Google AI Studio start with <code className="font-mono font-bold text-emerald-800">AIzaSy...</code>.
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-slate-900 font-semibold">
              <Zap className="h-3.5 w-3.5 text-[#b89047]" />
              <span>Get a free key from Google AI Studio</span>
            </div>
            <p className="leading-relaxed">
              Obtain your free Gemini API key with generous limits at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 underline hover:text-[#b89047] inline-flex items-center space-x-1 font-mono font-medium"
              >
                <span>aistudio.google.com/app/apikey</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-600 hover:underline font-mono cursor-pointer"
              >
                Clear Saved Key
              </button>
            ) : <span />}

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Key</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
