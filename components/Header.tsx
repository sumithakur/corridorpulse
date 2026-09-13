"use client";

import React from "react";
import { Settings, Sparkles, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  hasCustomKey: boolean;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ hasCustomKey, onOpenSettings }) => {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand & Logo matching sumitkt.com */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white font-mono font-black text-sm shadow-xs">
            DS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-sans text-base sm:text-lg font-black tracking-tight text-slate-950 uppercase">
                DEAL SCREENER
              </h1>
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 border border-slate-200">
                Pre-IC Engine
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 font-mono tracking-tight">
              Institutional VC Diligence & Pilot Readiness Scorecard
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Link to sumitkt.com */}
          <a
            href="https://www.sumitkt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 rounded-full border border-slate-300/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider">sumitkt.com</span>
            <ArrowUpRight className="h-3 w-3 text-slate-400" />
          </a>

          {/* Active Model Indicator in sumitkt.com pill style */}
          <div className="hidden sm:flex items-center space-x-2 rounded-full border border-slate-300/80 bg-white/90 px-3 py-1 font-mono text-[11px] font-semibold text-slate-800 tracking-wider uppercase shadow-xs">
            <Sparkles className="h-3 w-3 text-[#b89047]" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Gemini 3.6</span>
            <span className="md:hidden">Active</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 rounded-full border border-slate-300/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
          >
            <Settings className="h-3.5 w-3.5 text-slate-500" />
            <span className="font-mono uppercase tracking-wider text-[11px]">Settings</span>
            <span
              title={hasCustomKey ? "Custom API Key Active (Unlimited)" : "Using Shared Server Key (5 screens/hr)"}
              className={`h-2 w-2 rounded-full ${
                hasCustomKey ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
