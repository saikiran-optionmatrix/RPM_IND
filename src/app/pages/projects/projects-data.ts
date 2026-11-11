export interface Project {
  projectCode: string;
  projectId?: string;
  productId?: string;
  projectOwner: string;
  projectLead: string;
  molecule: string;
  productName: string;
  dosageForm: string;
  strength: string;
  targetMarket?: string;
  estimatedCostForDevelopment?: string;
  marketSizeInUsd?: string;
  levelOfCompetition?: string;
  competitorName?: string;
  marketAccessStrategy?: string;
  projectedMarketShare?: string;
  projectedNpv?: string;
  commercialAttractiveness?: string;
  priorityOfProject?: string;
  timelineForCompletionOfProject?: string;
  projectInitiatedOn?: string;
  productStatus?: string;
  preEbActivitiesCompletedOn?: string;
  tentativeBatchSize?: string;
  tentativeEbBatchPlan?: string;
  projectCompletedDate?: string;
  expectedMaCost?: string;
  drugAuthorityName?: string;
  remarks?: string;
  status: "Active" | "Inactive";
  division?: string;
  location?: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;

  // Columns from spreadsheet images
  starProduct?: string;
  registrationType?: string;
  priority?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectBudget?: string;
  market?: string;
  marketSizeLast3Years?: string;
  marketSizeUsdMnYr?: string;
  fillVolume?: string;
  pharmacopoeia?: string;
  packagingDetails?: string;
  innovatorCompany?: string;
  innovatorBrandName?: string;
  innovatorDosageForm?: string;
  innovatorStrengths?: string;
  innovatorApprovalDate?: string;
  innovatorPackPresentation?: string;
  innovatorBioStrength?: string;
  rldInformation?: string;
  innovatorVsJodas?: string;
  ipDetails?: string;
  apiManufacturer?: string;
  polymorphForm?: string;
  cepDmfNoReceiptStatus?: string;
  dmfAsmfCepReceived?: string;
  apiVendorQualification?: string;
  apiMl?: string;
  apiGmp?: string;
  ml?: string;
  whoGmp?: string;
  fsc?: string;
  copp?: string;
  bioStudyCroName?: string;
  bioStudyCroGmpStatus?: string;
  beNoc?: string;
  studyTimePeriod?: string;
  bioStudyReport?: string;
}

