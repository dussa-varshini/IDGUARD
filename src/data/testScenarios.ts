import { InternalTestScenario } from "../types";

// Helper to convert SVG strings into valid Data URLs
function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

// Generate realistic synthetic ID Document SVGs for internal testing
const validPassportSvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <pattern id="guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 Q10,0 20,20 T40,20" fill="none" stroke="#dbeafe" stroke-width="0.75" opacity="0.6"/>
      <path d="M0,20 Q10,40 20,20 T40,20" fill="none" stroke="#bfdbfe" stroke-width="0.75" opacity="0.6"/>
    </pattern>
    <linearGradient id="passportBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eff6ff"/>
    </linearGradient>
  </defs>

  <!-- Document Card Outer -->
  <rect x="10" y="10" width="580" height="400" rx="14" fill="url(#passportBg)" stroke="#94a3b8" stroke-width="2"/>
  <rect x="15" y="15" width="570" height="390" rx="10" fill="url(#guilloche)"/>

  <!-- Top Header Bar -->
  <rect x="10" y="10" width="580" height="46" rx="14" fill="#1e293b"/>
  <text x="30" y="38" fill="#ffffff" font-size="15" font-weight="700" letter-spacing="1">UTOPIA • PASSPORT / PASSEPORT</text>
  <text x="540" y="38" fill="#38bdf8" font-size="13" font-weight="600">P &lt; UTO</text>

  <!-- Photo Box -->
  <g transform="translate(35, 75)">
    <rect width="130" height="170" rx="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    <!-- Simulated Portrait Face -->
    <circle cx="65" cy="65" r="34" fill="#fcd34d"/>
    <path d="M35 155 C35 110, 95 110, 95 155 Z" fill="#334155"/>
    <circle cx="54" cy="62" r="4" fill="#1e293b"/>
    <circle cx="76" cy="62" r="4" fill="#1e293b"/>
    <path d="M58 80 Q65 86 72 80" stroke="#b45309" stroke-width="2" fill="none"/>
    <!-- Holographic security crest over photo corner -->
    <circle cx="110" cy="150" r="16" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="65" y="166" font-size="9" text-anchor="middle" fill="#64748b" font-weight="600">ICAO BIO-PORTRAIT</text>
  </g>

  <!-- VIZ Visual Inspection Fields -->
  <g transform="translate(185, 75)" font-size="11" fill="#475569">
    <text x="0" y="12" font-weight="600" font-size="9" fill="#64748b">TYPE / TYPE</text>
    <text x="0" y="27" font-weight="700" font-size="13" fill="#0f172a">P</text>

    <text x="60" y="12" font-weight="600" font-size="9" fill="#64748b">COUNTRY CODE</text>
    <text x="60" y="27" font-weight="700" font-size="13" fill="#0f172a">UTO</text>

    <text x="170" y="12" font-weight="600" font-size="9" fill="#64748b">PASSPORT NO. / NO DU PASSEPORT</text>
    <text x="170" y="27" font-weight="800" font-size="14" fill="#0369a1" letter-spacing="1">P12849021</text>

    <text x="0" y="55" font-weight="600" font-size="9" fill="#64748b">SURNAME / NOM</text>
    <text x="0" y="70" font-weight="700" font-size="13" fill="#0f172a">VASQUEZ</text>

    <text x="0" y="95" font-weight="600" font-size="9" fill="#64748b">GIVEN NAMES / PRENOMS</text>
    <text x="0" y="110" font-weight="700" font-size="13" fill="#0f172a">ELENA SOFIA</text>

    <text x="0" y="135" font-weight="600" font-size="9" fill="#64748b">NATIONALITY / NATIONALITE</text>
    <text x="0" y="150" font-weight="700" font-size="12" fill="#0f172a">UTOPIAN</text>

    <text x="170" y="135" font-weight="600" font-size="9" fill="#64748b">DATE OF BIRTH / DATE DE NAISSANCE</text>
    <text x="170" y="150" font-weight="700" font-size="12" fill="#0f172a">22 AUG / AOU 1990</text>

    <text x="0" y="175" font-weight="600" font-size="9" fill="#64748b">SEX / SEXE</text>
    <text x="0" y="190" font-weight="700" font-size="12" fill="#0f172a">F</text>

    <text x="60" y="175" font-weight="600" font-size="9" fill="#64748b">DATE OF ISSUE</text>
    <text x="60" y="190" font-weight="700" font-size="12" fill="#0f172a">15 MAR 2021</text>

    <text x="170" y="175" font-weight="600" font-size="9" fill="#64748b">DATE OF EXPIRY / EXPIRATION</text>
    <text x="170" y="190" font-weight="800" font-size="13" fill="#059669">14 MAR 2031</text>
  </g>

  <!-- MRZ Machine Readable Zone Section -->
  <rect x="25" y="315" width="550" height="78" rx="4" fill="#ffffff" stroke="#e2e8f0"/>
  <g transform="translate(40, 345)" font-family="Courier, monospace" font-size="17" font-weight="700" letter-spacing="3" fill="#0f172a">
    <text x="0" y="0">P&lt;UTOVASQUEZ&lt;&lt;ELENA&lt;SOFIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
    <text x="0" y="28">P128490218UTO9008226F3103142&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;06</text>
  </g>
