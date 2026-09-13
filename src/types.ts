export type WorkflowStage =
  | 'CAPTURE'
  | 'IMAGE_QUALITY'
  | 'OCR_EXTRACTION'
  | 'MRZ_CONSISTENCY'
  | 'DOCUMENT_FORENSICS'
  | 'FACE_VERIFICATION'
  | 'RISK_FUSION'
  | 'OFFICER_DECISION'
  | 'AUDIT_TRAIL';

export interface ImageQualityAssessment {
  sharpnessScore: number; // 0 - 100
  glareDetected: boolean;
  glareLevel: 'none' | 'minor' | 'excessive';
  framingValid: boolean;
  lightingCondition: 'optimal' | 'underexposed' | 'overexposed' | 'uneven';
  resolutionAdequate: boolean;
  qualityStatus: 'PASS' | 'MARGINAL' | 'FAIL';
  insufficientEvidence: boolean;
  recaptureReason?: string;
  notes: string;
}

export interface OCRFieldExtraction {
  documentType: string;
  issuingCountry: string;
  documentNumber: string;
  surname: string;
  givenNames: string;
  dateOfBirth: string;
  sex: 'M' | 'F' | 'X' | 'OTHER' | string;
  nationality: string;
  dateOfIssue: string;
  dateOfExpiry: string;
  isExpired: boolean;
  fieldConfidences: {
    documentNumber: number;
    fullName: number;
    dateOfBirth: number;
    dateOfExpiry: number;
    nationality: number;
  };
}

export interface MRZConsistencyCheck {
  hasMRZ: boolean;
  mrzFormat: 'TD1' | 'TD2' | 'TD3' | 'NONE';
  rawLines?: string[];
  parsedDocumentNumber?: string;
  parsedDOB?: string;
  parsedExpiry?: string;
  parsedNationality?: string;
  parsedSex?: string;
  checkDigitDocNumValid: boolean;
  checkDigitDOBValid: boolean;
  checkDigitExpiryValid: boolean;
  compositeCheckDigitValid: boolean;
  mrzVizConsistent: boolean;
  discrepancies: string[];
}

export interface ForensicFlag {
  region: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DocumentForensics {
  fontInconsistencyDetected: boolean;
  photoTamperingDetected: boolean;
  digitalArtifactsDetected: boolean;
  guillochePatternIntact: boolean;
  edgeIntegrityIntact: boolean;
  suspiciousAreas: ForensicFlag[];
  tamperRiskScore: number; // 0 - 100
  forensicSummary: string;
}

export interface FaceVerification {
  consentGranted: boolean;
  faceDetectedInDoc: boolean;
  liveFaceCaptured: boolean;
  similarityScore: number; // 0 - 100
  matchConfidence: 'HIGH_MATCH' | 'POTENTIAL_MATCH' | 'MISMATCH' | 'INSUFFICIENT_FACE';
  livenessCheckPassed: boolean;
  facialStructureAnalysis: string;
  notes: string;
}

export interface RiskDriver {
  factor: string;
  impact: 'positive' | 'warning' | 'critical';
  details: string;
}

export interface ExplainableRiskFusion {
  overallRiskTier: 'LOW_RISK' | 'REVIEW_REQUIRED' | 'HIGH_RISK' | 'RECAPTURE_REQUIRED';
  compositeRiskScore: number; // 0 - 100
  whyThisResult: {
    headline: string;
    summary: string;
    keyDrivers: RiskDriver[];
    forensicFindings: string[];
    mrzConsistencyFindings: string[];
    biometricFindings: string[];
    recommendedOfficerAction: string;
  };
}

export interface OfficerDecision {
  decision: 'APPROVE' | 'SECONDARY_INSPECTION' | 'REJECT' | 'REQUEST_RECAPTURE';
  officerBadgeId: string;
  officerName: string;
  notes: string;
  decidedAt: string;
}

export interface ScreeningSession {
  screeningId: string;
  timestamp: string;
  documentImage: string;
  selfieImage?: string;
  applicantConsent: boolean;
  quality: ImageQualityAssessment;
  ocr: OCRFieldExtraction;
  mrz: MRZConsistencyCheck;
  forensics: DocumentForensics;
  face: FaceVerification;
  risk: ExplainableRiskFusion;
  decision?: OfficerDecision;
  processingTimeMs: number;
}

export interface InternalTestScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedOutcome: 'PASS' | 'FLAG_MRZ' | 'FLAG_TAMPER' | 'RECAPTURE' | 'FACE_MISMATCH' | 'EXPIRED';
  documentImage: string;
  selfieImage?: string;
  expectedSummary: string;
}
