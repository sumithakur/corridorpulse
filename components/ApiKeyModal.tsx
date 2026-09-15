"use client";

import React, { useState } from "react";
import { 
  X, 
  Settings, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Zap, 
  ShieldAlert, 
  Sparkles, 
  ShieldCheck, 
  Trash2 
} from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
  rateLimitExceeded?: boolean;
  onViewSampleEvaluation?: () => void;
  onClearAllLocalStorage?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  rateLimitExceeded = false,
  onViewSampleEvaluation,
  onClearAllLocalStorage,
}) => {
  const [prevApiKey, setPrevApiKey] = useState(apiKey);
  const [inputKey, setInputKey] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

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

  const handleClearAllStorage = () => {
    if (onClearAllLocalStorage) {
      onClearAllLocalStorage();
    }
    setInputKey("");
    setClearedSuccess(true);
    setTimeout(() => {
      setClearedSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white border border-slate-800">
              <Settings className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 font-sans">Settings & Privacy</h3>
              <p className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Dual API Key Architecture • Local Storage</p>
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
            <div className="space-y-1.5 flex-1">
              <p className="font-bold text-amber-950">Free Trial Limit Reached (5 screens/hr)</p>
              <p className="text-slate-700 leading-relaxed font-sans">
                Add your own free Gemini API key below to unlock <strong>unlimited screenings</strong> with zero rate limits.
              </p>
              {onViewSampleEvaluation && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewSampleEvaluation();
                  }}
                  className="mt-1 inline-flex items-center space-x-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-900 hover:bg-amber-100 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>View Sample Evaluation (No Key Needed)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PRIVACY & LOCAL STORAGE NOTICE (Required Item 3) */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1.5 text-xs text-slate-800">
          <div className="flex items-center space-x-2 text-emerald-950 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <span className="font-mono text-xs uppercase tracking-wider">Privacy & Data Storage</span>
          </div>
          <p className="text-slate-700 leading-relaxed font-sans text-xs">
            Your Gemini API key and evaluated deals are stored 100% locally in your browser&apos;s localStorage. No credentials or proprietary deal documents are ever sent to, logged by, or stored on an external database.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                Google Gemini API Key
              </label>
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Unlimited Tier
              </span>
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 font-mono text-sm text-slate-950 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 shadow-2xs"
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
              <Zap className="h-3.5 w-3.5 text-emerald-600" />
              <span>Get a free key from Google AI Studio</span>
            </div>
            <p className="leading-relaxed">
              Obtain your free Gemini API key with generous limits at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline hover:text-emerald-900 inline-flex items-center space-x-1 font-mono font-medium"
              >
                <span>aistudio.google.com/app/apikey</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* CLEAR LOCAL STORAGE BUTTON (Required Item 3) */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-rose-950 font-mono uppercase text-[11px]">Wipe Stored Local Data</p>
              <p className="text-slate-600 text-[11px]">Delete saved API key and all local deal memo records.</p>
            </div>
            <button
              type="button"
              onClick={handleClearAllStorage}
              className="flex items-center space-x-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-mono font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shadow-2xs shrink-0 ml-3"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-600" />
              <span>{clearedSuccess ? "Cleared!" : "Clear Local Storage"}</span>
            </button>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 rounded-xl bg-slate-950 px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
