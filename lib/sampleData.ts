export const SAMPLE_PITCH_DECK = `
COMPANY: Aegis Robotics & Autonomous Systems (Aegis Dynamics)
FOUNDED: 2022 | HQ: Bengaluru, India (Expanding to Abu Dhabi / Riyadh)
STAGE: Series A ($4.5M raised to date)
SECTOR: DeepTech / Industrial Automation / Energy Infrastructure Robotics

EXECUTIVE SUMMARY:
Aegis Dynamics develops autonomous sub-surface & thermal-resistant inspection crawlers and aerial swarm robotics engineered for heavy industrial facilities, oil & gas refineries, subsea pipelines, and harsh desert solar farms. Designed specifically to eliminate human hazard in extreme thermal environments (up to 65°C operating temps) and high-dust atmospheres common across GCC energy corridors.

PROBLEM:
- Midstream & downstream energy infrastructure across Abu Dhabi (ADNOC), Saudi Arabia (Aramco), and Qatar Energy requires high-frequency non-destructive testing (NDT).
- Manual human inspection leads to expensive operational downtime ($450K/day per facility shutdown), severe heat stress safety incidents, and low inspection throughput across remote desert solar arrays (e.g. Al Dhafra, Mohammed bin Rashid Al Maktoum Solar Park).
- Existing western robotic systems (e.g., Boston Dynamics Spot, Eddyfi) fail in sandstorm environments due to mechanical grit ingestion, lack local telemetry data residency compliance, and carry excessive hardware costs ($180K+ per crawler unit).

SOLUTION & TECHNOLOGY:
- "Aegis Sentinel-X": Ruggedized, IP68 sealed crawler featuring dual-edge AI computation (NVIDIA Jetson Orin Industrial), ultrasonic thickness gauge arrays, lidar SLAM navigation without GPS dependency, and ATEX Zone 1 explosion-proof certified housing.
- Thermal Management Moat: Proprietary active phase-change cooling system allowing continuous 8-hour desert operation at 60°C ambient temperatures without thermal throttling.
- Software Moat: Edge-native anomaly detection algorithms trained on 45,000+ hours of pipeline corrosion & structural micro-crack data. Zero cloud dependence during field deployment; encrypted batch sync to on-premise local servers.
- Sovereign Data Compliance: Telemetry data processed strictly within country boundaries. Fully compliant with Saudi NCA (National Cybersecurity Authority) ECC and UAE DESC regulations.

MARKET OPPORTUNITY & GCC PILOT EXPANSION:
- TAM: $14.2B Global Energy & Utilities Infrastructure Inspection market.
- GCC Addressable Market: $2.1B driven by ADNOC 2030 Smart Operations Mandate, Saudi Vision 2030 NEOM Industrial Zone, and UAE Net Zero 2050 Energy Transition.
- Target GCC Partners: ADNOC Technical Services, Aramco Digital / Wa'ed Ventures, Hub71 Abu Dhabi, DP World Technology Pilots, Dubal Holding.

TRACTION & COMMERCIALS:
- Current ARR: $1.8M (FY25 projected $4.2M).
- Pilots Completed: 4 paid commercial pilots with Reliance Jamnagar Refinery (India) and ONGC Offshore platforms.
- Active GCC LOIs: Signed Memorandum of Understanding with UAE-based industrial maintenance distributor for $1.2M pilot deployment in Western Region facilities.
- Unit Economics & BOM:
  * Bill of Materials (BOM) Cost: $18,500 per unit (manufactured in Bengaluru & assembled in Abu Dhabi free zone).
  * Selling Price (Hardware + Annual Software License): $75,000 upfront + $24,000/yr SaaS license.
  * Gross Margin: 68% Hardware, 89% Software. Payback period: 4.2 months for customer.

TEAM:
- CEO & Co-founder: Dr. Vikramaditya Rao (Ex-ISRO Robotics Systems Architect, PhD IIT Bombay).
- CTO: Priya Sundaram (Ex-Defense Research & Dev Org, Senior Edge AI Lead).
- VP Growth (GCC): Tariq Al-Mansoori (Former Ops Director at Weatherford Middle East & Schlumberger).

ASK & GOAL FOR GCC PILOT:
- Raising $8M Series A to build an Abu Dhabi assembly & R&D facility, obtain GCC sovereign data security clearances, and deploy 30 autonomous inspection crawlers across ADNOC & Aramco pilot zones.
`.trim();

import { EvaluationResult } from "./types";
import { THESIS_PRESETS } from "./thesisPresets";

