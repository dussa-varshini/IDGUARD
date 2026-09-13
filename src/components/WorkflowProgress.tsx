import React from "react";
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Binary,
  Fingerprint,
  UserCheck,
  Scale,
  Gavel,
  History,
  XCircle,
} from "lucide-react";
import { WorkflowStage } from "../types";

interface WorkflowProgressProps {
  currentStage: WorkflowStage;
  stageStatuses: {
    capture: "complete" | "current" | "pending";
    quality: "pass" | "marginal" | "fail" | "pending" | "recapture";
    ocr: "pass" | "flag" | "fail" | "pending";
    mrz: "pass" | "flag" | "pending";
    forensics: "pass" | "flag" | "pending";
    face: "pass" | "flag" | "pending";
    risk: "low" | "review" | "high" | "recapture" | "pending";
    decision: "complete" | "pending";
  };
  onSelectStage?: (stage: WorkflowStage) => void;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({
  currentStage,
  stageStatuses,
  onSelectStage,
}) => {
  const stages = [
    {
      id: "CAPTURE" as WorkflowStage,
      label: "Capture / Upload",
      icon: Camera,
      status: stageStatuses.capture,
    },
    {
      id: "IMAGE_QUALITY" as WorkflowStage,
      label: "Image Quality",
      icon: CheckCircle2,
      status: stageStatuses.quality,
    },
    {
      id: "OCR_EXTRACTION" as WorkflowStage,
      label: "OCR & Fields",
      icon: FileSearch,
      status: stageStatuses.ocr,
    },
    {
      id: "MRZ_CONSISTENCY" as WorkflowStage,
      label: "MRZ & Parity",
      icon: Binary,
      status: stageStatuses.mrz,
    },
    {
      id: "DOCUMENT_FORENSICS" as WorkflowStage,
      label: "Forensics",
      icon: Fingerprint,
      status: stageStatuses.forensics,
    },
    {
      id: "FACE_VERIFICATION" as WorkflowStage,
      label: "1:1 Face Match",
      icon: UserCheck,
      status: stageStatuses.face,
    },
    {
      id: "RISK_FUSION" as WorkflowStage,
      label: "Risk Fusion",
      icon: Scale,
      status: stageStatuses.risk,
    },
    {
      id: "OFFICER_DECISION" as WorkflowStage,
      label: "Officer Decision",
      icon: Gavel,
      status: stageStatuses.decision,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pass":
      case "complete":
      case "low":
        return <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />;
      case "marginal":
      case "review":
      case "flag":
        return <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />;
      case "fail":
      case "recapture":
      case "high":
        return <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-slate-600" />;
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[860px] space-x-1">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCurrent = currentStage === stage.id;
            const isClickable = stage.status !== "pending";

            return (
              <React.Fragment key={stage.id}>
                <button
                  id={`workflow-step-${stage.id.toLowerCase()}`}
                  onClick={() => onSelectStage && isClickable && onSelectStage(stage.id)}
                  disabled={!isClickable}
                  className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg text-left transition-all ${
                    isCurrent
                      ? "bg-slate-800 text-sky-400 ring-1 ring-sky-500/40 font-semibold shadow-inner"
                      : isClickable
                      ? "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      : "text-slate-500 cursor-default opacity-60"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${isCurrent ? "text-sky-400" : "text-current"}`} />
                    <span className="absolute -top-1 -right-1.5">
                      {getStatusBadge(stage.status)}
                    </span>
                  </div>
                  <div className="leading-none">
                    <div className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                      Step 0{idx + 1}
                    </div>
                    <div className="text-xs font-medium whitespace-nowrap mt-0.5">
                      {stage.label}
                    </div>
                  </div>
                </button>

                {idx < stages.length - 1 && (
                  <div className="h-0.5 w-3 bg-slate-800 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
