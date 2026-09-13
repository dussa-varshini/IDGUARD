import React, { useState } from "react";
import { Gavel, CheckCircle2, AlertTriangle, XCircle, RefreshCw, X, ShieldCheck } from "lucide-react";
import { OfficerDecision } from "../types";

interface OfficerDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDecision: (decision: OfficerDecision) => void;
  suggestedAction?: string;
  defaultBadgeId?: string;
}

export const OfficerDecisionModal: React.FC<OfficerDecisionModalProps> = ({
  isOpen,
  onClose,
  onSaveDecision,
  suggestedAction,
  defaultBadgeId = "OFFICER-4892",
}) => {
  const [decision, setDecision] = useState<
    "APPROVE" | "SECONDARY_INSPECTION" | "REJECT" | "REQUEST_RECAPTURE"
  >("APPROVE");
  const [badgeId, setBadgeId] = useState(defaultBadgeId);
  const [officerName, setOfficerName] = useState("Screening Officer");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDecision({
      decision,
      officerBadgeId: badgeId.trim() || "OFFICER-DEFAULT",
      officerName: officerName.trim() || "Screening Officer",
      notes: notes.trim(),
      decidedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Officer Determination</h3>
              <p className="text-xs text-slate-400">Official binding screening decision and rationale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {suggestedAction && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">System Recommendation: </span>
                <span>{suggestedAction}</span>
              </div>
            </div>
          )}

          {/* Decision Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Screening Determination
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDecision("APPROVE")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  decision === "APPROVE"
                    ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/30 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400">APPROVE</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[11px] text-slate-400">Clear applicant &amp; document</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision("SECONDARY_INSPECTION")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  decision === "SECONDARY_INSPECTION"
                    ? "bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/30 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400">SECONDARY</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <span className="text-[11px] text-slate-400">Refer for physical examination</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision("REJECT")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  decision === "REJECT"
                    ? "bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/30 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-rose-400">REJECT</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <span className="text-[11px] text-slate-400">Deny entry / forged credential</span>
              </button>

              <button
                type="button"
                onClick={() => setDecision("REQUEST_RECAPTURE")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  decision === "REQUEST_RECAPTURE"
                    ? "bg-orange-950/40 border-orange-500 ring-1 ring-orange-500/30 text-white"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-orange-400">RECAPTURE</span>
                  <RefreshCw className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-[11px] text-slate-400">Insufficient optical evidence</span>
              </button>
            </div>
          </div>

          {/* Officer Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Officer ID / Badge</label>
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. OFFICER-4892"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Officer Name</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="e.g. Officer J. Miller"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Inspection Notes &amp; Justification
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Enter rationale for officer determination, physical observation notes, or referral instructions..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Commit Determination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
