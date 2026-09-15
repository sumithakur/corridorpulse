"use client";

import React from "react";
import { Settings, Sparkles, ArrowUpRight, LayoutGrid, Inbox } from "lucide-react";

interface HeaderProps {
  hasCustomKey: boolean;
  onOpenSettings: () => void;
  activeView?: "workspace" | "queue";
  onSelectView?: (view: "workspace" | "queue") => void;
  queueCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  hasCustomKey, 
  onOpenSettings,
  activeView = "workspace",
  onSelectView,
  queueCount = 4
}) => {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/90 bg-white/90 backdrop-blur-md transition-all">
      {/* Top Process Strip matching image: INGEST / ANALYZE / SURFACE / DECIDE */}
      <div className="border-b border-slate-100 bg-slate-950 text-slate-400 text-[10px] font-mono tracking-widest uppercase py-1 px-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="hidden sm:inline font-semibold text-slate-300">
            FROM DEALFLOW TO DECISIONS
          </span>
          <div className="flex items-center space-x-2 text-[9.5px] tracking-widest text-slate-400 mx-auto sm:mx-0">
            <span className="text-emerald-400 font-bold">INGEST</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 font-medium">ANALYZE</span>
            <span className="text-slate-700">/</span>
            <span className="text-slate-300 font-medium">SURFACE</span>
            <span className="text-slate-700">/</span>
            <span className="text-emerald-400 font-bold">DECIDE</span>
          </div>
          <span className="hidden md:inline text-slate-500">
            screener.sumitkt.com
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo matching screenshot: Deal Screener with emerald accent */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white font-mono font-black text-sm shadow-xs border border-slate-800">
            <span className="text-white">D</span>
            <span className="text-emerald-400">S</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans text-lg sm:text-xl font-black tracking-tight text-slate-950 uppercase">
                Deal <span className="text-emerald-500">Screener</span>
              </span>
              <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
                Pre-IC Engine
              </span>
            </div>
            <p className="hidden sm:block text-[10.5px] text-slate-500 font-mono tracking-tight uppercase">
              Operator Diligence & Sovereign Pilot Readiness
            </p>
          </div>
        </div>

        {/* Center Navigation Switcher (Workspace vs Dealflow Queue) */}
        {onSelectView && (
          <nav className="flex items-center rounded-full bg-slate-100 p-1 border border-slate-200 shadow-inner">
            <button
              onClick={() => onSelectView("workspace")}
              className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "workspace"
                  ? "bg-slate-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"
              }`}
            >
              <LayoutGrid className="h-3 w-3" />
              <span>Workspace</span>
            </button>
            <button
              onClick={() => onSelectView("queue")}
              className={`flex items-center space-x-1.5 rounded-full px-3.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "queue"
                  ? "bg-slate-950 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/70"
              }`}
            >
              <Inbox className="h-3 w-3" />
              <span>Dealflow</span>
              {queueCount > 0 && (
                <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  activeView === "queue" ? "bg-emerald-500 text-slate-950" : "bg-slate-200 text-slate-700"
                }`}>
                  {queueCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Status & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Link to sumitkt.com */}
          <a
            href="https://www.sumitkt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 rounded-full border border-slate-300/80 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-950 hover:bg-slate-50 transition-all shadow-xs"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider">sumitkt.com</span>
            <ArrowUpRight className="h-3 w-3 text-slate-400" />
          </a>

          {/* Active Engine Indicator */}
          <div 
            title="Diligence engine powered by Google Gemini with dynamic thesis injection"
            className="hidden lg:flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 font-mono text-[10.5px] font-semibold text-slate-700 uppercase tracking-wider shadow-2xs"
          >
            <Sparkles className="h-3 w-3 text-emerald-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini Engine</span>
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
