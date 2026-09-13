import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { WorkflowProgress } from "./components/WorkflowProgress";
import { CaptureStep } from "./components/CaptureStep";
import { AnalysisOverview } from "./components/AnalysisOverview";
import { WhyThisResultModal } from "./components/WhyThisResultModal";
import { OfficerDecisionModal } from "./components/OfficerDecisionModal";
import { AuditTrailView } from "./components/AuditTrailView";
import { WorkflowStage, ScreeningSession, OfficerDecision } from "./types";
import { INTERNAL_TEST_SCENARIOS } from "./data/testScenarios";

export default function App() {
  // Navigation & View State
  const [activeView, setActiveView] = useState<"screening" | "audit">("screening");
  const [currentStage, setCurrentStage] = useState<WorkflowStage>("CAPTURE");

  // Ingestion State
  const [documentImage, setDocumentImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [applicantConsent, setApplicantConsent] = useState<boolean>(true);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Analysis & Session State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSession, setCurrentSession] = useState<ScreeningSession | null>(null);
  const [auditSessions, setAuditSessions] = useState<ScreeningSession[]>(() => {
    try {
      const saved = localStorage.getItem("idguard_audit_trail");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not parse saved audit trail:", e);
    }
    return [];
  });

  // Modals
  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  // Sync audit sessions to local storage
  useEffect(() => {
    try {
      localStorage.setItem("idguard_audit_trail", JSON.stringify(auditSessions));
    } catch (e) {
      console.warn("Failed to persist audit trail:", e);
    }
  }, [auditSessions]);

  // Handle Loading of Internal Test Scenarios
  const handleLoadScenario = (scenarioId: string) => {
    const scenario = INTERNAL_TEST_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setActiveScenarioId(scenario.id);
    setDocumentImage(scenario.documentImage);
    setSelfieImage(scenario.selfieImage || null);
    setCurrentSession(null);
    setCurrentStage("CAPTURE");
    setActiveView("screening");
  };

  // Execute Screening Pipeline
  const handleRunScreening = async () => {
    if (!documentImage) return;

    setIsAnalyzing(true);
    setCurrentStage("IMAGE_QUALITY");

    try {
      const response = await fetch("/api/screen-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentImage,
          selfieImage: selfieImage || undefined,
          consentGranted: applicantConsent,
          scenarioId: activeScenarioId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Screening request failed with status ${response.status}`);
      }

      const sessionData: ScreeningSession = await response.json();
      setCurrentSession(sessionData);

      // Advance stage to Risk Fusion
      if (sessionData.quality.insufficientEvidence) {
        setCurrentStage("IMAGE_QUALITY");
      } else {
        setCurrentStage("RISK_FUSION");
      }

      // Add to audit sessions
      setAuditSessions((prev) => {
        const filtered = prev.filter((s) => s.screeningId !== sessionData.screeningId);
        return [sessionData, ...filtered];
      });
    } catch (err: any) {
      console.error("Screening execution error:", err);
      alert("Screening could not be completed. Please check your network connection or image format.");
      setCurrentStage("CAPTURE");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset current screening session
  const handleReset = () => {
    setDocumentImage(null);
    setSelfieImage(null);
    setActiveScenarioId(null);
    setCurrentSession(null);
    setCurrentStage("CAPTURE");
  };

  // Request Recapture
  const handleRequestRecapture = () => {
    setDocumentImage(null);
    setCurrentSession(null);
    setCurrentStage("CAPTURE");
  };

  // Save Officer Decision
  const handleSaveDecision = (decision: OfficerDecision) => {
    if (!currentSession) return;

    const updatedSession: ScreeningSession = {
      ...currentSession,
      decision,
    };

    setCurrentSession(updatedSession);
    setCurrentStage("OFFICER_DECISION");

    // Update in audit records
    setAuditSessions((prev) =>
      prev.map((s) => (s.screeningId === updatedSession.screeningId ? updatedSession : s))
    );
  };

  // Select a historical audit session to review
  const handleSelectAuditSession = (session: ScreeningSession) => {
    setCurrentSession(session);
    setDocumentImage(session.documentImage);
    setSelfieImage(session.selfieImage || null);
    setCurrentStage(session.decision ? "OFFICER_DECISION" : "RISK_FUSION");
    setActiveView("screening");
  };

  // Compute status badges for workflow stepper
  const computeWorkflowStatuses = () => {
    if (!currentSession) {
      return {
        capture: documentImage ? ("complete" as const) : ("current" as const),
        quality: "pending" as const,
        ocr: "pending" as const,
        mrz: "pending" as const,
        forensics: "pending" as const,
        face: "pending" as const,
        risk: "pending" as const,
        decision: "pending" as const,
      };
    }

    const { quality, ocr, mrz, forensics, face, risk, decision } = currentSession;

    return {
      capture: "complete" as const,
      quality: quality.insufficientEvidence
        ? ("recapture" as const)
        : quality.qualityStatus === "PASS"
        ? ("pass" as const)
        : ("marginal" as const),
      ocr: ocr.isExpired ? ("flag" as const) : ("pass" as const),
      mrz: mrz.mrzVizConsistent ? ("pass" as const) : ("flag" as const),
      forensics: forensics.tamperRiskScore > 40 ? ("flag" as const) : ("pass" as const),
      face: face.similarityScore >= 70 ? ("pass" as const) : ("flag" as const),
      risk:
        risk.overallRiskTier === "LOW_RISK"
          ? ("low" as const)
          : risk.overallRiskTier === "REVIEW_REQUIRED"
          ? ("review" as const)
          : risk.overallRiskTier === "RECAPTURE_REQUIRED"
          ? ("recapture" as const)
          : ("high" as const),
      decision: decision ? ("complete" as const) : ("pending" as const),
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* 1. Header */}
      <Header
        currentStage={currentStage}
        onReset={handleReset}
        onSelectScenario={handleLoadScenario}
        activeView={activeView}
        onToggleView={setActiveView}
        auditCount={auditSessions.length}
      />

      {/* 2. Stepper Progress Pipeline */}
      {activeView === "screening" && (
        <WorkflowProgress
          currentStage={currentStage}
          stageStatuses={computeWorkflowStatuses()}
          onSelectStage={(stage) => setCurrentStage(stage)}
        />
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === "audit" ? (
          <AuditTrailView
            sessions={auditSessions}
            onSelectSession={handleSelectAuditSession}
            onNewScreening={() => {
              handleReset();
              setActiveView("screening");
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* If no active screening session analyzed yet, show Capture stage */}
            {!currentSession ? (
              <CaptureStep
                documentImage={documentImage}
                selfieImage={selfieImage}
                consentGranted={applicantConsent}
                onSetDocumentImage={(img) => {
                  setDocumentImage(img);
                  setActiveScenarioId(null);
                }}
                onSetSelfieImage={setSelfieImage}
                onToggleConsent={setApplicantConsent}
                onRunScreening={handleRunScreening}
                onLoadScenario={handleLoadScenario}
                isAnalyzing={isAnalyzing}
              />
            ) : (
              /* If session analyzed, show multi-layer Analysis Overview */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-medium">Inspecting Reference:</span>
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {currentSession.screeningId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleReset}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      New Screening
                    </button>
                  </div>
                </div>

                <AnalysisOverview
                  session={currentSession}
                  onOpenWhyThisResult={() => setWhyModalOpen(true)}
                  onOpenOfficerDecision={() => setDecisionModalOpen(true)}
                  onRequestRecapture={handleRequestRecapture}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>IDGuard AI • AI-Assisted Identity &amp; Document Screening</span>
          <span className="font-mono">ICAO Doc 9303 Compliant • NIST Biometric 1:1 Reference Standard</span>
        </div>
      </footer>

      {/* 5. Explainable "WHY THIS RESULT?" Modal */}
      {currentSession && (
        <WhyThisResultModal
          isOpen={whyModalOpen}
          onClose={() => setWhyModalOpen(false)}
          risk={currentSession.risk}
          mrz={currentSession.mrz}
          forensics={currentSession.forensics}
          face={currentSession.face}
          ocr={currentSession.ocr}
          onOpenOfficerDecision={() => setDecisionModalOpen(true)}
        />
      )}

      {/* 6. Officer Decision Modal */}
      {currentSession && (
        <OfficerDecisionModal
          isOpen={decisionModalOpen}
          onClose={() => setDecisionModalOpen(false)}
          onSaveDecision={handleSaveDecision}
          suggestedAction={currentSession.risk.whyThisResult.recommendedOfficerAction}
        />
      )}
    </div>
  );
}
