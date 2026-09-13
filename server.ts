import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { executeDemoScreening } from "./src/utils/demoScreeningEngine";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow large payloads for high-resolution document and selfie image base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Clean base64 data url helper
function cleanBase64(dataUrl: string): { mimeType: string; data: string } {
  if (!dataUrl) return { mimeType: "image/jpeg", data: "" };
  const trimmed = dataUrl.trim();
  const commaIdx = trimmed.indexOf(",");
  if (trimmed.startsWith("data:") && commaIdx !== -1) {
    const meta = trimmed.substring(5, commaIdx).toLowerCase();
    const rawMime = meta.split(";")[0] || "image/jpeg";
    const isBase64 = meta.includes(";base64");
    let raw = trimmed.substring(commaIdx + 1);
    if (!isBase64) {
      try {
        const decoded = decodeURIComponent(raw);
        raw = Buffer.from(decoded).toString("base64");
      } catch {
        raw = Buffer.from(raw).toString("base64");
      }
    } else {
      raw = raw.replace(/\s+/g, "");
    }
    // Normalize MIME types supported by Gemini Vision
    let mimeType = rawMime;
    if (rawMime === "image/svg+xml" || !["image/jpeg", "image/png", "image/webp"].includes(rawMime)) {
      mimeType = "image/png";
    }
    return { mimeType, data: raw };
  }
  return { mimeType: "image/jpeg", data: trimmed.replace(/\s+/g, "") };
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Document Screening Endpoint (supports both /api/screen-document and /api/screen)
app.post(["/api/screen-document", "/api/screen"], async (req, res) => {
  const startTime = Date.now();
  let { documentImage, selfieImage, consentGranted = true, scenarioId } = req.body;

  const screeningId = `SCR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // If a pre-configured test scenario is selected, allow screening even if documentImage is empty
  if (scenarioId && scenarioId.startsWith("scenario-")) {
    const result = generateDeterministicResult(
      documentImage || "",
      selfieImage,
      consentGranted,
      screeningId,
      timestamp,
      scenarioId,
      Date.now() - startTime + 250
    );
    return res.json(result);
  }

  if (!documentImage) {
    return res.status(400).json({ error: "documentImage is required" });
  }

  const ai = getAI();

  if (!ai) {
    console.warn("GEMINI_API_KEY is not set. Generating reference forensic evaluation.");
    const fallbackResult = generateDeterministicResult(
      documentImage,
      selfieImage,
      consentGranted,
      screeningId,
      timestamp,
      scenarioId,
      Date.now() - startTime
    );
    return res.json(fallbackResult);
  }

  try {
    const docClean = cleanBase64(documentImage);
    const contents: any[] = [
      {
        inlineData: {
          mimeType: docClean.mimeType,
          data: docClean.data,
        },
      },
    ];

    let facePromptSnippet = "No live selfie face image was provided.";
    if (selfieImage) {
      const selfieClean = cleanBase64(selfieImage);
      contents.push({
        inlineData: {
          mimeType: selfieClean.mimeType,
          data: selfieClean.data,
        },
      });
      facePromptSnippet =
        "Image 1 is the Identity Document. Image 2 is the live captured selfie face of the applicant. Conduct a 1:1 biometric facial comparison between the photo on the document and the live applicant selfie.";
    }

    const promptText = `
You are the high-assurance inspection engine for IDGuard AI (AI-Assisted Identity & Document Screening).
Analyze the provided document image (and live applicant selfie if provided) with forensic rigor.

Examine:
1. IMAGE QUALITY:
   - Sharpness score (0-100)
   - Glare detection & level ('none', 'minor', 'excessive')
   - Framing & cutoffs (are all 4 document borders fully visible?)
   - Lighting ('optimal', 'underexposed', 'overexposed', 'uneven')
   - Resolution adequacy
   - If image is unreadable, extremely blurry, severely occluded, heavy glare blocking critical text, or not a valid identity document:
     set insufficientEvidence=true, qualityStatus="FAIL", and provide recaptureReason.
     When insufficientEvidence is true, the overall risk MUST be "RECAPTURE_REQUIRED".

2. OCR & VISUAL INSPECTION ZONE (VIZ) FIELD EXTRACTION:
   - Document type (e.g. Passport, National Identity Card, Driver's License, Residence Permit)
   - Issuing Country / State
   - Document number
   - Surname & Given Names
   - Date of Birth (YYYY-MM-DD or document format)
   - Sex ('M', 'F', 'X', or 'OTHER')
   - Nationality
   - Issue Date & Expiry Date
   - Is document expired based on current year (current date ~ 2026)?

3. MACHINE READABLE ZONE (MRZ) & CONSISTENCY:
   - Does this document feature an ICAO 9303 MRZ zone (2 or 3 lines of optical characters like P<UTO...)?
   - If present, parse lines and extract doc number, DOB, expiry, nationality.
   - Verify check digit consistency where calculable.
   - CROSS-CHECK MRZ vs VIZ:
     Compare MRZ values with Visual Zone values. Flag any discrepancies (e.g. VIZ expiry differs from MRZ expiry, doc number mismatch).

4. DOCUMENT FORENSICS:
   - Font typography & alignment irregularities (different font weights, misaligned digits indicating digital alteration)
   - Photo manipulation / ghost image / digital overlay artifacts (edge splicing, compression differences around photo)
   - Background guilloche / microprint pattern continuity
   - Tamper risk score (0-100, 0=clean, 100=definite forgery)
   - List any specific suspicious regions found.

5. 1:1 BIOMETRIC FACE VERIFICATION (${facePromptSnippet}):
   - Face detected in document?
   - Live face captured?
   - Similarity score (0-100)
   - Match confidence: 'HIGH_MATCH' | 'POTENTIAL_MATCH' | 'MISMATCH' | 'INSUFFICIENT_FACE'
   - Facial structure analysis comparing facial landmarks, eye shape, nose bridge, jawline.

6. EXPLAINABLE RISK FUSION:
   - Overall risk tier: 'LOW_RISK' | 'REVIEW_REQUIRED' | 'HIGH_RISK' | 'RECAPTURE_REQUIRED'
   - Composite risk score (0-100)
   - "WHY THIS RESULT?":
     - headline (clear single sentence explanation)
     - summary (2-3 sentences concise technical synthesis)
     - keyDrivers: Array of { factor, impact ('positive' | 'warning' | 'critical'), details }
     - forensicFindings (list of bullet findings)
     - mrzConsistencyFindings (list of bullet findings)
     - biometricFindings (list of bullet findings)
     - recommendedOfficerAction (e.g. "Approve - document exhibits valid security features and matching biometrics" OR "Refer to Secondary - MRZ expiration conflicts with visual inspection zone" OR "Recapture Required - severe glare prevents OCR verification").

Return the result matching the structured schema.
`;

    contents.push({ text: promptText });

    const schemaConfig = {
      type: Type.OBJECT,
      properties: {
        quality: {
          type: Type.OBJECT,
          properties: {
            sharpnessScore: { type: Type.NUMBER },
            glareDetected: { type: Type.BOOLEAN },
            glareLevel: { type: Type.STRING, enum: ["none", "minor", "excessive"] },
            framingValid: { type: Type.BOOLEAN },
            lightingCondition: {
              type: Type.STRING,
              enum: ["optimal", "underexposed", "overexposed", "uneven"],
            },
            resolutionAdequate: { type: Type.BOOLEAN },
            qualityStatus: { type: Type.STRING, enum: ["PASS", "MARGINAL", "FAIL"] },
            insufficientEvidence: { type: Type.BOOLEAN },
            recaptureReason: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: [
            "sharpnessScore",
            "glareDetected",
            "glareLevel",
            "framingValid",
            "lightingCondition",
            "resolutionAdequate",
            "qualityStatus",
            "insufficientEvidence",
            "notes",
          ],
        },
        ocr: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING },
            issuingCountry: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
            surname: { type: Type.STRING },
            givenNames: { type: Type.STRING },
            dateOfBirth: { type: Type.STRING },
            sex: { type: Type.STRING },
            nationality: { type: Type.STRING },
            dateOfIssue: { type: Type.STRING },
            dateOfExpiry: { type: Type.STRING },
            isExpired: { type: Type.BOOLEAN },
            fieldConfidences: {
              type: Type.OBJECT,
              properties: {
                documentNumber: { type: Type.NUMBER },
                fullName: { type: Type.NUMBER },
                dateOfBirth: { type: Type.NUMBER },
                dateOfExpiry: { type: Type.NUMBER },
                nationality: { type: Type.NUMBER },
              },
              required: ["documentNumber", "fullName", "dateOfBirth", "dateOfExpiry", "nationality"],
            },
          },
          required: [
            "documentType",
            "issuingCountry",
            "documentNumber",
            "surname",
            "givenNames",
            "dateOfBirth",
            "sex",
            "nationality",
            "dateOfIssue",
            "dateOfExpiry",
            "isExpired",
            "fieldConfidences",
          ],
        },
        mrz: {
          type: Type.OBJECT,
          properties: {
            hasMRZ: { type: Type.BOOLEAN },
            mrzFormat: { type: Type.STRING, enum: ["TD1", "TD2", "TD3", "NONE"] },
            rawLines: { type: Type.ARRAY, items: { type: Type.STRING } },
            parsedDocumentNumber: { type: Type.STRING },
            parsedDOB: { type: Type.STRING },
            parsedExpiry: { type: Type.STRING },
            parsedNationality: { type: Type.STRING },
            parsedSex: { type: Type.STRING },
            checkDigitDocNumValid: { type: Type.BOOLEAN },
            checkDigitDOBValid: { type: Type.BOOLEAN },
            checkDigitExpiryValid: { type: Type.BOOLEAN },
            compositeCheckDigitValid: { type: Type.BOOLEAN },
            mrzVizConsistent: { type: Type.BOOLEAN },
            discrepancies: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "hasMRZ",
            "mrzFormat",
            "checkDigitDocNumValid",
            "checkDigitDOBValid",
            "checkDigitExpiryValid",
            "compositeCheckDigitValid",
            "mrzVizConsistent",
            "discrepancies",
          ],
        },
        forensics: {
          type: Type.OBJECT,
          properties: {
            fontInconsistencyDetected: { type: Type.BOOLEAN },
            photoTamperingDetected: { type: Type.BOOLEAN },
            digitalArtifactsDetected: { type: Type.BOOLEAN },
            guillochePatternIntact: { type: Type.BOOLEAN },
            edgeIntegrityIntact: { type: Type.BOOLEAN },
            suspiciousAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  region: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
                },
                required: ["region", "description", "severity"],
              },
            },
            tamperRiskScore: { type: Type.NUMBER },
            forensicSummary: { type: Type.STRING },
          },
          required: [
            "fontInconsistencyDetected",
            "photoTamperingDetected",
            "digitalArtifactsDetected",
            "guillochePatternIntact",
            "edgeIntegrityIntact",
            "suspiciousAreas",
            "tamperRiskScore",
            "forensicSummary",
          ],
        },
        face: {
          type: Type.OBJECT,
          properties: {
            consentGranted: { type: Type.BOOLEAN },
            faceDetectedInDoc: { type: Type.BOOLEAN },
            liveFaceCaptured: { type: Type.BOOLEAN },
            similarityScore: { type: Type.NUMBER },
            matchConfidence: {
              type: Type.STRING,
              enum: ["HIGH_MATCH", "POTENTIAL_MATCH", "MISMATCH", "INSUFFICIENT_FACE"],
            },
            livenessCheckPassed: { type: Type.BOOLEAN },
            facialStructureAnalysis: { type: Type.STRING },
            notes: { type: Type.STRING },
          },
          required: [
            "consentGranted",
            "faceDetectedInDoc",
            "liveFaceCaptured",
            "similarityScore",
            "matchConfidence",
            "livenessCheckPassed",
            "facialStructureAnalysis",
            "notes",
          ],
        },
        risk: {
          type: Type.OBJECT,
          properties: {
            overallRiskTier: {
              type: Type.STRING,
              enum: ["LOW_RISK", "REVIEW_REQUIRED", "HIGH_RISK", "RECAPTURE_REQUIRED"],
            },
            compositeRiskScore: { type: Type.NUMBER },
            whyThisResult: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyDrivers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      factor: { type: Type.STRING },
                      impact: { type: Type.STRING, enum: ["positive", "warning", "critical"] },
                      details: { type: Type.STRING },
                    },
                    required: ["factor", "impact", "details"],
                  },
                },
                forensicFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                mrzConsistencyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                biometricFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedOfficerAction: { type: Type.STRING },
              },
              required: [
                "headline",
                "summary",
                "keyDrivers",
                "forensicFindings",
                "mrzConsistencyFindings",
                "biometricFindings",
                "recommendedOfficerAction",
              ],
            },
          },
          required: ["overallRiskTier", "compositeRiskScore", "whyThisResult"],
        },
      },
      required: ["quality", "ocr", "mrz", "forensics", "face", "risk"],
    };

    const callModelWithTimeout = async (modelName: string, timeoutMs: number) => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout waiting for model ${modelName}`)), timeoutMs)
      );
      const requestPromise = ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schemaConfig,
        },
      });
      return Promise.race([requestPromise, timeoutPromise]) as Promise<any>;
    };

    let response: any;
    try {
      response = await callModelWithTimeout("gemini-3.1-flash-lite", 14000);
    } catch (primaryErr: any) {
      console.warn("Primary model call failed, trying fallback model:", primaryErr?.message);
      response = await callModelWithTimeout("gemini-flash-latest", 12000);
    }

    let rawText = response.text || "{}";
    rawText = rawText.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    const parsedJson = JSON.parse(rawText);

    // Force recapture if insufficient evidence flagged
    if (parsedJson.quality?.insufficientEvidence) {
      parsedJson.quality.qualityStatus = "FAIL";
      parsedJson.risk.overallRiskTier = "RECAPTURE_REQUIRED";
      parsedJson.risk.compositeRiskScore = Math.max(parsedJson.risk.compositeRiskScore || 0, 75);
    }

    const fullSession = {
      screeningId,
      timestamp,
      documentImage,
      selfieImage,
      applicantConsent: !!consentGranted,
      quality: parsedJson.quality,
      ocr: parsedJson.ocr,
      mrz: parsedJson.mrz,
      forensics: parsedJson.forensics,
      face: {
        ...parsedJson.face,
        consentGranted: !!consentGranted,
      },
      risk: parsedJson.risk,
      processingTimeMs: Date.now() - startTime,
      isDemoFallback: false,
      analysisSource: "GEMINI_AI",
    };

    return res.json(fullSession);
  } catch (err: any) {
    console.error("Gemini analysis error:", err?.message || err);
    // Graceful fallback with deterministic realistic analysis
    const fallbackResult = generateDeterministicResult(
      documentImage,
      selfieImage,
      consentGranted,
      screeningId,
      timestamp,
      scenarioId,
      Date.now() - startTime
    );
    return res.json(fallbackResult);
  }
});

// Deterministic fallback generator for offline / fallback resilience
function generateDeterministicResult(
  documentImage: string,
  selfieImage: string | undefined,
  consentGranted: boolean,
  screeningId: string,
  timestamp: string,
  scenarioId?: string,
  elapsedMs = 450
) {
  const result = executeDemoScreening({
    documentImage,
    selfieImage,
    consentGranted,
    scenarioId,
  });
  result.screeningId = screeningId || result.screeningId;
  result.timestamp = timestamp || result.timestamp;
  result.processingTimeMs = elapsedMs;
  return result;
}

// Start server with Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IDGuard AI screening server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
