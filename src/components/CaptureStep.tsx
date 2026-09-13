import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";
import { CameraCaptureModal } from "./CameraCaptureModal";
import { INTERNAL_TEST_SCENARIOS } from "../data/testScenarios";

interface CaptureStepProps {
  documentImage: string | null;
  selfieImage: string | null;
  consentGranted: boolean;
  onSetDocumentImage: (img: string | null) => void;
  onSetSelfieImage: (img: string | null) => void;
  onToggleConsent: (val: boolean) => void;
  onRunScreening: () => void;
  onLoadScenario: (scenarioId: string) => void;
  isAnalyzing: boolean;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({
  documentImage,
  selfieImage,
  consentGranted,
  onSetDocumentImage,
  onSetSelfieImage,
  onToggleConsent,
  onRunScreening,
  onLoadScenario,
  isAnalyzing,
}) => {
  const [cameraModalMode, setCameraModalMode] = useState<"document" | "face" | null>(null);
  const docFileInputRef = useRef<HTMLInputElement | null>(null);
  const selfieFileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActiveDoc, setDragActiveDoc] = useState(false);
  const [dragActiveSelfie, setDragActiveSelfie] = useState(false);

  const handleFile = (file: File, target: "document" | "face") => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WEBP).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        if (target === "document") onSetDocumentImage(e.target.result);
        else onSetSelfieImage(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidelines */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Document Ingestion &amp; Biometric Capture
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Acquire high-resolution imagery of the physical identity document and applicant portrait.
              Ensure even lighting, sharp focus on security markings, and zero specular reflection over the Machine Readable Zone (MRZ).
            </p>
          </div>

          {/* Quick test scenarios helper */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Load Preset:</span>
            <select
              id="quick-scenario-dropdown"
              onChange={(e) => {
                if (e.target.value) {
                  onLoadScenario(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            >
              <option value="" disabled>
                Select Test Preset...
              </option>
              {INTERNAL_TEST_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid: Document Capture & Face Selfie Capture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: ID Document Ingestion */}
        <div
          className={`bg-slate-900 border rounded-xl overflow-hidden transition-all flex flex-col ${
            documentImage
              ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
              : dragActiveDoc
              ? "border-sky-500 bg-sky-950/20"
              : "border-slate-800 hover:border-slate-700"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActiveDoc(true);
          }}
          onDragLeave={() => setDragActiveDoc(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActiveDoc(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0], "document");
          }}
        >
          <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileImage className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                1. Identity Document
              </span>
            </div>
            {documentImage ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Image Loaded
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 font-medium">Required</span>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col items-center justify-center">
            {documentImage ? (
              <div className="relative w-full aspect-[1.586/1] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center group">
                <img
                  src={documentImage}
                  alt="Identity Document"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    id="doc-retake-btn"
                    onClick={() => setCameraModalMode("document")}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" /> Retake via Camera
                  </button>
                  <button
                    id="doc-replace-btn"
                    onClick={() => docFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full py-8 border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl flex flex-col items-center justify-center text-center p-6 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
                  <Camera className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">
                  Capture or Upload Document
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mb-4">
                  Passports, National Identity Cards, or Driver&apos;s Licenses with MRZ or barcode.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    id="open-doc-camera-btn"
                    onClick={() => setCameraModalMode("document")}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Open Live Camera
                  </button>
                  <button
                    id="upload-doc-file-btn"
                    onClick={() => docFileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                </div>
              </div>
            )}
            <input
              ref={docFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0], "document");
              }}
            />
          </div>
        </div>

        {/* Card 2: 1:1 Live Face Biometric Selfie */}
        <div
          className={`bg-slate-900 border rounded-xl overflow-hidden transition-all flex flex-col ${
            selfieImage
              ? "border-emerald-500/50 ring-1 ring-emerald-500/20"
              : dragActiveSelfie
              ? "border-sky-500 bg-sky-950/20"
              : "border-slate-800 hover:border-slate-700"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActiveSelfie(true);
          }}
          onDragLeave={() => setDragActiveSelfie(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActiveSelfie(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0], "face");
          }}
        >
          <div className="p-4 border-b border-slate-800 bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                2. Live Applicant Face (1:1 Biometrics)
              </span>
            </div>
            {selfieImage ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-medium flex items-center gap-1 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Face Captured
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">Optional / Recommended</span>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col items-center justify-center">
            {selfieImage ? (
              <div className="relative w-48 h-48 bg-slate-950 rounded-full overflow-hidden border-2 border-emerald-500/60 flex items-center justify-center group shadow-md">
                <img
                  src={selfieImage}
                  alt="Applicant Face Selfie"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <button
                    id="selfie-retake-btn"
                    onClick={() => setCameraModalMode("face")}
                    className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md shadow flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" /> Retake
                  </button>
                  <button
                    id="selfie-replace-btn"
                    onClick={() => selfieFileInputRef.current?.click()}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-md shadow flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full py-8 border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl flex flex-col items-center justify-center text-center p-6 transition-colors">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">
                  Live Biometric Face Capture
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mb-4">
                  Enables 1:1 facial landmark comparison against the document portrait to prevent lookalike impostors.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    id="open-selfie-camera-btn"
                    onClick={() => setCameraModalMode("face")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Capture Live Selfie
                  </button>
                  <button
                    id="upload-selfie-file-btn"
                    onClick={() => selfieFileInputRef.current?.click()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo
                  </button>
                </div>
              </div>
            )}
            <input
              ref={selfieFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0], "face");
              }}
            />

            {/* Applicant Biometric Consent Affirmation */}
            <div className="mt-4 w-full bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 flex items-start space-x-2.5">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => onToggleConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
              />
              <label htmlFor="consent-checkbox" className="text-[11px] text-slate-300 leading-relaxed cursor-pointer select-none">
                <span className="font-semibold text-white">Informed Applicant Biometric Consent:</span> The applicant confirms consent for 1:1 facial biometric matching strictly for verification against this identity document in accordance with identity verification standards.
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            Inspection engine executes: Image Quality Check &rarr; OCR &amp; VIZ Extraction &rarr; MRZ Parity &rarr; Document Forensics &rarr; 1:1 Biometrics &rarr; Explainable Risk Fusion.
          </span>
        </div>

        <button
          id="run-screening-submit-btn"
          onClick={onRunScreening}
          disabled={!documentImage || isAnalyzing}
          className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
              <span>Analyzing Document &amp; Biometrics...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-sky-300" />
              <span>Run Identity &amp; Document Screening</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Camera Capture Modal */}
      {cameraModalMode && (
        <CameraCaptureModal
          isOpen={!!cameraModalMode}
          mode={cameraModalMode}
          onClose={() => setCameraModalMode(null)}
          onCapture={(dataUrl) => {
            if (cameraModalMode === "document") onSetDocumentImage(dataUrl);
            else onSetSelfieImage(dataUrl);
            setCameraModalMode(null);
          }}
        />
      )}
    </div>
  );
};
