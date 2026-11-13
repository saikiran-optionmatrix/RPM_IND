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
  status: 'Active' | 'Inactive';
  division?: string;
  location?: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;

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
    projectCode: '2026/IND/001',
    productId: 'PRG-2026-8492',
    projectId: 'PRG-2026-8492',
    productName: 'Industrial Equipment Line Expansion',
    molecule: 'Automated Assembly & Material Transfer Line',
    division: 'Industrial Machinery - MA',
    starProduct: 'Yes',
    registrationType: 'Industrial Equipment Development / ISO & BIS Compliance',
    projectOwner: 'Plant Engineering Strategy',
    projectLead: 'Ananya Rao',
    priority: 'High',
    projectStartDate: '01-Nov-2026',
    projectEndDate: '31-Oct-2027',
    projectBudget: '1.45',
    market: 'India / ASEAN',
    marketSizeLast3Years: '14% CAGR across heavy machinery & factory automation (2023–2025)',
    marketSizeUsdMnYr: '125',
    projectedMarketShare: '8.5%',
    commercialAttractiveness: 'High',
    projectedNpv: '6.4',
    dosageForm: 'Modular conveyor & servo-actuated assembly line',
    strength: '120 units/hr throughput; 415V 3-phase',
    fillVolume: '18,500 sq. ft. bay footprint',
    pharmacopoeia: 'ISO 9001, ISO 13849-1, IEC 60204-1, BIS Safety',
    packagingDetails: 'IP54 steel control enclosures with safety light-curtain guarding',
    innovatorCompany: 'Siemens / Bosch Rexroth Benchmark',
    innovatorBrandName: 'Rexroth Modular Transfer System',
    innovatorDosageForm: 'Automated servo assembly cell',
    innovatorStrengths: '110–130 units/hr nominal rating',
    innovatorApprovalDate: 'Commissioned Q2 2022',
    innovatorPackPresentation: 'Turnkey 6-station line + SCADA HMI',
    innovatorBioStrength: 'OEE >= 85% continuous 3-shift operation',
    rldInformation: 'OEM technical manual, P&ID and FAT/SAT benchmark spec collected',
    innovatorVsJodas: 'Benchmark cycle time, power draw, footprint and PLC interoperability',
    ipDetails: 'Freedom-to-operate verified for servo indexing and safety PLC logic',
    apiManufacturer: 'Nominated OEM & Tier-1 Drive Suppliers',
    polymorphForm: 'PLC / SCADA + Servo Indexing Platform',
    cepDmfNoReceiptStatus: 'Technical Specification Pack: Approved',
    dmfAsmfCepReceived: 'Received',
    apiVendorQualification: 'Qualified (ISO 9001 Audited)',
    apiMl: 'Factory Compliance Active',
    apiGmp: 'ISO 9001 / CE Certified',
    ml: 'Plant Operations License Active',
    whoGmp: 'ISO 45001 / ISO 14001 Compliant',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'TUV Rheinland Industrial Inspection',
    bioStudyCroGmpStatus: 'ISO/IEC 17020 Accredited',
    beNoc: 'Factory Inspectorate & Electrical Safety Permit Approved',
    studyTimePeriod: '6–9 months (FAT, SAT & 72-hr endurance run)',
    bioStudyReport: 'FAT Protocol Approved; SAT Scheduled',
    remarks: 'Flagship line expansion to boost plant assembly capacity by 35%.',
    status: 'Active',
    historyCount: 4,
    updatedDate: '05-Oct-2026',
    updatedBy: 'Ananya Rao',
    location: 'Ahmedabad - Mfg Plant'
  },
  {
    projectCode: '2026/IND/002',
    productId: 'PRG-2026-5127',
    projectId: 'PRG-2026-5127',
    productName: 'CNC Machining Process Optimization',
    molecule: '5-Axis CNC Machining Center Upgrade',
    division: 'Equipment Engineering - CT',
    starProduct: 'Yes',
    registrationType: 'Plant Modernization / Precision Tooling Upgrade',
    projectOwner: 'Manufacturing Excellence',
    projectLead: 'Rajesh Kumar',
    priority: 'High',
    projectStartDate: '01-Dec-2026',
    projectEndDate: '30-Nov-2027',
    projectBudget: '0.85',
    market: 'India / Europe Export',
    marketSizeLast3Years: 'Precision CNC machining demand up 11% YoY (2023–2025)',
    marketSizeUsdMnYr: '78',
    projectedMarketShare: '7.0%',
    commercialAttractiveness: 'High',
    projectedNpv: '4.1',
    dosageForm: '5-Axis Simultaneous CNC Machining Cell',
    strength: '18,000 RPM spindle; +/- 0.005 mm tolerance',
    fillVolume: '2,400 sq. ft. climate-controlled cell',
    pharmacopoeia: 'ISO 230-2 Positioning Accuracy, ISO 9001, CE Machinery Directive',
    packagingDetails: 'Full splash enclosure with mist collector & chip conveyor',
    innovatorCompany: 'DMG MORI / Mazak Benchmark',
    innovatorBrandName: 'DMU 50 3rd Generation',
    innovatorDosageForm: '5-Axis Universal Milling Machine',
    innovatorStrengths: '15,000–20,000 RPM spindle class',
    innovatorApprovalDate: 'Commissioned Q4 2021',
    innovatorPackPresentation: 'Machine + 60-tool ATC + Renishaw probing',
    innovatorBioStrength: 'Cpk >= 1.67 on aerospace/industrial housings',
    rldInformation: 'Spindle thermal drift & CMM inspection baseline collected',
    innovatorVsJodas: 'Reduce cycle time by 22% and scrap rate below 0.5%',
    ipDetails: 'Custom fixture & toolpath NC post-processor owned in-house',
    apiManufacturer: 'Shortlisted CNC Spindle & Linear Guide OEMs',
    polymorphForm: 'CNC-K1 High-Precision Milling Platform',
    cepDmfNoReceiptStatus: 'Technical Dossier & Laser Calibration File: Received',
    dmfAsmfCepReceived: 'Received',
    apiVendorQualification: 'Under Technical Audit',
    apiMl: 'OEM Compliance Verified',
    apiGmp: 'ISO 9001 Certified',
    ml: 'Plant License Active',
    whoGmp: 'ISO 14001 / EHS Compliant',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'CMTI Metrology & Inspection Agency',
    bioStudyCroGmpStatus: 'NABL Accredited Lab',
    beNoc: 'Plant Safety & Power Load Sanction Approved',
    studyTimePeriod: '4–6 months (Cpk & thermal stability trials)',
    bioStudyReport: 'First-Article CMM Report Planned',
    remarks: 'Targets bottleneck reduction in precision housing machining.',
    status: 'Active',
    historyCount: 5,
    updatedDate: '03-Oct-2026',
    updatedBy: 'Rajesh Kumar',
    location: 'Hyderabad - Engg Centre'
  },
  {
    projectCode: '2026/IND/003',
    productId: 'PRG-2026-9341',
    projectId: 'PRG-2026-9341',
    productName: 'Automated Packaging Line Development',
    molecule: 'Robotic Case Packing & Palletizing System',
    division: 'Production Systems - VX',
    starProduct: 'Yes',
    registrationType: 'Industrial Automation / End-of-Line Integration',
    projectOwner: 'Operations Automation',
    projectLead: 'Anita Desai',
    priority: 'High',
    projectStartDate: '01-Jan-2027',
    projectEndDate: '31-Dec-2027',
    projectBudget: '0.92',
    market: 'India / Middle East / ASEAN',
    marketSizeLast3Years: 'End-of-line robotics adoption grew 19% (2023–2025)',
    marketSizeUsdMnYr: '64',
    projectedMarketShare: '6.5%',
    commercialAttractiveness: 'Medium',
    projectedNpv: '3.8',
    dosageForm: '6-Axis Robotic Pick-and-Place & Stretch Wrapper',
    strength: '35 cases/min; 25 kg max payload',
    fillVolume: '3,200 sq. ft. end-of-line zone',
    pharmacopoeia: 'ISO 10218-1 Industrial Robots, ANSI/RIA R15.06, GS1 Barcode',
    packagingDetails: 'Heavy-duty corrugated case erector + perimeter safety fencing',
    innovatorCompany: 'FANUC / KUKA Integrator Benchmark',
    innovatorBrandName: 'FANUC M-410iC Palletizing Cell',
    innovatorDosageForm: '4/6-Axis Robotic Palletizer',
    innovatorStrengths: '30–40 cycles/min rated speed',
    innovatorApprovalDate: 'Commissioned Q1 2023',
    innovatorPackPresentation: 'Robot + Vision Camera + Roller Conveyor',
    innovatorBioStrength: '99.4% barcode read & case-seal accuracy',
    rldInformation: 'Vision camera specs & conveyor interface drawings collected',
    innovatorVsJodas: 'Compare payload, changeover time and WMS/ERP handshake',
    ipDetails: 'Standard integrator IP; custom gripper CAD owned internally',
    apiManufacturer: 'Robotic OEM & Vision System Integrator Shortlisted',
    polymorphForm: 'PLC + Vision-Guided Robotics Platform',
    cepDmfNoReceiptStatus: 'Control Panel & Safety Matrix: Pending Review',
    dmfAsmfCepReceived: 'Pending',
    apiVendorQualification: 'Qualification in Progress',
    apiMl: 'Pending OEM Audit',
    apiGmp: 'CE / ISO 10218-1 Required',
    ml: 'Plant Operations Active',
    whoGmp: 'ISO 45001 Safety Standard',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'Bureau Veritas Machinery Safety',
    bioStudyCroGmpStatus: 'Accredited Inspection Body',
    beNoc: 'Machine Guarding & Robot Risk Assessment Pending',
    studyTimePeriod: '5–7 months (FAT & 48-hr line run)',
    bioStudyReport: 'Pending Site Readiness',
    remarks: 'Eliminates manual palletizing ergonomics risk on Line 3.',
    status: 'Active',
    historyCount: 2,
    updatedDate: '30-Sep-2026',
    updatedBy: 'Anita Desai',
    location: 'Pune - QC & Materials Lab'
  },
  {
    projectCode: '2026/IND/004',
    productId: 'PRG-2026-2678',
    projectId: 'PRG-2026-2678',
    productName: 'Industrial Pump Assembly Development',
    molecule: 'High-Pressure Centrifugal Pump Assembly',
    division: 'Process Equipment - GT',
    starProduct: 'Yes',
    registrationType: 'Core Equipment Development / API 610 & ISO 5199',
    projectOwner: 'Process Equipment Engineering',
    projectLead: 'Priya Reddy',
    priority: 'Critical',
    projectStartDate: '15-Nov-2026',
    projectEndDate: '29-Feb-2028',
    projectBudget: '1.15',
    market: 'India / Global Process Industries',
    marketSizeLast3Years: 'Process pump demand steady at 9.5% CAGR (2023–2025)',
    marketSizeUsdMnYr: '95',
    projectedMarketShare: '5.5%',
    commercialAttractiveness: 'High',
    projectedNpv: '5.2',
    dosageForm: 'Multi-Stage Horizontal Centrifugal Pump Assembly',
    strength: '450 m3/hr flow; 18 bar discharge head',
    fillVolume: 'Hydrostatic test skid 1,500 sq. ft.',
    pharmacopoeia: 'API 610, ISO 5199, ISO 10816 Vibration, ASME B16.5',
    packagingDetails: 'Duplex SS316L casing with mechanical cartridge seal & skid frame',
    innovatorCompany: 'Flowserve / Sulzer Benchmark',
    innovatorBrandName: 'Sulzer CPT Process Pump',
    innovatorDosageForm: 'End-suction centrifugal process pump',
    innovatorStrengths: '400–500 m3/hr; 82% hydraulic efficiency',
    innovatorApprovalDate: 'Commissioned Q3 2020',
    innovatorPackPresentation: 'Pump + VFD Motor + Baseplate Skid',
    innovatorBioStrength: 'NPSHr < 3.2 m; < 2.3 mm/s RMS vibration',
    rldInformation: 'Hydraulic performance curves & NPSH test benchmarks collected',
    innovatorVsJodas: 'Improve hydraulic efficiency by 3% and seal MTBF > 24,000 hrs',
    ipDetails: 'Impeller vane geometry patent clearance under review',
    apiManufacturer: 'Investment Casting Foundry & Mechanical Seal Vendors',
    polymorphForm: 'Precision Cast Impeller + VFD Drive Platform',
    cepDmfNoReceiptStatus: 'Metallurgy MTC & Hydrotest Spec: Pending',
    dmfAsmfCepReceived: 'Pending',
    apiVendorQualification: 'Foundry Qualification Scheduled',
    apiMl: 'EN 10204 3.1 MTC Required',
    apiGmp: 'ISO 9001 /PED Certified',
    ml: 'Manufacturing License Active',
    whoGmp: 'ISO 14001 / Safety Compliant',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'SGS Hydrostatic & Vibration Lab',
    bioStudyCroGmpStatus: 'ISO/IEC 17025 Accredited',
    beNoc: 'Pressure Vessel & Hydrotest Safety Clearance Required',
    studyTimePeriod: '9–12 months (Hydraulic & endurance loop)',
    bioStudyReport: 'Test Loop Protocol Drafted',
    remarks: 'Critical fluid-handling platform for chemical and process plant clients.',
    status: 'Active',
    historyCount: 6,
    updatedDate: '26-Sep-2026',
    updatedBy: 'Priya Reddy',
    location: 'Bengaluru - Reliability Facility'
  },
  {
    projectCode: '2026/IND/005',
    productId: 'PRG-2026-4815',
    projectId: 'PRG-2026-4815',
    productName: 'Industrial Compressor Assembly Development',
    molecule: 'Oil-Free Rotary Screw Compressor System',
    division: 'Process Equipment - GT',
    starProduct: 'No',
    registrationType: 'Industrial Machinery & Energy Efficiency Program',
    projectOwner: 'Utilities & Compression Systems',
    projectLead: 'Suresh Naidu',
    priority: 'Critical',
    projectStartDate: '01-Feb-2027',
    projectEndDate: '31-Jul-2028',
    projectBudget: '1.30',
    market: 'India / Southeast Asia / Europe',
    marketSizeLast3Years: 'Oil-free compressor segment grew 12% YoY (2023–2025)',
    marketSizeUsdMnYr: '110',
    projectedMarketShare: '4.5%',
    commercialAttractiveness: 'High',
    projectedNpv: '5.8',
    dosageForm: 'Two-Stage Oil-Free Rotary Screw Compressor Package',
    strength: '160 kW IE4 VSD motor; 8.5–10 bar; 26 m3/min FAD',
    fillVolume: 'Acoustic canopy 2,800 x 1,650 x 2,100 mm',
    pharmacopoeia: 'ISO 8573-1 Class 0 Air Purity, ISO 1217 Performance, ASME Sec VIII',
    packagingDetails: 'Sound-attenuated galvanized canopy (< 72 dBA) + heat recovery module',
    innovatorCompany: 'Atlas Copco / Ingersoll Rand Benchmark',
    innovatorBrandName: 'Atlas Copco ZR 160 VSD+',
    innovatorDosageForm: 'Two-stage oil-free screw compressor',
    innovatorStrengths: '160 kW; ISO Class 0 certified',
    innovatorApprovalDate: 'Commissioned Q1 2022',
    innovatorPackPresentation: 'Compressor + Integrated Refrigerant Dryer + Controller',
    innovatorBioStrength: 'Specific energy <= 6.1 kW/(m3/min)',
    rldInformation: 'ISO 1217 FAD & energy-consumption benchmarks collected',
    innovatorVsJodas: 'Benchmark specific energy, oil-free Class 0 rating and noise level',
    ipDetails: 'Rotor profile & intercooler IP clearance underway',
    apiManufacturer: 'Airend Machining & IE4 Motor Suppliers Evaluated',
    polymorphForm: 'Twin-Screw VSD + Heat Recovery Platform',
    cepDmfNoReceiptStatus: 'Pressure Vessel & Airend File: Pending',
    dmfAsmfCepReceived: 'Pending',
    apiVendorQualification: 'Vendor Audit Planned',
    apiMl: 'ASME U-Stamp / PESO Required',
    apiGmp: 'ISO 9001 Certified',
    ml: 'Plant License Active',
    whoGmp: 'ISO 50001 Energy / ISO 45001',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'Intertek Acoustic & Energy Lab',
    bioStudyCroGmpStatus: 'ISO/IEC 17025 Accredited',
    beNoc: 'PESO / IBR Pressure Vessel Approval Required',
    studyTimePeriod: '12–15 months (Class 0 & 1,000-hr endurance)',
    bioStudyReport: 'Endurance Test Rig Under Setup',
    remarks: 'Delivers zero-oil plant compressed air with 18% lower energy draw.',
    status: 'Active',
    historyCount: 3,
    updatedDate: '22-Sep-2026',
    updatedBy: 'Suresh Naidu',
    location: 'Mumbai - Central Warehouse'
  },
  {
    projectCode: '2026/IND/006',
    productId: 'PRG-2026-6104',
    projectId: 'PRG-2026-6104',
    productName: 'CNC Machining Line Capacity Expansion',
    molecule: 'Multi-Spindle Machining Cell Expansion',
    division: 'Industrial Machinery - MA',
    starProduct: 'Yes',
    registrationType: 'CapEx Capacity Expansion / Plant Automation',
    projectOwner: 'Plant Engineering Strategy',
    projectLead: 'Amit Patel',
    priority: 'High',
    projectStartDate: '15-Jan-2026',
    projectEndDate: '31-Jul-2027',
    projectBudget: '1.80',
    market: 'India / Global OEM Supply',
    marketSizeLast3Years: 'High-volume precision component demand +16% CAGR',
    marketSizeUsdMnYr: '140',
    projectedMarketShare: '9.0%',
    commercialAttractiveness: 'Very attractive',
    projectedNpv: '7.6',
    dosageForm: 'Twin-Spindle Horizontal Machining Center + Gantry Loader',
    strength: '24,000 RPM; 4-pallet FMS pool',
    fillVolume: '4,500 sq. ft. Bay B expansion',
    pharmacopoeia: 'ISO 9001, IATF 16949 Ready, ISO 13849 Safety',
    packagingDetails: 'Automated chip-recovery, coolant filtration & gantry safety enclosure',
    innovatorCompany: 'Makino / Heller Benchmark',
    innovatorBrandName: 'Makino a51nx FMS Cell',
    innovatorDosageForm: 'Horizontal machining center cell',
    innovatorStrengths: '14,000–24,000 RPM spindle class',
    innovatorApprovalDate: 'Commissioned Q2 2023',
    innovatorPackPresentation: 'Twin HMC + 4-pallet FMS + Tool Presetter',
    innovatorBioStrength: '92% spindle utilization across 3 shifts',
    rldInformation: 'FMS cycle-time & tool-life benchmark data collected',
    innovatorVsJodas: 'Double shift output with unmanned night-shift capability',
    ipDetails: 'Standard FMS architecture; custom fixture IP internal',
    apiManufacturer: 'HMC OEM & Gantry Integrator Nominated',
    polymorphForm: 'CNC-FMS Automated Machining Platform',
    cepDmfNoReceiptStatus: 'Equipment Technical Pack: Approved',
    dmfAsmfCepReceived: 'Received',
    apiVendorQualification: 'Qualified',
    apiMl: 'Factory Compliance Active',
    apiGmp: 'ISO 9001 / CE Certified',
    ml: 'Plant License Active',
    whoGmp: 'ISO 45001 Compliant',
    fsc: 'Valid',
    copp: 'Valid',
    bioStudyCroName: 'TUV SUD Equipment Safety Inspection',
    bioStudyCroGmpStatus: 'Accredited',
    beNoc: 'Foundation & HV Power Sanction Approved',
    studyTimePeriod: '6–9 months (FAT, SAT & OQ ramp-up)',
    bioStudyReport: 'FAT Completed; SAT In Progress',
    remarks: 'Primary sample program tracked across Analytics, Overview, Stages, and Gates.',
    status: 'Active',
    historyCount: 5,
    updatedDate: '05-Oct-2026',
    updatedBy: 'Amit Patel',
    location: 'Ahmedabad - Mfg Plant'
  }
];

