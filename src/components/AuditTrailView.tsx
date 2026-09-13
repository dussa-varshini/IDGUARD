import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Eye,
} from "lucide-react";
import { ScreeningSession } from "../types";

interface AuditTrailViewProps {
  sessions: ScreeningSession[];
  onSelectSession: (session: ScreeningSession) => void;
  onNewScreening: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  sessions,
  onSelectSession,
  onNewScreening,
}) => {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter((s) => {
    // Filter by decision
    if (filter === "APPROVED" && s.decision?.decision !== "APPROVE") return false;
    if (filter === "SECONDARY" && s.decision?.decision !== "SECONDARY_INSPECTION") return false;
    if (filter === "REJECTED" && s.decision?.decision !== "REJECT") return false;
    if (filter === "RECAPTURE" && s.risk.overallRiskTier !== "RECAPTURE_REQUIRED" && s.decision?.decision !== "REQUEST_RECAPTURE") return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = s.screeningId.toLowerCase().includes(q);
      const matchName = `${s.ocr.givenNames} ${s.ocr.surname}`.toLowerCase().includes(q);
      const matchDoc = s.ocr.documentNumber.toLowerCase().includes(q);
      return matchId || matchName || matchDoc;
    }
    return true;
  });

  const getStatusBadge = (session: ScreeningSession) => {
    if (session.decision) {
      switch (session.decision.decision) {
        case "APPROVE":
          return (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
              APPROVED
            </span>
          );
        case "SECONDARY_INSPECTION":
          return (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
              SECONDARY
            </span>
          );
        case "REJECT":
          return (
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
              REJECTED
            </span>
          );
        case "REQUEST_RECAPTURE":
          return (
            <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
              RECAPTURE
            </span>
          );
      }
    }

    if (session.risk.overallRiskTier === "RECAPTURE_REQUIRED") {
      return (
        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded text-[11px] font-bold">
          RECAPTURE REQ.
        </span>
      );
    }

    return (
      <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium">
        PENDING DECISION
      </span>
    );
  };

  const exportAuditCsv = () => {
    if (sessions.length === 0) return;
    const headers = [
      "Screening ID",
      "Timestamp",
      "Document Type",
      "Document Number",
      "Subject Name",
      "Risk Tier",
      "Composite Score",
      "MRZ Parity",
      "Face Match %",
      "Officer Decision",
      "Officer Badge",
    ];

    const rows = sessions.map((s) => [
      s.screeningId,
      s.timestamp,
      s.ocr.documentType,
      s.ocr.documentNumber,
      `"${s.ocr.givenNames} ${s.ocr.surname}"`,
      s.risk.overallRiskTier,
      s.risk.compositeRiskScore,
      s.mrz.mrzVizConsistent ? "PARITY_OK" : "DISCREPANCY",
      s.face.similarityScore,
      s.decision?.decision || "PENDING",
      s.decision?.officerBadgeId || "N/A",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `idguard-audit-trail-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            Compliance Inspection Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable session ledger of all document evaluations, forensic indicators, and recorded determinations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={exportAuditCsv}
            disabled={sessions.length === 0}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={onNewScreening}
            className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            New Inspection
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, Name, or Doc #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "ALL", label: "All Records" },
            { id: "APPROVED", label: "Approved" },
            { id: "SECONDARY", label: "Secondary" },
            { id: "REJECTED", label: "Rejected" },
            { id: "RECAPTURE", label: "Recapture" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredSessions.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-medium text-slate-400">No screening records match your filter.</p>
            <p className="text-xs text-slate-500 mt-1">Execute an identity document screening to populate the audit log.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 border-b border-slate-800 text-[11px] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Subject &amp; Document</th>
                  <th className="py-3 px-4">MRZ Parity</th>
                  <th className="py-3 px-4">1:1 Face Match</th>
                  <th className="py-3 px-4">Risk Tier</th>
                  <th className="py-3 px-4">Determination</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 font-medium">
                {filteredSessions.map((session) => (
                  <tr
                    key={session.screeningId}
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => onSelectSession(session)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">
                      {session.screeningId}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(session.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-semibold">
                        {session.ocr.givenNames} {session.ocr.surname}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {session.ocr.documentType} • {session.ocr.documentNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {session.mrz.mrzVizConsistent ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Parity Valid
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Mismatch
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {session.face.liveFaceCaptured ? (
                        <span
                          className={
                            session.face.similarityScore >= 70
                              ? "text-emerald-400"
                              : "text-rose-400 font-bold"
                          }
                        >
                          {session.face.similarityScore}%
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">No Selfie</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-white font-bold">
                        {session.risk.compositeRiskScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(session)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(session);
                        }}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
                        title="View Full Inspection Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
