export interface StageColumnHeader {
  key: string;
  label: string;
  stageCode: string;
  stageNumber: number;
  subtitle: string;
  fullName: string;
  projectCount: number;
}

export interface GateColumnHeader {
  key: string;
  label: string;
  subtitle: string;
}

export interface StageRow {
  [key: string]: string;
}

export interface GateRow {
  [key: string]: string;
}

export const INDUSTRIAL_DIVISIONS: string[] = [
  'All',
  'Equipment Engineering - CT',
  'Industrial Machinery - MA',
  'Process Equipment - GT',
  'Production Systems - VX',
];

export const INDUSTRIAL_LOCATIONS: string[] = [
  'All',
  'Ahmedabad - Mfg Plant',
  'Hyderabad - Engg Centre',
  'Pune - QC & Materials Lab',
  'Bengaluru - Reliability Facility',
  'Mumbai - Central Warehouse',
];

export const INDUSTRIAL_PROJECT_NAMES: string[] = [
  'Industrial Equipment Line Expansion',
  'CNC Machining Process Optimization',
  'Automated Packaging Line Development',
  'Industrial Pump Assembly Development',
  'Industrial Compressor Assembly Development',
  'CNC Machining Line Capacity Expansion',
  'Industrial Pump Assembly Line Upgrade',
  'Automated Packaging Line Installation',
  'Industrial Compressor Manufacturing & Operations Equipment',
  'Factory Utilities & Material Handling Upgrade',
  'Automated Production Line Control System',
  'Pilot Production Line Trial',
];

export const INDUSTRIAL_STAGE_HEADERS: StageColumnHeader[] = [
  { key: 's1', label: 'Stage 1', stageCode: 'S1', stageNumber: 1, subtitle: 'Business Need & Opportunity Assessment', fullName: 'S1 - Business Need & Opportunity Assessment', projectCount: 20 },
  { key: 's2', label: 'Stage 2', stageCode: 'S2', stageNumber: 2, subtitle: 'Project Scope & Feasibility Validation', fullName: 'S2 - Project Scope & Feasibility Validation', projectCount: 19 },
  { key: 's3', label: 'Stage 3', stageCode: 'S3', stageNumber: 3, subtitle: 'Concept Engineering & Solution Development', fullName: 'S3 - Concept Engineering & Solution Development', projectCount: 18 },
  { key: 's4', label: 'Stage 4', stageCode: 'S4', stageNumber: 4, subtitle: 'Detailed Engineering & Design Optimization', fullName: 'S4 - Detailed Engineering & Design Optimization', projectCount: 17 },
  { key: 's5', label: 'Stage 5', stageCode: 'S5', stageNumber: 5, subtitle: 'Concept Selection & Design Freeze', fullName: 'S5 - Concept Selection & Design Freeze', projectCount: 16 },
  { key: 's6', label: 'Stage 6', stageCode: 'S6', stageNumber: 6, subtitle: 'Process Engineering & Equipment Design', fullName: 'S6 - Process Engineering & Equipment Design', projectCount: 15 },
  { key: 's7', label: 'Stage 7', stageCode: 'S7', stageNumber: 7, subtitle: 'Prototype Fabrication & Engineering Validation', fullName: 'S7 - Prototype Fabrication & Engineering Validation', projectCount: 14 },
  { key: 's8', label: 'Stage 8', stageCode: 'S8', stageNumber: 8, subtitle: 'Installation Planning & Site Installation Readiness', fullName: 'S8 - Installation Planning & Site Installation Readiness', projectCount: 13 },
  { key: 's9', label: 'Stage 9', stageCode: 'S9', stageNumber: 9, subtitle: 'Equipment Installation & Integration', fullName: 'S9 - Equipment Installation & Integration', projectCount: 12 },
  { key: 's10', label: 'Stage 10', stageCode: 'S10', stageNumber: 10, subtitle: 'Commissioning & Performance Testing', fullName: 'S10 - Commissioning & Performance Testing', projectCount: 11 },
  { key: 's11', label: 'Stage 11', stageCode: 'S11', stageNumber: 11, subtitle: 'Operational Qualification & Production Ramp-Up', fullName: 'S11 - Operational Qualification & Production Ramp-Up', projectCount: 10 },
  { key: 's12', label: 'Stage 12', stageCode: 'S12', stageNumber: 12, subtitle: 'Operational Handover & Project Closeout', fullName: 'S12 - Operational Handover & Project Closeout', projectCount: 9 },
];

