import { ThesisConfig } from "./types";

export const AVAILABLE_REGIONS = [
  "Global",
  "GCC",
  "India",
  "North America",
  "Southeast Asia",
  "Europe",
] as const;

export const SOURCING_ORIGIN_OPTIONS = [
  "Global / Agnostic",
  "India Engineering / Global Scale",
  "Local Only",
] as const;

export const INVESTMENT_STAGE_OPTIONS = [
  "Pre-Seed to Seed",
  "Pre-Seed",
  "Seed",
  "Series A",
] as const;

export const AVAILABLE_SECTORS = [
  "B2B SaaS",
  "Edge AI & Robotics",
  "Sovereign AI",
  "Energy & Industrial Tech",
  "FinTech",
  "ClimateTech",
] as const;

export const TECH_DEPTH_OPTIONS = [
  "Pure Software / Agnostic",
  "Applied AI / Deep Software",
  "DeepTech & Hardware",
] as const;

export const STRATEGIC_MANDATE_OPTIONS = [
  "Financial VC Return",
  "Sovereign / Strategic Procurement",
  "Venture Studio Co-Build",
] as const;

export const STRICTNESS_LABELS: Record<number, { title: string; desc: string }> = {
  1: { title: "Lenient / Founder-Friendly", desc: "Constructive feedback, focuses on upside potential and creative vision" },
  2: { title: "Early Exploration", desc: "Balanced upside potential vs early technical execution risks" },
  3: { title: "Balanced Institutional VC", desc: "Standard partner-level first-principles audit across problem, team, market & blindspots" },
  4: { title: "High-Hurdle Diligence", desc: "Demanding strict moat verification, customer pull and defensibility" },
  5: { title: "Ruthless Institutional IC", desc: "Zero fluff tolerance, harsh penalties for hand-waving claims, unverified traction or missing moats" },
};

export const THESIS_PRESETS: Record<string, ThesisConfig> = {
  "preset-general": {
    presetId: "preset-general",
    presetName: "General Discovery (Unknown / Sector-Agnostic Startup)",
    targetDeploymentRegions: ["Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Pre-Seed to Seed",
    coreSectorFocus: ["B2B SaaS", "Edge AI & Robotics", "Energy & Industrial Tech", "ClimateTech", "FinTech"],
    techDepthHurdle: "Pure Software / Agnostic",
    strategicMandate: "Financial VC Return",
    diligenceStrictness: 3,
    customDirectives: "",
  },
  "preset-1": {
    presetId: "preset-1",
    presetName: "Preset 1: India-GCC DeepTech & Sovereign AI",
    targetDeploymentRegions: ["GCC", "India"],
    sourcingRndOrigin: "India Engineering / Global Scale",
    targetStage: "Seed",
    coreSectorFocus: ["Edge AI & Robotics", "Sovereign AI", "Energy & Industrial Tech"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
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
    diligenceStrictness: 4,
    customDirectives: "Must have verified field pilot or industrial bench test; clear customer payback timeline; resilient operations in physical field conditions.",
  },
  "custom": {
    presetId: "custom",
    presetName: "Custom Configuration",
    targetDeploymentRegions: ["Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Pre-Seed to Seed",
    coreSectorFocus: ["B2B SaaS", "Edge AI & Robotics"],
    techDepthHurdle: "Pure Software / Agnostic",
    strategicMandate: "Financial VC Return",
    diligenceStrictness: 3,
    customDirectives: "",
  },
};

export const DEFAULT_THESIS_CONFIG: ThesisConfig = THESIS_PRESETS["preset-general"];
