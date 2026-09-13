# IDGuard AI

### AI-Assisted Identity & Document Screening

IDGuard AI is an AI-assisted screening system designed to help authorized personnel assess identity documents using multiple independent evidence sources.

Instead of relying on a single AI verdict, IDGuard AI combines document intelligence, cross-consistency verification, document-forensic signals, and consent-based identity verification into an explainable risk assessment.

> *AI assists. Authorized personnel decide.*

---

## Overview

Identity-document screening can involve multiple verification steps, including extracting information from documents, checking internal consistency, identifying possible visual manipulation, and verifying that the presented identity matches the document.

IDGuard AI brings these checks together into a single workflow and presents the supporting evidence behind the resulting risk assessment.

### Core Workflow

*Document Capture / Upload*  
↓  
*OCR & Field Extraction*  
↓  
*MRZ / Field Consistency Verification*  
↓  
*Document Forensics*  
↓  
*1:1 Identity Verification*  
↓  
*Explainable Risk Fusion*  
↓  
*Officer Decision*  
↓  
*Audit Trail*

---

## Key Features

### 📷 Document Capture
- Browser-based camera capture
- Image upload fallback
- Capture and retake workflow
- Basic image-quality assessment

### 🔎 Document Intelligence
- OCR-based text extraction
- Structured field extraction
- Document information processing

### 🔄 Cross-Consistency Verification
- Compares extracted document fields
- Checks visible information against machine-readable information where available
- Identifies inconsistencies for further review

### 🧪 Document Forensics
- Analyzes visual signals that may indicate image manipulation
- Provides forensic evidence as part of the overall assessment

### 👤 Identity Verification
- Consent-based 1:1 face verification
- Compares the presented person with the document portrait
- Designed as verification, not open-ended identity identification

### 🧠 Explainable Risk Assessment
IDGuard AI combines available evidence into a risk assessment rather than presenting a black-box result.

The system can explain:

- What was checked
- What was found
- Which evidence increased the risk
- When evidence is insufficient
- What action may be appropriate for further verification

### 📋 Audit Trail
Screening events and officer decisions can be recorded to support traceability and review.

---

## Evidence-Based Decision Model

IDGuard AI uses four primary evidence layers:

1. *Document Intelligence*
2. *Cross-Consistency Verification*
3. *Document Forensics*
4. *Identity Verification*

These signals are combined by a *Risk Fusion* layer to produce an explainable assessment.

The risk assessment is intended to support human review and is not a substitute for an authorized officer's decision.

---

## Handling Insufficient Evidence

A key design principle is that poor-quality or incomplete evidence should not automatically be classified as fraudulent.

When the available evidence is insufficient, the system can indicate:

*INSUFFICIENT EVIDENCE*

and recommend:

*RECAPTURE REQUIRED*

This helps distinguish uncertainty from suspected manipulation.

---

## Technology Stack

- *Frontend:* React / TypeScript
- *Build Tool:* Vite
- *Backend:* Node.js / TypeScript
- *AI:* Gemini API
- *Computer Vision:* OpenCV / image-analysis techniques
- *OCR:* OCR-based document text extraction
- *Data Processing:* Structured document and identity analysis
- *Version Control:* Git / GitHub

---

## Architecture

```text
                 ┌─────────────────────┐
                 │   Document Capture  │
                 │   Camera / Upload   │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ OCR & Field         │
                 │ Extraction          │
                 └──────────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ Cross-     │ │ Document   │ │ Identity   │
       │ Consistency│ │ Forensics  │ │ Verification│
       └─────┬──────┘ └─────┬──────┘ └─────┬──────┘
             │              │              │
             └──────────────┼──────────────┘
                            ▼
                 ┌─────────────────────┐
                 │   Risk Fusion       │
                 │   & Explanation     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Authorized Officer  │
                 │ Decision            │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     Audit Trail     │
                 └─────────────────────┘