export const projects: Project[] = [
  {
    "projectCode": "2026/RD/001",
    "productId": "PRD-2026-8492",
    "projectId": "PRD-2026-8492",
    "productName": "Dapagliflozin Film-Coated Tablets",
    "molecule": "Dapagliflozin",
    "division": "Endocrinology / Diabetes",
    "starProduct": "Yes",
    "registrationType": "Generic product development",
    "projectOwner": "Product Strategy",
    "projectLead": "A. Sharma",
    "priority": "High",
    "projectStartDate": "01-Nov-2026",
    "projectEndDate": "31-Oct-2027",
    "projectBudget": "0.55",
    "market": "India / ASEAN",
    "marketSizeLast3Years": "Market trend analysis required for 2023–2025; source data to be confirmed",
    "marketSizeUsdMnYr": "62",
    "projectedMarketShare": "7.0%",
    "commercialAttractiveness": "High",
    "projectedNpv": "3.4",
    "dosageForm": "Film-coated tablets",
    "strength": "5 mg and 10 mg",
    "fillVolume": "NA",
    "pharmacopoeia": "Applicable pharmacopoeia and current specification to be confirmed",
    "packagingDetails": "PVC/PVDC-Alu blister; pack configuration to be confirmed",
    "innovatorCompany": "Reference innovator to be confirmed",
    "innovatorBrandName": "Reference brand to be confirmed",
    "innovatorDosageForm": "Film-coated tablets; reference presentation to be verified",
    "innovatorStrengths": "5 mg and 10 mg; verify against target-market reference label",
    "innovatorApprovalDate": "Confirm current approval details with official regulator database",
    "innovatorPackPresentation": "Confirm market-specific pack presentation",
    "innovatorBioStrength": "Not applicable unless BE protocol requires otherwise",
    "rldInformation": "SmPC/PIL/COA collection pending",
    "innovatorVsJodas": "Benchmark dosage form, strengths, excipients and labeling against approved reference product",
    "ipDetails": "Patent landscape and freedom-to-operate assessment required for target markets",
    "apiManufacturer": "API supplier shortlist under evaluation",
    "polymorphForm": "API solid-state form and specification to be confirmed from supplier DMF/CEP",
    "cepDmfNoReceiptStatus": "DMF/CEP number and access status to be confirmed",
    "dmfAsmfCepReceived": "Pending document receipt / assessment",
    "apiVendorQualification": "Qualification pending",
    "apiMl": "GMP evidence to be collected and verified",
    "apiGmp": "To be confirmed based on API source and regulatory pathway",
    "ml": "To be confirmed for target market",
    "whoGmp": "To be confirmed for target market",
    "fsc": "To be confirmed for target market",
    "copp": "To be confirmed for target market",
    "bioStudyCroName": "CRO selection pending",
    "bioStudyCroGmpStatus": "CRO GMP / quality status to be audited",
    "beNoc": "BE NOC applicability and submission requirements to be confirmed",
    "studyTimePeriod": "Planning estimate: 6–9 months, subject to protocol and approvals",
    "bioStudyReport": "Not yet available; planned after study completion",
    "remarks": "Illustrative project data. Market, regulatory, patent, supplier and BE assumptions require formal due diligence.",
    "status": "Active",
    "historyCount": 4,
    "updatedDate": "05-Oct-2026",
    "updatedBy": "A. Sharma",
    "location": "Hyderabad"
  },
  {
    "projectCode": "2026/RD/002",
    "productId": "PRD-2026-5127",
    "projectId": "PRD-2026-5127",
    "productName": "Levetiracetam Oral Solution",
    "molecule": "Levetiracetam",
    "division": "Neurology",
    "starProduct": "No",
    "registrationType": "Generic product development",
    "projectOwner": "Portfolio Management",
    "projectLead": "R. Mehta",
    "priority": "Medium",
    "projectStartDate": "01-Dec-2026",
    "projectEndDate": "30-Nov-2027",
    "projectBudget": "0.32",
    "market": "India / Middle East",
    "marketSizeLast3Years": "Three-year market trend to be established using validated market intelligence",
    "marketSizeUsdMnYr": "28",
    "projectedMarketShare": "6.0%",
    "commercialAttractiveness": "Medium",
    "projectedNpv": "1.6",
    "dosageForm": "Oral solution",
    "strength": "100 mg/mL (proposed; confirm target-market need)",
    "fillVolume": "100 mL bottle (proposed)",
    "pharmacopoeia": "Applicable pharmacopoeial standard to be confirmed",
    "packagingDetails": "Amber bottle with child-resistant closure; final pack to be assessed",
    "innovatorCompany": "Reference innovator to be confirmed",
    "innovatorBrandName": "Reference brand to be confirmed",
    "innovatorDosageForm": "Oral solution; reference dosage form to be verified",
    "innovatorStrengths": "Strength and concentration to be confirmed from approved labeling",
    "innovatorApprovalDate": "Official approval date to be verified",
    "innovatorPackPresentation": "Market-specific pack presentation to be confirmed",
    "innovatorBioStrength": "Not applicable unless required by study design",
    "rldInformation": "Reference SmPC/PIL/COA collection pending",
    "innovatorVsJodas": "Compare concentration, excipients, taste-masking, container closure and labeling",
    "ipDetails": "Patent and exclusivity review required in each intended market",
    "apiManufacturer": "API vendor evaluation not started",
    "polymorphForm": "Solid-state form and API controls to be defined from approved supplier documentation",
    "cepDmfNoReceiptStatus": "DMF/CEP availability and number to be confirmed",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Qualification pending",
    "apiMl": "Supplier GMP documentation pending verification",
    "apiGmp": "To be confirmed by regulatory assessment",
    "ml": "To be confirmed by target-market requirements",
    "whoGmp": "To be confirmed by target-market requirements",
    "fsc": "To be confirmed by target-market requirements",
    "copp": "To be confirmed by target-market requirements",
    "bioStudyCroName": "CRO requirement to be assessed",
    "bioStudyCroGmpStatus": "Not applicable unless a bio-study is required; otherwise assess CRO quality system",
    "beNoc": "BE NOC requirement to be confirmed with regulatory team",
    "studyTimePeriod": "Planning estimate: 5–8 months after formulation and protocol readiness",
    "bioStudyReport": "Not available; study need to be confirmed",
    "remarks": "Illustrative project data. Confirm strength, reference product, market size, regulatory pathway and study requirements.",
    "status": "Active",
    "historyCount": 5,
    "updatedDate": "03-Oct-2026",
    "updatedBy": "R. Mehta",
    "location": "Bengaluru"
  },
  {
    "projectCode": "2026/RD/003",
    "productId": "PRD-2026-9341",
    "projectId": "PRD-2026-9341",
    "productName": "Pantoprazole Sodium Delayed-Release Tablets",
    "molecule": "Pantoprazole Sodium",
    "division": "Gastroenterology",
    "starProduct": "Yes",
    "registrationType": "Generic product development",
    "projectOwner": "Product Strategy",
    "projectLead": "S. Iyer",
    "priority": "High",
    "projectStartDate": "01-Jan-2027",
    "projectEndDate": "31-Dec-2027",
    "projectBudget": "0.28",
    "market": "India / Africa",
    "marketSizeLast3Years": "Market trend and competitor assessment required for 2023–2025",
    "marketSizeUsdMnYr": "44",
    "projectedMarketShare": "5.0%",
    "commercialAttractiveness": "Medium",
    "projectedNpv": "2.1",
    "dosageForm": "Delayed-release / enteric-coated tablets",
    "strength": "20 mg and 40 mg",
    "fillVolume": "NA",
    "pharmacopoeia": "Current applicable monograph to be confirmed",
    "packagingDetails": "Alu-Alu or blister pack; stability compatibility to be assessed",
    "innovatorCompany": "Reference innovator to be confirmed",
    "innovatorBrandName": "Reference brand to be confirmed",
    "innovatorDosageForm": "Delayed-release tablets; verify reference label",
    "innovatorStrengths": "20 mg and 40 mg proposed; confirm target-market presentations",
    "innovatorApprovalDate": "Verify approval dates from official sources",
    "innovatorPackPresentation": "Pack count and presentation to be confirmed by market",
    "innovatorBioStrength": "Not applicable unless required by comparative study",
    "rldInformation": "Reference SmPC/PIL/COA pending collection",
    "innovatorVsJodas": "Assess release profile, dissolution, formulation and labeling against reference product",
    "ipDetails": "Patent, formulation and process review required before development lock",
    "apiManufacturer": "Supplier shortlist to be prepared",
    "polymorphForm": "API form and impurity profile to be verified against supplier dossier",
    "cepDmfNoReceiptStatus": "DMF/CEP number and receipt status pending",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Qualification pending",
    "apiMl": "GMP evidence pending review",
    "apiGmp": "To be confirmed",
    "ml": "To be confirmed for target markets",
    "whoGmp": "To be confirmed for target markets",
    "fsc": "To be confirmed for target markets",
    "copp": "To be confirmed for target markets",
    "bioStudyCroName": "CRO to be selected if comparative study is required",
    "bioStudyCroGmpStatus": "Quality/GMP status to be verified if CRO is engaged",
    "beNoc": "Regulatory team to confirm BE NOC requirements",
    "studyTimePeriod": "Planning estimate: 6–9 months; dependent on formulation and dissolution/BE strategy",
    "bioStudyReport": "Pending study strategy",
    "remarks": "Illustrative planning values only. Confirm regulatory pathway, reference product, market estimates and technical feasibility.",
    "status": "Active",
    "historyCount": 2,
    "updatedDate": "30-Sep-2026",
    "updatedBy": "S. Iyer",
    "location": "Ahmedabad"
  },
  {
    "projectCode": "2026/RD/004",
    "productId": "PRD-2026-2678",
    "projectId": "PRD-2026-2678",
    "productName": "Ceftriaxone for Injection",
    "molecule": "Ceftriaxone Sodium",
    "division": "Anti-infectives",
    "starProduct": "Yes",
    "registrationType": "Generic sterile product development",
    "projectOwner": "Technical Operations",
    "projectLead": "P. Nair",
    "priority": "Critical",
    "projectStartDate": "15-Nov-2026",
    "projectEndDate": "29-Feb-2028",
    "projectBudget": "0.78",
    "market": "India / selected export markets",
    "marketSizeLast3Years": "Hospital tender and antimicrobial market data to be validated for 2023–2025",
    "marketSizeUsdMnYr": "95",
    "projectedMarketShare": "4.0%",
    "commercialAttractiveness": "High",
    "projectedNpv": "4.8",
    "dosageForm": "Sterile powder for injection",
    "strength": "500 mg and 1 g (proposed)",
    "fillVolume": "NA; vial presentation to be confirmed",
    "pharmacopoeia": "Applicable sterile product/API monographs to be confirmed",
    "packagingDetails": "Sterile vial with stopper and seal; carton and diluent presentation to be assessed",
    "innovatorCompany": "Reference product and target-market comparator to be confirmed",
    "innovatorBrandName": "Reference brand to be confirmed",
    "innovatorDosageForm": "Powder for solution for injection; verify local reference label",
    "innovatorStrengths": "500 mg and 1 g proposed; verify market-specific strengths",
    "innovatorApprovalDate": "Official approval date to be verified",
    "innovatorPackPresentation": "Vial count and pack presentation to be confirmed",
    "innovatorBioStrength": "Not applicable unless required by regulatory strategy",
    "rldInformation": "Reference SmPC/PIL/COA and quality information pending collection",
    "innovatorVsJodas": "Benchmark reconstitution, compatibility, container closure, labeling and quality attributes",
    "ipDetails": "Patent/exclusivity and local regulatory pathway assessment required",
    "apiManufacturer": "Sterile-grade API supplier shortlist under evaluation",
    "polymorphForm": "API specification, impurity profile and solid-state details to be verified",
    "cepDmfNoReceiptStatus": "DMF/CEP and open-part availability to be confirmed",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Supplier qualification and audit pending",
    "apiMl": "GMP evidence and sterile supply-chain controls to be verified",
    "apiGmp": "To be confirmed for API source",
    "ml": "Target-market requirement to be confirmed",
    "whoGmp": "Target-market requirement to be confirmed",
    "fsc": "Target-market requirement to be confirmed",
    "copp": "Target-market requirement to be confirmed",
    "bioStudyCroName": "Bioequivalence study need to be assessed; CRO not selected",
    "bioStudyCroGmpStatus": "Assess only if study/CRO is required",
    "beNoc": "Regulatory team to confirm study and NOC requirements",
    "studyTimePeriod": "Planning estimate: 12–15 months due to sterile manufacturing and validation",
    "bioStudyReport": "Not available; study requirements to be assessed",
    "remarks": "Illustrative project data. Sterile manufacturing capability, antimicrobial stewardship rules and market authorization requirements need specialist review.",
    "status": "Active",
    "historyCount": 6,
    "updatedDate": "26-Sep-2026",
    "updatedBy": "P. Nair",
    "location": "Pune"
  },
  {
    "projectCode": "2026/RD/005",
    "productId": "PRD-2026-4815",
    "projectId": "PRD-2026-4815",
    "productName": "Budesonide/Formoterol Inhalation Powder",
    "molecule": "Budesonide + Formoterol Fumarate Dihydrate",
    "division": "Respiratory",
    "starProduct": "No",
    "registrationType": "Complex generic / device combination development",
    "projectOwner": "Product Development",
    "projectLead": "V. Rao",
    "priority": "Critical",
    "projectStartDate": "01-Feb-2027",
    "projectEndDate": "31-Jul-2028",
    "projectBudget": "1.1",
    "market": "India / selected regulated markets",
    "marketSizeLast3Years": "Market size and growth to be confirmed through validated respiratory market research",
    "marketSizeUsdMnYr": "110",
    "projectedMarketShare": "3.0%",
    "commercialAttractiveness": "High",
    "projectedNpv": "5.2",
    "dosageForm": "Dry powder for inhalation",
    "strength": "Proposed dose combinations to be defined from reference label and target market",
    "fillVolume": "Metered-dose / delivered-dose configuration to be confirmed",
    "pharmacopoeia": "Applicable API and finished-product standards to be confirmed",
    "packagingDetails": "Inhaler device with foil blister or reservoir system; device strategy pending",
    "innovatorCompany": "Reference innovator to be confirmed",
    "innovatorBrandName": "Reference brand to be confirmed",
    "innovatorDosageForm": "Combination inhalation product; reference device and dosage form to be verified",
    "innovatorStrengths": "Strength combinations to be confirmed from official labeling",
    "innovatorApprovalDate": "Official approval date to be verified by target market",
    "innovatorPackPresentation": "Device and pack presentation to be confirmed",
    "innovatorBioStrength": "Not applicable unless comparative clinical/PK strategy requires it",
    "rldInformation": "Reference SmPC/PIL/COA and device documentation pending",
    "innovatorVsJodas": "Compare delivered dose, aerodynamic particle size, device usability, labeling and in-vitro performance",
    "ipDetails": "Patent, device IP, formulation and freedom-to-operate assessment required",
    "apiManufacturer": "Separate API suppliers for both actives to be assessed",
    "polymorphForm": "API form, particle size and inhalation-grade controls to be confirmed",
    "cepDmfNoReceiptStatus": "DMF/CEP status to be confirmed for both APIs",
    "dmfAsmfCepReceived": "Pending",
    "apiVendorQualification": "Qualification pending for both API sources",
    "apiMl": "GMP and micronization capability to be verified",
    "apiGmp": "To be confirmed for each API source",
    "ml": "Target-market requirements to be confirmed",
    "whoGmp": "Target-market requirements to be confirmed",
    "fsc": "Target-market requirements to be confirmed",
    "copp": "Target-market requirements to be confirmed",
    "bioStudyCroName": "Specialist inhalation testing / clinical CRO to be assessed",
    "bioStudyCroGmpStatus": "Quality-system and capability audit required if CRO engaged",
    "beNoc": "Regulatory team to confirm BE/clinical study and NOC pathway",
    "studyTimePeriod": "Planning estimate: 15–18 months; device and performance studies may drive timeline",
    "bioStudyReport": "Not available; study strategy to be defined",
    "remarks": "Illustrative project data. Complex generic, inhaler-device, performance, IP and regulatory feasibility require expert review.",
    "status": "Active",
    "historyCount": 3,
    "updatedDate": "22-Sep-2026",
    "updatedBy": "V. Rao",
    "location": "Mumbai"
  }
];

