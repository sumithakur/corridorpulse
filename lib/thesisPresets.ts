import { ThesisConfig } from "./types";

export const AVAILABLE_REGIONS = [
  "GCC",
  "India",
  "North America",
  "Southeast Asia",
  "Europe",
  "Global",
] as const;

export const SOURCING_ORIGIN_OPTIONS = [
  "India Engineering / Global Scale",
  "Local Only",
  "Global / Agnostic",
] as const;

export const INVESTMENT_STAGE_OPTIONS = [
  "Pre-Seed",
  "Seed",
  "Series A",
] as const;

export const AVAILABLE_SECTORS = [
  "Edge AI & Robotics",
  "Sovereign AI",
  "Energy & Industrial Tech",
  "FinTech",
  "B2B SaaS",
  "ClimateTech",
] as const;

export const TECH_DEPTH_OPTIONS = [
  "DeepTech & Hardware",
  "Applied AI / Deep Software",
  "Pure Software / Agnostic",
] as const;

export const STRATEGIC_MANDATE_OPTIONS = [
  "Financial VC Return",
  "Sovereign / Strategic Procurement",
  "Venture Studio Co-Build",
] as const;

export const STRICTNESS_LABELS: Record<number, { title: string; desc: string }> = {
  1: { title: "Lenient / Founder-Friendly", desc: "Constructive feedback, lenient on early stage gaps & projection assumptions" },
  2: { title: "Early Exploration", desc: "Balanced upside potential vs early technical execution risks" },
  3: { title: "Institutional VC", desc: "Standard partner-level audit across defensibility, unit economics & traction" },
  4: { title: "High-Hurdle Diligence", desc: "Demanding strict moat verification, physical feasibility & margin discipline" },
  5: { title: "Ruthless Institutional IC", desc: "Zero fluff tolerance, harsh penalties for missing IP moats, high burn or vague claims" },
};

export const THESIS_PRESETS: Record<string, ThesisConfig> = {
  "preset-1": {
    presetId: "preset-1",
    presetName: "Preset 1: India-GCC DeepTech & Sovereign AI",
    targetDeploymentRegions: ["GCC", "India"],
    sourcingRndOrigin: "India Engineering / Global Scale",
    targetStage: "Seed",
    coreSectorFocus: ["Edge AI & Robotics", "Sovereign AI", "Energy & Industrial Tech"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
    minTargetGrossMargin: 65,
    diligenceStrictness: 4,
    customDirectives: "Must support on-prem / sovereign data residency (UAE DESC / Saudi NCA ECC); verify physical-to-software coupling and thermal/sand harsh environment durability; reject generic LLM wrappers.",
  },
  "preset-2": {
    presetId: "preset-2",
    presetName: "Preset 2: Global Enterprise AI & B2B SaaS",
    targetDeploymentRegions: ["North America", "Europe", "Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Series A",
    coreSectorFocus: ["B2B SaaS", "Sovereign AI"],
    techDepthHurdle: "Applied AI / Deep Software",
    strategicMandate: "Financial VC Return",
    minTargetGrossMargin: 75,
    diligenceStrictness: 3,
    customDirectives: "Must demonstrate sustainable net dollar retention (>115%), high workflow switching costs, defensibility against foundation model platforms, and scalable GTM.",
  },
  "preset-3": {
    presetId: "preset-3",
    presetName: "Preset 3: Climate & Industrial Hardware",
    targetDeploymentRegions: ["GCC", "North America", "Europe", "Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Seed",
    coreSectorFocus: ["ClimateTech", "Energy & Industrial Tech"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
    minTargetGrossMargin: 50,
    diligenceStrictness: 4,
    customDirectives: "Must have verified field pilot or industrial bench test; clear Bill of Materials (BOM) gross margin pathway; customer payback < 24 months without relying on subsidies.",
  },
  "custom": {
    presetId: "custom",
    presetName: "Custom Configuration",
    targetDeploymentRegions: ["Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Seed",
    coreSectorFocus: ["Edge AI & Robotics", "B2B SaaS"],
    techDepthHurdle: "Applied AI / Deep Software",
    strategicMandate: "Financial VC Return",
    minTargetGrossMargin: 60,
    diligenceStrictness: 3,
    customDirectives: "",
  },
};

export const DEFAULT_THESIS_CONFIG: ThesisConfig = THESIS_PRESETS["preset-1"];
