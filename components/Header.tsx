"use client";

import React from "react";
import { Settings, Cpu, Sparkles } from "lucide-react";

interface HeaderProps {
  hasCustomKey: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasCustomKey, onOpenSettings }) => {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-zinc-950 shadow-md shadow-emerald-500/10">
            <Cpu className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-sans text-lg font-bold tracking-tight text-zinc-100">
                DEAL SCREENER
              </h1>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                Institutional v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              DeepTech & Cross-Border Sovereign VC Intelligence
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Powered by <strong className="text-zinc-200">Gemini 3.6 Flash</strong></span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <Settings className="h-3.5 w-3.5 text-zinc-400" />
            <span>Settings</span>
            <span
              title={hasCustomKey ? "Custom API Key Active (Unlimited)" : "Using Shared Server Key (5 screens/hr)"}
              className={`h-2 w-2 rounded-full ${
                hasCustomKey ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-amber-400"
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