</svg>
`;

const mrzDiscrepancySvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <defs>
    <pattern id="guilloche2" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M0,20 Q10,0 20,20 T40,20" fill="none" stroke="#fed7aa" stroke-width="0.75" opacity="0.6"/>
      <path d="M0,20 Q10,40 20,20 T40,20" fill="none" stroke="#ffedd5" stroke-width="0.75" opacity="0.6"/>
    </pattern>
  </defs>

  <rect x="10" y="10" width="580" height="400" rx="14" fill="#fffbeb" stroke="#f59e0b" stroke-width="2"/>
  <rect x="15" y="15" width="570" height="390" rx="10" fill="url(#guilloche2)"/>

  <!-- Top Header -->
  <rect x="10" y="10" width="580" height="46" rx="14" fill="#78350f"/>
  <text x="30" y="38" fill="#ffffff" font-size="15" font-weight="700" letter-spacing="1">UTOPIA • PASSPORT / PASSEPORT</text>
  <text x="540" y="38" fill="#fcd34d" font-size="13" font-weight="600">P &lt; UTO</text>

  <!-- Photo Box -->
  <g transform="translate(35, 75)">
    <rect width="130" height="170" rx="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="65" cy="65" r="34" fill="#fed7aa"/>
    <path d="M35 155 C35 110, 95 110, 95 155 Z" fill="#475569"/>
    <circle cx="54" cy="62" r="4" fill="#0f172a"/>
    <circle cx="76" cy="62" r="4" fill="#0f172a"/>
    <path d="M58 80 Q65 86 72 80" stroke="#7c2d12" stroke-width="2" fill="none"/>
  </g>

  <!-- VIZ Fields with Tampered Expiry -->
  <g transform="translate(185, 75)" font-size="11" fill="#475569">
    <text x="0" y="12" font-weight="600" font-size="9" fill="#78716c">TYPE</text>
    <text x="0" y="27" font-weight="700" font-size="13" fill="#0f172a">P</text>

    <text x="60" y="12" font-weight="600" font-size="9" fill="#78716c">COUNTRY</text>
    <text x="60" y="27" font-weight="700" font-size="13" fill="#0f172a">UTO</text>

    <text x="170" y="12" font-weight="600" font-size="9" fill="#78716c">PASSPORT NO.</text>
    <text x="170" y="27" font-weight="800" font-size="14" fill="#0f172a">L898902C3</text>

    <text x="0" y="55" font-weight="600" font-size="9" fill="#78716c">SURNAME</text>
    <text x="0" y="70" font-weight="700" font-size="13" fill="#0f172a">ERIKSSON</text>

    <text x="0" y="95" font-weight="600" font-size="9" fill="#78716c">GIVEN NAMES</text>
    <text x="0" y="110" font-weight="700" font-size="13" fill="#0f172a">ANNA MARIA</text>

    <text x="0" y="135" font-weight="600" font-size="9" fill="#78716c">NATIONALITY</text>
    <text x="0" y="150" font-weight="700" font-size="12" fill="#0f172a">UTOPIAN</text>

    <text x="170" y="135" font-weight="600" font-size="9" fill="#78716c">DATE OF BIRTH</text>
    <text x="170" y="150" font-weight="700" font-size="12" fill="#0f172a">14 JUL 1984</text>

    <!-- Tampered Visual Expiry (Modified with 2030) -->
    <text x="170" y="175" font-weight="600" font-size="9" fill="#b91c1c">DATE OF EXPIRY [VISUAL FIELD]</text>
    <!-- Background highlight indicating modification artifact -->
    <rect x="165" y="180" width="130" height="24" rx="3" fill="#fee2e2" stroke="#dc2626" stroke-width="1" stroke-dasharray="2 2"/>
    <text x="170" y="197" font-weight="800" font-size="14" fill="#b91c1c">12 NOV 2030</text>
  </g>

  <!-- MRZ Section encoding ORIGINAL expiry 2028 (2811124) -->
  <rect x="25" y="315" width="550" height="78" rx="4" fill="#ffffff" stroke="#fca5a5" stroke-width="1.5"/>
  <g transform="translate(40, 345)" font-family="Courier, monospace" font-size="17" font-weight="700" letter-spacing="3" fill="#0f172a">
    <text x="0" y="0">P&lt;UTOERIKSSON&lt;&lt;ANNA&lt;MARIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text>
    <text x="0" y="28">L898902C36UTO8407148F<tspan fill="#b91c1c" font-weight="900">2811124</tspan>&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</text>
  </g>
</svg>
`;

const insufficientEvidenceSvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg">
  <!-- Blurred, Cropped, and heavily glares -->
  <defs>
    <filter id="heavyBlur">
      <feGaussianBlur stdDeviation="8"/>
    </filter>
    <radialGradient id="glareSpot" cx="60%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#fef08a" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="420" fill="#334155"/>
  <!-- Cropped angled document -->
  <g transform="rotate(-7 300 210) translate(-30, 20)" filter="url(#heavyBlur)">
    <rect x="50" y="50" width="520" height="340" rx="12" fill="#cbd5e1"/>
    <rect x="70" y="80" width="110" height="150" fill="#94a3b8"/>
    <rect x="200" y="90" width="320" height="20" fill="#64748b"/>
    <rect x="200" y="130" width="280" height="20" fill="#64748b"/>
    <rect x="200" y="170" width="260" height="20" fill="#64748b"/>
    <rect x="70" y="270" width="480" height="50" fill="#475569"/>
  </g>

  <!-- Specular Flash Glare Hotspot Over MRZ and Document Number -->
  <ellipse cx="380" cy="220" rx="200" ry="140" fill="url(#glareSpot)"/>

  <!-- Visual Warning Banner Overlay -->
  <rect x="80" y="160" width="440" height="90" rx="8" fill="#1e293b" fill-opacity="0.9" stroke="#ef4444" stroke-width="2"/>
  <text x="300" y="200" font-family="-apple-system, sans-serif" font-size="16" font-weight="800" fill="#ef4444" text-anchor="middle" letter-spacing="1">INSUFFICIENT EVIDENCE DETECTED</text>
  <text x="300" y="226" font-family="-apple-system, sans-serif" font-size="12" fill="#e2e8f0" text-anchor="middle">Excessive Glare &amp; Laplacian Motion Blur • Recapture Required</text>
