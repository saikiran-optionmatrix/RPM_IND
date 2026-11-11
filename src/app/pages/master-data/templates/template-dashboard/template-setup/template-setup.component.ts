import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

export interface TaskItem {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
}

export interface ModuleItem {
  id: number;
  name: string;
  description?: string;
  completed?: boolean;
  tasks: TaskItem[];
}

export interface StageItem {
  id: number;
  name: string;
  type: 'stage' | 'gate';
  completed?: boolean;
  modules: ModuleItem[];
  tasks?: TaskItem[];
}

@Component({
  selector: 'app-template-setup',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './template-setup.component.html',
  styleUrl: './template-setup.component.scss',
})
export class TemplateSetupComponent implements OnInit {
  projectName =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Oral Solid Dosage (OSD) Formulation & Commercialization';

  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Oral Solid Dosage (OSD) Formulation & Commercialization - 2026/GEN/001';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = [
    {
      id: 1,
      name: 'Feasibility',
      type: 'stage',
      modules: [
        {
          id: 101,
          name: 'API & Raw Material Assessment',
          description:
            'Evaluate API physical, chemical properties and supplier documentation.',
          tasks: [
            {
              id: 1001,
              name: 'API Characterization & Testing',
              description: 'Evaluate API physical, chemical properties and purity.',
              completed: true,
            },
            {
              id: 1002,
              name: 'API Specification Review',
              description:
                'Review API specifications and pharmacopeial standards.',
              completed: true,
            },
            {
              id: 1003,
              name: 'Supplier DMF & Qualification',
              description:
                'Assess API manufacturer DMF and vendor documentation.',
              completed: true,
            },
          ],
        },
        {
          id: 102,
          name: 'Preformulation & Compatibility',
          description: 'Evaluate drug-excipient compatibility and solubility.',
          tasks: [
            {
              id: 1021,
              name: 'API–Excipient Compatibility Study',
              description:
                'Evaluate compatibility of API with selected functional excipients.',
              completed: true,
            },
            {
              id: 1022,
              name: 'Solubility & Dissolution Pre-check',
              description:
                'Assess BCS class solubility across physiological pH buffers.',
              completed: false,
            },
          ],
        },
        {
          id: 103,
          name: 'Feasibility & Business Case',
          description: 'Technical feasibility and risk assessment.',
          tasks: [
            {
              id: 1031,
              name: 'Preliminary Formulation Feasibility',
              description:
                'Assess technical feasibility and baseline tablet characteristics.',
              completed: true,
            },
            {
              id: 1032,
              name: 'Feasibility Gate Assessment Report',
              description:
                'Compile feasibility dossier and risk matrix for Gate 1 decision.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Gate 1: Feasibility Review',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 2001,
          name: 'Formal Freedom-to-Operate (FTO) Opinion',
          description:
            'Formal Freedom-to-Operate (FTO) opinion obtained (legal/patent counsel).',
          completed: true,
        },
        {
          id: 2002,
          name: 'API Source & Vendor Qualification',
          description:
            'API source(s) identified, minimum 2 vendors with DMF/CEP status confirmed.',
          completed: true,
        },
        {
          id: 2003,
          name: 'Reference Listed Drug (RLD) Characterization',
          description: 'Reference Listed Drug (RLD) procured and characterized.',
          completed: true,
        },
        {
          id: 2004,
          name: 'Target Product Profile (TPP) Documentation',
          description:
            'Target Product Profile (TPP) documented — dosage form, strength, release profile.',
          completed: true,
        },
        {
          id: 2005,
          name: 'Formulation Complexity Risk Rating',
          description:
            'Formulation complexity risk rated (Low/Med/High) with technical rationale.',
          completed: false,
        },
        {
          id: 2006,
          name: 'Cost of Goods Sold (COGS) Feasibility',
          description:
            'Preliminary cost model shows COGS within target margin band.',
          completed: true,
        },
        {
          id: 2007,
          name: 'Regulatory Submission Pathway Confirmation',
          description:
            'Regulatory pathway confirmed (ANDA/505(j), or equivalent for target market).',
          completed: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Formulation',
      type: 'stage',
      modules: [
        {
          id: 301,
          name: 'Formula Design & Excipient Selection',
          description: 'Develop and optimize core tablet formulation components.',
          tasks: [
            {
              id: 3001,
              name: 'Binder & Disintegrant Screening',
              description: 'Select and optimize binder-to-disintegrant ratio.',
              completed: true,
            },
            {
              id: 3002,
              name: 'Lubricant & Flow Enhancer Trials',
              description:
                'Evaluate blend flowability, bulk density, and compressibility.',
              completed: true,
            },
            {
              id: 3003,
              name: 'Prototype Trial Batches Preparation',
              description: 'Prepare 3 lab-scale prototype tablet formulations.',
              completed: false,
            },
          ],
        },
        {
          id: 302,
          name: 'Coating & Physical Optimization',
          description: 'Optimize coating and physical tablet attributes.',
          tasks: [
            {
              id: 3021,
              name: 'Film Coating Formulation Optimization',
              description:
                'Optimize aqueous coating suspension and spray rate parameters.',
              completed: true,
            },
            {
              id: 3022,
              name: 'Hardness & Friability Optimization',
              description: 'Ensure tablet breaking force and friability < 0.8%.',
              completed: false,
            },
          ],
        },
        {
          id: 303,
          name: 'Formula Lock & Comparative Studies',
          description: 'Freeze formulation and verify dissolution match.',
          tasks: [
            {
              id: 3031,
              name: 'Comparative Dissolution vs Reference Product',
              description: 'Evaluate dissolution match against Innovator RLD.',
              completed: true,
            },
            {
              id: 3032,
              name: 'Formulation Lock & Handover Sign-off',
              description:
                'Formal formula composition freeze for scale development.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Gate 2: Formulation Lock',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 4001,
          name: 'Prototype Batches Manufacturing',
          description:
            'Prototype batch(es) manufactured (minimum 3 formulation iterations typically).',
          completed: true,
        },
        {
          id: 4002,
          name: 'Comparative Dissolution Profile (f2 ≥ 50)',
          description:
            'Dissolution profile matches RLD (f2 similarity factor ≥ 50, or per applicable guidance).',
          completed: false,
        },
        {
          id: 4003,
          name: 'Critical Quality Attributes (CQAs) Target Ranges',
          description:
            'Critical Quality Attributes (CQAs) identified and within acceptable range.',
          completed: false,
        },
        {
          id: 4004,
          name: 'Excipient Compatibility Study Completion',
          description:
            'Excipient compatibility study complete, no incompatibility flags.',
          completed: false,
        },
        {
          id: 4005,
          name: 'Manufacturing Unit Operations Mapping',
          description:
            'Manufacturing process outline defined (unit operations mapped).',
          completed: false,
        },
        {
          id: 4006,
          name: 'Preliminary Impurity Profile Evaluation',
          description:
            'Preliminary impurity profile acceptable (no unknown impurities above qualification threshold).',
          completed: false,
        },
      ],
    },
    {
      id: 5,
      name: 'Development',
      type: 'stage',
      modules: [
        {
          id: 501,
          name: 'Process Development & Optimization',
          description: 'Develop and establish unit manufacturing operations.',
          tasks: [
            {
              id: 5001,
              name: 'High Shear Granulation Parameters Study',
              description:
                'Determine impeller speed, binder addition rate, and wet mass time.',
              completed: true,
            },
            {
              id: 5002,
              name: 'Fluid Bed Drying Optimization',
              description:
                'Establish drying inlet temperature, air flow rate, and end-point LOD.',
              completed: true,
            },
            {
              id: 5003,
              name: 'Compression Machine Speed & Force Mapping',
              description:
                'Map compression force vs ejection force and tablet porosity.',
              completed: false,
            },
          ],
        },
        {
          id: 502,
          name: 'Analytical Method Development',
          description: 'Develop and validate QC testing methods.',
          tasks: [
            {
              id: 5021,
              name: 'Assay & Content Uniformity HPLC Method',
              description:
                'Develop and validate isocratic HPLC method for assay testing.',
              completed: true,
            },
            {
              id: 5022,
              name: 'Related Substances Impurity Method',
              description:
                'Develop gradient HPLC method for degradation and process impurities.',
              completed: false,
            },
            {
              id: 5023,
              name: 'Discriminatory Dissolution Method Development',
              description:
                'Validate discriminatory power of dissolution apparatus & media.',
              completed: false,
            },
          ],
        },
        {
          id: 503,
          name: 'Process Characterization & Tech Transfer',
          description: 'Define CPPs and prepare tech transfer protocol.',
          tasks: [
            {
              id: 5031,
              name: 'Critical Process Parameters (CPP) Definition',
              description:
                'Define design space boundaries and critical quality attributes.',
              completed: true,
            },
            {
              id: 5032,
              name: 'Tech Transfer Protocol Preparation',
              description:
                'Prepare tech transfer dossier for pilot scale plant execution.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 6,
      name: 'Gate 3: Analytical & Stability Readiness',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 6001,
          name: 'Analytical Methods Validation (ICH Q2)',
          description:
            'Analytical methods validated (assay, dissolution, related substances) per ICH Q2.',
          completed: false,
        },
        {
          id: 6002,
          name: 'Forced Degradation & Stability-Indicating Study',
          description:
            'Forced degradation study complete, stability-indicating method confirmed.',
          completed: false,
        },
        {
          id: 6003,
          name: 'Accelerated Stability Data (3 Months 40°C/75% RH)',
          description:
            'Accelerated stability data (minimum 3 months, 40°C/75%RH) shows no significant degradation.',
          completed: false,
        },
        {
          id: 6004,
          name: 'Long-Term Stability Protocol Initiation',
          description: 'Long-term stability protocol initiated.',
          completed: false,
        },
        {
          id: 6005,
          name: 'Container-Closure System Finalization',
          description: 'Container-closure system finalized and compatible.',
          completed: false,
        },
        {
          id: 6006,
          name: 'Exhibit Batch Manufacturing Record (BMR) Draft',
          description: 'Batch record draft prepared for exhibit batch.',
          completed: false,
        },
      ],
    },
    {
      id: 7,
      name: 'Testing',
      type: 'stage',
      modules: [
        {
          id: 701,
          name: 'Finished Product QC Testing',
          description: 'Perform full specification release tests on batches.',
          tasks: [
            {
              id: 7001,
              name: 'Batch Release Assay & Uniformity Testing',
              description:
                'Conduct full batch release assay and dosage uniformity tests.',
              completed: true,
            },
            {
              id: 7002,
              name: 'Impurity Profile & Degradants Analysis',
              description:
                'Quantify known, unknown, and total degradation products by HPLC.',
              completed: false,
            },
            {
              id: 7003,
              name: 'Microbial Limits & Pathogen Testing',
              description:
                'Verify TAMC, TYMC, and absence of objectionable pathogens.',
              completed: false,
            },
          ],
        },
        {
          id: 702,
          name: 'Accelerated Stability Testing',
          description: 'Monitor stability under ICH environmental conditions.',
          tasks: [
            {
              id: 7021,
              name: '3-Month Accelerated Stability (40°C/75%RH)',
              description:
                'Test stability samples stored under accelerated chamber conditions.',
              completed: false,
            },
            {
              id: 7022,
              name: 'Photostability & Stress Condition Testing',
              description:
                'Assess formulation stability under direct light exposure (Option 2).',
              completed: false,
            },
          ],
        },
        {
          id: 703,
          name: 'Dissolution Profile Comparison',
          description: 'In-vitro comparison across physiological pH ranges.',
          tasks: [
            {
              id: 7031,
              name: 'Multi-Media Dissolution Profiling',
              description:
                'Conduct dissolution in pH 1.2, pH 4.5, and pH 6.8 buffer media.',
              completed: true,
            },
            {
              id: 7032,
              name: 'Similarity Factor (f2) Statistical Analysis',
              description: 'Compute f1 and f2 values against reference listed drug.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 8,
      name: 'Gate 4: Bioequivalence & Exhibit Batch',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 8001,
          name: 'Exhibit/Registration Batch Scale Manufacturing',
          description:
            'Exhibit/registration batch manufactured at pilot-to-commercial scale (min. 100,000 units or 1/10th commercial scale per guidance).',
          completed: false,
        },
        {
          id: 8002,
          name: 'Exhibit Batch Release Specifications Compliance',
          description: 'Exhibit batch meets all release specifications.',
          completed: false,
        },
        {
          id: 8003,
          name: 'Pilot Bioequivalence (BE) Study Trend',
          description: 'Pilot BE study (if run) shows favorable trend.',
          completed: false,
        },
        {
          id: 8004,
          name: 'Pivotal Bioequivalence (BE) Study Success',
          description:
            'Pivotal BE study passes: 90% CI for Cmax and AUC within 80.00–125.00%.',
          completed: false,
        },
        {
          id: 8005,
          name: 'CMC Quality Data Package Consistency',
          description:
            'CMC data package internally consistent (batch analysis, stability, method validation all align).',
          completed: false,
        },
        {
          id: 8006,
          name: 'Bioanalytical Method Regulatory Validation',
          description: 'Bioanalytical method validated per regulatory guidance.',
          completed: false,
        },
      ],
    },
    {
      id: 9,
      name: 'Validation',
      type: 'stage',
      modules: [
        {
          id: 901,
          name: 'Scale-Up & Equipment Qualification',
          description: 'Plant scale execution and machine qualification.',
          tasks: [
            {
              id: 9001,
              name: 'Scale-Up Batch Execution (Commercial Batch Size)',
              description:
                'Manufacture scale-up batch on commercial production line.',
              completed: true,
            },
            {
              id: 9002,
              name: 'Commercial Blend Uniformity Testing',
              description:
                'Sample and verify blend uniformity across 10 blender locations.',
              completed: false,
            },
            {
              id: 9003,
              name: 'Equipment Qualification (IQ/OQ/PQ)',
              description:
                'Verify installation, operational, and performance qualification.',
              completed: false,
            },
          ],
        },
        {
          id: 902,
          name: 'Process Validation (PV) Execution',
          description: 'Execute 3 consecutive commercial validation batches.',
          tasks: [
            {
              id: 9021,
              name: 'PV Batch 1 Execution & Intensive Sampling',
              description:
                'Manufacture and test PV Batch 1 with enhanced stratified sampling.',
              completed: false,
            },
            {
              id: 9022,
              name: 'PV Batch 2 Execution & Intensive Sampling',
              description:
                'Manufacture and test PV Batch 2 with enhanced stratified sampling.',
              completed: false,
            },
            {
              id: 9023,
              name: 'PV Batch 3 Execution & Intensive Sampling',
              description:
                'Manufacture and test PV Batch 3 to demonstrate consistency.',
              completed: false,
            },
          ],
        },
        {
          id: 903,
          name: 'Cleaning Validation & Reports',
          description: 'Cleaning swab testing and PV summary dossier.',
          tasks: [
            {
              id: 9031,
              name: 'Cleaning Validation Swab & Rinse Analysis',
              description:
                'Analyze swab samples for active chemical & detergent residues.',
              completed: false,
            },
            {
              id: 9032,
              name: 'Process Validation Summary Report (PVSR)',
              description:
                'Compile PVSR report with CPK calculations and quality sign-off.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 10,
      name: 'Gate 5: Regulatory Submission Readiness',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 10001,
          name: 'Full CTD/eCTD Dossier Compilation (Modules 1-5)',
          description: 'Full CTD/eCTD dossier compiled (Modules 1-5).',
          completed: false,
        },
        {
          id: 10002,
          name: 'Internal QA Dossier Gap Assessment',
          description:
            'Internal QA review of dossier complete, no open gaps.',
          completed: false,
        },
        {
          id: 10003,
          name: 'DMF Reference & Letter of Authorization (LoA)',
          description: 'DMF references current and cross-referenced correctly.',
          completed: false,
        },
        {
          id: 10004,
          name: 'Product Labeling & Packaging Alignment',
          description:
            'Labeling draft aligned with RLD (or justified deviations documented).',
          completed: false,
        },
        {
          id: 10005,
          name: 'Manufacturing Facility cGMP Inspection Readiness',
          description:
            'Facility(ies) named in submission are inspection-ready (no open 483s/warning letters).',
          completed: false,
        },
      ],
    },
    {
      id: 11,
      name: 'Regulatory',
      type: 'stage',
      modules: [
        {
          id: 1101,
          name: 'eCTD Dossier Preparation (Module 3)',
          description: 'Compile eCTD Quality documentation sections.',
          tasks: [
            {
              id: 11001,
              name: 'Module 3.2.S Drug Substance Compilation',
              description:
                'Assemble manufacturer DMF, characterization, and API control sections.',
              completed: true,
            },
            {
              id: 11002,
              name: 'Module 3.2.P Drug Product Compilation',
              description:
                'Compile formulation, manufacturing process, and container closure data.',
              completed: false,
            },
            {
              id: 11003,
              name: 'Executed Batch Records & CoA Assembly',
              description:
                'Attach executed batch records, packaging specs, and CoAs for exhibit lots.',
              completed: false,
            },
          ],
        },
        {
          id: 1102,
          name: 'Stability & Bioequivalence Dossier',
          description: 'Compile clinical BE and long-term stability data.',
          tasks: [
            {
              id: 11021,
              name: '6-Month Primary Stability Study Dossier',
              description:
                'Compile accelerated and room temperature stability data curves.',
              completed: false,
            },
            {
              id: 11022,
              name: 'Bioequivalence (BE) Study Clinical Report',
              description:
                'Integrate clinical protocol, bioanalytical report, and 90% CI stats.',
              completed: false,
            },
          ],
        },
        {
          id: 1103,
          name: 'Submission & Query Management',
          description: 'Health authority submission and query responses.',
          tasks: [
            {
              id: 11031,
              name: 'Regulatory Filing Dispatch & Tracking',
              description:
                'Submit electronic eCTD sequence to Health Authority gateway.',
              completed: false,
            },
            {
              id: 11032,
              name: 'Deficiency & Agency Query Response Protocol',
              description:
                'Establish timeline tracking and protocol for response to agency queries.',
              completed: false,
            },
          ],
        },
      ],
    },
    {
      id: 12,
      name: 'Gate 6: Commercial Launch',
      type: 'gate',
      modules: [],
      tasks: [
        {
          id: 12001,
          name: 'Commercial Site Technology Transfer',
          description:
            'Technology transfer to commercial site complete, documented.',
          completed: false,
        },
        {
          id: 12002,
          name: 'Process Validation (3 Consecutive Batches)',
          description:
            'Three consecutive process validation batches pass all specs.',
          completed: false,
        },
        {
          id: 12003,
          name: 'Actual Cost of Goods Sold (COGS) Verification',
          description: 'COGS confirmed within target (actual, not projected).',
          completed: false,
        },
        {
          id: 12004,
          name: 'Equipment Cleaning Validation',
          description: 'Cleaning validation complete.',
          completed: false,
        },
        {
          id: 12005,
          name: 'Commercial Supply Chain & Raw Material Contracts',
          description:
            'Supply chain for API/excipients secured at commercial volumes (contracts, not just samples).',
          completed: false,
        },
      ],
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateName =
        params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  selectStage(stage: StageItem): void {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem): void {
    this.selectedModule = moduleItem;
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }
}
