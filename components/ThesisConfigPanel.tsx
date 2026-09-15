"use client";

import React, { useState } from "react";
import { 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Check, 
  Layers, 
  MapPin, 
  Gauge, 
  ShieldAlert, 
  Compass, 
  Info,
  Plus,
  X,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { ThesisConfig } from "@/lib/types";
import {
  THESIS_PRESETS,
  AVAILABLE_REGIONS,
  SOURCING_ORIGIN_OPTIONS,
  INVESTMENT_STAGE_OPTIONS,
  AVAILABLE_SECTORS,
  TECH_DEPTH_OPTIONS,
  STRATEGIC_MANDATE_OPTIONS,
  STRICTNESS_LABELS,
  QUICK_CONSTRAINT_SUGGESTIONS,
} from "@/lib/thesisPresets";

interface ThesisConfigPanelProps {
  config: ThesisConfig;
  onChange: (newConfig: ThesisConfig) => void;
}

export const ThesisConfigPanel: React.FC<ThesisConfigPanelProps> = ({
  config,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showStrictnessExplainer, setShowStrictnessExplainer] = useState<boolean>(false);
  const [customConstraintInput, setCustomConstraintInput] = useState<string>("");

  // Handle Preset switch
  const handlePresetSelect = (presetId: string) => {
    if (THESIS_PRESETS[presetId]) {
      onChange({ ...THESIS_PRESETS[presetId] });
    }
  };

  // Toggle region multi-select
  const toggleRegion = (region: string) => {
    const exists = config.targetDeploymentRegions.includes(region);
    let updated: string[];
    if (exists) {
      if (config.targetDeploymentRegions.length === 1) return; // Keep at least one
      updated = config.targetDeploymentRegions.filter((r) => r !== region);
    } else {
      updated = [...config.targetDeploymentRegions, region];
    }
    onChange({
      ...config,
      presetId: "custom",
      presetName: "Custom Mandate",
      targetDeploymentRegions: updated,
    });
  };

  // Toggle sector multi-select
  const toggleSector = (sector: string) => {
    const exists = config.coreSectorFocus.includes(sector);
    let updated: string[];
    if (exists) {
      if (config.coreSectorFocus.length === 1) return; // Keep at least one
      updated = config.coreSectorFocus.filter((s) => s !== sector);
    } else {
      updated = [...config.coreSectorFocus, sector];
    }
    onChange({
      ...config,
      presetId: "custom",
      presetName: "Custom Mandate",
      coreSectorFocus: updated,
    });
  };

  const handleFieldChange = <K extends keyof ThesisConfig>(
    field: K,
    value: ThesisConfig[K]
  ) => {
    onChange({
      ...config,
      presetId: "custom",
      presetName: "Custom Mandate",
      [field]: value,
    });
  };

  // Split custom directives into discrete rule lines for Hero representation (Audit Point 5)
  const activeConstraints = config.customDirectives
    ? config.customDirectives
        .split(/[;\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  const handleAddConstraint = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const current = config.customDirectives ? config.customDirectives.trim() : "";
    const updated = current ? `${current}; ${trimmed}` : trimmed;
    handleFieldChange("customDirectives", updated);
    setCustomConstraintInput("");
  };

  const handleRemoveConstraint = (indexToRemove: number) => {
    const remaining = activeConstraints.filter((_, idx) => idx !== indexToRemove);
    handleFieldChange("customDirectives", remaining.join("; "));
  };

  const strictnessInfo = STRICTNESS_LABELS[config.diligenceStrictness] || STRICTNESS_LABELS[3];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm overflow-hidden backdrop-blur-md transition-all duration-300">
      
      {/* 1. TOP HEADER & MANDATE IDENTITY (Audit Point 3) */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-4 py-3 sm:px-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-emerald-400 shadow-xs border border-slate-800">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 font-sans">
                Investment Mandate Configurator
              </h3>
              <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                Stage 01 • Define Mandate
              </span>
            </div>
            <p className="text-xs text-slate-500 font-sans">
              Evaluation engine dynamically aligns scoring, weighting, and veto filters to this mandate
            </p>
          </div>
        </div>

        {/* Saved Mandates Selector & Accordion Toggle (Audit Point 28) */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold hidden md:inline">Saved Mandate:</span>
            <select
              value={config.presetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              aria-label="Investment Thesis Preset"
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 cursor-pointer shadow-xs"
            >
              <option value="preset-risin-core">Risin Core VC (GCC · India DeepTech)</option>
              <option value="preset-sovereign-ai">Sovereign AI GCC (On-Prem / High Strictness)</option>
              <option value="preset-2">Global Enterprise AI & B2B SaaS</option>
              <option value="preset-3">Climate & Industrial Hardware</option>
              <option value="preset-general">General Discovery (Sector-Agnostic First Principles)</option>
              <option value="custom">Custom Mandate</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all shadow-xs cursor-pointer"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider">{isExpanded ? "Collapse" : "Edit Mandate"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* PERSISTENT MANDATE SUMMARY STRIP (Audit Point 3 & 13) */}
      <div className="px-4 py-2.5 sm:px-6 bg-slate-950 text-slate-300 flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono uppercase tracking-widest text-[10px] text-emerald-400 font-bold">
            ACTIVE LENS:
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-white font-mono text-[11px] font-semibold border border-slate-700">
            {config.targetDeploymentRegions.join(" · ")}
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-white font-mono text-[11px] font-semibold border border-slate-700">
            {config.coreSectorFocus.slice(0, 2).join(" · ")}{config.coreSectorFocus.length > 2 ? ` +${config.coreSectorFocus.length - 2}` : ""}
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-white font-mono text-[11px] font-semibold border border-slate-700">
            {config.targetStage}
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-800/80">
            Strictness {config.diligenceStrictness}/5
          </span>
          {activeConstraints.length > 0 && (
            <span className="rounded bg-emerald-950/80 px-2 py-0.5 text-emerald-300 font-mono text-[11px] font-medium border border-emerald-700/60">
              {activeConstraints.length} Hard Exclusions
            </span>
          )}
        </div>
        
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
          >
            Edit Lens →
          </button>
        )}
      </div>

      {/* EXPANDED CONFIGURATOR BODY */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">

          {/* "Why am I configuring this?" Context Box (Audit Point 8) */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-3.5 sm:p-4 flex items-start space-x-3">
            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 space-y-0.5">
              <p className="font-bold text-slate-900">
                Your mandate actively changes the screen.
              </p>
              <p className="font-sans text-slate-600 leading-relaxed">
                The AI does not decide what a good investment is—your fund does. The exact same company will score differently depending on your geography, technical hurdle, risk strictness, and non-negotiable exclusions.
              </p>
            </div>
          </div>

          {/* 4 CONCEPTUAL GROUPS (Audit Point 7) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* GROUP 1: FUND PROFILE (Audit Point 7.1) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  <span>1. Fund Profile</span>
                </span>
                <span className="text-[10.5px] font-mono text-slate-400">Core parameters</span>
              </div>

              {/* Target Deployment Regions with Selected vs Available (Audit Point 4) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Deployment Regions
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {config.targetDeploymentRegions.length} selected
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_REGIONS.map((region) => {
                      const isSelected = config.targetDeploymentRegions.includes(region);
                      return (
                        <button
                          key={region}
                          type="button"
                          onClick={() => toggleRegion(region)}
                          className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-slate-950 text-white border border-slate-950 shadow-xs"
                              : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:bg-white"
                          }`}
                        >
                          {isSelected && <Check className="inline h-3 w-3 mr-1 text-emerald-400" />}
                          {region}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Core Sector Focus (Audit Point 4) */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700 flex items-center space-x-1">
                    <Layers className="h-3 w-3 text-slate-400" />
                    <span>Sector Focus</span>
                  </label>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {config.coreSectorFocus.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SECTORS.map((sector) => {
                    const isSelected = config.coreSectorFocus.includes(sector);
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => toggleSector(sector)}
                        className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-950 text-white border border-slate-950 shadow-xs"
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-400 hover:text-slate-900 hover:bg-white"
                        }`}
                      >
                        {isSelected && <Check className="inline h-3 w-3 mr-1 text-emerald-400" />}
                        {sector}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Investment Stage */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700">
                  Target Investment Stage
                </label>
                <select
                  value={config.targetStage}
                  onChange={(e) => handleFieldChange("targetStage", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs cursor-pointer"
                >
                  {INVESTMENT_STAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* GROUP 2: INVESTMENT LENS (Audit Point 7.2) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-1.5">
                  <Compass className="h-3.5 w-3.5 text-emerald-600" />
                  <span>2. Investment Lens & Moat</span>
                </span>
                <span className="text-[10.5px] font-mono text-slate-400">Underwriting hurdles</span>
              </div>

              {/* Tech Depth Hurdle */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700">
                  Tech Depth Hurdle
                </label>
                <select
                  value={config.techDepthHurdle}
                  onChange={(e) => handleFieldChange("techDepthHurdle", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs cursor-pointer"
                >
                  {TECH_DEPTH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 font-sans">
                  Sets the defensibility threshold. Rejects trivial wrappers if DeepTech or Applied AI is required.
                </p>
              </div>

              {/* Sourcing / R&D Origin & Strategic Mandate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Sourcing / R&D Origin
                  </label>
                  <select
                    value={config.sourcingRndOrigin}
                    onChange={(e) => handleFieldChange("sourcingRndOrigin", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {SOURCING_ORIGIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Strategic Mandate
                  </label>
                  <select
                    value={config.strategicMandate}
                    onChange={(e) => handleFieldChange("strategicMandate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {STRATEGIC_MANDATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Pre-IC Screening Lens Active</span>
                </div>
                <p>
                  Evaluates alignment with venture return profile and regional procurement pipelines.
                </p>
              </div>
            </div>

            {/* GROUP 3: RISK TOLERANCE (STRICTNESS) (Audit Point 6 & 7.3) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-1.5">
                  <Gauge className="h-3.5 w-3.5 text-emerald-600" />
                  <span>3. Risk Tolerance & Diligence Strictness</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowStrictnessExplainer(!showStrictnessExplainer)}
                  className="flex items-center space-x-1 text-[11px] font-mono text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>{showStrictnessExplainer ? "Hide Guide" : "Level Guide"}</span>
                </button>
              </div>

              {/* Strictness Level Badge & Description */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase font-semibold text-slate-700">
                    Diligence Calibration:
                  </span>
                  <span className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-900">
                    {strictnessInfo.title}
                  </span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={config.diligenceStrictness}
                  onChange={(e) => handleFieldChange("diligenceStrictness", Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />

                {/* Level Tick Indicators */}
                <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
                  <span>1: Exploratory</span>
                  <span>2: Lenient</span>
                  <span>3: Institutional</span>
                  <span>4: High-Hurdle</span>
                  <span>5: Adversarial</span>
                </div>

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <p className="text-xs text-slate-900 font-semibold">
                    {strictnessInfo.desc}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Impact: {strictnessInfo.behavioralNotice}
                  </p>
                </div>

                {/* Interactive Behavioral Difference Explainer (Audit Point 6) */}
                {showStrictnessExplainer && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10.5px] font-mono font-bold uppercase text-slate-500 block">
                      Behavioral Shift Across Strictness Levels:
                    </span>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px] font-sans">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-start space-x-2">
                        <strong className="font-mono text-slate-900 shrink-0">L1 Exploratory:</strong>
                        <span className="text-slate-600">High tolerance for missing metrics; tests creative upside.</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-start space-x-2">
                        <strong className="font-mono text-slate-900 shrink-0">L3 Institutional:</strong>
                        <span className="text-slate-600">Standard tier-1 partner audit across unit economics, team, and moats.</span>
                      </div>
                      <div className="p-2 rounded bg-rose-50 border border-rose-200 flex items-start space-x-2">
                        <strong className="font-mono text-rose-950 shrink-0">L5 Adversarial IC:</strong>
                        <span className="text-rose-900">Assumes claims require independent proof; harsh score penalties for hand-waving.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* GROUP 4: HARD CONSTRAINTS & HERO DIRECTIVES (Audit Point 5 & 7.4) */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-900 flex items-center space-x-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
                  <span>4. Hard Constraints & Directives</span>
                </span>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono text-slate-700 font-bold">
                  {activeConstraints.length} active
                </span>
              </div>

              <p className="text-xs text-slate-600 font-sans">
                Encode your fund&apos;s institutional memory. The AI specifically audits every deal against these non-negotiable rules.
              </p>

              {/* Active Hard Constraints Chips (Audit Point 5) */}
              {activeConstraints.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Active Hard Exclusions:
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {activeConstraints.map((constraint, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-900 transition-all hover:border-slate-300"
                      >
                        <div className="flex items-center space-x-2">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="font-medium">{constraint}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveConstraint(idx)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Remove constraint"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-slate-500 font-sans">
                  No hard constraints added. Deals will be screened on standard sector metrics.
                </div>
              )}

              {/* Quick Add Preset Constraints (Audit Point 5) */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-mono uppercase tracking-wider text-slate-500 font-semibold block">
                  + Add Common Directives:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_CONSTRAINT_SUGGESTIONS.slice(0, 4).map((suggestion) => {
                    const alreadyHas = activeConstraints.includes(suggestion);
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        disabled={alreadyHas}
                        onClick={() => handleAddConstraint(suggestion)}
                        className={`rounded-md px-2 py-1 text-[11px] font-mono transition-all text-left cursor-pointer ${
                          alreadyHas
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            : "bg-white border border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-950 hover:bg-emerald-50/40"
                        }`}
                      >
                        + {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Constraint Input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={customConstraintInput}
                  onChange={(e) => setCustomConstraintInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddConstraint(customConstraintInput);
                    }
                  }}
                  placeholder="Type custom rule (e.g. Must have SOC2; no B2C)..."
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddConstraint(customConstraintInput)}
                  className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-white hover:bg-slate-800 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Plus className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Add</span>
                </button>
              </div>
            </div>

          </div>

          {/* Subordinate Reset Action & Methodology Note (Audit Point 22 & 23) */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => handlePresetSelect(config.presetId === "custom" ? "preset-risin-core" : config.presetId)}
              className="text-slate-500 hover:text-slate-900 transition-colors flex items-center space-x-1.5 underline decoration-slate-300 cursor-pointer text-[11px]"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset parameters to selected preset defaults</span>
            </button>

            <span className="text-[11px] text-slate-500">
              Audit Engine: <strong className="text-slate-800 font-semibold">Gemini 3.6</strong> • Dynamic Prompt Injection
            </span>
          </div>

        </div>
      )}
    </div>
  );
};
