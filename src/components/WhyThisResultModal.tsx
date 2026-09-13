import React from "react";
import {
  HelpCircle,
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Binary,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ExplainableRiskFusion, MRZConsistencyCheck, DocumentForensics, FaceVerification, OCRFieldExtraction } from "../types";

interface WhyThisResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: ExplainableRiskFusion;
  mrz: MRZConsistencyCheck;
  forensics: DocumentForensics;
  face: FaceVerification;
  ocr: OCRFieldExtraction;
  onOpenOfficerDecision?: () => void;
}

export const WhyThisResultModal: React.FC<WhyThisResultModalProps> = ({
  isOpen,
  onClose,
  risk,
  mrz,
  forensics,
  face,
  ocr,
  onOpenOfficerDecision,
}) => {
  if (!isOpen) return null;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "LOW_RISK":
        return (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Low Risk (Clear)
          </span>
        );
      case "REVIEW_REQUIRED":
        return (
          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Review Required
          </span>
        );
      case "HIGH_RISK":
        return (
          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" /> High Risk (Flagged)
          </span>
        );
      case "RECAPTURE_REQUIRED":
        return (
          <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Recapture Required
          </span>
        );
      default:
        return null;
    }
  };

  const getDriverIcon = (impact: "positive" | "warning" | "critical") => {
    if (impact === "positive") {
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />;
    }
    if (impact === "warning") {
      return <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />;
    }
    return <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Why This Result?</h3>
                <span className="text-[11px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                  Explainable Evidence Breakdown
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent multi-layer synthesis of forensic, optical, and biometric findings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Executive Verdict Banner */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Screening Verdict
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {risk.whyThisResult.headline}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {risk.whyThisResult.summary}
              </p>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1">
              {getTierBadge(risk.overallRiskTier)}
              <span className="text-xs text-slate-400 font-mono mt-1">
                Risk Score: <span className="font-bold text-white">{risk.compositeRiskScore}/100</span>
              </span>
            </div>
          </div>

          {/* Key Evidence Drivers */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Key Risk Drivers &amp; Evidence
            </h4>
            <div className="space-y-2.5">
              {risk.whyThisResult.keyDrivers.map((driver, index) => (
                <div
                  key={index}
                  className={`p-3.5 rounded-lg border flex items-start space-x-3 ${
                    driver.impact === "positive"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                      : driver.impact === "warning"
                      ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                      : "bg-rose-950/20 border-rose-500/30 text-rose-200"
                  }`}
                >
                  {getDriverIcon(driver.impact)}
                  <div className="flex-1 text-xs">
                    <span className="font-bold text-white mr-1.5">{driver.factor}:</span>
                    <span className="text-slate-200 leading-relaxed">{driver.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Verification Parity Comparison Table if Discrepancy Exists */}
          {mrz.discrepancies.length > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Detected Cross-Field Discrepancies</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-200">
                {mrz.discrepancies.map((disc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{disc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Three-Column Evidence Drilldown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Forensics Drilldown */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-2">
                <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
                <span>Forensic Checks</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Tamper Score:</span>
                  <span className="font-bold text-white">{forensics.tamperRiskScore}/100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Typography:</span>
                  <span className={forensics.fontInconsistencyDetected ? "text-rose-400 font-semibold" : "text-emerald-400"}>
                    {forensics.fontInconsistencyDetected ? "Inconsistent" : "Intact"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Photo Edge:</span>
                  <span className={forensics.photoTamperingDetected ? "text-rose-400 font-semibold" : "text-emerald-400"}>
                    {forensics.photoTamperingDetected ? "Tampered" : "Original"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. MRZ Consistency Drilldown */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-2">
                <Binary className="w-3.5 h-3.5 text-sky-400" />
                <span>MRZ Consistency</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">MRZ Format:</span>
                  <span className="font-mono text-white">{mrz.mrzFormat}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Check Digits:</span>
                  <span className={mrz.checkDigitExpiryValid ? "text-emerald-400" : "text-rose-400 font-semibold"}>
                    {mrz.checkDigitExpiryValid ? "Valid" : "Failed"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">VIZ Parity:</span>
                  <span className={mrz.mrzVizConsistent ? "text-emerald-400" : "text-rose-400 font-bold"}>
                    {mrz.mrzVizConsistent ? "Consistent" : "Conflict"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. 1:1 Face Verification Drilldown */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 mb-2">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>1:1 Biometrics</span>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Similarity:</span>
                  <span className="font-bold text-white">{face.similarityScore}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Confidence:</span>
                  <span
                    className={
                      face.matchConfidence === "HIGH_MATCH"
                        ? "text-emerald-400"
                        : face.matchConfidence === "POTENTIAL_MATCH"
                        ? "text-amber-400"
                        : "text-rose-400 font-bold"
                    }
                  >
                    {face.matchConfidence}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Consent:</span>
                  <span className="text-emerald-400 font-medium">Recorded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Officer Action */}
          <div className="bg-sky-950/30 border border-sky-500/40 rounded-xl p-4">
            <div className="text-[11px] text-sky-400 uppercase tracking-wider font-bold mb-1">
              Recommended Officer Action
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {risk.whyThisResult.recommendedOfficerAction}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Close Drilldown
          </button>

          {onOpenOfficerDecision && (
            <button
              onClick={() => {
                onClose();
                onOpenOfficerDecision();
              }}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <span>Proceed to Officer Decision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
