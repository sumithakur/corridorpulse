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

export const STRICTNESS_LABELS: Record<number, { title: string; desc: string; behavioralNotice: string }> = {
  1: { 
    title: "1 — Exploratory", 
    desc: "High tolerance for missing information. Prioritizes upside vision and creative market timing.",
    behavioralNotice: "Assumes early-stage gaps can be resolved post-investment."
  },
  2: { 
    title: "2 — Lenient", 
    desc: "Constructive feedback balancing upside potential with early technical execution feasibility.",
    behavioralNotice: "Soft penalization on incomplete data rooms."
  },
  3: { 
    title: "3 — Institutional VC", 
    desc: "Standard partner-level first-principles diligence across problem, moat, market & unit economics.",
    behavioralNotice: "Balanced screening with verified claims expectations."
  },
  4: { 
    title: "4 — High-Hurdle", 
    desc: "Demanding strict moat verification, tangible customer pull, and defensibility against incumbents.",
    behavioralNotice: "Aggressive discounting of unverified traction claims."
  },
  5: { 
    title: "5 — Adversarial IC", 
    desc: "Ruthless diligence. Zero fluff tolerance; assume claims require proof; hard thesis disqualification.",
    behavioralNotice: "Assumes claims require independent proof; instant pass on unverified metrics."
  },
};

export const QUICK_CONSTRAINT_SUGGESTIONS = [
  "Must support on-prem sovereign deployment",
  "GCC commercialisation / revenue potential required",
  "No consumer-only products (B2B / Enterprise only)",
  "Founder must have deep technical / domain background",
  "Reject generic LLM / API wrappers",
  "Gross margin must be defensible (>65%)",
  "Must have at least one enterprise LOI / paid pilot",
] as const;

export const THESIS_PRESETS: Record<string, ThesisConfig> = {
  "preset-risin-core": {
    presetId: "preset-risin-core",
    presetName: "Risin Core VC (GCC · India DeepTech)",
    targetDeploymentRegions: ["GCC", "India"],
    sourcingRndOrigin: "India Engineering / Global Scale",
    targetStage: "Seed",
    coreSectorFocus: ["Edge AI & Robotics", "B2B SaaS", "Sovereign AI"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
    diligenceStrictness: 4,
    customDirectives: "Must support GCC deployment/residency (UAE/Saudi); reject generic LLM wrappers; require high technical moat in engineering or hardware.",
  },
  "preset-sovereign-ai": {
    presetId: "preset-sovereign-ai",
    presetName: "Sovereign AI GCC (On-Prem Infrastructure)",
    targetDeploymentRegions: ["GCC"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Seed",
    coreSectorFocus: ["Sovereign AI", "Edge AI & Robotics", "Energy & Industrial Tech"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
    diligenceStrictness: 5,
    customDirectives: "Must support on-prem sovereign data residency (UAE DESC / Saudi NCA ECC); zero foreign telemetry leaks; harsh environment thermal tolerance.",
  },
  "preset-2": {
    presetId: "preset-2",
    presetName: "Global Enterprise AI & B2B SaaS",
    targetDeploymentRegions: ["North America", "Europe", "Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Series A",
    coreSectorFocus: ["B2B SaaS", "Sovereign AI"],
    techDepthHurdle: "Applied AI / Deep Software",
    strategicMandate: "Financial VC Return",
    diligenceStrictness: 3,
    customDirectives: "Must demonstrate sustainable net dollar retention (>115%), high workflow switching costs, defensibility against foundation models, and scalable enterprise GTM.",
  },
  "preset-3": {
    presetId: "preset-3",
    presetName: "Climate & Industrial Hardware",
    targetDeploymentRegions: ["GCC", "North America", "Europe", "Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Seed",
    coreSectorFocus: ["ClimateTech", "Energy & Industrial Tech"],
    techDepthHurdle: "DeepTech & Hardware",
    strategicMandate: "Sovereign / Strategic Procurement",
    diligenceStrictness: 4,
    customDirectives: "Must have verified field pilot or industrial bench test; clear customer payback timeline (<12 mos); resilient operations in physical field conditions.",
  },
  "preset-general": {
    presetId: "preset-general",
    presetName: "General Discovery (Sector-Agnostic First Principles)",
    targetDeploymentRegions: ["Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Pre-Seed to Seed",
    coreSectorFocus: ["B2B SaaS", "Edge AI & Robotics", "Energy & Industrial Tech", "ClimateTech", "FinTech"],
    techDepthHurdle: "Pure Software / Agnostic",
    strategicMandate: "Financial VC Return",
    diligenceStrictness: 3,
    customDirectives: "",
  },
  "custom": {
    presetId: "custom",
    presetName: "Custom Mandate",
    targetDeploymentRegions: ["GCC", "India", "Global"],
    sourcingRndOrigin: "Global / Agnostic",
    targetStage: "Seed",
    coreSectorFocus: ["B2B SaaS", "Edge AI & Robotics"],
    techDepthHurdle: "Applied AI / Deep Software",
    strategicMandate: "Financial VC Return",
    diligenceStrictness: 3,
    customDirectives: "",
  },
};

export const DEFAULT_THESIS_CONFIG: ThesisConfig = THESIS_PRESETS["preset-risin-core"] || THESIS_PRESETS["preset-general"];