export const SAMPLE_DEAL_MEMO: EvaluationResult = {
  companyProfile: {
    name: "AeroEdge Dynamics",
    oneLiner: "Autonomous edge-AI robotics for harsh industrial pipeline inspection.",
    hqLocation: "Bengaluru, India / Doha, Qatar",
    primarySector: "Edge AI & Robotics",
    stage: "Seed",
  },
  overallAssessment: {
    score: 84,
    recommendation: "Proceed to Intro Call",
    summaryRationale: "Proprietary on-device computer vision inspection robot with demonstrated IP defensibility. Direct alignment with GCC energy corridor mandates, though customer concentration in pilot stage remains a key diligence item.",
  },
  executiveSummary: "AeroEdge Dynamics builds autonomous, thermal-resistant edge-AI robotics designed for harsh pipeline and industrial energy infrastructure inspection. Operating without GPS or cloud dependency, their proprietary inspection crawler delivers high-frequency non-destructive testing in extreme thermal environments.",
  keyHighlights: [
    "Proprietary SLAM and edge-inference firmware operating without cloud connectivity or GPS.",
    "Fast payback period with hardware CapEx fully recovered within 4 months of enterprise leasing.",
    "Two provisional patents filed protecting heat-resistant sensor payload chassis up to 60°C.",
  ],
  keyRisksAndGaps: [
    "Pilot concentration: 70% of current revenue pipeline tied to single NOC trial.",
    "Hardware supply chain dependencies on single-source specialized optics with long lead times.",
    "Requires local field maintenance teams and support infrastructure across GCC desert deployments.",
  ],
  partnerCallQuestions: [
    "What is your hardware unit cost (BOM) at 50 units vs. 500 units?",
    "How do thermal limits perform during continuous operation at 50°C+ ambient temperatures?",
    "What is the deployment timeline from arrival on-site to fully autonomous data collection?",
  ],
  thesisFit: {
    matchScore: 88,
    verdict: "High Alignment",
    alignmentSummary: "Strong alignment with sovereign infrastructure protection and edge-AI autonomy mandates across the GCC and India.",
    directivesCompliance: [
      {
        directive: "Edge AI & Sovereign Industrial Infrastructure",
        compliant: true,
        analysis: "Air-gapped operation and on-device compute eliminate data residency barriers and support critical infrastructure inspection.",
      },
    ],
  },
  evaluationPillars: [
    {
      pillarName: "Strategic & Market Alignment",
      score: 22,
      verdict: "Strong",
      findings: [
        "Strong fit for sovereign infrastructure mandates and harsh environmental inspection.",
        "Targeting a multi-billion dollar brownfield energy asset inspection market.",
      ],
    },
    {
      pillarName: "Technical & IP Defensibility",
      score: 23,
      verdict: "Strong",
      findings: [
        "Proprietary SLAM and edge-inference firmware operating without cloud connectivity.",
        "2 provisional patents filed on heat-resistant sensor payload chassis.",
      ],
    },
    {
      pillarName: "Operational Viability",
      score: 19,
      verdict: "Moderate",
      findings: [
        "Requires local field maintenance teams across GCC desert deployments.",
        "Zero data residency friction due to 100% on-prem / air-gapped data logging.",
      ],
    },
    {
      pillarName: "Unit Economics & Commercial Traction",
      score: 20,
      verdict: "Moderate",
      findings: [
        "Hardware CapEx recovered within 4 months of enterprise leasing.",
        "High reliance on initial 2 pilot partners; expansion pipeline needs verification.",
      ],
    },
  ],
  gccPilotFit: {
    targetSectors: ["Oil & Gas Infrastructure", "Desalination & Utilities", "Maritime Logistics"],
    dataResidencyFriction: "Low",
    potentialRegionalPartners: ["QatarEnergy", "Milaha", "Aramco", "ADNOC"],
  },
  redFlags: [
    "Pilot concentration: 70% of current revenue pipeline tied to single NOC trial.",
    "Hardware supply chain dependencies on single-source specialized optics.",
  ],
  keyQuestionsForFounder: [
    "What is your hardware unit cost (BOM) at 50 units vs. 500 units?",
    "How do thermal limits perform during continuous operation at 50°C+ ambient temperatures?",
    "What is the deployment timeline from arrival on-site to fully autonomous data collection?",
  ],
  evaluatedThesis: THESIS_PRESETS["preset-india-gcc"] || THESIS_PRESETS["preset-general"],
};