</svg>
`;

const digitalTamperingSvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect x="10" y="10" width="580" height="400" rx="14" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
  <rect x="10" y="10" width="580" height="46" rx="14" fill="#991b1b"/>
  <text x="30" y="38" fill="#ffffff" font-size="15" font-weight="700" letter-spacing="1">NATIONAL IDENTITY CARD • SAMPLE</text>

  <!-- Photo with visible splice border -->
  <g transform="translate(35, 75)">
    <rect width="130" height="170" rx="6" fill="#e2e8f0" stroke="#b91c1c" stroke-width="2" stroke-dasharray="3 3"/>
    <circle cx="65" cy="65" r="34" fill="#fde047"/>
    <path d="M35 155 C35 110, 95 110, 95 155 Z" fill="#1e293b"/>
    <!-- Discontinuous halo around photo -->
    <rect x="-4" y="-4" width="138" height="178" rx="8" fill="none" stroke="#ef4444" stroke-width="1.5" opacity="0.8"/>
  </g>

  <g transform="translate(185, 75)" font-size="11" fill="#475569">
    <text x="0" y="12" font-weight="600" font-size="9" fill="#64748b">CARD ID</text>
    <text x="0" y="27" font-weight="700" font-size="13" fill="#0f172a">ID-98210344</text>

    <text x="0" y="60" font-weight="600" font-size="9" fill="#64748b">FULL NAME</text>
    <text x="0" y="75" font-weight="700" font-size="13" fill="#0f172a">KLEIN, MARCUS</text>

    <!-- Tampered Date of Birth with font mismatch -->
    <text x="0" y="110" font-weight="600" font-size="9" fill="#dc2626">DATE OF BIRTH [FONT ANOMALY]</text>
    <rect x="-4" y="118" width="200" height="26" fill="#fee2e2" stroke="#dc2626" stroke-width="1"/>
    <text x="4" y="136" font-family="'Comic Sans MS', sans-serif" font-weight="900" font-size="14" fill="#b91c1c">1995-12-04</text>

    <text x="0" y="170" font-weight="600" font-size="9" fill="#64748b">STATUS</text>
    <text x="0" y="185" font-weight="700" font-size="12" fill="#0f172a">ACTIVE CITIZEN</text>
  </g>
</svg>
`;

const faceMismatchDocSvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect x="10" y="10" width="580" height="400" rx="14" fill="#f8fafc" stroke="#475569" stroke-width="2"/>
  <rect x="10" y="10" width="580" height="46" rx="14" fill="#1e3a8a"/>
  <text x="30" y="38" fill="#ffffff" font-size="15" font-weight="700" letter-spacing="1">RÉPUBLIQUE FRANÇAISE • CARTE NATIONALE D'IDENTITÉ</text>

  <!-- Document Portrait (Male, Short Hair, Glasses) -->
  <g transform="translate(35, 75)">
    <rect width="130" height="170" rx="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="65" cy="65" r="34" fill="#fed7aa"/>
    <path d="M35 155 C35 110, 95 110, 95 155 Z" fill="#1e293b"/>
    <!-- Glasses -->
    <rect x="44" y="58" width="18" height="12" rx="2" fill="none" stroke="#0f172a" stroke-width="2"/>
    <rect x="68" y="58" width="18" height="12" rx="2" fill="none" stroke="#0f172a" stroke-width="2"/>
    <line x1="62" y1="64" x2="68" y2="64" stroke="#0f172a" stroke-width="2"/>
  </g>

  <g transform="translate(185, 75)" font-size="11" fill="#475569">
    <text x="0" y="12" font-weight="600" font-size="9" fill="#64748b">CARD NUMBER</text>
    <text x="0" y="27" font-weight="800" font-size="14" fill="#0f172a">180975200341</text>

    <text x="0" y="60" font-weight="600" font-size="9" fill="#64748b">NOM / SURNAME</text>
    <text x="0" y="75" font-weight="700" font-size="13" fill="#0f172a">DUBOIS</text>

    <text x="0" y="100" font-weight="600" font-size="9" fill="#64748b">PRENOMS / GIVEN NAMES</text>
    <text x="0" y="115" font-weight="700" font-size="13" fill="#0f172a">LUCAS PIERRE</text>

    <text x="0" y="140" font-weight="600" font-size="9" fill="#64748b">DATE DE NAISSANCE</text>
    <text x="0" y="155" font-weight="700" font-size="12" fill="#0f172a">18.04.1992</text>
  </g>