export const projectOwners = [
  'Plant Engineering Strategy',
  'Manufacturing Excellence',
  'Operations Automation',
  'Process Equipment Engineering',
  'Utilities & Compression Systems',
  'Ananya Rao',
  'Rajesh Kumar',
  'Anita Desai',
  'Priya Reddy',
  'Suresh Naidu',
  'Amit Patel'
];

export const projectLeads = [
  'Ananya Rao',
  'Rajesh Kumar',
  'Anita Desai',
  'Priya Reddy',
  'Suresh Naidu',
  'Amit Patel',
  'Vikram Sharma',
  'R. Kulkarni'
];

export const molecules = [
  'Automated Assembly & Material Transfer Line',
  '5-Axis CNC Machining Center Upgrade',
  'Robotic Case Packing & Palletizing System',
  'High-Pressure Centrifugal Pump Assembly',
  'Oil-Free Rotary Screw Compressor System',
  'Multi-Spindle Machining Cell Expansion'
];

export const dosageForms = [
  'Modular conveyor & servo-actuated assembly line',
  '5-Axis Simultaneous CNC Machining Cell',
  '6-Axis Robotic Pick-and-Place & Stretch Wrapper',
  'Multi-Stage Horizontal Centrifugal Pump Assembly',
  'Two-Stage Oil-Free Rotary Screw Compressor Package',
  'Twin-Spindle Horizontal Machining Center + Gantry Loader'
];