export const INDUSTRIAL_STAGE_NAME_MAP: Record<string, string> = Object.fromEntries(
  INDUSTRIAL_STAGE_HEADERS.map(h => [h.stageCode, h.subtitle])
);

export const INDUSTRIAL_GATE_HEADERS: GateColumnHeader[] = [
  { key: 'g1', label: 'Gate 1', subtitle: 'Business Case Approval' },
  { key: 'g2', label: 'Gate 2', subtitle: 'Concept Selection & Design Freeze' },
  { key: 'g3', label: 'Gate 3', subtitle: 'Procurement & Build Readiness' },
  { key: 'g4', label: 'Gate 4', subtitle: 'Commissioning & Performance Acceptance' },
  { key: 'g5', label: 'Gate 5', subtitle: 'Operational Handover Approval' },
];

export const INDUSTRIAL_GATE_NAME_MAP: Record<string, string> = {
  'Gate 1': 'Business Case Approval',
  'Gate 2': 'Concept Selection & Design Freeze',
  'Gate 3': 'Procurement & Build Readiness',
  'Gate 4': 'Commissioning & Performance Acceptance',
  'Gate 5': 'Operational Handover Approval',
};

function repeatToLength(seed: string[], count: number): string[] {
  return Array.from({ length: count }, (_, idx) => seed[idx % seed.length]);
}

/**
 * Generates stage rows matching Section 1 of Industrial_Manufacturing_Data_Table.xlsx.
 */
export function buildIndustrialStageRows(): StageRow[] {
  const maxRows = 20;
  const rows: StageRow[] = [];
  for (let r = 0; r < maxRows; r++) {
    const row: StageRow = {};
    INDUSTRIAL_STAGE_HEADERS.forEach((head, colIdx) => {
      row[head.key] =
        r < head.projectCount
          ? INDUSTRIAL_PROJECT_NAMES[(r + colIdx) % INDUSTRIAL_PROJECT_NAMES.length]
          : '';
    });
    rows.push(row);
  }
  return rows;
}

/**
 * Generates gate rows matching Section 2 of Industrial_Manufacturing_Data_Table.xlsx.
 */
export function buildIndustrialGateRows(): GateRow[] {
  const g1List = repeatToLength(
    [
      'Industrial Equipment Line Expansion',
      'CNC Machining Process Optimization',
      'Automated Packaging Line Development',
      'Industrial Pump Assembly Development',
      'Industrial Compressor Assembly Development',
    ],
    20
  );
  const g2List = repeatToLength(
    [
      'CNC Machining Line Capacity Expansion',
      'Industrial Pump Assembly Line Upgrade',
      'Automated Packaging Line Installation',
      'Industrial Compressor Manufacturing & Operations Equipment',
      'Factory Utilities & Material Handling Upgrade',
    ],
    17
  );
  const g3List = repeatToLength(
    [
      'Automated Production Line Control System',
      'Pilot Production Line Trial',
      'Industrial Equipment Line Expansion',
      'CNC Machining Line Capacity Expansion',
      'Industrial Pump Assembly Line Upgrade',
    ],
    14
  );
  const g4List = repeatToLength(
    [
      'CNC Machining Process Optimization',
      'Automated Packaging Line Development',
      'Industrial Pump Assembly Development',
      'Automated Packaging Line Installation',
      'Industrial Compressor Manufacturing & Operations Equipment',
    ],
    11
  );
  const g5List = repeatToLength(
    [
      'Industrial Compressor Assembly Development',
      'Factory Utilities & Material Handling Upgrade',
      'Automated Production Line Control System',
      'Pilot Production Line Trial',
      'CNC Machining Line Capacity Expansion',
    ],
    8
  );

  const maxLength = Math.max(g1List.length, g2List.length, g3List.length, g4List.length, g5List.length);
  return Array.from({ length: maxLength }, (_, i) => ({
    g1: g1List[i] || '',
    g2: g2List[i] || '',
    g3: g3List[i] || '',
    g4: g4List[i] || '',
    g5: g5List[i] || '',
  }));
}