export const projectOwners = [
  "Product Strategy",
  "Portfolio Management",
  "Technical Operations",
  "Product Development",
  "Ananya Rao",
  "Rahul Mehta",
  "Priya Nair",
  "Karthik Reddy",
  "Neha Kapoor",
  "Shantaram",
  "Dutta"
];

export const projectLeads = [
  "A. Sharma",
  "R. Mehta",
  "S. Iyer",
  "P. Nair",
  "V. Rao",
  "V. Sharma",
  "A. Menon",
  "R. Kulkarni"
];

export const molecules = [
  "Dapagliflozin",
  "Levetiracetam",
  "Pantoprazole Sodium",
  "Ceftriaxone Sodium",
  "Budesonide + Formoterol Fumarate Dihydrate"
];

export const dosageForms = [
  "Film-coated tablets",
  "Oral solution",
  "Delayed-release / enteric-coated tablets",
  "Sterile powder for injection",
  "Dry powder for inhalation"
];

export const targetMarkets = [
  "India / ASEAN",
  "India / Middle East",
  "India / Africa",
  "India / selected export markets",
  "India / selected regulated markets",
  "Domestic"
];

export const competitionLevels = [
  "High",
  "Medium",
  "Low",
  "Tier-1 Established",
  "Commodity"
];

export const commercialAttractivenessOptions = [
  "High",
  "Medium",
  "Low",
  "Attractive",
  "Very attractive"
];

export const priorityOptions = [
  "Critical",
  "High",
  "Medium",
  "Low"
];

export const productStatusOptions = [
  "Active",
  "Under evaluation",
  "In Development",
  "Completed",
  "On Hold"
];

export const drugAuthorityOptions = [
  "Applicable pharmacopoeia",
  "USFDA / EMA",
  "MHRA / TGA",
  "CDSCO",
  "WHO"
];

export const locations = [
  "Hyderabad",
  "Bengaluru",
  "Ahmedabad",
  "Pune",
  "Mumbai",
  "Chennai",
  "Gurugram"
];
