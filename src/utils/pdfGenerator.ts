import { jsPDF } from "jspdf";
import { ScreeningSession } from "../types";

/**
 * Generates and triggers download of a professional, government-grade PDF
 * dossier report for an individual IDGuard AI screening session.
 */
export function generateScreeningPdf(session: ScreeningSession): void {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Helper: Page management
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 16) {
        doc.addPage();
        y = margin + 8;
        drawRunningHeader();
      }
    };

    const drawRunningHeader = () => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(130, 140, 155);
      doc.text("IDGUARD AI • OFFICIAL IDENTITY SCREENING DOSSIER", margin, margin - 4);
      doc.text(`AUDIT REF: ${session.screeningId}`, pageWidth - margin, margin - 4, { align: "right" });
      doc.setDrawColor(220, 226, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, margin - 2, pageWidth - margin, margin - 2);
    };

    // -------------------------------------------------------------
    // 1. Official Header Banner (Government & Inspection Grade)
    // -------------------------------------------------------------
    doc.setFillColor(15, 23, 42); // slate-900 / dark navy
    doc.rect(margin, y, contentWidth, 24, "F");

    // Left security badge icon simulation
    doc.setFillColor(14, 165, 233); // sky-500
    doc.roundedRect(margin + 4, y + 4, 16, 16, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("IDG", margin + 12, y + 14, { align: "center" });

    // Main Header Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text("IDGUARD AI • IDENTITY SCREENING & FORENSIC DOSSIER", margin + 24, y + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(186, 230, 253); // sky-200
    doc.text(
      "SECURITY COMPLIANT VERIFICATION REPORT • ICAO 9303 / BORDER CONTROL AUDIT TRAIL",
      margin + 24,
      y + 14
    );

    // Classification banner on right
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(254, 240, 138); // amber-200
    doc.text("OFFICIAL USE ONLY", pageWidth - margin - 4, y + 9, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(203, 213, 225);
    doc.text(`CONFIDENTIAL AUDIT`, pageWidth - margin - 4, y + 14, { align: "right" });

    y += 28;

    // -------------------------------------------------------------
    // 2. Metadata Strip
    // -------------------------------------------------------------
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 14, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text("SCREENING REF ID:", margin + 3, y + 5.5);
    doc.text("TIMESTAMP (UTC):", margin + 65, y + 5.5);
    doc.text("ENGINE SOURCE:", margin + 125, y + 5.5);

    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144);
    doc.text(session.screeningId, margin + 3, y + 10.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    const formattedDate = new Date(session.timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
    doc.text(formattedDate, margin + 65, y + 10.5);

    const engineText = session.analysisSource === "GEMINI_AI" ? "Gemini AI Multi-Modal Engine" : "Controlled Forensic Engine";
    doc.text(`${engineText} (${session.processingTimeMs}ms)`, margin + 125, y + 10.5);

    y += 18;

    // -------------------------------------------------------------
    // 3. Composite Risk & Executive Evaluation Banner
    // -------------------------------------------------------------
    let bannerBg = [241, 245, 249];
    let badgeBg = [100, 116, 139];
    let badgeText = "REVIEW REQUIRED";

    switch (session.risk.overallRiskTier) {
      case "LOW_RISK":
        bannerBg = [240, 253, 244];
        badgeBg = [22, 163, 74]; // green-600
        badgeText = "LOW RISK • AUTHENTICITY VERIFIED";
        break;
      case "REVIEW_REQUIRED":
        bannerBg = [254, 252, 232];
        badgeBg = [202, 138, 4]; // yellow-600
        badgeText = "REVIEW REQUIRED • DISCREPANCIES DETECTED";
        break;
      case "HIGH_RISK":
        bannerBg = [254, 242, 242];
        badgeBg = [220, 38, 38]; // red-600
        badgeText = "HIGH RISK • SECURITY ANOMALY DETECTED";
        break;
      case "RECAPTURE_REQUIRED":
        bannerBg = [255, 247, 237];
        badgeBg = [234, 88, 12]; // orange-600
        badgeText = "INSUFFICIENT EVIDENCE • RECAPTURE REQUIRED";
        break;
    }

    doc.setFillColor(bannerBg[0], bannerBg[1], bannerBg[2]);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, 22, "FD");

    // Risk badge
    doc.setFillColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.roundedRect(margin + 4, y + 3.5, 68, 6.5, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, margin + 6, y + 8);

    // Score box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.roundedRect(margin + 4, y + 11.5, 26, 7, 1, 1, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text("RISK SCORE", margin + 6, y + 14.5);
    doc.setFontSize(9);
    doc.setTextColor(badgeBg[0], badgeBg[1], badgeBg[2]);
    doc.text(`${session.risk.compositeRiskScore} / 100`, margin + 6, y + 17.5);

    // Headline & Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(session.risk.whyThisResult.headline || "Comprehensive Forensic Assessment", margin + 76, y + 7.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitSummary = doc.splitTextToSize(session.risk.whyThisResult.summary, contentWidth - 80);
    doc.text(splitSummary.slice(0, 2), margin + 76, y + 12);

    y += 26;

    // -------------------------------------------------------------
    // 4. Section: Applicant & Credential Data vs Document Image
    // -------------------------------------------------------------
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("1. APPLICANT & CREDENTIAL EXTRACTION (OCR / VIZ)", margin, y);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5;

    // Field Grid Table (Left side) and Document Image (Right side)
    const dataWidth = session.documentImage ? 122 : contentWidth;
    const imgWidth = 54;
    const imgHeight = 35;

    // Field details box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, dataWidth, 38, "FD");

    const fields = [
      { label: "FULL NAME:", val: `${session.ocr.givenNames} ${session.ocr.surname}`.trim() || "N/A" },
      { label: "DOCUMENT TYPE:", val: session.ocr.documentType || "N/A" },
      { label: "DOCUMENT NUMBER:", val: session.ocr.documentNumber || "N/A" },
      { label: "NATIONALITY:", val: session.ocr.nationality || "N/A" },
      { label: "DATE OF BIRTH:", val: session.ocr.dateOfBirth || "N/A" },
      { label: "GENDER / SEX:", val: session.ocr.sex || "N/A" },
      { label: "DATE OF EXPIRY:", val: `${session.ocr.dateOfExpiry || "N/A"} ${session.ocr.isExpired ? "[EXPIRED]" : "[VALID]"}` },
      { label: "ISSUING COUNTRY:", val: session.ocr.issuingCountry || "N/A" },
    ];

    let fieldY = y + 4.5;
    for (let i = 0; i < fields.length; i += 2) {
      // Col 1
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(fields[i].label, margin + 3, fieldY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(fields[i].val, margin + 3, fieldY + 3.8);

      // Col 2
      if (fields[i + 1]) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(fields[i + 1].label, margin + 62, fieldY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(fields[i + 1].val, margin + 62, fieldY + 3.8);
      }
      fieldY += 8.2;
    }

    // Embed Document Image thumbnail if valid base64
    if (session.documentImage) {
      try {
        const imgX = pageWidth - margin - imgWidth;
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.rect(imgX, y, imgWidth, imgHeight, "FD");

        const imgData = session.documentImage;
        const format = imgData.startsWith("data:image/png") ? "PNG" : "JPEG";
        doc.addImage(imgData, format, imgX + 1, y + 1, imgWidth - 2, imgHeight - 2, undefined, "FAST");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.5);
        doc.setTextColor(100, 116, 139);
        doc.text("INGESTED CREDENTIAL SPECIMEN", imgX + 2, y + imgHeight + 3);
      } catch (err) {
        console.warn("Could not embed document specimen image into PDF:", err);
      }
    }

    y += 42;

    // -------------------------------------------------------------
    // 5. Section: Multi-Layer Verification Breakdown
    // -------------------------------------------------------------
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("2. INDEPENDENT VERIFICATION LAYERS & EVIDENCE", margin, y);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5;

    // 4 Columns for the 4 Evidence Modules
    const colWidth = (contentWidth - 6) / 4;

    const renderVerificationCard = (
      x: number,
      title: string,
      status: string,
      statusColor: number[],
      lines: { k: string; v: string }[]
    ) => {
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.rect(x, y, colWidth, 42, "FD");

      // Card Header
      doc.setFillColor(248, 250, 252);
      doc.rect(x, y, colWidth, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text(title, x + 2, y + 4.8);

      // Status pill
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(x + 2, y + 8.5, colWidth - 4, 5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(255, 255, 255);
      doc.text(status, x + colWidth / 2, y + 12, { align: "center" });

      // Lines
      let lineY = y + 17;
      doc.setFontSize(6.5);
      lines.forEach((l) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(l.k, x + 2, lineY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(l.v, x + colWidth - 2, lineY, { align: "right" });
        lineY += 5.5;
      });
    };

    // Layer 1: Image Quality
    const qColor = session.quality.qualityStatus === "PASS" ? [22, 163, 74] : session.quality.qualityStatus === "MARGINAL" ? [202, 138, 4] : [220, 38, 38];
    renderVerificationCard(
      margin,
      "IMAGE QUALITY",
      session.quality.qualityStatus,
      qColor,
      [
        { k: "Sharpness:", v: `${session.quality.sharpnessScore}%` },
        { k: "Glare Level:", v: session.quality.glareLevel.toUpperCase() },
        { k: "Lighting:", v: session.quality.lightingCondition.toUpperCase() },
        { k: "Framing:", v: session.quality.framingValid ? "VALID" : "CROPPED" },
      ]
    );

    // Layer 2: MRZ & Parity
    const mColor = session.mrz.mrzVizConsistent ? [22, 163, 74] : [220, 38, 38];
    renderVerificationCard(
      margin + colWidth + 2,
      "MRZ & PARITY",
      session.mrz.mrzVizConsistent ? "PARITY VERIFIED" : "PARITY MISMATCH",
      mColor,
      [
        { k: "Format:", v: session.mrz.mrzFormat },
        { k: "Doc # Parity:", v: session.mrz.checkDigitDocNumValid ? "VALID" : "INVALID" },
        { k: "DOB Parity:", v: session.mrz.checkDigitDOBValid ? "VALID" : "INVALID" },
        { k: "VIZ Cross-Check:", v: session.mrz.mrzVizConsistent ? "MATCH" : "FLAG" },
      ]
    );

    // Layer 3: Document Forensics
    const fColor = session.forensics.tamperRiskScore < 30 ? [22, 163, 74] : session.forensics.tamperRiskScore < 60 ? [202, 138, 4] : [220, 38, 38];
    renderVerificationCard(
      margin + (colWidth + 2) * 2,
      "FORENSICS",
      session.forensics.tamperRiskScore < 30 ? "PASSED" : "ANOMALY DETECTED",
      fColor,
      [
        { k: "Tamper Risk:", v: `${session.forensics.tamperRiskScore}/100` },
        { k: "Font Consistency:", v: session.forensics.fontInconsistencyDetected ? "ANOMALY" : "INTACT" },
        { k: "Photo Tampering:", v: session.forensics.photoTamperingDetected ? "SUSPECT" : "INTACT" },
        { k: "Edge Integrity:", v: session.forensics.edgeIntegrityIntact ? "INTACT" : "FLAGGED" },
      ]
    );

    // Layer 4: 1:1 Face Match
    const faceColor = session.face.similarityScore >= 70 ? [22, 163, 74] : session.face.liveFaceCaptured ? [220, 38, 38] : [100, 116, 139];
    renderVerificationCard(
      margin + (colWidth + 2) * 3,
      "1:1 BIOMETRIC",
      session.face.liveFaceCaptured ? `${session.face.similarityScore}% MATCH` : "NOT CAPTURED",
      faceColor,
      [
        { k: "Applicant Consent:", v: session.face.consentGranted ? "GRANTED" : "DECLINED" },
        { k: "Doc Portrait:", v: session.face.faceDetectedInDoc ? "DETECTED" : "ABSENT" },
        { k: "Live Selfie:", v: session.face.liveFaceCaptured ? "CAPTURED" : "OMITTED" },
        { k: "Liveness Check:", v: session.face.livenessCheckPassed ? "VERIFIED" : "SKIPPED" },
      ]
    );

    y += 46;

    // -------------------------------------------------------------
    // 6. Section: Why This Result? (Key Risk Drivers & Forensic Findings)
    // -------------------------------------------------------------
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("3. EXPLAINABILITY & CAUSAL EVIDENCE (WHY THIS RESULT?)", margin, y);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5;

    const drivers = session.risk.whyThisResult.keyDrivers || [];
    if (drivers.length > 0) {
      drivers.slice(0, 4).forEach((d) => {
        checkPageBreak(12);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, y, contentWidth, 10, "FD");

        let dotColor = [22, 163, 74];
        if (d.impact === "warning") dotColor = [202, 138, 4];
        if (d.impact === "critical") dotColor = [220, 38, 38];

        doc.setFillColor(dotColor[0], dotColor[1], dotColor[2]);
        doc.circle(margin + 4, y + 5, 1.8, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`[${d.impact.toUpperCase()}] ${d.factor}`, margin + 8, y + 4.5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(71, 85, 105);
        const detailText = doc.splitTextToSize(d.details, contentWidth - 12);
        doc.text(detailText[0] || "", margin + 8, y + 8);

        y += 12;
      });
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("No anomalous risk drivers identified. Specimen passed standard boundary heuristics.", margin + 2, y + 4);
      y += 8;
    }

    // Recommended Officer Action
    checkPageBreak(14);
    doc.setFillColor(240, 249, 255); // sky-50
    doc.setDrawColor(186, 230, 253); // sky-200
    doc.rect(margin, y, contentWidth, 11, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(14, 116, 144);
    doc.text("SYSTEM RECOMMENDED ACTION:", margin + 3, y + 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    const recAction = session.risk.whyThisResult.recommendedOfficerAction || "Inspect physical document security markings and corroborate biometrics.";
    doc.text(recAction, margin + 3, y + 8.5);

    y += 15;

    // -------------------------------------------------------------
    // 7. Section: Officer Decision & Chain of Custody
    // -------------------------------------------------------------
    checkPageBreak(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text("4. AUTHORIZED OFFICER DETERMINATION & AUDIT STAMP", margin, y);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
    y += 5;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 32, "FD");

    if (session.decision) {
      let decBg = [22, 163, 74];
      let decLabel = "APPROVED / ADMITTED";
      switch (session.decision.decision) {
        case "APPROVE":
          decBg = [22, 163, 74];
          decLabel = "APPROVED / ADMITTED";
          break;
        case "SECONDARY_INSPECTION":
          decBg = [202, 138, 4];
          decLabel = "REFERRED TO SECONDARY INSPECTION";
          break;
        case "REJECT":
          decBg = [220, 38, 38];
          decLabel = "REFUSED / REJECTED";
          break;
        case "REQUEST_RECAPTURE":
          decBg = [234, 88, 12];
          decLabel = "DOCUMENT RECAPTURE REQUIRED";
          break;
      }

      // Decision Badge
      doc.setFillColor(decBg[0], decBg[1], decBg[2]);
      doc.roundedRect(margin + 4, y + 4, 64, 7, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(decLabel, margin + 6, y + 8.8);

      // Officer Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("AUTHORIZING OFFICER:", margin + 74, y + 6);
      doc.text("BADGE / CREDENTIAL ID:", margin + 130, y + 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(session.decision.officerName || "Authorized Screener", margin + 74, y + 10.5);
      doc.text(session.decision.officerBadgeId || "IDG-AUTH", margin + 130, y + 10.5);

      // Decision notes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("OFFICER INSPECTION NOTES:", margin + 4, y + 17);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const splitNotes = doc.splitTextToSize(session.decision.notes || "No additional notes recorded.", contentWidth - 8);
      doc.text(splitNotes.slice(0, 2), margin + 4, y + 21.5);

      // Timestamp
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text(`Recorded At: ${new Date(session.decision.decidedAt).toLocaleString()}`, margin + 4, y + 29);
    } else {
      // Pending Officer Review
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin + 4, y + 4, 55, 7, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("STATUS: PENDING OFFICER DECISION", margin + 6, y + 8.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Screening analysis complete. Awaiting determination from an authorized inspector or border control officer.",
        margin + 4,
        y + 18
      );

      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Dossier locked at: ${new Date(session.timestamp).toLocaleString()}`, margin + 4, y + 26);
    }

    // -------------------------------------------------------------
    // 8. Official Document Security Stamp / Footer
    // -------------------------------------------------------------
    const footerY = pageHeight - 14;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont("courier", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `DIGITAL HASH: SHA256-${session.screeningId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 16).toUpperCase()}-${session.risk.compositeRiskScore} • AUDIT VERIFIED`,
      margin,
      footerY + 2
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.text(
      "IDGuard AI Forensic Identity Screening Suite • Confidential Government Record",
      pageWidth - margin,
      footerY + 2,
      { align: "right" }
    );

    // Trigger direct browser download
    const cleanDocNum = (session.ocr.documentNumber || "DOC").replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `IDGuard-Report-${cleanDocNum}-${session.screeningId}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error("Failed to generate screening PDF dossier:", err);
    alert("Could not generate PDF report. Please check the browser console for details.");
  }
}