</svg>
`;

const expiredPassportSvg = `
<svg width="600" height="420" viewBox="0 0 600 420" xmlns="http://www.w3.org/2000/svg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <rect x="10" y="10" width="580" height="400" rx="14" fill="#f8fafc" stroke="#dc2626" stroke-width="2"/>
  <rect x="10" y="10" width="580" height="46" rx="14" fill="#475569"/>
  <text x="30" y="38" fill="#ffffff" font-size="15" font-weight="700" letter-spacing="1">PASSPORT • EXPIRED RECORD</text>

  <g transform="translate(35, 75)">
    <rect width="130" height="170" rx="6" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="65" cy="65" r="34" fill="#fed7aa"/>
    <path d="M35 155 C35 110, 95 110, 95 155 Z" fill="#334155"/>
  </g>

  <g transform="translate(185, 75)" font-size="11" fill="#475569">
    <text x="0" y="12" font-weight="600" font-size="9" fill="#64748b">NUMBER</text>
    <text x="0" y="27" font-weight="700" font-size="14" fill="#0f172a">C77301994</text>

    <text x="0" y="60" font-weight="600" font-size="9" fill="#64748b">SURNAME</text>
    <text x="0" y="75" font-weight="700" font-size="13" fill="#0f172a">CHANG</text>

    <text x="0" y="100" font-weight="600" font-size="9" fill="#64748b">GIVEN NAMES</text>
    <text x="0" y="115" font-weight="700" font-size="13" fill="#0f172a">WEI JIE</text>

    <text x="0" y="150" font-weight="600" font-size="9" fill="#dc2626">EXPIRY DATE (EXPIRED)</text>
    <text x="0" y="170" font-weight="800" font-size="14" fill="#dc2626">10 FEB 2023 [LAPSED]</text>
  </g>
</svg>
`;

// Selfies SVGs
const matchingSelfieSvg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#0f172a"/>
  <!-- Target framing circle -->
  <circle cx="200" cy="200" r="160" fill="none" stroke="#22c55e" stroke-width="2" stroke-dasharray="6 6"/>
  <!-- Live Portrait Face matching Elena Sofia -->
  <circle cx="200" cy="180" r="80" fill="#fcd34d"/>
  <path d="M120 380 C120 280, 280 280, 280 380 Z" fill="#334155"/>
  <circle cx="175" cy="175" r="9" fill="#0f172a"/>
  <circle cx="225" cy="175" r="9" fill="#0f172a"/>
  <path d="M185 220 Q200 232 215 220" stroke="#b45309" stroke-width="3" fill="none"/>
  <text x="200" y="370" font-family="-apple-system, sans-serif" font-size="12" fill="#22c55e" text-anchor="middle" font-weight="600">LIVE BIOMETRIC FEED • VERIFIED CONSENT</text>
</svg>
`;