export const targetMarkets = [
  'India / ASEAN',
  'India / Europe Export',
  'India / Middle East / ASEAN',
  'India / Global Process Industries',
  'India / Southeast Asia / Europe',
  'Domestic'
];

export const competitionLevels = [
  'High',
  'Medium',
  'Low',
  'Tier-1 Established',
  'Specialized OEM'
];

export const commercialAttractivenessOptions = [
  'High',
  'Medium',
  'Low',
  'Attractive',
  'Very attractive'
];

export const priorityOptions = [
  'Critical',
  'High',
  'Medium',
  'Low'
];

export const productStatusOptions = [
  'Active',
  'Under evaluation',
  'In Engineering',
  'Commissioning',
  'Completed',
  'On Hold'
];

export const drugAuthorityOptions = [
  'ISO 9001 / CE Machinery Directive',
  'BIS / Factory Inspectorate',
  'API 610 / ASME Sec VIII',
  'ISO 13849 / IEC 60204-1',
  'PESO / ISO 45001 EHS'
];

export const locations = [
  'Ahmedabad - Mfg Plant',
  'Hyderabad - Engg Centre',
  'Pune - QC & Materials Lab',
  'Bengaluru - Reliability Facility',
  'Mumbai - Central Warehouse'
];

export const industrialDivisions = [
  'Equipment Engineering - CT',
  'Industrial Machinery - MA',
  'Process Equipment - GT',
  'Production Systems - VX'
];

export const industrialTemplates = [
  'Industrial Equipment Line Expansion Program',
  'Automated Production Line Upgrade Program',
  'Industrial Control System Development',
  'Industrial Compressor Platform Development',
  'Commercial Production Line Transfer & Ramp-Up',
  'Equipment Upgrade & Post-Commissioning Change'
];
