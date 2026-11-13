export interface StageItem {
  phase: string;
  description: string;
  tasks: number;
  status: 'Active' | 'Pending' | 'Inactive';
  stageCode: string;
  stageName: string;
  division?: string;
  divisions?: string[];
  stageSerial?: number;
  sequence?: string;
  gateCode: string;
  stageDescription: string;
  planEffort: number;
  planDuration: number;
  materialBudget?: string;
  TotalUsed?: boolean;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface WbsTaskItem {
  deliverableSlNo: string;
  slNo: string;
  task: string;
  predecessor: string;
  applicability: string;
  taskCode: string;
  jobCode: string;
  department?: string;
  activityCode?: string;
  effort: string;
  duration: string;
  description: string;
  procedure: string;
  planned: string;
  assignedTo: string;
  assigned: string;
  actual: string;
  cost: string;
  worked: string;
  remaining: string;
  scheduled: string;
  date: string;
  status: string;
  submitted: string;
  requirements?: string;
  tasks?: string;
  requirementsData?: any[];
  tasksData?: any[];
  predecessorsData?: any[];
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface StageSidebarMenu {
  slNo?: string;
  name: string;
  description?: string;
  count: number;
  isOpen: boolean;
  subItems?: string[];
}

export interface StageWbsConfig {
  sidebarMenus: StageSidebarMenu[];
  modulesData: WbsTaskItem[][];
}

export const INDUSTRIAL_STAGE_DIVISIONS: string[] = [
  'Equipment Engineering - CT',
  'Industrial Machinery - MA',
  'Process Equipment - GT',
  'Production Systems - VX',
];

export const INDUSTRIAL_STAGE_GATES: string[] = [
  'Gate 1',
  'Gate 2',
  'Gate 3',
  'Gate 4',
  'Gate 5',
];

export const INDUSTRIAL_STAGE_DEPARTMENTS: string[] = [
  'Engineering & R&D',
  'Mechanical Design',
  'Automation & Controls',
  'Manufacturing & Operations',
  'Quality Assurance',
  'Quality Control & Inspection',
  'Procurement & Supply Chain',
  'EHS & Compliance',
  'Commissioning & Qualification',
  'PMO / Management',
];

export const INDUSTRIAL_JOB_CODES: string[] = [
  'ENG01',
  'ENG02',
  'MECH01',
  'ELEC01',
  'INST01',
  'CAL01',
  'CQV01',
  'QA01',
  'QC01',
  'MFG01',
  'MFG03',
  'VAL01',
];

interface SeedDeliverable {
  slNo: string;
  name: string;
  activities: {
    slNo: string;
    name: string;
    dept: string;
    predecessor?: string;
    effort: string;
    duration: string;
    cost: string;
  }[];
}

const WBS_BLUEPRINT: Record<string, { stageName: string; gateCode: string; deliverables: SeedDeliverable[] }> = {
  S1: {
    stageName: 'Business Need & Opportunity Assessment',
    gateCode: '-',
    deliverables: [
      {
        slNo: '1.1',
        name: 'Plant needs and capacity opportunity assessment',
        activities: [
          { slNo: '1.11', name: 'Plant throughput & bottleneck assessment', dept: 'Manufacturing & Operations', effort: '160', duration: '15', cost: '8000' },
          { slNo: '1.12', name: 'Existing asset & industrial equipment benchmarking', dept: 'Engineering & R&D', predecessor: '1.11 (SS)', effort: '140', duration: '15', cost: '6500' },
          { slNo: '1.13', name: 'Target plant & statutory compliance shortlist', dept: 'EHS & Compliance', predecessor: '1.12 (FS)', effort: '100', duration: '10', cost: '4000' },
          { slNo: '1.14', name: 'Factory floor footprint & logistics constraint mapping', dept: 'Manufacturing & Operations', predecessor: '1.13 (SS)', effort: '120', duration: '12', cost: '5000' },
        ],
      },
      {
        slNo: '1.2',
        name: 'Program economics and CapEx feasibility assessment',
        activities: [
          { slNo: '1.21', name: 'Production volume & line utilization forecast', dept: 'PMO / Management', predecessor: '1.14 (FS)', effort: '80', duration: '10', cost: '3000' },
          { slNo: '1.22', name: 'Preliminary CapEx, OpEx & ROI modeling', dept: 'PMO / Management', predecessor: '1.21 (SS)', effort: '70', duration: '10', cost: '2500' },
          { slNo: '1.23', name: 'Initial technical feasibility & execution risk screening', dept: 'Engineering & R&D', predecessor: '1.22 (FS)', effort: '50', duration: '10', cost: '1000' },
        ],
      },
      {
        slNo: '1.3',
        name: 'Business case approval package',
        activities: [
          { slNo: '1.31', name: 'Cross-functional plant capacity & resource readiness review', dept: 'Manufacturing & Operations', predecessor: '1.23 (FS)', effort: '60', duration: '8', cost: '2000' },
          { slNo: '1.32', name: 'Preliminary safety, environmental & hazard screening', dept: 'EHS & Compliance', predecessor: '1.31 (SS)', effort: '50', duration: '6', cost: '1500' },
          { slNo: '1.33', name: 'CapEx investment justification & financial hurdle rate model', dept: 'PMO / Management', predecessor: '1.32 (FS)', effort: '70', duration: '10', cost: '3000' },
          { slNo: '1.34', name: 'Steering committee business case approval & charter release', dept: 'PMO / Management', predecessor: '1.33 (FS)', effort: '40', duration: '5', cost: '1000' },
        ],
      },
    ],
  },
  S2: {
    stageName: 'Project Scope & Feasibility Validation',
    gateCode: 'Gate 1',
    deliverables: [
      {
        slNo: '2.1',
        name: 'Operational requirements and functional specification',
        activities: [
          { slNo: '2.11', name: 'User Requirements Specification (URS) definition', dept: 'Manufacturing & Operations', effort: '200', duration: '20', cost: '12000' },
          { slNo: '2.12', name: 'Critical-to-performance equipment parameters', dept: 'Engineering & R&D', predecessor: '2.11 (SS)', effort: '180', duration: '15', cost: '10000' },
          { slNo: '2.13', name: 'Utility, footprint & environmental constraints review', dept: 'EHS & Compliance', predecessor: '2.12 (FS)', effort: '140', duration: '15', cost: '8000' },
          { slNo: '2.14', name: 'Maintenance access & ergonomic compliance specification', dept: 'Manufacturing & Operations', predecessor: '2.13 (SS)', effort: '120', duration: '10', cost: '6000' },
        ],
      },
      {
        slNo: '2.2',
        name: 'Compliance, safety and IP strategy',
        activities: [
          { slNo: '2.21', name: 'Machine safety, CE / ISO & statutory standards audit', dept: 'EHS & Compliance', predecessor: '2.14 (FS)', effort: '160', duration: '15', cost: '9000' },
          { slNo: '2.22', name: 'Quality assurance & inspection strategy alignment', dept: 'Quality Assurance', predecessor: '2.21 (SS)', effort: '120', duration: '10', cost: '6000' },
          { slNo: '2.23', name: 'Industrial automation cybersecurity & IP architecture', dept: 'Automation & Controls', predecessor: '2.22 (FS)', effort: '140', duration: '12', cost: '7500' },
          { slNo: '2.24', name: 'Statutory environmental emission & noise level baseline', dept: 'EHS & Compliance', predecessor: '2.23 (SS)', effort: '110', duration: '10', cost: '5500' },
        ],
      },
      {
        slNo: '2.3',
        name: 'Program charter, schedule and CapEx budget',
        activities: [
          { slNo: '2.31', name: 'Integrated master schedule & milestone baseline', dept: 'PMO / Management', predecessor: '2.24 (FS)', effort: '200', duration: '15', cost: '8000' },
          { slNo: '2.32', name: 'Procurement long-lead item risk & vendor pre-qualification', dept: 'Procurement & Supply Chain', predecessor: '2.31 (SS)', effort: '150', duration: '12', cost: '6000' },
          { slNo: '2.33', name: 'Gate 1 business case & charter sign-off', dept: 'PMO / Management', predecessor: '2.32 (FS)', effort: '200', duration: '10', cost: '7000' },
          { slNo: '2.34', name: 'CapEx allocation and multi-year funding release', dept: 'PMO / Management', predecessor: '2.33 (FS)', effort: '160', duration: '10', cost: '6000' },
        ],
      },
    ],
  },
  S3: {
    stageName: 'Concept Engineering & Solution Development',
    gateCode: '-',
    deliverables: [
      {
        slNo: '3.1',
        name: 'Equipment architecture and plant layout concepts',
        activities: [
          { slNo: '3.11', name: 'Production line layout & material flow alternatives', dept: 'Mechanical Design', effort: '350', duration: '25', cost: '30000' },
          { slNo: '3.12', name: 'Automation & PLC architecture concept design', dept: 'Automation & Controls', predecessor: '3.11 (SS)', effort: '350', duration: '25', cost: '35000' },
          { slNo: '3.13', name: 'Ergonomics & maintenance access concept review', dept: 'Manufacturing & Operations', predecessor: '3.12 (FS)', effort: '250', duration: '20', cost: '20000' },
          { slNo: '3.14', name: 'Digital twin simulation & throughput bottleneck modeling', dept: 'Engineering & R&D', predecessor: '3.13 (SS)', effort: '300', duration: '20', cost: '25000' },
        ],
      },
      {
        slNo: '3.2',
        name: 'Process flow and utility integration concept',
        activities: [
          { slNo: '3.21', name: 'Power, compressed air, cooling & HVAC load sizing', dept: 'Engineering & R&D', predecessor: '3.14 (FS)', effort: '400', duration: '25', cost: '30000' },
          { slNo: '3.22', name: 'Cycle-time & OEE throughput modeling', dept: 'Manufacturing & Operations', predecessor: '3.21 (SS)', effort: '350', duration: '20', cost: '20000' },
          { slNo: '3.23', name: 'Cleanroom & environmental classification interface design', dept: 'EHS & Compliance', predecessor: '3.22 (FS)', effort: '250', duration: '15', cost: '15000' },
        ],
      },
      {
        slNo: '3.3',
        name: 'Preliminary tooling & material handling specification',
        activities: [
          { slNo: '3.31', name: 'End-of-arm tooling & robotic palletizing concepts', dept: 'Mechanical Design', predecessor: '3.23 (FS)', effort: '280', duration: '18', cost: '22000' },
          { slNo: '3.32', name: 'Automated guided vehicle (AGV) & conveyor routing', dept: 'Automation & Controls', predecessor: '3.31 (SS)', effort: '260', duration: '16', cost: '18000' },
          { slNo: '3.33', name: 'Concept milestone engineering sign-off package', dept: 'PMO / Management', predecessor: '3.32 (FS)', effort: '200', duration: '10', cost: '10000' },
        ],
      },
    ],
  },
  S4: {
    stageName: 'Detailed Engineering & Design Optimization',
    gateCode: '-',
    deliverables: [
      {
        slNo: '4.1',
        name: 'Mechanical, structural and CAD engineering package',
        activities: [
          { slNo: '4.11', name: '3D CAD assembly & structural stress analysis', dept: 'Mechanical Design', effort: '650', duration: '40', cost: '75000' },
          { slNo: '4.12', name: 'Bill of Materials (BOM) & tolerance stack-up', dept: 'Mechanical Design', predecessor: '4.11 (SS)', effort: '550', duration: '35', cost: '60000' },
          { slNo: '4.13', name: 'Finite element analysis (FEA) dynamic loading review', dept: 'Engineering & R&D', predecessor: '4.12 (FS)', effort: '500', duration: '30', cost: '50000' },
        ],
      },
      {
        slNo: '4.2',
        name: 'Electrical, PLC and control schematics',
        activities: [
          { slNo: '4.21', name: 'Electrical panel wiring & safety interlock diagrams', dept: 'Automation & Controls', predecessor: '4.13 (FS)', effort: '650', duration: '40', cost: '65000' },
          { slNo: '4.22', name: 'PLC / HMI / SCADA functional design specification', dept: 'Automation & Controls', predecessor: '4.21 (SS)', effort: '650', duration: '35', cost: '55000' },
          { slNo: '4.23', name: 'Field sensor, actuator & servo drive loop specifications', dept: 'Automation & Controls', predecessor: '4.22 (FS)', effort: '500', duration: '28', cost: '45000' },
        ],
      },
      {
        slNo: '4.3',
        name: 'DFMEA and design optimization review',
        activities: [
          { slNo: '4.31', name: 'Design FMEA & reliability simulation', dept: 'Quality Assurance', predecessor: '4.23 (FS)', effort: '700', duration: '30', cost: '45000' },
          { slNo: '4.32', name: 'Maintainability & spare parts interchangeability audit', dept: 'Manufacturing & Operations', predecessor: '4.31 (SS)', effort: '400', duration: '20', cost: '25000' },
          { slNo: '4.33', name: 'Detailed engineering design baseline freeze review', dept: 'PMO / Management', predecessor: '4.32 (FS)', effort: '350', duration: '15', cost: '20000' },
        ],
      },
    ],
  },
  S5: {
    stageName: 'Concept Selection & Design Freeze',
    gateCode: 'Gate 2',
    deliverables: [
      {
        slNo: '5.1',
        name: 'Design freeze and configuration review package',
        activities: [
          { slNo: '5.11', name: 'Final engineering drawing & specification freeze', dept: 'Engineering & R&D', effort: '400', duration: '20', cost: '25000' },
          { slNo: '5.12', name: 'Safety & HAZOP design review sign-off', dept: 'EHS & Compliance', predecessor: '5.11 (SS)', effort: '350', duration: '15', cost: '20000' },
          { slNo: '5.13', name: 'Component obsolescence & lifecycle risk assessment', dept: 'Engineering & R&D', predecessor: '5.12 (FS)', effort: '300', duration: '12', cost: '15000' },
        ],
      },
      {
        slNo: '5.2',
        name: 'OEM vendor qualification and RFQ package',
        activities: [
          { slNo: '5.21', name: 'OEM & component supplier technical qualification', dept: 'Procurement & Supply Chain', predecessor: '5.13 (FS)', effort: '400', duration: '15', cost: '20000' },
          { slNo: '5.22', name: 'Equipment bid leveling & total cost of ownership model', dept: 'Procurement & Supply Chain', predecessor: '5.21 (SS)', effort: '350', duration: '12', cost: '18000' },
          { slNo: '5.23', name: 'Supplier quality assurance agreement & audit report', dept: 'Quality Assurance', predecessor: '5.22 (FS)', effort: '280', duration: '10', cost: '12000' },
        ],
      },
      {
        slNo: '5.3',
        name: 'Gate 2 procurement release package',
        activities: [
          { slNo: '5.31', name: 'Long-lead procurement release requisition package', dept: 'Procurement & Supply Chain', predecessor: '5.23 (FS)', effort: '300', duration: '12', cost: '15000' },
          { slNo: '5.32', name: 'Gate 2 design freeze & procurement release sign-off', dept: 'PMO / Management', predecessor: '5.31 (FS)', effort: '350', duration: '10', cost: '15000' },
        ],
      },
    ],
  },
  S6: {
    stageName: 'Process Engineering & Equipment Design',
    gateCode: '-',
    deliverables: [
      {
        slNo: '6.1',
        name: 'Manufacturing process and tooling engineering',
        activities: [
          { slNo: '6.11', name: 'Tooling, fixtures & jig fabrication engineering', dept: 'Mechanical Design', effort: '800', duration: '35', cost: '120000' },
          { slNo: '6.12', name: 'Standard work & cycle-time balancing design', dept: 'Manufacturing & Operations', predecessor: '6.11 (SS)', effort: '700', duration: '30', cost: '80000' },
          { slNo: '6.13', name: 'CNC machining & stamping program verification', dept: 'Manufacturing & Operations', predecessor: '6.12 (FS)', effort: '650', duration: '28', cost: '70000' },
          { slNo: '6.14', name: 'Poke-yoke (error-proofing) fixture validation', dept: 'Quality Assurance', predecessor: '6.13 (SS)', effort: '550', duration: '22', cost: '55000' },
          { slNo: '6.15', name: 'CNC tool path & high-speed machining optimization', dept: 'Mechanical Design', predecessor: '6.14 (SS)', effort: '500', duration: '20', cost: '45000' },
        ],
      },
      {
        slNo: '6.2',
        name: 'Quality control, instrumentation and test methods',
        activities: [
          { slNo: '6.21', name: 'In-line vision, torque & sensor inspection setup', dept: 'Quality Control & Inspection', predecessor: '6.15 (FS)', effort: '800', duration: '30', cost: '95000' },
          { slNo: '6.22', name: 'Statistical Process Control (SPC) control plan release', dept: 'Quality Assurance', predecessor: '6.21 (SS)', effort: '600', duration: '25', cost: '65000' },
          { slNo: '6.23', name: 'Gage R&R measurement system analysis protocol', dept: 'Quality Control & Inspection', predecessor: '6.22 (FS)', effort: '550', duration: '22', cost: '60000' },
          { slNo: '6.24', name: 'Long-lead capital equipment & subassembly POs', dept: 'Procurement & Supply Chain', predecessor: '6.23 (SS)', effort: '1500', duration: '55', cost: '155000' },
        ],
      },
      {
        slNo: '6.3',
        name: 'Assembly line balancing and operator ergonomics',
        activities: [
          { slNo: '6.31', name: 'Shop-floor cell layout & ergonomic workstation audit', dept: 'Manufacturing & Operations', predecessor: '6.24 (FS)', effort: '500', duration: '20', cost: '45000' },
          { slNo: '6.32', name: 'Assembly sequence & standard operating instruction draft', dept: 'Manufacturing & Operations', predecessor: '6.31 (SS)', effort: '450', duration: '18', cost: '35000' },
          { slNo: '6.33', name: 'Shop-floor visual management & Andon board setup', dept: 'Manufacturing & Operations', predecessor: '6.32 (SS)', effort: '300', duration: '10', cost: '15000' },
          { slNo: '6.34', name: 'Process engineering readiness milestone sign-off', dept: 'PMO / Management', predecessor: '6.33 (FS)', effort: '350', duration: '12', cost: '20000' },
        ],
      },
    ],
  },
  S7: {
    stageName: 'Prototype Fabrication & Engineering Validation',
    gateCode: 'Gate 3',
    deliverables: [
      {
        slNo: '7.1',
        name: 'Prototype fabrication and subassembly build',
        activities: [
          { slNo: '7.11', name: 'Machining, welding & mechanical subassembly build', dept: 'Manufacturing & Operations', effort: '1200', duration: '65', cost: '280000' },
          { slNo: '7.12', name: 'Control cabinet assembly & bench power-up', dept: 'Automation & Controls', predecessor: '7.11 (SS)', effort: '950', duration: '55', cost: '210000' },
          { slNo: '7.13', name: 'Pneumatic, hydraulic & sensor harness integration', dept: 'Automation & Controls', predecessor: '7.12 (FS)', effort: '850', duration: '45', cost: '180000' },
          { slNo: '7.14', name: 'Subassembly mechanical dry-cycling & backlash test', dept: 'Mechanical Design', predecessor: '7.13 (SS)', effort: '750', duration: '40', cost: '150000' },
        ],
      },
      {
        slNo: '7.2',
        name: 'Engineering validation and FAT readiness',
        activities: [
          { slNo: '7.21', name: 'Instrument calibration & vibration / thermal trials', dept: 'Quality Control & Inspection', predecessor: '7.14 (FS)', effort: '1150', duration: '60', cost: '220000' },
          { slNo: '7.22', name: 'PLC logic verification & emergency stop response test', dept: 'Automation & Controls', predecessor: '7.21 (SS)', effort: '900', duration: '45', cost: '170000' },
          { slNo: '7.23', name: 'Prototype Cpk capability & dimensional CMM inspection', dept: 'Quality Control & Inspection', predecessor: '7.22 (FS)', effort: '850', duration: '40', cost: '160000' },
          { slNo: '7.24', name: 'Factory Acceptance Test (FAT) & Gate 3 approval', dept: 'Commissioning & Qualification', predecessor: '7.23 (FS)', effort: '1200', duration: '60', cost: '190000' },
        ],
      },
      {
        slNo: '7.3',
        name: 'FAT deficiency punch list resolution and shipment release',
        activities: [
          { slNo: '7.31', name: 'FAT punch list resolution & hardware re-testing', dept: 'Manufacturing & Operations', predecessor: '7.24 (FS)', effort: '650', duration: '30', cost: '110000' },
          { slNo: '7.32', name: 'Equipment preservation, crating & shipping permit package', dept: 'Procurement & Supply Chain', predecessor: '7.31 (SS)', effort: '500', duration: '20', cost: '90000' },
          { slNo: '7.33', name: 'Pre-shipment cleaning, packaging & transport log', dept: 'Procurement & Supply Chain', predecessor: '7.32 (SS)', effort: '350', duration: '12', cost: '40000' },
          { slNo: '7.34', name: 'Dispatch authorization & Gate 3 build sign-off', dept: 'PMO / Management', predecessor: '7.33 (FS)', effort: '400', duration: '15', cost: '60000' },
        ],
      },
    ],
  },
  S8: {
    stageName: 'Installation Planning & Site Installation Readiness',
    gateCode: '-',
    deliverables: [
      {
        slNo: '8.1',
        name: 'Foundation, civil and plant utility readiness',
        activities: [
          { slNo: '8.11', name: 'Floor loading, foundation & anchor-bolt civil works', dept: 'Engineering & R&D', effort: '650', duration: '35', cost: '50000' },
          { slNo: '8.12', name: 'HV/LV power, compressed air & exhaust hook-up prep', dept: 'Engineering & R&D', predecessor: '8.11 (SS)', effort: '600', duration: '30', cost: '45000' },
          { slNo: '8.13', name: 'Chilled water & process cooling line installation', dept: 'Engineering & R&D', predecessor: '8.12 (FS)', effort: '500', duration: '25', cost: '35000' },
        ],
      },
      {
        slNo: '8.2',
        name: 'Rigging, EHS permit and site readiness sign-off',
        activities: [
          { slNo: '8.21', name: 'Rigging plan, LOTO & EHS work permit clearance', dept: 'EHS & Compliance', predecessor: '8.13 (FS)', effort: '550', duration: '25', cost: '25000' },
          { slNo: '8.22', name: 'Equipment laydown area & delivery access corridor audit', dept: 'Manufacturing & Operations', predecessor: '8.21 (SS)', effort: '400', duration: '18', cost: '18000' },
          { slNo: '8.23', name: 'Pre-delivery site inspection & readiness certificate', dept: 'Commissioning & Qualification', predecessor: '8.22 (FS)', effort: '350', duration: '15', cost: '15000' },
        ],
      },
      {
        slNo: '8.3',
        name: 'Installation tooling and contractor mobilization',
        activities: [
          { slNo: '8.31', name: 'Rigging cranes, gantry systems & laser alignment tool prep', dept: 'Manufacturing & Operations', predecessor: '8.23 (FS)', effort: '380', duration: '18', cost: '22000' },
          { slNo: '8.32', name: 'Mechanical/electrical installation crew safety induction', dept: 'EHS & Compliance', predecessor: '8.31 (SS)', effort: '300', duration: '12', cost: '14000' },
          { slNo: '8.33', name: 'Site mobilization baseline review & start clearance', dept: 'PMO / Management', predecessor: '8.32 (FS)', effort: '250', duration: '10', cost: '10000' },
        ],
      },
    ],
  },
  S9: {
    stageName: 'Equipment Installation & Integration',
    gateCode: '-',
    deliverables: [
      {
        slNo: '9.1',
        name: 'Shop-floor equipment installation and alignment',
        activities: [
          { slNo: '9.11', name: 'Heavy equipment rigging, leveling & laser alignment', dept: 'Commissioning & Qualification', effort: '1400', duration: '100', cost: '450000' },
          { slNo: '9.12', name: 'Mechanical piping, guarding & conveyor tie-in', dept: 'Mechanical Design', predecessor: '9.11 (SS)', effort: '1200', duration: '95', cost: '380000' },
          { slNo: '9.13', name: 'Anchor grouting & structural vibration isolation check', dept: 'Engineering & R&D', predecessor: '9.12 (FS)', effort: '950', duration: '75', cost: '280000' },
          { slNo: '9.14', name: 'Power distribution & transformer busway energization', dept: 'Automation & Controls', predecessor: '9.13 (SS)', effort: '1100', duration: '80', cost: '320000' },
          { slNo: '9.15', name: 'Overhead crane rail inspection & seismic tie-down check', dept: 'Engineering & R&D', predecessor: '9.14 (SS)', effort: '900', duration: '60', cost: '240000' },
        ],
      },
      {
        slNo: '9.2',
        name: 'PLC, SCADA and MES system integration',
        activities: [
          { slNo: '9.21', name: 'Fieldbus, I/O loop checks & SCADA/MES integration', dept: 'Automation & Controls', predecessor: '9.15 (FS)', effort: '1400', duration: '105', cost: '370000' },
          { slNo: '9.22', name: 'Safety circuit (PLd / Cat 3) hardwired loop verification', dept: 'Automation & Controls', predecessor: '9.21 (SS)', effort: '1150', duration: '85', cost: '290000' },
          { slNo: '9.23', name: 'HMI alarm management & event logger configuration', dept: 'Automation & Controls', predecessor: '9.22 (FS)', effort: '900', duration: '70', cost: '220000' },
          { slNo: '9.24', name: 'Industrial OT network firewall & MES handshake test', dept: 'Automation & Controls', predecessor: '9.23 (SS)', effort: '850', duration: '65', cost: '210000' },
          { slNo: '9.25', name: 'Historian data logging & edge computing gateway setup', dept: 'Automation & Controls', predecessor: '9.24 (SS)', effort: '800', duration: '55', cost: '190000' },
        ],
      },
      {
        slNo: '9.3',
        name: 'Mechanical completion and utility dry run sign-off',
        activities: [
          { slNo: '9.31', name: 'Piping pressure leak test & pneumatic system blowdown', dept: 'Mechanical Design', predecessor: '9.25 (FS)', effort: '800', duration: '60', cost: '180000' },
          { slNo: '9.32', name: 'Mechanical completion certificate & safety checklist', dept: 'EHS & Compliance', predecessor: '9.31 (SS)', effort: '750', duration: '50', cost: '160000' },
          { slNo: '9.33', name: 'Pre-commissioning lockout/tagout (LOTO) clearance audit', dept: 'EHS & Compliance', predecessor: '9.32 (SS)', effort: '600', duration: '35', cost: '120000' },
          { slNo: '9.34', name: 'Integrated installation completion milestone sign-off', dept: 'PMO / Management', predecessor: '9.33 (FS)', effort: '650', duration: '40', cost: '140000' },
        ],
      },
    ],
  },
  S10: {
    stageName: 'Commissioning & Performance Testing',
    gateCode: 'Gate 4',
    deliverables: [
      {
        slNo: '10.1',
        name: 'Site Acceptance Testing (SAT) and dry runs',
        activities: [
          { slNo: '10.11', name: 'Installation Qualification (IQ) & cold-run verification', dept: 'Commissioning & Qualification', effort: '1800', duration: '160', cost: '1100000' },
          { slNo: '10.12', name: 'Emergency-stop, interlock & safety circuit verification', dept: 'EHS & Compliance', predecessor: '10.11 (SS)', effort: '1200', duration: '110', cost: '700000' },
          { slNo: '10.13', name: 'Axis calibration, zero-positioning & servo tuning', dept: 'Automation & Controls', predecessor: '10.12 (FS)', effort: '1400', duration: '130', cost: '850000' },
          { slNo: '10.14', name: 'Empty-line speed ramp & sensor response timing test', dept: 'Manufacturing & Operations', predecessor: '10.13 (SS)', effort: '1300', duration: '120', cost: '800000' },
        ],
      },
      {
        slNo: '10.2',
        name: 'Cycle-time, OEE and endurance performance trials',
        activities: [
          { slNo: '10.21', name: 'Continuous endurance load & Cpk capability trial', dept: 'Quality Control & Inspection', predecessor: '10.14 (FS)', effort: '1600', duration: '150', cost: '950000' },
          { slNo: '10.22', name: 'Rated speed cycle-time & OEE bottleneck validation', dept: 'Manufacturing & Operations', predecessor: '10.21 (SS)', effort: '1500', duration: '140', cost: '900000' },
          { slNo: '10.23', name: 'Site Acceptance Test (SAT) & Gate 4 sign-off', dept: 'Commissioning & Qualification', predecessor: '10.22 (FS)', effort: '1400', duration: '120', cost: '750000' },
        ],
      },
      {
        slNo: '10.3',
        name: 'Safety qualification and statutory environmental compliance',
        activities: [
          { slNo: '10.31', name: 'Statutory noise, exhaust & OSHA machine guarding audit', dept: 'EHS & Compliance', predecessor: '10.23 (FS)', effort: '1100', duration: '100', cost: '650000' },
          { slNo: '10.32', name: 'Commissioning deficiency punch list clearance', dept: 'Commissioning & Qualification', predecessor: '10.31 (SS)', effort: '1050', duration: '95', cost: '600000' },
          { slNo: '10.33', name: 'Operational readiness transition authorization', dept: 'PMO / Management', predecessor: '10.32 (FS)', effort: '950', duration: '80', cost: '550000' },
        ],
      },
    ],
  },
  S11: {
    stageName: 'Operational Qualification & Production Ramp-Up',
    gateCode: 'Gate 5',
    deliverables: [
      {
        slNo: '11.1',
        name: 'Operational Qualification (OQ) and pilot production runs',
        activities: [
          { slNo: '11.11', name: 'Multi-shift pilot production run & yield verification', dept: 'Manufacturing & Operations', effort: '3200', duration: '320', cost: '3500000' },
          { slNo: '11.12', name: 'Performance Qualification (PQ) & quality audit', dept: 'Quality Assurance', predecessor: '11.11 (SS)', effort: '2800', duration: '280', cost: '2900000' },
          { slNo: '11.13', name: 'Production scrap reduction & yield optimization trial', dept: 'Quality Control & Inspection', predecessor: '11.12 (FS)', effort: '2400', duration: '240', cost: '2400000' },
          { slNo: '11.14', name: 'Line changeover & tooling swap time (SMED) audit', dept: 'Manufacturing & Operations', predecessor: '11.13 (SS)', effort: '2000', duration: '200', cost: '1900000' },
          { slNo: '11.15', name: 'Statistical Process Capability (Cpk > 1.67) validation run', dept: 'Quality Assurance', predecessor: '11.14 (SS)', effort: '1800', duration: '180', cost: '1500000' },
        ],
      },
      {
        slNo: '11.2',
        name: 'Operator training, SOPs and maintenance readiness',
        activities: [
          { slNo: '11.21', name: 'Operator certification, SOPs & PM schedule setup', dept: 'Manufacturing & Operations', predecessor: '11.15 (FS)', effort: '1500', duration: '150', cost: '1300000' },
          { slNo: '11.22', name: 'Autonomous maintenance & daily inspection checklist release', dept: 'Manufacturing & Operations', predecessor: '11.21 (SS)', effort: '1300', duration: '130', cost: '1100000' },
          { slNo: '11.23', name: 'Maintenance technician diagnostic & troubleshooting training', dept: 'Engineering & R&D', predecessor: '11.22 (FS)', effort: '1400', duration: '140', cost: '1200000' },
          { slNo: '11.24', name: 'Operational handover readiness Gate 5 approval', dept: 'PMO / Management', predecessor: '11.23 (FS)', effort: '1500', duration: '150', cost: '1300000' },
        ],
      },
      {
        slNo: '11.3',
        name: 'Ramp-up stabilization and full-rate capacity release',
        activities: [
          { slNo: '11.31', name: 'Full-rate commercial production volume run', dept: 'Manufacturing & Operations', predecessor: '11.24 (FS)', effort: '1800', duration: '180', cost: '1600000' },
          { slNo: '11.32', name: 'Quality assurance continuous capability & Cpk report', dept: 'Quality Assurance', predecessor: '11.31 (SS)', effort: '1400', duration: '140', cost: '1200000' },
          { slNo: '11.33', name: 'Commercial volume production warranty handover sign-off', dept: 'PMO / Management', predecessor: '11.32 (SS)', effort: '1000', duration: '100', cost: '800000' },
          { slNo: '11.34', name: 'Commercial ramp-up completion certification', dept: 'PMO / Management', predecessor: '11.33 (FS)', effort: '1200', duration: '120', cost: '1000000' },
        ],
      },
    ],
  },
  S12: {
    stageName: 'Operational Handover & Project Closeout',
    gateCode: '-',
    deliverables: [
      {
        slNo: '12.1',
        name: 'As-built documentation and statutory compliance package',
        activities: [
          { slNo: '12.11', name: 'As-built drawings, PLC backups & CE/statutory dossier', dept: 'Engineering & R&D', effort: '1100', duration: '130', cost: '160000' },
          { slNo: '12.12', name: 'Critical spare parts & CMMS asset register upload', dept: 'Procurement & Supply Chain', predecessor: '12.11 (SS)', effort: '800', duration: '95', cost: '110000' },
          { slNo: '12.13', name: 'Vendor service level agreements (SLAs) & warranty files', dept: 'Procurement & Supply Chain', predecessor: '12.12 (FS)', effort: '700', duration: '80', cost: '90000' },
        ],
      },
      {
        slNo: '12.2',
        name: 'Plant operations handover and program closeout',
        activities: [
          { slNo: '12.21', name: 'Formal plant operations sign-off & warranty tracking', dept: 'Manufacturing & Operations', predecessor: '12.13 (FS)', effort: '650', duration: '80', cost: '80000' },
          { slNo: '12.22', name: 'Post-implementation ROI & lessons learned closeout', dept: 'PMO / Management', predecessor: '12.21 (FS)', effort: '450', duration: '60', cost: '50000' },
          { slNo: '12.23', name: 'Final capital program accounting closeout & contract settlement', dept: 'PMO / Management', predecessor: '12.22 (FS)', effort: '400', duration: '50', cost: '40000' },
        ],
      },
      {
        slNo: '12.3',
        name: 'Warranty performance and asset lifecycle management',
        activities: [
          { slNo: '12.31', name: '90-day post-handover warranty reliability audit', dept: 'Quality Assurance', predecessor: '12.23 (FS)', effort: '380', duration: '45', cost: '45000' },
          { slNo: '12.32', name: 'Final project archive & executive closeout report', dept: 'PMO / Management', predecessor: '12.31 (FS)', effort: '320', duration: '35', cost: '30000' },
        ],
      },
    ],
  },
};

function buildWbsConfig(stageCode: string): StageWbsConfig {
  const blueprint = WBS_BLUEPRINT[stageCode] || WBS_BLUEPRINT['S1'];
  const sidebarMenus: StageSidebarMenu[] = [];
  const modulesData: WbsTaskItem[][] = [];

  blueprint.deliverables.forEach((del, delIdx) => {
    sidebarMenus.push({
      slNo: del.slNo,
      name: del.name,
      description: `Produce, review, and obtain cross-functional acceptance for the ${del.name} deliverable under ${stageCode} (${blueprint.stageName}).`,
      count: del.activities.length,
      isOpen: delIdx === 0,
    });

    const tasks: WbsTaskItem[] = del.activities.map((act, actIdx) => {
      const codeSuffix = act.slNo.replace(/\./g, '');
      return {
        deliverableSlNo: del.slNo,
        slNo: act.slNo,
        task: act.name,
        predecessor: act.predecessor || '—',
        applicability: 'All Programs',
        taskCode: `IND-${codeSuffix}`,
        activityCode: `ACT-${codeSuffix}`,
        jobCode: INDUSTRIAL_JOB_CODES[(delIdx + actIdx) % INDUSTRIAL_JOB_CODES.length],
        department: act.dept,
        effort: act.effort,
        duration: act.duration,
        description: `Execute ${act.name} by defining engineering acceptance criteria, coordinating ${act.dept}, validating equipment/process outputs, and recording quality sign-off.`,
        procedure: `${act.dept} engineers; Cross-functional technical review; ISO 9001 / Plant SOP`,
        planned: act.cost,
        assignedTo: act.dept,
        assigned: act.cost,
        actual: act.cost,
        cost: act.cost,
        worked: '0.00',
        remaining: '0.00',
        scheduled: '-',
        date: '-',
        status: 'Scheduled',
        submitted: '-',
      };
    });
    modulesData.push(tasks);
  });

  return { sidebarMenus, modulesData };
}

export const INDUSTRIAL_STAGES_WBS_MAP: Record<string, StageWbsConfig> = Object.fromEntries(
  Object.keys(WBS_BLUEPRINT).map(code => [code, buildWbsConfig(code)])
);

export const INDUSTRIAL_STAGES_MASTER: StageItem[] = [
  {
    sequence: '1.0',
    phase: 'Business Need & Opportunity Assessment',
    stageCode: 'S1',
    stageName: 'Business Need & Opportunity Assessment',
    division: 'Equipment Engineering - CT',
    divisions: ['Equipment Engineering - CT'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S1'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Assess plant capacity bottlenecks, existing industrial equipment benchmarks, and preliminary CapEx business opportunity.',
    stageDescription: 'Assess plant capacity bottlenecks, existing industrial equipment benchmarks, and preliminary CapEx business opportunity.',
    planEffort: 600,
    planDuration: 60,
    materialBudget: '$25,000',
    updatedDate: '2026-02-15',
    updatedBy: 'Ananya Rao',
  },
  {
    sequence: '2.0',
    phase: 'Project Scope & Feasibility Validation',
    stageCode: 'S2',
    stageName: 'Project Scope & Feasibility Validation',
    division: 'Equipment Engineering - CT, Industrial Machinery - MA',
    divisions: ['Equipment Engineering - CT', 'Industrial Machinery - MA'],
    gateCode: 'Gate 1',
    tasks: WBS_BLUEPRINT['S2'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Define User Requirements Specification (URS), safety/statutory compliance pathways, integrated schedule, and Gate 1 business case charter.',
    stageDescription: 'Define User Requirements Specification (URS), safety/statutory compliance pathways, integrated schedule, and Gate 1 business case charter.',
    planEffort: 1200,
    planDuration: 90,
    materialBudget: '$60,000',
    updatedDate: '2026-02-12',
    updatedBy: 'Rajesh Kumar',
  },
  {
    sequence: '3.0',
    phase: 'Concept Engineering & Solution Development',
    stageCode: 'S3',
    stageName: 'Concept Engineering & Solution Development',
    division: 'Equipment Engineering - CT',
    divisions: ['Equipment Engineering - CT'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S3'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Develop equipment architecture, plant layout concepts, PLC automation concepts, utility sizing, and throughput simulation.',
    stageDescription: 'Develop equipment architecture, plant layout concepts, PLC automation concepts, utility sizing, and throughput simulation.',
    planEffort: 2000,
    planDuration: 120,
    materialBudget: '$150,000',
    updatedDate: '2026-02-10',
    updatedBy: 'Anita Desai',
  },
  {
    sequence: '4.0',
    phase: 'Detailed Engineering & Design Optimization',
    stageCode: 'S4',
    stageName: 'Detailed Engineering & Design Optimization',
    division: 'Equipment Engineering - CT, Process Equipment - GT',
    divisions: ['Equipment Engineering - CT', 'Process Equipment - GT'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S4'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Complete 3D CAD mechanical design, electrical and PLC/SCADA schematics, BOM optimization, and Design FMEA validation.',
    stageDescription: 'Complete 3D CAD mechanical design, electrical and PLC/SCADA schematics, BOM optimization, and Design FMEA validation.',
    planEffort: 3200,
    planDuration: 180,
    materialBudget: '$300,000',
    updatedDate: '2026-02-05',
    updatedBy: 'Priya Reddy',
  },
  {
    sequence: '5.0',
    phase: 'Concept Selection & Design Freeze',
    stageCode: 'S5',
    stageName: 'Concept Selection & Design Freeze',
    division: 'Industrial Machinery - MA',
    divisions: ['Industrial Machinery - MA'],
    gateCode: 'Gate 2',
    tasks: WBS_BLUEPRINT['S5'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Freeze final equipment configuration, complete HAZOP safety sign-off, qualify OEM suppliers, and release Gate 2 procurement.',
    stageDescription: 'Freeze final equipment configuration, complete HAZOP safety sign-off, qualify OEM suppliers, and release Gate 2 procurement.',
    planEffort: 1500,
    planDuration: 60,
    materialBudget: '$80,000',
    updatedDate: '2026-01-30',
    updatedBy: 'Suresh Naidu',
  },
  {
    sequence: '6.0',
    phase: 'Process Engineering & Equipment Design',
    stageCode: 'S6',
    stageName: 'Process Engineering & Equipment Design',
    division: 'Industrial Machinery - MA, Production Systems - VX',
    divisions: ['Industrial Machinery - MA', 'Production Systems - VX'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S6'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Engineer tooling, fixtures, inline quality inspection sensors, and issue long-lead capital equipment purchase orders.',
    stageDescription: 'Engineer tooling, fixtures, inline quality inspection sensors, and issue long-lead capital equipment purchase orders.',
    planEffort: 3800,
    planDuration: 150,
    materialBudget: '$450,000',
    updatedDate: '2026-01-28',
    updatedBy: 'Amit Patel',
  },
  {
    sequence: '7.0',
    phase: 'Prototype Fabrication & Engineering Validation',
    stageCode: 'S7',
    stageName: 'Prototype Fabrication & Engineering Validation',
    division: 'Process Equipment - GT',
    divisions: ['Process Equipment - GT'],
    gateCode: 'Gate 3',
    tasks: WBS_BLUEPRINT['S7'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Fabricate prototype equipment and control panels, run instrument calibration and endurance trials, and complete Gate 3 FAT sign-off.',
    stageDescription: 'Fabricate prototype equipment and control panels, run instrument calibration and endurance trials, and complete Gate 3 FAT sign-off.',
    planEffort: 4500,
    planDuration: 240,
    materialBudget: '$900,000',
    updatedDate: '2026-01-25',
    updatedBy: 'Ananya Rao',
  },
  {
    sequence: '8.0',
    phase: 'Installation Planning & Site Installation Readiness',
    stageCode: 'S8',
    stageName: 'Installation Planning & Site Installation Readiness',
    division: 'Process Equipment - GT, Production Systems - VX',
    divisions: ['Process Equipment - GT', 'Production Systems - VX'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S8'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Prepare shop-floor foundations, utility hook-ups, rigging plans, and EHS work permits prior to equipment delivery.',
    stageDescription: 'Prepare shop-floor foundations, utility hook-ups, rigging plans, and EHS work permits prior to equipment delivery.',
    planEffort: 1800,
    planDuration: 90,
    materialBudget: '$120,000',
    updatedDate: '2026-01-22',
    updatedBy: 'Rajesh Kumar',
  },
  {
    sequence: '9.0',
    phase: 'Equipment Installation & Integration',
    stageCode: 'S9',
    stageName: 'Equipment Installation & Integration',
    division: 'Production Systems - VX',
    divisions: ['Production Systems - VX'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S9'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Execute mechanical rigging, laser alignment, utility piping tie-ins, and PLC/SCADA/MES line integration.',
    stageDescription: 'Execute mechanical rigging, laser alignment, utility piping tie-ins, and PLC/SCADA/MES line integration.',
    planEffort: 4000,
    planDuration: 300,
    materialBudget: '$1,200,000',
    updatedDate: '2026-01-20',
    updatedBy: 'Anita Desai',
  },
  {
    sequence: '10.0',
    phase: 'Commissioning & Performance Testing',
    stageCode: 'S10',
    stageName: 'Commissioning & Performance Testing',
    division: 'Industrial Machinery - MA, Production Systems - VX',
    divisions: ['Industrial Machinery - MA', 'Production Systems - VX'],
    gateCode: 'Gate 4',
    tasks: WBS_BLUEPRINT['S10'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Conduct Installation Qualification (IQ), safety interlock tests, endurance load trials, and Gate 4 Site Acceptance Testing (SAT).',
    stageDescription: 'Conduct Installation Qualification (IQ), safety interlock tests, endurance load trials, and Gate 4 Site Acceptance Testing (SAT).',
    planEffort: 6000,
    planDuration: 540,
    materialBudget: '$3,500,000',
    updatedDate: '2026-01-18',
    updatedBy: 'Suresh Naidu',
  },
  {
    sequence: '11.0',
    phase: 'Operational Qualification & Production Ramp-Up',
    stageCode: 'S11',
    stageName: 'Operational Qualification & Production Ramp-Up',
    division: 'Production Systems - VX',
    divisions: ['Production Systems - VX'],
    gateCode: 'Gate 5',
    tasks: WBS_BLUEPRINT['S11'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Run Operational and Performance Qualification (OQ/PQ) pilot shifts, certify operators, and obtain Gate 5 Operational Handover Approval.',
    stageDescription: 'Run Operational and Performance Qualification (OQ/PQ) pilot shifts, certify operators, and obtain Gate 5 Operational Handover Approval.',
    planEffort: 9000,
    planDuration: 900,
    materialBudget: '$9,000,000',
    updatedDate: '2026-01-15',
    updatedBy: 'Amit Patel',
  },
  {
    sequence: '12.0',
    phase: 'Operational Handover & Project Closeout',
    stageCode: 'S12',
    stageName: 'Operational Handover & Project Closeout',
    division: 'Equipment Engineering - CT, Production Systems - VX',
    divisions: ['Equipment Engineering - CT', 'Production Systems - VX'],
    gateCode: '-',
    tasks: WBS_BLUEPRINT['S12'].deliverables.reduce((sum, d) => sum + d.activities.length, 0),
    status: 'Active',
    description: 'Deliver as-built drawings, CMMS spare-parts register, statutory clearances, and formal handover to plant operations.',
    stageDescription: 'Deliver as-built drawings, CMMS spare-parts register, statutory clearances, and formal handover to plant operations.',
    planEffort: 3000,
    planDuration: 365,
    materialBudget: '$400,000',
    updatedDate: '2026-01-12',
    updatedBy: 'Priya Reddy',
  },
];

export const INDUSTRIAL_STAGE_OPTIONS: string[] = Object.entries(WBS_BLUEPRINT).map(
  ([code, cfg]) => `${code} - ${cfg.stageName}`
);

export const INDUSTRIAL_STAGE_DELIVERABLES_MAP: Record<string, string[]> = Object.fromEntries(
  Object.entries(WBS_BLUEPRINT).map(([code, cfg]) => [
    `${code} - ${cfg.stageName}`,
    cfg.deliverables.map(d => `${d.slNo} - ${d.name}`),
  ])
);

export const INDUSTRIAL_STAGE_ACTIVITIES_MAP: Record<string, string[]> = Object.fromEntries(
  Object.values(WBS_BLUEPRINT)
    .flatMap(cfg => cfg.deliverables)
    .map(del => [
      `${del.slNo} - ${del.name}`,
      del.activities.map(a => `${a.slNo} - ${a.name}`),
    ])
);

export const INDUSTRIAL_DEFAULT_REQUIREMENTS = [
  {
    active: true,
    done: true,
    requirementName: 'Mechanical Load, Dimensional Tolerance, and Vibration Limits Specification',
    department: 'Mechanical Design',
    role: 'Lead Mechanical Engineer',
    dueDate: '2026-05-15',
    completedDate: '2026-05-14',
    remarks: 'ISO 10816 vibration and GD&T tolerance stack-up verified',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    requirementName: 'PLC / SCADA Control Logic and Safety Interlock Compliance (ISO 13849)',
    department: 'Automation & Controls',
    role: 'Controls Lead',
    dueDate: '2026-06-01',
    completedDate: '2026-05-31',
    remarks: 'PLd / SIL2 emergency-stop and light-curtain interlock logic validated',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    requirementName: 'OEM Benchmark Equipment Throughput and OEE Target Verification',
    department: 'Engineering & R&D',
    role: 'Principal Manufacturing Engineer',
    dueDate: '2026-05-20',
    completedDate: '2026-05-19',
    remarks: 'Target OEE >= 85% and takt-time benchmark established',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    requirementName: 'Design FMEA Risk Assessment and Critical Component Control Strategy',
    department: 'Quality Assurance',
    role: 'QA Manager',
    dueDate: '2026-05-10',
    completedDate: '2026-05-09',
    remarks: 'High-RPN failure modes mitigated with redundant sensors',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    requirementName: 'Critical Component Grade, Material Test Certificate (MTC), and CoC Requirements',
    department: 'Procurement & Supply Chain',
    role: 'Procurement Manager',
    dueDate: '2026-05-12',
    completedDate: '2026-05-11',
    remarks: 'EN 10204 3.1 material certificates and OEM warranties verified',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    requirementName: 'Machine Enclosure, Acoustic Shielding, and Guarding Integrity Requirements',
    department: 'EHS & Compliance',
    role: 'EHS Engineer',
    dueDate: '2026-06-05',
    completedDate: '',
    remarks: 'Acoustic < 78 dBA and IP54 dust/coolant sealing verification underway',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    requirementName: 'Plant Utility Consumption, Compressed Air, and Power Quality Requirements',
    department: 'Engineering & R&D',
    role: 'Utilities Engineer',
    dueDate: '2026-05-25',
    completedDate: '2026-05-24',
    remarks: '415V 3-phase harmonic limits and 6-bar air manifold pressure verified',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    requirementName: 'Site Acceptance Test (SAT) and 72-Hour Continuous Endurance Criteria',
    department: 'Commissioning & Qualification',
    role: 'CQV Engineer',
    dueDate: '2026-06-15',
    completedDate: '',
    remarks: 'Cpk >= 1.33 capability criteria defined for automated line run',
    isEditing: false,
  },
];

export const INDUSTRIAL_DEFAULT_TASKS = [
  {
    active: true,
    done: true,
    taskName: 'Verify Structural Load, Vibration, and Thermal Envelope Specifications',
    taskCode: 'IND-101',
    jobCode: 'ENG01',
    department: 'Mechanical Design',
    role: 'Lead Mechanical Engineer',
    dueDate: '2026-05-15',
    completedDate: '2026-05-14',
    remarks: 'FEA structural deflection and thermal expansion within limits',
    isEditing: false,
  },
  {
    active: true,
    done: true,
    taskName: 'Validate Line Cycle-Time, Takt Balance, and OEE Baseline Criteria',
    taskCode: 'IND-102',
    jobCode: 'MFG03',
    department: 'Manufacturing & Operations',
    role: 'Production Supervisor',
    dueDate: '2026-05-20',
    completedDate: '2026-05-19',
    remarks: 'Bottleneck station cycle time reduced to 14.2 seconds',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Benchmark Existing Plant Equipment and Utility Capacity Gaps',
    taskCode: 'IND-103',
    jobCode: 'ENG02',
    department: 'Engineering & R&D',
    role: 'Engineering Manager',
    dueDate: '2026-06-01',
    completedDate: '',
    remarks: 'Chilled water and compressed air header capacity audit underway',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Develop PLC / SCADA Sequence Control and Fault Diagnostics Logic',
    taskCode: 'IND-104',
    jobCode: 'ELEC01',
    department: 'Automation & Controls',
    role: 'Controls Technician',
    dueDate: '2026-06-05',
    completedDate: '',
    remarks: 'OPC-UA telemetry tags mapped to plant SCADA historian',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Execute Subassembly Material Compatibility and Wear Testing',
    taskCode: 'IND-105',
    jobCode: 'MECH01',
    department: 'Quality Control & Inspection',
    role: 'QC Inspector',
    dueDate: '2026-06-10',
    completedDate: '',
    remarks: 'Hardened spindle bearing and seal endurance checks in progress',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Prepare Factory Acceptance Test (FAT) Protocol and Checklists',
    taskCode: 'IND-106',
    jobCode: 'CQV01',
    department: 'Commissioning & Qualification',
    role: 'CQV Engineer',
    dueDate: '2026-06-15',
    completedDate: '',
    remarks: 'FAT test matrix approved by QA and Plant Operations',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Complete Instrument Calibration and Metrology Traceability Plan',
    taskCode: 'IND-107',
    jobCode: 'CAL01',
    department: 'Quality Control & Inspection',
    role: 'Calibration Technician',
    dueDate: '2026-06-20',
    completedDate: '',
    remarks: 'NIST/NABL calibration certificates scheduled for all transducers',
    isEditing: false,
  },
  {
    active: true,
    done: false,
    taskName: 'Conduct OEM Vendor Audit and Critical Spare-Parts SLA Review',
    taskCode: 'IND-108',
    jobCode: 'QA01',
    department: 'Procurement & Supply Chain',
    role: 'QA Executive',
    dueDate: '2026-06-25',
    completedDate: '',
    remarks: 'Supplier ISO 9001 audit and 24-hour SLA terms under review',
    isEditing: false,
  },
];

