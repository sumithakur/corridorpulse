export type RecommendationType = "Proceed to Intro Call" | "Keep on Radar" | "Pass";
export type VerdictType = "Strong" | "Moderate" | "Critical Risk";
export type DataResidencyFriction = "Low" | "Medium" | "High";
export type ThesisFitVerdict = "High Alignment" | "Moderate Fit" | "Misaligned";

export interface ThesisConfig {
  presetId: string;
  presetName: string;
  targetDeploymentRegions: string[];
  sourcingRndOrigin: string;
  targetStage: string;
  coreSectorFocus: string[];
  techDepthHurdle: string;
  strategicMandate: string;
  diligenceStrictness: number; // 1 (Lenient) to 5 (Ruthless IC)
  customDirectives: string;
}

export interface DirectiveComplianceItem {
  directive: string;
  compliant: boolean;
  analysis: string;
}

export interface ThesisFit {
  matchScore: number; // 0-100%
  verdict: ThesisFitVerdict;
  alignmentSummary: string;
  directivesCompliance: DirectiveComplianceItem[];
}

export interface CompanyProfile {
  name: string;
  oneLiner: string;
  hqLocation: string;
  primarySector: string;
  stage: string;
}

export interface OverallAssessment {
  score: number; // 0-100
  recommendation: RecommendationType;
  summaryRationale: string;
}

export interface EvaluationPillar {
  pillarName: string;
  score: number; // 0-25
  verdict: VerdictType;
  findings: string[];
}

export interface RegionalPilotFit {
  targetSectors: string[];
  dataResidencyFriction: DataResidencyFriction;
  potentialRegionalPartners: string[];
}

export type InvestorDecisionType = "Pending" | "Advance to Partner" | "Request More Info" | "Hold / Watch" | "Pass";

export interface ScoreDriver {
  label: string;
  points: number; // e.g. +22, -8
  category: "positive" | "negative";
}

export interface EvidenceItem {
  id: string;
  claim: string;
  source: string;
  status: "Verified in Deck" | "Unverified Claim" | "Founder Note" | "External Signal";
  context?: string;
}

export interface NegativeDiligenceCategorized {
  conflicts: Array<{ title: string; detail: string; source?: string }>;
  concerns: Array<{ title: string; detail: string; source?: string }>;
  unknowns: Array<{ title: string; detail: string; source?: string }>;
  questions: Array<{ title: string; detail: string }>;
}

export interface InvestorDecision {
  status: InvestorDecisionType;
  decidedBy?: string;
  timestamp?: string;
  notes?: string;
}

export interface SavedDealRecord {
  id: string;
  createdAt: string;
  companyName: string;
  score: number;
  thesisMatchPercent: number;
  verdict: string;
  sector: string;
  memoData: EvaluationResult;
}

export interface DealQueueItem {
  id: string;
  companyName: string;
  oneLiner: string;
  stage: string;
  sector: string;
  region: string;
  score: number;
  thesisFitScore: number;
  riskLevel: "Low" | "Medium" | "High";
  mandateName: string;
  systemRecommendation: RecommendationType;
  investorDecision: InvestorDecisionType;
  screenedDate: string;
  memoData: EvaluationResult;
}

export interface EvaluationResult {
  companyProfile: CompanyProfile;
  overallAssessment: OverallAssessment;
  // Pre-IC Deal Memo Core Fields
  executiveSummary: string; // 2-3 sentences on what they actually do
  keyHighlights: string[]; // 3 bullet points
  keyRisksAndGaps: string[]; // 3 bullet points
  partnerCallQuestions: string[]; // 3 questions for the first partner call
  thesisFit: ThesisFit;
  evaluationPillars: EvaluationPillar[];
  gccPilotFit?: RegionalPilotFit;
  redFlags: string[];
  keyQuestionsForFounder: string[];
  evaluatedThesis?: ThesisConfig;
  // Enhanced Institutional Fields (Audit Points 14, 15, 17, 26, 29, 30)
  scoreDecomposition?: ScoreDriver[];
  negativeDiligenceCategorized?: NegativeDiligenceCategorized;
  evidenceList?: EvidenceItem[];
  investorDecision?: InvestorDecision;
}

export interface EvaluateRequestPayload {
  inputText: string;
  inputType: "pdf" | "text" | "url";
  sourceName?: string;
  customApiKey?: string;
  thesisConfig?: ThesisConfig;
}
