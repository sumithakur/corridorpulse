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

import { EvaluationResult, DealQueueItem } from "./types";
import { THESIS_PRESETS } from "./thesisPresets";

export const SAMPLE_DEAL_MEMO: EvaluationResult = {
  companyProfile: {
    name: "AeroEdge Dynamics",
    oneLiner: "Autonomous edge-AI robotics for harsh industrial pipeline inspection.",
    hqLocation: "Bengaluru, India / Abu Dhabi, UAE",
    primarySector: "Edge AI & Robotics",
    stage: "Seed",
  },
  overallAssessment: {
    score: 84,
    recommendation: "Proceed to Intro Call",
    summaryRationale: "Proprietary on-device SLAM inspection crawler with demonstrated thermal resilience. Direct fit for GCC energy corridor mandates, though 70% customer concentration in initial pilot warrants immediate partner verification.",
  },
  executiveSummary: "AeroEdge Dynamics develops thermal-resistant, autonomous edge-AI crawlers and swarm robotics engineered for oil refineries, subsea pipelines, and harsh desert solar arrays across the GCC. Operating with zero GPS or foreign cloud dependency, their proprietary IP68 crawler eliminates downtime and human heat stress hazards.",
  keyHighlights: [
    "Proprietary edge-native SLAM inference running air-gapped on NVIDIA Jetson Orin Industrial without GPS.",
    "Hardware CapEx recovered within 4.2 months with 68% hardware gross margins and $24K/yr software recurring revenue.",
    "Two provisional patents filed protecting active phase-change cooling payload up to 65°C ambient desert heat.",
  ],
  keyRisksAndGaps: [
    "Customer Concentration: 70% of current revenue pipeline tied to a single national oil company pilot.",
    "Single-Source Hardware: Thermal optical sensors sourced exclusively from one European vendor (16-week lead time).",
    "Missing Support SLA: Deck lacks clarity on whether desert field maintenance requires dedicated dispatch teams or local partner training.",
  ],
  partnerCallQuestions: [
    "What is your hardware BOM cost progression from 50 units ($18,500) to 500 units at scale?",
    "How does continuous 8-hour operation perform under 60°C ambient temperatures without sensor drift?",
    "What is the deployment timeline from arrival on-site to fully autonomous data collection?",
  ],
  thesisFit: {
    matchScore: 88,
    verdict: "High Alignment",
    alignmentSummary: "Strong alignment with sovereign infrastructure protection, harsh environment operations, and edge-AI autonomy mandates across the UAE and Saudi Arabia.",
    directivesCompliance: [
      {
        directive: "Must support GCC deployment/residency (UAE/Saudi)",
        compliant: true,
        analysis: "Air-gapped on-premise data architecture complies with UAE DESC and Saudi NCA ECC sovereign data standards.",
      },
      {
        directive: "Reject generic LLM / API wrappers",
        compliant: true,
        analysis: "Custom hardware-software coupling with edge-trained computer vision; zero generic API wrapper dependency.",
      },
      {
        directive: "High technical moat in engineering or hardware",
        compliant: true,
        analysis: "Active phase-change cooling system + proprietary ultrasonic thickness array provide defensible physical IP.",
      },
    ],
  },
  evaluationPillars: [
    {
      pillarName: "Mandate & Thesis Alignment",
      score: 22,
      verdict: "Strong",
      findings: [
        "Direct alignment with sovereign energy corridor inspection and GCC Net Zero 2050 modernization mandates.",
        "Targeting a multi-billion dollar brownfield energy asset inspection market with high willingness to pay.",
      ],
    },
    {
      pillarName: "Technical & IP Defensibility",
      score: 23,
      verdict: "Strong",
      findings: [
        "Proprietary SLAM and edge-inference firmware operating without cloud connectivity or satellite GPS.",
        "2 provisional patents filed on thermal-isolated payload chassis and acoustic anomaly detection.",
      ],
    },
    {
      pillarName: "Operational & Deployment Viability",
      score: 19,
      verdict: "Moderate",
      findings: [
        "Requires local field maintenance teams and calibration benches across GCC desert deployments.",
        "Zero data residency friction due to 100% on-prem / air-gapped local batch synchronization.",
      ],
    },
    {
      pillarName: "Unit Economics & BOM Feasibility",
      score: 20,
      verdict: "Moderate",
      findings: [
        "Hardware CapEx ($18.5K BOM) recovered in 4.2 months based on $75K sale + $24K/yr maintenance lease.",
        "Single-source European optical supplier presents component lead time vulnerability at volume.",
      ],
    },
  ],
  // Audit Point 29: Mandate Score Decomposition
  scoreDecomposition: [
    { label: "Technical & IP Moat", points: 23, category: "positive" },
    { label: "Mandate Alignment (GCC Sovereign)", points: 22, category: "positive" },
    { label: "Unit Economics & Payback", points: 20, category: "positive" },
    { label: "Operational Viability", points: 19, category: "positive" },
    { label: "Customer Concentration Risk", points: -6, category: "negative" },
    { label: "Single-Source Optical Dependency", points: -4, category: "negative" },
  ],
  // Audit Points 15, 16, 26: Distinct Negative Diligence Categorization
  negativeDiligenceCategorized: {
    conflicts: [],
    concerns: [
      {
        title: "High Revenue Pipeline Concentration",
        detail: "70% of current commercial pipeline is dependent on a single national oil company pilot contract.",
        source: "Pitch Deck, Slide 14",
      },
      {
        title: "Single-Source Component Lead Times",
        detail: "Critical heat-resistant optics depend on one German specialty fabricator with 16-week lead times.",
        source: "Pitch Deck, Slide 11",
      },
    ],
    unknowns: [
      {
        title: "Field Support Infrastructure in GCC",
        detail: "Deck does not clarify whether on-site technician dispatch will be handled in-house or via distributor SLA.",
        source: "Missing in collateral",
      },
      {
        title: "Cohort Conversion from Pilot to Production",
        detail: "Historical expansion velocity from free/discounted trials into multi-unit enterprise contracts is unstated.",
        source: "Data room requested",
      },
    ],
    questions: [
      {
        title: "BOM Cost Curve at Scale",
        detail: "What is your projected Bill of Materials cost at 50 units vs 500 units?",
      },
      {
        title: "Continuous Thermal Limits",
        detail: "How do internal sensor calibrations hold up during continuous 8-hour shifts at 60°C ambient heat?",
      },
      {
        title: "On-site Commissioning Timeline",
        detail: "What is the exact time required between crawler arrival and autonomous pipeline inspection?",
      },
    ],
  },
  // Audit Point 17: Evidence Provenance
  evidenceList: [
    {
      id: "ev-1",
      claim: "BOM cost $18,500 per unit; selling price $75,000 + $24,000/yr software license.",
      source: "Pitch Deck, Slide 12",
      status: "Verified in Deck",
      context: "Gross margin reported at 68% hardware, 89% software.",
    },
    {
      id: "ev-2",
      claim: "Zero cloud dependence during field operation; 100% on-premise local server batch sync.",
      source: "Pitch Deck, Slide 8",
      status: "Verified in Deck",
      context: "Complies with UAE DESC and Saudi NCA ECC regulations.",
    },
    {
      id: "ev-3",
      claim: "Two provisional patents filed on heat-resistant sensor payload chassis up to 65°C.",
      source: "Pitch Deck, Slide 9",
      status: "Unverified Claim",
      context: "Requires IP patent attorney search confirmation during confirmatory diligence.",
    },
    {
      id: "ev-4",
      claim: "Signed Memorandum of Understanding with UAE maintenance distributor for $1.2M deployment.",
      source: "Pitch Deck, Slide 14",
      status: "Verified in Deck",
      context: "LOI is non-binding pending final safety certification in Q3.",
    },
  ],
  // Audit Point 30: Separate Investor Decision from AI Assessment
  investorDecision: {
    status: "Advance to Partner",
    decidedBy: "Diligence Lead",
    timestamp: "2026-09-15",
    notes: "Compelling sovereign energy angle with defensible physical moats. Schedule technical intro call with Dr. Rao and review thermal drift bench tests before IC meeting.",
  },
  gccPilotFit: {
    targetSectors: ["Oil & Gas Infrastructure", "Desalination & Utilities", "Maritime Logistics"],
    dataResidencyFriction: "Low",
    potentialRegionalPartners: ["ADNOC Technical Services", "Aramco Digital / Wa'ed", "Hub71 Abu Dhabi", "DP World"],
  },
  redFlags: [
    "Customer Concentration: 70% of current revenue pipeline tied to single NOC trial.",
    "Hardware supply chain dependencies on single-source specialized optics with long lead times.",
  ],
  keyQuestionsForFounder: [
    "What is your hardware unit cost (BOM) at 50 units vs. 500 units?",
    "How do thermal limits perform during continuous operation at 50°C+ ambient temperatures?",
    "What is the deployment timeline from arrival on-site to fully autonomous data collection?",
  ],
  evaluatedThesis: THESIS_PRESETS["preset-risin-core"],
};

