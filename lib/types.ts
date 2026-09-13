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
}

export interface EvaluateRequestPayload {
  inputText: string;
  inputType: "pdf" | "text" | "url";
  sourceName?: string;
  customApiKey?: string;
  thesisConfig?: ThesisConfig;
}
