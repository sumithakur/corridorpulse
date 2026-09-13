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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">Settings & API Access</h3>
              <p className="text-[11px] font-mono text-zinc-400">Dual API Key Architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Rate Limit Alert Banner (when 429 occurs) */}
        {rateLimitExceeded && (
          <div className="flex items-start space-x-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-300">Free Trial Limit Reached (5 screens/hr)</p>
              <p className="text-zinc-300 leading-relaxed">
                Add your own free Gemini API key below to unlock <strong>unlimited screenings</strong> with zero rate limits.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-medium text-zinc-300">
                Google Gemini API Key
              </label>
              <span className="text-[10px] font-mono text-emerald-400">Unlimited Tier</span>
            </div>
            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
              Stored securely in your browser&apos;s localStorage and passed via the <code className="font-mono text-zinc-300">X-Custom-API-Key</code> header.
            </p>
            <div className="mt-2 relative">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 font-mono text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {inputKey.trim().startsWith("AQ.") && (
              <div className="mt-2 flex items-start space-x-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Keys starting with <code className="font-mono font-bold text-amber-200">AQ.</code> are Google Cloud OAuth tokens, not Gemini API keys. Gemini keys from Google AI Studio start with <code className="font-mono font-bold text-emerald-300">AIzaSy...</code>.
                </span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <Zap className="h-3.5 w-3.5" />
              <span>Get a free key from Google AI Studio</span>
            </div>
            <p className="leading-relaxed">
              Obtain your free Gemini API key with generous limits at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center space-x-1 font-mono font-medium"
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
                className="text-xs text-rose-400 hover:underline"
              >
                Clear Saved Key
              </button>
            ) : <span />}

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors shadow-sm"
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