// Audit Point 27: Dealflow Queue Sample Data for Fund Pipeline Operating Layer
export const SAMPLE_DEAL_QUEUE: DealQueueItem[] = [
  {
    id: "deal-1",
    companyName: "AeroEdge Dynamics",
    oneLiner: "Autonomous edge-AI robotics for harsh industrial pipeline inspection.",
    stage: "Seed",
    sector: "Edge AI & Robotics",
    region: "GCC / India",
    score: 84,
    thesisFitScore: 88,
    riskLevel: "Medium",
    mandateName: "Risin Core VC",
    systemRecommendation: "Proceed to Intro Call",
    investorDecision: "Advance to Partner",
    screenedDate: "Today",
    memoData: SAMPLE_DEAL_MEMO,
  },
  {
    id: "deal-2",
    companyName: "CyberFort Sovereign",
    oneLiner: "Air-gapped sovereign encryption for critical national infrastructure.",
    stage: "Series A",
    sector: "Sovereign AI",
    region: "GCC",
    score: 91,
    thesisFitScore: 95,
    riskLevel: "Low",
    mandateName: "Sovereign AI GCC",
    systemRecommendation: "Proceed to Intro Call",
    investorDecision: "Advance to Partner",
    screenedDate: "Yesterday",
    memoData: {
      ...SAMPLE_DEAL_MEMO,
      companyProfile: {
        name: "CyberFort Sovereign",
        oneLiner: "Air-gapped sovereign encryption for critical national infrastructure.",
        hqLocation: "Riyadh, Saudi Arabia / Abu Dhabi, UAE",
        primarySector: "Sovereign AI",
        stage: "Series A",
      },
      overallAssessment: {
        score: 91,
        recommendation: "Proceed to Intro Call",
        summaryRationale: "Exceptional alignment with sovereign data residency mandates. Strong government pipeline with low customer churn and proven zero-trust cryptography.",
      },
      thesisFit: {
        matchScore: 95,
        verdict: "High Alignment",
        alignmentSummary: "Perfect fit for on-premise sovereign computing guidelines with institutional defense backing.",
        directivesCompliance: [
          {
            directive: "Must support on-prem sovereign data residency",
            compliant: true,
            analysis: "100% on-premise hardware appliances certified by Saudi NCA.",
          },
        ],
      },
    },
  },
  {
    id: "deal-3",
    companyName: "Q-Flux Energy Systems",
    oneLiner: "Thermal energy storage batteries for grid-scale industrial solar parks.",
    stage: "Seed",
    sector: "ClimateTech",
    region: "Global",
    score: 72,
    thesisFitScore: 78,
    riskLevel: "Medium",
    mandateName: "Climate & Industrial Hardware",
    systemRecommendation: "Keep on Radar",
    investorDecision: "Request More Info",
    screenedDate: "3 days ago",
    memoData: {
      ...SAMPLE_DEAL_MEMO,
      companyProfile: {
        name: "Q-Flux Energy Systems",
        oneLiner: "Thermal energy storage batteries for grid-scale industrial solar parks.",
        hqLocation: "London, UK / Dubai, UAE",
        primarySector: "ClimateTech",
        stage: "Seed",
      },
      overallAssessment: {
        score: 72,
        recommendation: "Keep on Radar",
        summaryRationale: "High potential storage chemistry, but high CapEx hurdles and long utility sales cycles require verification of 12-month commercial pilot data.",
      },
    },
  },
  {
    id: "deal-4",
    companyName: "PromptFlow AI Studio",
    oneLiner: "Drag-and-drop conversational agent builder for consumer ecommerce.",
    stage: "Pre-Seed",
    sector: "B2B SaaS",
    region: "North America",
    score: 41,
    thesisFitScore: 35,
    riskLevel: "High",
    mandateName: "Risin Core VC",
    systemRecommendation: "Pass",
    investorDecision: "Pass",
    screenedDate: "5 days ago",
    memoData: {
      ...SAMPLE_DEAL_MEMO,
      companyProfile: {
        name: "PromptFlow AI Studio",
        oneLiner: "Drag-and-drop conversational agent builder for consumer ecommerce.",
        hqLocation: "San Francisco, CA",
        primarySector: "B2B SaaS",
        stage: "Pre-Seed",
      },
      overallAssessment: {
        score: 41,
        recommendation: "Pass",
        summaryRationale: "Generic LLM wrapper with zero proprietary IP moat. Extreme churn vulnerability to OpenAI / Anthropic platform releases and misaligned with deeptech mandate.",
      },
      thesisFit: {
        matchScore: 35,
        verdict: "Misaligned",
        alignmentSummary: "Violates fund exclusion directive against generic LLM wrappers and lacks regional relevance.",
        directivesCompliance: [
          {
            directive: "Reject generic LLM / API wrappers",
            compliant: false,
            analysis: "Direct violation: Application is built as an orchestration layer on top of OpenAI APIs without proprietary models.",
          },
        ],
      },
    },
  },
];
