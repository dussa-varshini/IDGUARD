import React from "react";
import { Shield, Sparkles, Plus, FileText, CheckCircle2, AlertTriangle, Layers } from "lucide-react";
import { INTERNAL_TEST_SCENARIOS } from "../data/testScenarios";

interface HeaderProps {
  currentStage: string;
  onReset: () => void;
  onSelectScenario: (scenarioId: string) => void;
  activeView: "screening" | "audit";
  onToggleView: (view: "screening" | "audit") => void;
  auditCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  onReset,
  onSelectScenario,
  activeView,
  onToggleView,
  auditCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { onToggleView("screening"); }}>
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Shield className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">IDGuard AI</span>
                <span className="text-xs bg-sky-500/20 text-sky-300 font-medium px-2 py-0.5 rounded border border-sky-400/30">
                  v3.8 Production
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                AI-Assisted Identity &amp; Document Screening
              </p>
            </div>
          </div>

          {/* Center: Test Benchmark Profiles (Internal Testing) */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
            <span className="text-xs text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> Benchmark Profiles:
            </span>
            <select
              id="test-scenario-selector"
              onChange={(e) => {
                if (e.target.value) {
                  onSelectScenario(e.target.value);
                  e.target.value = "";
                }
              }}
              defaultValue=""
              className="bg-slate-900 text-xs text-slate-200 border border-slate-700 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="" disabled>
                Select Benchmark Scenario...
              </option>
              {INTERNAL_TEST_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name} ({scenario.category})
                </option>
              ))}
            </select>
          </div>

          {/* Right Navigation & Operational Controls */}
          <div className="flex items-center space-x-2.5">
            <button
              id="view-toggle-screening-btn"
              onClick={() => onToggleView("screening")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeView === "screening"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Screening Console</span>
            </button>

            <button
              id="view-toggle-audit-btn"
              onClick={() => onToggleView("audit")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeView === "audit"
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
              {auditCount > 0 && (
                <span className="ml-1 bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.2 rounded-full">
                  {auditCount}
                </span>
              )}
            </button>

            <button
              id="new-screening-reset-btn"
              onClick={onReset}
              title="Start a new identity screening session"
              className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-md shadow-sm transition-all flex items-center gap-1.5 border border-sky-400/40 hover:border-sky-300 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Screening</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