const mismatchedSelfieSvg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#0f172a"/>
  <circle cx="200" cy="200" r="160" fill="none" stroke="#ef4444" stroke-width="2"/>
  <!-- Entirely different face structure (Female, different facial features) -->
  <circle cx="200" cy="180" r="75" fill="#fbcfe8"/>
  <path d="M125 380 C125 285, 275 285, 275 380 Z" fill="#be185d"/>
  <circle cx="180" cy="175" r="7" fill="#831843"/>
  <circle cx="220" cy="175" r="7" fill="#831843"/>
  <path d="M188 220 Q200 228 212 220" stroke="#9d174d" stroke-width="3" fill="none"/>
  <text x="200" y="370" font-family="-apple-system, sans-serif" font-size="12" fill="#ef4444" text-anchor="middle" font-weight="600">APPLICANT SELFIE • BIOMETRIC MISMATCH</text>
</svg>
`;

export const INTERNAL_TEST_SCENARIOS: InternalTestScenario[] = [
  {
    id: "scenario-valid-passport",
    name: "Scenario 1: Standard Valid Passport",
    category: "Baseline Compliance",
    description: "Full compliance, high optical resolution, authentic ICAO Doc 9303 MRZ check digits, and live 1:1 facial biometric match.",
    expectedOutcome: "PASS",
    documentImage: svgToDataUri(validPassportSvg),
    selfieImage: svgToDataUri(matchingSelfieSvg),
    expectedSummary: "Document valid, security features intact, zero discrepancy, facial biometric match 96%.",
  },
  {
    id: "scenario-mrz-discrepancy",
    name: "Scenario 2: MRZ Expiry Discrepancy",
    category: "Cross-Field Integrity",
    description: "Visual inspection zone shows expiry year 2030, but optical MRZ Line 2 encodes 2028 with check digit. Demonstrates cross-check integrity.",
    expectedOutcome: "FLAG_MRZ",
    documentImage: svgToDataUri(mrzDiscrepancySvg),
    selfieImage: svgToDataUri(matchingSelfieSvg),
    expectedSummary: "High Risk: MRZ Line 2 expiration date (2028) contradicts Visual Inspection Zone (2030).",
  },
  {
    id: "scenario-digital-tampering",
    name: "Scenario 3: Forensic Font Alteration & Splicing",
    category: "Document Forensics",
    description: "National ID with font baseline irregularity on Date of Birth and compression haloing around the photo border.",
    expectedOutcome: "FLAG_TAMPER",
    documentImage: svgToDataUri(digitalTamperingSvg),
    expectedSummary: "High Risk: Font weight divergence and digital splicing detected around portrait.",
  },
  {
    id: "scenario-insufficient-evidence",
    name: "Scenario 4: Specular Glare & Defocus Blur",
    category: "Image Quality Assurance",
    description: "Severe flash hotspot obscuring identification numbers and Laplacian blur exceeding threshold. Demonstrates non-negotiable recapture logic.",
    expectedOutcome: "RECAPTURE",
    documentImage: svgToDataUri(insufficientEvidenceSvg),
    expectedSummary: "INSUFFICIENT EVIDENCE → RECAPTURE REQUIRED. Severe glare reflection blocks character extraction.",
  },
  {
    id: "scenario-face-mismatch",
    name: "Scenario 5: 1:1 Biometric Face Mismatch",
    category: "Biometric Verification",
    description: "Genuine authentic National ID card presented by an applicant whose live facial landmarks do not match (24% similarity score).",
    expectedOutcome: "FACE_MISMATCH",
    documentImage: svgToDataUri(faceMismatchDocSvg),
    selfieImage: svgToDataUri(mismatchedSelfieSvg),
    expectedSummary: "High Risk: Document is genuine, but live applicant fails 1:1 biometric comparison (24% similarity).",
  },
  {
    id: "scenario-expired-document",
    name: "Scenario 6: Expired Credential Check",
    category: "Validity Lifecycle",
    description: "Passport document with valid structure and authentic features, but expiration date has passed.",
    expectedOutcome: "EXPIRED",
    documentImage: svgToDataUri(expiredPassportSvg),
    selfieImage: svgToDataUri(matchingSelfieSvg),
    expectedSummary: "Review Required: Document expiration date passed in 2023. Validity expired.",
  },
];
