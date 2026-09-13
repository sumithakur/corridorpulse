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
  FileCode2, 
  Info 
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

  // Handle Preset switch
  const handlePresetSelect = (presetId: string) => {
    if (THESIS_PRESETS[presetId]) {
      onChange({ ...THESIS_PRESETS[presetId] });
    }
  };

  // Toggle multi-select tags
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
      presetName: "Custom Configuration",
      targetDeploymentRegions: updated,
    });
  };

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
      presetName: "Custom Configuration",
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
      presetName: "Custom Configuration",
      [field]: value,
    });
  };

  const strictnessInfo = STRICTNESS_LABELS[config.diligenceStrictness] || STRICTNESS_LABELS[3];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 shadow-sm overflow-hidden backdrop-blur-md transition-all duration-300">
      {/* Top Header Bar matching sumitkt.com */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-3 sm:px-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-xs">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 font-sans">
                Investment Thesis Configurator
              </h3>
              <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-700">
                Active Mandate
              </span>
            </div>
            <p className="text-xs text-slate-500 font-editorial italic">
              Evaluation engine dynamically aligns scoring & weights to this mandate
            </p>
          </div>
        </div>

        {/* Presets Selector & Expand Toggle */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Preset Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono uppercase text-slate-500 hidden md:inline">Preset:</span>
            <select
              value={config.presetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              aria-label="Investment Thesis Preset"
              className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 font-mono text-xs text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer shadow-xs"
            >
              <option value="preset-general">General Discovery (Unknown / Sector-Agnostic Startup)</option>
              <option value="preset-1">Preset 1: India-GCC DeepTech & Sovereign AI</option>
              <option value="preset-2">Preset 2: Global Enterprise AI & B2B SaaS</option>
              <option value="preset-3">Preset 3: Climate & Industrial Hardware</option>
              <option value="custom">Custom Configuration</option>
            </select>
          </div>

          {/* Toggle Accordion */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-950 transition-all shadow-xs cursor-pointer"
          >
            <span className="font-mono text-[11px] uppercase tracking-wider">{isExpanded ? "Collapse" : "Configure"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsed Summary Badge Strip */}
      {!isExpanded && (
        <div className="px-4 py-2.5 sm:px-6 bg-slate-50/40 flex flex-wrap items-center gap-2 text-xs border-b border-slate-200/60">
          <span className="font-mono uppercase tracking-wider text-[11px] text-slate-500">Mandate:</span>
          <span className="rounded-md border border-slate-300 bg-white px-2.5 py-0.5 text-slate-800 font-mono text-xs">
            {config.targetStage}
          </span>
          <span className="rounded-md border border-slate-300 bg-white px-2.5 py-0.5 text-slate-800 font-mono text-xs">
            {config.targetDeploymentRegions.join(", ")}
          </span>
          <span className="rounded-md border border-slate-300 bg-white px-2.5 py-0.5 text-slate-800 font-mono text-xs">
            {config.techDepthHurdle}
          </span>
          <span className="rounded-md border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-amber-900 font-mono text-xs font-medium">
            Strictness {config.diligenceStrictness}/5 ({strictnessInfo.title})
          </span>
          {config.customDirectives && (
            <span className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-slate-800 font-mono text-xs">
              Directives Active
            </span>
          )}
        </div>
      )}

      {/* Expanded Configurator Body */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: Geo, Sectors & Directives */}
            <div className="space-y-5">
              {/* Target Deployment Regions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-900" />
                    <span>Target Deployment Regions</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">Multi-select</span>
                </div>
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

              {/* Core Sector Focus */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 flex items-center space-x-1.5">
                    <Layers className="h-3.5 w-3.5 text-slate-900" />
                    <span>Core Sector Focus</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">Multi-select</span>
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
                        {isSelected && <Check className="inline h-3 w-3 mr-1 text-[#b89047]" />}
                        {sector}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Directives / Exclusions */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 flex items-center space-x-1.5">
                    <FileCode2 className="h-3.5 w-3.5 text-slate-900" />
                    <span>Custom Directives / Hard Exclusions</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">IC Mandates</span>
                </div>
                <textarea
                  value={config.customDirectives}
                  onChange={(e) => handleFieldChange("customDirectives", e.target.value)}
                  rows={4}
                  placeholder="e.g. Must support on-prem sovereign data residency; reject generic API wrappers; verify hardware durability in harsh desert climate..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 font-mono text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed transition-all"
                />
                <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Info className="h-3 w-3 shrink-0 text-slate-400" />
                  <span>The AI audit will specifically test compliance against each custom directive.</span>
                </p>
              </div>
            </div>

            {/* COLUMN 2: Stage, Tech Depth & Strictness */}
            <div className="space-y-4">
              {/* Sourcing / R&D Origin & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Sourcing / R&D Origin
                  </label>
                  <select
                    value={config.sourcingRndOrigin}
                    onChange={(e) => handleFieldChange("sourcingRndOrigin", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-slate-900 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {SOURCING_ORIGIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Target Investment Stage
                  </label>
                  <select
                    value={config.targetStage}
                    onChange={(e) => handleFieldChange("targetStage", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-slate-900 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {INVESTMENT_STAGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tech Depth & Strategic Mandate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Tech Depth Hurdle
                  </label>
                  <select
                    value={config.techDepthHurdle}
                    onChange={(e) => handleFieldChange("techDepthHurdle", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-slate-900 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {TECH_DEPTH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                    Strategic Mandate
                  </label>
                  <select
                    value={config.strategicMandate}
                    onChange={(e) => handleFieldChange("strategicMandate", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-slate-900 focus:outline-none shadow-xs cursor-pointer"
                  >
                    {STRATEGIC_MANDATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diligence Strictness Slider */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700 flex items-center space-x-1.5">
                    <Gauge className="h-3.5 w-3.5 text-[#b89047]" />
                    <span>Diligence Strictness</span>
                  </label>
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 font-mono text-xs font-bold text-amber-900">
                    Level {config.diligenceStrictness} / 5: {strictnessInfo.title}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={config.diligenceStrictness}
                  onChange={(e) => handleFieldChange("diligenceStrictness", Number(e.target.value))}
                  className="w-full accent-slate-950 cursor-pointer"
                />
                <p className="text-xs text-slate-600 font-editorial italic">
                  {strictnessInfo.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => handlePresetSelect(config.presetId === "custom" ? "preset-general" : config.presetId)}
              className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Selected Preset Defaults</span>
            </button>

            <span className="text-[11px] text-slate-500">
              Evaluation Engine: <strong className="text-slate-900 font-bold">Gemini 3.6 Flash</strong> with Dynamic Thesis Injection
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
