import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Fingerprint,
  Binary,
  UserCheck,
  FileSearch,
  Camera,
  RefreshCw,
  Gavel,
  Check,
  Maximize2,
  AlertOctagon,
  Sparkles,
  Plus,
  FileDown,
} from "lucide-react";
import { ScreeningSession } from "../types";
import { generateScreeningPdf } from "../utils/pdfGenerator";

interface AnalysisOverviewProps {
  session: ScreeningSession;
  onOpenWhyThisResult: () => void;
  onOpenOfficerDecision: () => void;
  onRequestRecapture: () => void;
  onNewScreening: () => void;
}

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  session,
  onOpenWhyThisResult,
  onOpenOfficerDecision,
  onRequestRecapture,
  onNewScreening,
}) => {
  const { quality, ocr, mrz, forensics, face, risk, decision } = session;

  const isInsufficient = quality.insufficientEvidence || quality.qualityStatus === "FAIL";

  const getRiskColor = (tier: string) => {
    switch (tier) {
      case "LOW_RISK":
        return {
          bg: "bg-emerald-950/30",
          border: "border-emerald-500/40",
          badgeBg: "bg-emerald-500/20",
          text: "text-emerald-400",
          badgeBorder: "border-emerald-500/30",
          label: "LOW RISK (CLEAR)",
          icon: CheckCircle2,
        };
      case "REVIEW_REQUIRED":
        return {
          bg: "bg-amber-950/30",
          border: "border-amber-500/40",
          badgeBg: "bg-amber-500/20",
          text: "text-amber-400",
          badgeBorder: "border-amber-500/30",
          label: "REVIEW REQUIRED",
          icon: AlertTriangle,
        };
      case "RECAPTURE_REQUIRED":
        return {
          bg: "bg-orange-950/40",
          border: "border-orange-500/50",
          badgeBg: "bg-orange-500/25",
          text: "text-orange-400",
          badgeBorder: "border-orange-500/40",
          label: "INSUFFICIENT EVIDENCE → RECAPTURE REQUIRED",
          icon: AlertOctagon,
        };
      case "HIGH_RISK":
      default:
        return {
          bg: "bg-rose-950/30",
          border: "border-rose-500/40",
          badgeBg: "bg-rose-500/20",
          text: "text-rose-400",
          badgeBorder: "border-rose-500/30",
          label: "HIGH RISK (FLAGGED)",
          icon: XCircle,
        };
    }
  };

  const riskMeta = getRiskColor(risk.overallRiskTier);
  const RiskIcon = riskMeta.icon;

  return (
    <div className="space-y-6">
      {/* 1. Executive Explainable Risk Banner */}
      <div
        className={`${riskMeta.bg} ${riskMeta.border} border rounded-2xl p-6 shadow-md transition-all relative overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`${riskMeta.badgeBg} ${riskMeta.text} ${riskMeta.badgeBorder} border text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm`}
              >
                <RiskIcon className="w-4 h-4" />
                <span>{riskMeta.label}</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Screening ID: {session.screeningId}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Latency: {session.processingTimeMs}ms
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">
              {risk.whyThisResult.headline}
            </h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {risk.whyThisResult.summary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* The Strongest Feature: WHY THIS RESULT? */}
            <button
              id="why-this-result-btn"
              onClick={onOpenWhyThisResult}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>WHY THIS RESULT?</span>
            </button>

            {isInsufficient ? (
              <button
                id="request-recapture-btn"
                onClick={onRequestRecapture}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recapture Document</span>
              </button>
            ) : (
              <button
                id="officer-decision-btn"
                onClick={onOpenOfficerDecision}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Gavel className="w-4 h-4 text-sky-400" />
                <span>{decision ? "Update Decision" : "Record Officer Decision"}</span>
              </button>
            )}

            <button
              id="banner-download-pdf-btn"
              onClick={() => generateScreeningPdf(session)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              title="Download official government-grade PDF screening dossier"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Download PDF Report</span>
            </button>

            <button
              id="banner-new-screening-btn"
              onClick={onNewScreening}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              title="Clear current evaluation and start a new screening"
            >
              <Plus className="w-4 h-4 text-sky-400" />
              <span>New Screening</span>
            </button>
          </div>
        </div>

        {/* If Officer decision already recorded, display determination pill */}
        {decision && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Officer Determination:</span>
              <span className="font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                {decision.decision}
              </span>
              <span className="text-slate-400">by {decision.officerName} ({decision.officerBadgeId})</span>
            </div>
            {decision.notes && (
              <span className="text-slate-300 italic text-[11px]">
                &quot;{decision.notes}&quot;
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Insufficient Evidence Callout Alert (if applicable) */}
      {isInsufficient && (
        <div className="bg-orange-950/40 border-2 border-orange-500 rounded-xl p-5 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-orange-200 uppercase tracking-wide">
                INSUFFICIENT EVIDENCE &rarr; RECAPTURE REQUIRED
              </h3>
              <p className="text-xs text-orange-100/90 leading-relaxed">
                {quality.recaptureReason ||
                  "The acquired optical image fails clarity, lighting, or framing thresholds. Automated classification and forensics cannot proceed on insufficient evidence."}
              </p>
              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={onRequestRecapture}
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Initiate Clean Recapture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Multi-Card Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Step 2: Image Quality Assessment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Image Quality
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  quality.qualityStatus === "PASS"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : quality.qualityStatus === "MARGINAL"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {quality.qualityStatus}
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Sharpness Index:</span>
                  <span className="font-bold text-white">{quality.sharpnessScore}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      quality.sharpnessScore > 65
                        ? "bg-emerald-500"
                        : quality.sharpnessScore > 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${quality.sharpnessScore}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Specular Glare:</span>
                <span className={quality.glareDetected ? "text-amber-400 font-semibold" : "text-emerald-400"}>
                  {quality.glareDetected ? `Detected (${quality.glareLevel})` : "None"}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Framing / Edges:</span>
                <span className={quality.framingValid ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                  {quality.framingValid ? "All Borders Visible" : "Cutoff / Occluded"}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lighting:</span>
                <span className="text-slate-200 capitalize">{quality.lightingCondition}</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic mt-3 pt-2 border-t border-slate-800">
            {quality.notes}
          </p>
        </div>

        {/* Step 3: OCR & Field Extraction */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileSearch className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  OCR &amp; Visual Zone
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  ocr.isExpired
                    ? "bg-rose-500/20 text-rose-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {ocr.isExpired ? "EXPIRED" : "ACTIVE"}
              </span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold text-white truncate max-w-[170px]">{ocr.documentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doc Number:</span>
                <span className="font-mono font-bold text-sky-400">{ocr.documentNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Full Name:</span>
                <span className="font-semibold text-white truncate max-w-[170px]">
                  {ocr.givenNames} {ocr.surname}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="font-mono text-slate-200">{ocr.dateOfBirth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nationality:</span>
                <span className="text-slate-200">{ocr.nationality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiry Date:</span>
                <span className={`font-mono ${ocr.isExpired ? "text-rose-400 font-bold" : "text-emerald-400 font-semibold"}`}>
                  {ocr.dateOfExpiry}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Extraction Confidence:</span>
            <span className="font-mono font-bold text-emerald-400">
              {Math.round(
                (ocr.fieldConfidences.documentNumber +
                  ocr.fieldConfidences.fullName +
                  ocr.fieldConfidences.dateOfExpiry) /
                  3
              )}
              %
            </span>
          </div>
        </div>

        {/* Step 4: MRZ & Field Consistency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Binary className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  MRZ &amp; Parity Check
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  mrz.mrzVizConsistent
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {mrz.mrzVizConsistent ? "PARITY VALID" : "MISMATCH"}
              </span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">MRZ Standard:</span>
                <span className="font-mono font-bold text-white">{mrz.mrzFormat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doc # Checksum:</span>
                <span className={mrz.checkDigitDocNumValid ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                  {mrz.checkDigitDocNumValid ? "VALID" : "INVALID"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expiry Checksum:</span>
                <span className={mrz.checkDigitExpiryValid ? "text-emerald-400" : "text-rose-400 font-bold"}>
                  {mrz.checkDigitExpiryValid ? "VALID" : "INVALID"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Composite Check:</span>
                <span className={mrz.compositeCheckDigitValid ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                  {mrz.compositeCheckDigitValid ? "VALID" : "FAILED"}
                </span>
              </div>

              {/* Raw MRZ snippet */}
              {mrz.rawLines && mrz.rawLines.length > 0 && (
                <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[10px] text-slate-300 overflow-x-auto">
                  {mrz.rawLines.map((line, i) => (
                    <div key={i} className="whitespace-nowrap">{line}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {mrz.discrepancies.length > 0 ? (
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-rose-400 font-medium">
              ⚠ Discrepancy: {mrz.discrepancies[0]}
            </div>
          ) : (
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Visual &amp; Machine zones 100% matched
            </div>
          )}
        </div>

        {/* Step 5: Document Forensics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Fingerprint className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Document Forensics
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  forensics.tamperRiskScore < 25
                    ? "bg-emerald-500/20 text-emerald-400"
                    : forensics.tamperRiskScore < 60
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                Risk: {forensics.tamperRiskScore}/100
              </span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Font Typography:</span>
                <span className={forensics.fontInconsistencyDetected ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {forensics.fontInconsistencyDetected ? "Altered Font / Baseline" : "Genuine ICAO Font"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Photo Tampering:</span>
                <span className={forensics.photoTamperingDetected ? "text-rose-400 font-bold" : "text-emerald-400"}>
                  {forensics.photoTamperingDetected ? "Photo Edge Splicing" : "Pristine Border"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Guilloche Pattern:</span>
                <span className={forensics.guillochePatternIntact ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                  {forensics.guillochePatternIntact ? "Continuous & Intact" : "Disrupted / Altered"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Edge Integrity:</span>
                <span className={forensics.edgeIntegrityIntact ? "text-emerald-400" : "text-amber-400"}>
                  {forensics.edgeIntegrityIntact ? "Natural Die-Cut" : "Irregular"}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic mt-3 pt-2 border-t border-slate-800 truncate">
            {forensics.forensicSummary}
          </p>
        </div>

        {/* Step 6: 1:1 Face Biometrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  1:1 Face Verification
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  face.matchConfidence === "HIGH_MATCH"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : face.matchConfidence === "POTENTIAL_MATCH"
                    ? "bg-amber-500/20 text-amber-400"
                    : face.matchConfidence === "INSUFFICIENT_FACE"
                    ? "bg-slate-700 text-slate-300"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {face.matchConfidence}
              </span>
            </div>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Biometric Similarity:</span>
                <span className="font-mono font-bold text-white">{face.similarityScore}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    face.similarityScore > 75
                      ? "bg-emerald-500"
                      : face.similarityScore > 50
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${face.similarityScore}%` }}
                />
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Live Selfie Capture:</span>
                <span className={face.liveFaceCaptured ? "text-emerald-400" : "text-slate-400"}>
                  {face.liveFaceCaptured ? "Captured" : "Not Provided"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Applicant Consent:</span>
                <span className={face.consentGranted ? "text-emerald-400" : "text-amber-400"}>
                  {face.consentGranted ? "Affirmed" : "Pending"}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic mt-3 pt-2 border-t border-slate-800 truncate">
            {face.facialStructureAnalysis || face.notes}
          </p>
        </div>

        {/* Visual Inspection Images Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Optical Evidence Source
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">2 Channels</span>
          </div>

          <div className="mt-3 flex items-center justify-around gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400 font-semibold mb-1">DOCUMENT ID</span>
              <div className="w-28 h-20 rounded bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <img
                  src={session.documentImage}
                  alt="Document"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {session.selfieImage && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-semibold mb-1">LIVE SELFIE</span>
                <div className="w-20 h-20 rounded-full bg-slate-950 border-2 border-slate-800 overflow-hidden flex items-center justify-center">
                  <img
                    src={session.selfieImage}
                    alt="Applicant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Timestamp:</span>
            <span className="font-mono text-slate-300 text-[11px]">
              {new Date(session.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="text-slate-300 font-medium">Screening Reference:</span>
          <span className="font-mono text-sky-400 font-bold">{session.screeningId}</span>
          <span className="text-slate-600">•</span>
          <span>Inspection evaluation completed</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            id="bottom-why-this-result-btn"
            onClick={onOpenWhyThisResult}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span>Why This Result?</span>
          </button>

          {!isInsufficient && !decision && (
            <button
              id="bottom-record-decision-btn"
              onClick={onOpenOfficerDecision}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Gavel className="w-3.5 h-3.5 text-sky-400" />
              <span>Record Officer Decision</span>
            </button>
          )}

          <button
            id="bottom-download-pdf-btn"
            onClick={() => generateScreeningPdf(session)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download official government-style PDF report"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download PDF Report</span>
          </button>

          <button
            id="bottom-new-screening-btn"
            onClick={onNewScreening}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Screening</span>
          </button>
        </div>
      </div>
    </div>
  );
};
