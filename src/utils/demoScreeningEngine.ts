import { ScreeningSession } from "../types";
import { ImageHeuristics } from "./imageOptimizer";

interface DemoScreeningOptions {
  documentImage: string;
  selfieImage?: string | null;
  consentGranted: boolean;
  scenarioId?: string | null;
  heuristics?: ImageHeuristics;
  selfieHeuristics?: ImageHeuristics;
}

export function executeDemoScreening({
  documentImage,
  selfieImage,
  consentGranted,
  scenarioId,
  heuristics,
  selfieHeuristics,
}: DemoScreeningOptions): ScreeningSession {
  const screeningId = `SCR-DEMO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const startTime = Date.now();

  // 1. Scenario 2: MRZ Expiry Discrepancy
  if (scenarioId === "scenario-mrz-discrepancy") {
    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: 92,
        glareDetected: false,
        glareLevel: "none",
        framingValid: true,
        lightingCondition: "optimal",
        resolutionAdequate: true,
        qualityStatus: "PASS",
        insufficientEvidence: false,
        notes: "High-resolution optical capture with clear contrast and full edge visibility.",
      },
      ocr: {
        documentType: "Passport (ICAO Doc 9303)",
        issuingCountry: "UTOPIA (UTO)",
        documentNumber: "L898902C3",
        surname: "ERIKSSON",
        givenNames: "ANNA MARIA",
        dateOfBirth: "1984-07-14",
        sex: "F",
        nationality: "UTOPIAN",
        dateOfIssue: "2020-11-12",
        dateOfExpiry: "2030-11-12",
        isExpired: false,
        fieldConfidences: {
          documentNumber: 98,
          fullName: 99,
          dateOfBirth: 97,
          dateOfExpiry: 96,
          nationality: 99,
        },
      },
      mrz: {
        hasMRZ: true,
        mrzFormat: "TD3",
        rawLines: [
          "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<",
          "L898902C36UTO8407148F2811124<<<<<<<<<<<<<<04",
        ],
        parsedDocumentNumber: "L898902C3",
        parsedDOB: "1984-07-14",
        parsedExpiry: "2028-11-12",
        parsedNationality: "UTO",
        parsedSex: "F",
        checkDigitDocNumValid: true,
        checkDigitDOBValid: true,
        checkDigitExpiryValid: true,
        compositeCheckDigitValid: true,
        mrzVizConsistent: false,
        discrepancies: [
          "CRITICAL: Expiry Date Mismatch. Visual Zone displays '2030-11-12', but MRZ Line 2 encodes '2811124' (2028-11-12).",
        ],
      },
      forensics: {
        fontInconsistencyDetected: true,
        photoTamperingDetected: false,
        digitalArtifactsDetected: true,
        guillochePatternIntact: false,
        edgeIntegrityIntact: true,
        suspiciousAreas: [
          {
            region: "Visual Expiry Date '2030'",
            description: "Digit '30' shows font baseline deviation and micro-halo compression artifacts inconsistent with document typography.",
            severity: "high",
          },
        ],
        tamperRiskScore: 88,
        forensicSummary: "Altered expiry date in Visual Inspection Zone to fraudulently extend passport validity by 2 years.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: true,
        liveFaceCaptured: !!selfieImage,
        similarityScore: selfieImage ? 93 : 0,
        matchConfidence: selfieImage ? "HIGH_MATCH" : "INSUFFICIENT_FACE",
        livenessCheckPassed: !!selfieImage,
        facialStructureAnalysis: "Facial contour, inter-pupillary distance, and nasal bridge match the document portrait.",
        notes: selfieImage ? "1:1 Face match confirmed with applicant consent." : "Selfie capture not provided.",
      },
      risk: {
        overallRiskTier: "HIGH_RISK",
        compositeRiskScore: 89,
        whyThisResult: {
          headline: "High Risk Detected: MRZ and Visual Inspection Zone Expiry Date Conflict.",
          summary: "The passport displays a visual expiration year of 2030, but the optical machine-readable zone encodes 2028. Forensic typography analysis confirms altered characters in the visual date field.",
          keyDrivers: [
            {
              factor: "MRZ Expiry Mismatch",
              impact: "critical",
              details: "Visual date '2030-11-12' contradicts encoded MRZ date '2028-11-12'.",
            },
            {
              factor: "Typography Alteration",
              impact: "critical",
              details: "Digital haloing and font weight divergence detected on the visual expiry digits.",
            },
            {
              factor: "Biometric Match",
              impact: "positive",
              details: "Live applicant selfie matches the portrait on the document (93% similarity).",
            },
          ],
          forensicFindings: [
            "Visual expiry year '30' superimposed over original print",
            "Disruption of anti-counterfeiting guilloche background lines under expiry text",
          ],
          mrzConsistencyFindings: [
            "MRZ Line 2 position 22-27 encodes '281112' (2028-11-12)",
            "Checksum digit 4 for expiration date validates against 2028 date, failing 2030 visual value",
          ],
          biometricFindings: [
            "1:1 face similarity score 93% indicates applicant is the person depicted in the photo",
          ],
          recommendedOfficerAction: "Refer to Secondary Inspection immediately. Impound document for physical laboratory examination.",
        },
      },
      processingTimeMs: Date.now() - startTime + 320,
    };
  }

  // 2. Scenario 3: Digital Tampering & Splicing
  if (scenarioId === "scenario-digital-tampering") {
    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: 90,
        glareDetected: false,
        glareLevel: "none",
        framingValid: true,
        lightingCondition: "optimal",
        resolutionAdequate: true,
        qualityStatus: "PASS",
        insufficientEvidence: false,
        notes: "Sharp image capture allowing microscopic pattern analysis.",
      },
      ocr: {
        documentType: "National Identity Card",
        issuingCountry: "UTOPIA (UTO)",
        documentNumber: "ID84729103",
        surname: "NOVAK",
        givenNames: "JAKUB",
        dateOfBirth: "1994-03-22",
        sex: "M",
        nationality: "UTOPIAN",
        dateOfIssue: "2019-06-15",
        dateOfExpiry: "2029-06-14",
        isExpired: false,
        fieldConfidences: {
          documentNumber: 95,
          fullName: 98,
          dateOfBirth: 82,
          dateOfExpiry: 96,
          nationality: 99,
        },
      },
      mrz: {
        hasMRZ: true,
        mrzFormat: "TD1",
        checkDigitDocNumValid: true,
        checkDigitDOBValid: false,
        checkDigitExpiryValid: true,
        compositeCheckDigitValid: false,
        mrzVizConsistent: false,
        discrepancies: [
          "Checksum failure on Date of Birth field in MRZ data block.",
        ],
      },
      forensics: {
        fontInconsistencyDetected: true,
        photoTamperingDetected: true,
        digitalArtifactsDetected: true,
        guillochePatternIntact: false,
        edgeIntegrityIntact: false,
        suspiciousAreas: [
          {
            region: "Portrait Photo Border",
            description: "Discontinuous color gradient and pixel splicing boundary around photo box.",
            severity: "high",
          },
          {
            region: "Date of Birth digits '1994'",
            description: "Font kerning and weight mismatch with surrounding OCR-B typography.",
            severity: "high",
          },
        ],
        tamperRiskScore: 94,
        forensicSummary: "Photo substitution and date of birth alteration detected through digital edge forensics.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: true,
        liveFaceCaptured: !!selfieImage,
        similarityScore: selfieImage ? 68 : 0,
        matchConfidence: selfieImage ? "POTENTIAL_MATCH" : "INSUFFICIENT_FACE",
        livenessCheckPassed: !!selfieImage,
        facialStructureAnalysis: "Portrait photo shows edge compression ringing and inconsistent lighting direction with document card.",
        notes: "Document portrait shows evidence of digital replacement.",
      },
      risk: {
        overallRiskTier: "HIGH_RISK",
        compositeRiskScore: 94,
        whyThisResult: {
          headline: "High Risk: Photo Substitution and Date of Birth Alteration Detected.",
          summary: "Forensic image inspection identified digital splicing artifacts along the photo perimeter, broken guilloche background security lines, and font divergence in the date of birth field.",
          keyDrivers: [
            {
              factor: "Photo Substitution Artifacts",
              impact: "critical",
              details: "Compression edge discontinuity detected around document photo perimeter.",
            },
            {
              factor: "Guilloche Disruption",
              impact: "critical",
              details: "Fine security background pattern is disrupted behind modified date field.",
            },
            {
              factor: "MRZ Checksum Failure",
              impact: "warning",
              details: "Computed check digit does not match encoded MRZ value.",
            },
          ],
          forensicFindings: [
            "Pixel boundary discontinuity surrounding portrait photo",
            "Non-standard typography weights in visual date of birth",
          ],
          mrzConsistencyFindings: [
            "MRZ check digit validation failed on date segment",
          ],
          biometricFindings: [
            "Photo appears spliced onto the document canvas",
          ],
          recommendedOfficerAction: "Reject credential and impound for fraud investigation. Refuse transit or clearance.",
        },
      },
      processingTimeMs: Date.now() - startTime + 290,
    };
  }

  // 3. Scenario 4: Specular Glare & Defocus Blur (Insufficient Evidence)
  if (scenarioId === "scenario-insufficient-evidence") {
    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: 28,
        glareDetected: true,
        glareLevel: "excessive",
        framingValid: false,
        lightingCondition: "uneven",
        resolutionAdequate: false,
        qualityStatus: "FAIL",
        insufficientEvidence: true,
        recaptureReason: "Excessive specular glare over document number and MRZ zone; image blur exceeds threshold (>0.45 laplacian variance).",
        notes: "Document edges are clipped on bottom left and specular flash glare covers the document identification fields.",
      },
      ocr: {
        documentType: "Unidentified Identity Document",
        issuingCountry: "Unknown",
        documentNumber: "UNREADABLE",
        surname: "UNREADABLE",
        givenNames: "UNREADABLE",
        dateOfBirth: "UNREADABLE",
        sex: "OTHER",
        nationality: "Unknown",
        dateOfIssue: "UNREADABLE",
        dateOfExpiry: "UNREADABLE",
        isExpired: false,
        fieldConfidences: {
          documentNumber: 12,
          fullName: 18,
          dateOfBirth: 15,
          dateOfExpiry: 10,
          nationality: 22,
        },
      },
      mrz: {
        hasMRZ: false,
        mrzFormat: "NONE",
        checkDigitDocNumValid: false,
        checkDigitDOBValid: false,
        checkDigitExpiryValid: false,
        compositeCheckDigitValid: false,
        mrzVizConsistent: false,
        discrepancies: ["MRZ unreadable due to severe optical glare and out-of-focus blur."],
      },
      forensics: {
        fontInconsistencyDetected: false,
        photoTamperingDetected: false,
        digitalArtifactsDetected: false,
        guillochePatternIntact: false,
        edgeIntegrityIntact: false,
        suspiciousAreas: [],
        tamperRiskScore: 0,
        forensicSummary: "Forensic analysis inconclusive due to low optical resolution and obstruction.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: false,
        liveFaceCaptured: !!selfieImage,
        similarityScore: 0,
        matchConfidence: "INSUFFICIENT_FACE",
        livenessCheckPassed: false,
        facialStructureAnalysis: "Facial portrait on document is overexposed and obscured by light reflection.",
        notes: "Cannot isolate facial landmarks on document.",
      },
      risk: {
        overallRiskTier: "RECAPTURE_REQUIRED",
        compositeRiskScore: 75,
        whyThisResult: {
          headline: "INSUFFICIENT EVIDENCE → RECAPTURE REQUIRED",
          summary: "Image quality metrics fail minimum threshold for forensic or optical character extraction. Specular glare and camera defocus prevent verified reading of security features and identity fields.",
          keyDrivers: [
            {
              factor: "Severe Glare Reflection",
              impact: "critical",
              details: "Flash hotspot obscures document number and Machine Readable Zone.",
            },
            {
              factor: "Low Sharpness & Motion Blur",
              impact: "critical",
              details: "Laplacian variance sharpness score 28/100 is below the 60/100 threshold.",
            },
            {
              factor: "Framing Cutoff",
              impact: "warning",
              details: "Lower document boundary is cropped outside the camera frame.",
            },
          ],
          forensicFindings: ["Cannot inspect microtext or guilloche patterns under current optical capture."],
          mrzConsistencyFindings: ["MRZ text lines unreadable."],
          biometricFindings: ["Facial portrait obscured by overexposure."],
          recommendedOfficerAction: "Request Immediate Recapture. Direct applicant or camera operator to adjust lighting angle and keep document steady within alignment guides.",
        },
      },
      processingTimeMs: Date.now() - startTime + 210,
    };
  }

  // 4. Scenario 5: 1:1 Biometric Face Mismatch
  if (scenarioId === "scenario-face-mismatch") {
    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: 94,
        glareDetected: false,
        glareLevel: "none",
        framingValid: true,
        lightingCondition: "optimal",
        resolutionAdequate: true,
        qualityStatus: "PASS",
        insufficientEvidence: false,
        notes: "Sharp, high-resolution document and live biometric selfie capture.",
      },
      ocr: {
        documentType: "National Identity Card",
        issuingCountry: "FRANCE (FRA)",
        documentNumber: "180975200341",
        surname: "DUBOIS",
        givenNames: "LUCAS PIERRE",
        dateOfBirth: "1992-04-18",
        sex: "M",
        nationality: "FRENCH",
        dateOfIssue: "2019-05-10",
        dateOfExpiry: "2029-05-09",
        isExpired: false,
        fieldConfidences: {
          documentNumber: 99,
          fullName: 99,
          dateOfBirth: 98,
          dateOfExpiry: 98,
          nationality: 99,
        },
      },
      mrz: {
        hasMRZ: true,
        mrzFormat: "TD1",
        parsedDocumentNumber: "180975200341",
        parsedDOB: "1992-04-18",
        parsedExpiry: "2029-05-09",
        parsedNationality: "FRA",
        parsedSex: "M",
        checkDigitDocNumValid: true,
        checkDigitDOBValid: true,
        checkDigitExpiryValid: true,
        compositeCheckDigitValid: true,
        mrzVizConsistent: true,
        discrepancies: [],
      },
      forensics: {
        fontInconsistencyDetected: false,
        photoTamperingDetected: false,
        digitalArtifactsDetected: false,
        guillochePatternIntact: true,
        edgeIntegrityIntact: true,
        suspiciousAreas: [],
        tamperRiskScore: 12,
        forensicSummary: "Document physical and digital characteristics appear genuine and intact.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: true,
        liveFaceCaptured: true,
        similarityScore: 24,
        matchConfidence: "MISMATCH",
        livenessCheckPassed: true,
        facialStructureAnalysis: "Significant structural biometric differences: earlobe attachment, nasal angle, inter-canthal distance, and philtrum ratio diverge significantly between document photo and live applicant.",
        notes: "Biometric 1:1 similarity is 24%, well below the 70% threshold. High likelihood of impostor / lookalike presentation.",
      },
      risk: {
        overallRiskTier: "HIGH_RISK",
        compositeRiskScore: 92,
        whyThisResult: {
          headline: "High Risk: Biometric 1:1 Facial Mismatch (Possible Impostor).",
          summary: "While the presented identity document is authentic and has valid security markings, the live applicant presenting the card fails 1:1 biometric facial comparison with a 24% similarity score.",
          keyDrivers: [
            {
              factor: "Biometric Face Mismatch",
              impact: "critical",
              details: "Similarity score 24% (minimum passing threshold: 70%). Key facial landmarks do not match.",
            },
            {
              factor: "Document Integrity",
              impact: "positive",
              details: "National ID card passes optical security and MRZ check digit verification.",
            },
            {
              factor: "Live Presence Confirmed",
              impact: "positive",
              details: "Applicant completed live camera capture with valid consent.",
            },
          ],
          forensicFindings: ["No physical document tampering detected; card appears genuine."],
          mrzConsistencyFindings: ["MRZ check digits valid and consistent with visual card details."],
          biometricFindings: [
            "Facial landmark divergence: Nasal bridge width +22% variance",
            "Jawline curvature and chin projection incompatible with ID portrait",
          ],
          recommendedOfficerAction: "Deny clearance and escort applicant to Secondary Inspection for fingerprint/multi-factor identity challenge.",
        },
      },
      processingTimeMs: Date.now() - startTime + 380,
    };
  }

  // 5. Scenario 6: Expired Document
  if (scenarioId === "scenario-expired-document") {
    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: 91,
        glareDetected: false,
        glareLevel: "none",
        framingValid: true,
        lightingCondition: "optimal",
        resolutionAdequate: true,
        qualityStatus: "PASS",
        insufficientEvidence: false,
        notes: "Document clearly framed with intact contrast.",
      },
      ocr: {
        documentType: "Passport (ICAO Doc 9303)",
        issuingCountry: "UTOPIA (UTO)",
        documentNumber: "P40918231",
        surname: "ALVAREZ",
        givenNames: "MARCOS ANTONIO",
        dateOfBirth: "1978-10-05",
        sex: "M",
        nationality: "UTOPIAN",
        dateOfIssue: "2013-04-10",
        dateOfExpiry: "2023-04-09",
        isExpired: true,
        fieldConfidences: {
          documentNumber: 99,
          fullName: 99,
          dateOfBirth: 99,
          dateOfExpiry: 99,
          nationality: 99,
        },
      },
      mrz: {
        hasMRZ: true,
        mrzFormat: "TD3",
        rawLines: [
          "P<UTOALVAREZ<<MARCOS<ANTONIO<<<<<<<<<<<<<<<<<",
          "P409182319UTO7810052M2304098<<<<<<<<<<<<<<02",
        ],
        parsedDocumentNumber: "P40918231",
        parsedDOB: "1978-10-05",
        parsedExpiry: "2023-04-09",
        parsedNationality: "UTO",
        parsedSex: "M",
        checkDigitDocNumValid: true,
        checkDigitDOBValid: true,
        checkDigitExpiryValid: true,
        compositeCheckDigitValid: true,
        mrzVizConsistent: true,
        discrepancies: ["EXPIRED CREDENTIAL: Document expired on 2023-04-09."],
      },
      forensics: {
        fontInconsistencyDetected: false,
        photoTamperingDetected: false,
        digitalArtifactsDetected: false,
        guillochePatternIntact: true,
        edgeIntegrityIntact: true,
        suspiciousAreas: [],
        tamperRiskScore: 10,
        forensicSummary: "Genuine credential; no physical tampering detected.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: true,
        liveFaceCaptured: !!selfieImage,
        similarityScore: selfieImage ? 91 : 0,
        matchConfidence: selfieImage ? "HIGH_MATCH" : "INSUFFICIENT_FACE",
        livenessCheckPassed: !!selfieImage,
        facialStructureAnalysis: "Facial features correspond with natural aging progression from 2013 portrait.",
        notes: selfieImage ? "Biometric comparison passed (91%)." : "Selfie capture not provided.",
      },
      risk: {
        overallRiskTier: "REVIEW_REQUIRED",
        compositeRiskScore: 65,
        whyThisResult: {
          headline: "Review Required: Credential Validity Expired.",
          summary: "The presented passport is physically genuine and check digits are valid, but the expiration date passed in 2023. An expired document cannot be accepted for clearance.",
          keyDrivers: [
            {
              factor: "Expired Credential",
              impact: "critical",
              details: "Document validity expired on 2023-04-09.",
            },
            {
              factor: "Document Authenticity",
              impact: "positive",
              details: "Security printing, guilloche patterns, and MRZ check digits are valid.",
            },
            {
              factor: "Biometric Likeness",
              impact: "positive",
              details: selfieImage ? "Applicant matches the document portrait." : "Biometrics not submitted.",
            },
          ],
          forensicFindings: ["Genuine document substrate without alterations."],
          mrzConsistencyFindings: ["MRZ matches Visual Zone; both record 2023 expiration."],
          biometricFindings: ["Facial comparison consistent."],
          recommendedOfficerAction: "Deny entry or request alternative active government-issued identity credential.",
        },
      },
      processingTimeMs: Date.now() - startTime + 260,
    };
  }

  // 6. Dynamic Evaluation for Real Uploaded Images & Camera Captures
  // If heuristics show bad quality (extreme glare, heavy blur, or too small)
  const isHeuristicInsufficient = heuristics && (
    heuristics.glareLevel === "excessive" ||
    heuristics.sharpnessScore < 35 ||
    !heuristics.resolutionAdequate
  );

  if (isHeuristicInsufficient) {
    const reason = heuristics.glareLevel === "excessive"
      ? "Severe optical glare reflection covers key security areas. Please angle document away from direct lighting."
      : "Image sharpness is below acceptable threshold (motion blur or focus issue). Please steady camera.";

    return {
      screeningId,
      timestamp,
      documentImage,
      selfieImage: selfieImage || undefined,
      applicantConsent: consentGranted,
      isDemoFallback: true,
      analysisSource: "CONTROLLED_DEMO_ENGINE",
      quality: {
        sharpnessScore: heuristics.sharpnessScore,
        glareDetected: heuristics.glareDetected,
        glareLevel: heuristics.glareLevel,
        framingValid: heuristics.framingValid,
        lightingCondition: heuristics.lightingCondition,
        resolutionAdequate: heuristics.resolutionAdequate,
        qualityStatus: "FAIL",
        insufficientEvidence: true,
        recaptureReason: reason,
        notes: `Optical analysis detected ${heuristics.glareLevel} glare with sharpness score ${heuristics.sharpnessScore}/100.`,
      },
      ocr: {
        documentType: "Identity Document (Recapture Needed)",
        issuingCountry: "Undetermined",
        documentNumber: "UNREADABLE",
        surname: "UNREADABLE",
        givenNames: "UNREADABLE",
        dateOfBirth: "UNREADABLE",
        sex: "OTHER",
        nationality: "Undetermined",
        dateOfIssue: "UNREADABLE",
        dateOfExpiry: "UNREADABLE",
        isExpired: false,
        fieldConfidences: {
          documentNumber: 15,
          fullName: 20,
          dateOfBirth: 10,
          dateOfExpiry: 12,
          nationality: 18,
        },
      },
      mrz: {
        hasMRZ: false,
        mrzFormat: "NONE",
        checkDigitDocNumValid: false,
        checkDigitDOBValid: false,
        checkDigitExpiryValid: false,
        compositeCheckDigitValid: false,
        mrzVizConsistent: false,
        discrepancies: ["Characters obstructed by optical glare or blur."],
      },
      forensics: {
        fontInconsistencyDetected: false,
        photoTamperingDetected: false,
        digitalArtifactsDetected: false,
        guillochePatternIntact: false,
        edgeIntegrityIntact: false,
        suspiciousAreas: [],
        tamperRiskScore: 0,
        forensicSummary: "Inspection suspended due to inadequate optical capture quality.",
      },
      face: {
        consentGranted,
        faceDetectedInDoc: false,
        liveFaceCaptured: !!selfieImage,
        similarityScore: 0,
        matchConfidence: "INSUFFICIENT_FACE",
        livenessCheckPassed: false,
        facialStructureAnalysis: "Facial region obscured by optical reflection or defocus.",
        notes: "Recapture required to isolate facial landmarks.",
      },
      risk: {
        overallRiskTier: "RECAPTURE_REQUIRED",
        compositeRiskScore: 80,
        whyThisResult: {
          headline: "INSUFFICIENT EVIDENCE → RECAPTURE REQUIRED",
          summary: "Camera capture quality failed the minimum optical threshold for identity extraction. Visual glare or optical blur prevents verified inspection of anti-forgery security features.",
          keyDrivers: [
            {
              factor: heuristics.glareLevel === "excessive" ? "Specular Glare" : "Optical Defocus Blur",
              impact: "critical",
              details: reason,
            },
            {
              factor: "Resolution & Framing",
              impact: heuristics.resolutionAdequate ? "positive" : "warning",
              details: heuristics.resolutionAdequate ? "Image resolution acceptable" : "Low capture resolution",
            },
          ],
          forensicFindings: ["Cannot verify microtext or guilloche patterns under current capture quality."],
          mrzConsistencyFindings: ["Machine Readable Zone obstructed."],
          biometricFindings: ["Facial comparison cannot be conducted."],
          recommendedOfficerAction: "Instruct applicant or operator to recapture with even ambient light and no direct flash.",
        },
      },
      processingTimeMs: Date.now() - startTime + 240,
    };
  }

  // Default Standard Valid Document Evaluation
  const hasSelfie = !!selfieImage;
  const matchSimilarity = hasSelfie ? 95 : 0;
  const matchTier = hasSelfie ? "HIGH_MATCH" : "INSUFFICIENT_FACE";

  return {
    screeningId,
    timestamp,
    documentImage,
    selfieImage: selfieImage || undefined,
    applicantConsent: consentGranted,
    isDemoFallback: true,
    analysisSource: "CONTROLLED_DEMO_ENGINE",
    quality: {
      sharpnessScore: heuristics?.sharpnessScore || 93,
      glareDetected: heuristics?.glareDetected || false,
      glareLevel: heuristics?.glareLevel || "none",
      framingValid: heuristics?.framingValid ?? true,
      lightingCondition: heuristics?.lightingCondition || "optimal",
      resolutionAdequate: heuristics?.resolutionAdequate ?? true,
      qualityStatus: "PASS",
      insufficientEvidence: false,
      notes: "Clear capture with balanced contrast, legible text fields, and intact boundary margins.",
    },
    ocr: {
      documentType: "Passport / National Identity Credential",
      issuingCountry: "UTOPIA (UTO)",
      documentNumber: "P12849021",
      surname: "TAYLOR",
      givenNames: "ALEX MORGAN",
      dateOfBirth: "1990-08-22",
      sex: "F",
      nationality: "UTOPIAN",
      dateOfIssue: "2021-03-15",
      dateOfExpiry: "2031-03-14",
      isExpired: false,
      fieldConfidences: {
        documentNumber: 99,
        fullName: 99,
        dateOfBirth: 99,
        dateOfExpiry: 99,
        nationality: 99,
      },
    },
    mrz: {
      hasMRZ: true,
      mrzFormat: "TD3",
      rawLines: [
        "P<UTOTAYLOR<<ALEX<MORGAN<<<<<<<<<<<<<<<<<<<",
        "P128490218UTO9008226F3103142<<<<<<<<<<<<<<06",
      ],
      parsedDocumentNumber: "P12849021",
      parsedDOB: "1990-08-22",
      parsedExpiry: "2031-03-14",
      parsedNationality: "UTO",
      parsedSex: "F",
      checkDigitDocNumValid: true,
      checkDigitDOBValid: true,
      checkDigitExpiryValid: true,
      compositeCheckDigitValid: true,
      mrzVizConsistent: true,
      discrepancies: [],
    },
    forensics: {
      fontInconsistencyDetected: false,
      photoTamperingDetected: false,
      digitalArtifactsDetected: false,
      guillochePatternIntact: true,
      edgeIntegrityIntact: true,
      suspiciousAreas: [],
      tamperRiskScore: 6,
      forensicSummary: "Continuous guilloche security printing, uniform ICAO typography, and uncompromised portrait registration borders.",
    },
    face: {
      consentGranted,
      faceDetectedInDoc: true,
      liveFaceCaptured: hasSelfie,
      similarityScore: matchSimilarity,
      matchConfidence: matchTier,
      livenessCheckPassed: hasSelfie,
      facialStructureAnalysis: hasSelfie
        ? "Facial geometric vectors (zygomatic width, philtrum height, orbital separation) align with 95% statistical likeness."
        : "Document portrait verified; live applicant selfie not submitted.",
      notes: hasSelfie
        ? "High-confidence 1:1 facial biometric match with verified applicant consent."
        : "Live selfie capture optional; proceeding on document security attributes.",
    },
    risk: {
      overallRiskTier: "LOW_RISK",
      compositeRiskScore: 8,
      whyThisResult: {
        headline: "Low Risk: Identity Credential & Biometrics Validated.",
        summary: "The identity document passes physical, optical, and machine-readable cryptographic validation checks. Visual fields are 100% consistent with embedded MRZ lines, and anti-tamper security features are uncompromised.",
        keyDrivers: [
          {
            factor: "Document Integrity",
            impact: "positive",
            details: "Security guilloche pattern, microtext lines, and edge registration intact.",
          },
          {
            factor: "MRZ & VIZ Parity",
            impact: "positive",
            details: "All check digits valid; zero discrepancy between visual zone and encoded zone.",
          },
          {
            factor: "1:1 Biometric Likeness",
            impact: "positive",
            details: hasSelfie
              ? "Live applicant facial likeness verified with 95% similarity score."
              : "Document portrait quality verified; applicant selfie optional.",
          },
        ],
        forensicFindings: [
          "Typography adheres to standard ICAO Doc 9303 OCR-B specifications",
          "No pixel tampering or color space anomalies detected around portrait box",
        ],
        mrzConsistencyFindings: [
          "Document Number Check Digit: VALID (8)",
          "Date of Birth Check Digit: VALID (6)",
          "Expiry Date Check Digit: VALID (2)",
          "Composite Check Digit: VALID (06)",
        ],
        biometricFindings: [
          hasSelfie ? "1:1 biometric comparison similarity: 95% (PASS)" : "Document portrait quality verified",
        ],
        recommendedOfficerAction: "Approve and proceed. Standard clearance criteria satisfied.",
      },
    },
    processingTimeMs: Date.now() - startTime + 420,
  };
}
