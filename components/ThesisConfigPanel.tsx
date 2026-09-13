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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-950/70 px-4 py-3.5 sm:px-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold tracking-tight text-zinc-100">
                Investment Thesis Configurator
              </h3>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                Active
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Evaluation engine dynamically aligns scoring & penalties to this mandate
            </p>
          </div>
        </div>

        {/* Presets Selector & Expand Toggle */}
        <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Preset Selector */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-mono text-zinc-400 hidden md:inline">Preset:</span>
            <select
              value={config.presetId}
              onChange={(e) => handlePresetSelect(e.target.value)}
              aria-label="Investment Thesis Preset"
              className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-sm"
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
            className="flex items-center space-x-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <span>{isExpanded ? "Collapse" : "Configure"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsed Summary Badge Strip */}
      {!isExpanded && (
        <div className="px-4 py-3 sm:px-6 bg-zinc-950/40 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-zinc-400">Mandate:</span>
          <span className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-300 font-mono">
            {config.targetStage}
          </span>
          <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300 font-mono">
            {config.targetDeploymentRegions.join(", ")}
          </span>
          <span className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300 font-mono">
            {config.techDepthHurdle}
          </span>
          <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-amber-300 font-mono">
            Strictness {config.diligenceStrictness}/5 ({strictnessInfo.title})
          </span>
          {config.customDirectives && (
            <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-purple-300 font-mono">
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
                  <label className="text-xs font-mono font-medium text-zinc-300 flex items-center space-x-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Target Deployment Regions</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500">Multi-select</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_REGIONS.map((region) => {
                    const isSelected = config.targetDeploymentRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                            : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
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
                  <label className="text-xs font-mono font-medium text-zinc-300 flex items-center space-x-1.5">
                    <Layers className="h-3.5 w-3.5 text-teal-400" />
                    <span>Core Sector Focus</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500">Multi-select</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SECTORS.map((sector) => {
                    const isSelected = config.coreSectorFocus.includes(sector);
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => toggleSector(sector)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                          isSelected
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                            : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        {isSelected && <Check className="inline h-3 w-3 mr-1 text-teal-400" />}
                        {sector}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Directives / Exclusions */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-zinc-300 flex items-center space-x-1.5">
                    <FileCode2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>Custom Directives / Hard Exclusions</span>
                  </label>
                  <span className="text-[11px] font-mono text-zinc-500">IC Mandates</span>
                </div>
                <textarea
                  value={config.customDirectives}
                  onChange={(e) => handleFieldChange("customDirectives", e.target.value)}
                  rows={4}
                  placeholder="e.g. Must support on-prem sovereign data residency; reject generic API wrappers; verify hardware durability in harsh desert climate..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                />
                <p className="text-[11px] text-zinc-400 flex items-center space-x-1">
                  <Info className="h-3 w-3 shrink-0 text-zinc-400" />
                  <span>The AI audit will specifically test compliance against each custom directive.</span>
                </p>
              </div>
            </div>

            {/* COLUMN 2: Stage, Tech Depth, Margins & Strictness */}
            <div className="space-y-4">
              {/* Sourcing / R&D Origin & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-300">
                    Sourcing / R&D Origin
                  </label>
                  <select
                    value={config.sourcingRndOrigin}
                    onChange={(e) => handleFieldChange("sourcingRndOrigin", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {SOURCING_ORIGIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-300">
                    Target Investment Stage
                  </label>
                  <select
                    value={config.targetStage}
                    onChange={(e) => handleFieldChange("targetStage", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
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
                  <label className="block text-xs font-mono font-medium text-zinc-300">
                    Tech Depth Hurdle
                  </label>
                  <select
                    value={config.techDepthHurdle}
                    onChange={(e) => handleFieldChange("techDepthHurdle", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {TECH_DEPTH_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-medium text-zinc-300">
                    Strategic Mandate
                  </label>
                  <select
                    value={config.strategicMandate}
                    onChange={(e) => handleFieldChange("strategicMandate", e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-100 focus:border-emerald-500 focus:outline-none"
                  >
                    {STRATEGIC_MANDATE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diligence Strictness Slider */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-medium text-zinc-300 flex items-center space-x-1.5">
                    <Gauge className="h-3.5 w-3.5 text-amber-400" />
                    <span>Diligence Strictness</span>
                  </label>
                  <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
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
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <p className="text-[11px] text-zinc-400 font-sans italic">
                  {strictnessInfo.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 pt-4 text-xs font-mono">
            <button
              type="button"
              onClick={() => handlePresetSelect(config.presetId === "custom" ? "preset-general" : config.presetId)}
              className="flex items-center space-x-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Selected Preset Defaults</span>
            </button>

            <span className="text-[11px] text-zinc-400">
              Active Model: <strong className="text-emerald-400">Gemini 3.6 Flash</strong> with Thesis Prompt Injection
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
