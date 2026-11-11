import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { AddDeliverableComponent } from '../../../stages/stages-wbs/add-deliverable/add-deliverable.component';
import { AddActivityComponent } from '../../../stages/stages-wbs/add-activity/add-activity.component';
import { AddCriteriaComponent } from '../../../gates/gate-criteria/add-criteria/add-criteria.component';

// Interfaces to define our hierarchical data structure
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
  selector: 'app-project-setup',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './project-setup.component.html',
  styleUrl: './project-setup.component.scss',
})
export class ProjectSetupComponent implements OnInit {

  // Project Header Properties
  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/RD/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  selectedStage: StageItem | null = null;
  selectedModule: ModuleItem | null = null;

  stagesAndGates: StageItem[] = [
    {
      id: 1,
      name: 'S1 - Opportunity and Portfolio Assessment',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 101,
          name: 'Market and therapeutic opportunity assessment',
          description: 'Compile and obtain cross-functional approval of the market and therapeutic opportunity assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 1011,
              name: 'Market and therapeutic-area assessment',
              description: 'Complete market and therapeutic-area assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 1012,
              name: 'Unmet medical need and target product profile research',
              description: 'Complete unmet medical need and target product profile research by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 1013,
              name: 'Competitor and reference product benchmarking',
              description: 'Complete competitor and reference product benchmarking by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 1014,
              name: 'Target markets and regulatory pathway shortlist',
              description: 'Complete target markets and regulatory pathway shortlist by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 102,
          name: 'Program economics and feasibility assessment',
          description: 'Compile and obtain cross-functional approval of the program economics and feasibility assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 1021,
              name: 'Patient population and demand forecast',
              description: 'Complete patient population and demand forecast by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 1022,
              name: 'Preliminary pricing and access assessment',
              description: 'Complete preliminary pricing and access assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 1023,
              name: 'Initial product feasibility and risk screening',
              description: 'Complete initial product feasibility and risk screening by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 103,
          name: 'Concept and portfolio approval package',
          description: 'Compile and obtain cross-functional approval of the concept and portfolio approval package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 1031,
              name: 'Portfolio committee concept approval',
              description: 'Complete portfolio committee concept approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Gate 1: Opportunity and portfolio approval',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3101,
          name: 'Therapeutic Area & Unmet Medical Need Assessment',
          description: 'Epidemiological prevalence data, standard-of-care analysis, and addressable patient population verified and endorsed by medical affairs.',
          completed: false
        },
        {
          id: 3102,
          name: 'Target Product Profile (TPP) Baseline Sign-off',
          description: 'Dosage form, strength, release mechanism, indication, route of administration, and packaging format documented in baseline TPP.',
          completed: false
        },
        {
          id: 3103,
          name: 'Patent Landscape & Freedom-to-Operate (FTO) Review',
          description: 'Orange Book/Patent register review, molecule exclusivity horizon, formulation patent expiry, and paragraph IV litigation risk evaluated by legal.',
          completed: false
        },
        {
          id: 3104,
          name: 'Preliminary Business Case & Peak-Sales Financial Model',
          description: 'Development budget, target unit cost of goods (COGS), gross-to-net pricing assumptions, and return on investment approved by finance.',
          completed: false
        },
        {
          id: 3105,
          name: 'API Sourcing Feasibility & DMF Availability',
          description: 'At least two qualified API synthetic routes identified with Drug Master File (DMF) availability and initial pricing feasibility.',
          completed: false
        },
        {
          id: 3106,
          name: 'Regulatory Filing Pathway & Exclusivity Strategy',
          description: 'Target submission route (ANDA / 505(b)(2) / MAA) defined across target jurisdictions (US, EU, ROW) with bioequivalence expectations.',
          completed: false
        },
        {
          id: 3107,
          name: 'Portfolio Steering Committee Concept Authorization',
          description: 'Executive R&D committee formal charter sign-off approving progression into product definition and funding allocation.',
          completed: false
        }
      ]
    },
    {
      id: 3,
      name: 'S2 - Product Definition and Project Charter',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 201,
          name: 'Product requirements and target profile',
          description: 'Compile and obtain cross-functional approval of the product requirements and target profile deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 2011,
              name: 'Target Product Profile (TPP) definition',
              description: 'Complete target product profile (tpp) definition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2012,
              name: 'Quality Target Product Profile (QTPP) definition',
              description: 'Complete quality target product profile (qtpp) definition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2013,
              name: 'Preliminary Critical Quality Attributes (CQA) identification',
              description: 'Complete preliminary critical quality attributes (cqa) identification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2014,
              name: 'Regulatory strategy and submission pathway assessment',
              description: 'Complete regulatory strategy and submission pathway assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2015,
              name: 'Intellectual property and freedom-to-operate review',
              description: 'Complete intellectual property and freedom-to-operate review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 202,
          name: 'Regulatory, quality and IP strategy',
          description: 'Compile and obtain cross-functional approval of the regulatory, quality and ip strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 2021,
              name: 'Product development strategy and project charter',
              description: 'Complete product development strategy and project charter by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2022,
              name: 'Development budget and resource estimate',
              description: 'Complete development budget and resource estimate by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2023,
              name: 'Integrated project schedule and milestone plan',
              description: 'Complete integrated project schedule and milestone plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2024,
              name: 'Cross-functional responsibility matrix',
              description: 'Complete cross-functional responsibility matrix by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 203,
          name: 'Development plan, budget and project charter',
          description: 'Compile and obtain cross-functional approval of the development plan, budget and project charter deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 2031,
              name: 'Preliminary risk register and mitigation plan',
              description: 'Complete preliminary risk register and mitigation plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2032,
              name: 'Commercial forecast and profitability assessment',
              description: 'Complete commercial forecast and profitability assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2033,
              name: 'Make-or-buy and external partner strategy',
              description: 'Complete make-or-buy and external partner strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 204,
          name: 'Risk and resource management plan',
          description: 'Compile and obtain cross-functional approval of the risk and resource management plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 2041,
              name: 'Project charter review and approval',
              description: 'Complete project charter review and approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2042,
              name: 'Product specification and acceptance criteria draft',
              description: 'Complete product specification and acceptance criteria draft by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2043,
              name: 'Clinical and nonclinical evidence gap assessment',
              description: 'Complete clinical and nonclinical evidence gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 205,
          name: 'Product development feasibility assessment',
          description: 'Compile and obtain cross-functional approval of the product development feasibility assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 2051,
              name: 'Data integrity and documentation strategy',
              description: 'Complete data integrity and documentation strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 2052,
              name: 'Development governance and change-control plan',
              description: 'Complete development governance and change-control plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Gate 2: Product definition and project charter approval',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3201,
          name: 'Reference Listed Drug (RLD) Characterization Complete',
          description: 'Innovator sample characterization, dissolution profiling across physiological pH range, excipient deconstruction, and polymorphic form identified.',
          completed: false
        },
        {
          id: 3202,
          name: 'Quality Target Product Profile (QTPP) Finalization',
          description: 'Critical Quality Attributes (CQAs) mapped to patient safety and efficacy in compliance with ICH Q8 Quality by Design guidance.',
          completed: false
        },
        {
          id: 3203,
          name: 'Regulatory Strategy & Agency Scientific Advice Plan',
          description: 'Pre-submission briefing package, pharmacopoeial monograph compliance check, and potential guidance divergence risks documented.',
          completed: false
        },
        {
          id: 3204,
          name: 'Cross-Functional Project Charter & Schedule Commitment',
          description: 'Integrated master development timeline, milestone commitments across R&D, RA, QA, and Manufacturing, and Capex sign-off.',
          completed: false
        },
        {
          id: 3205,
          name: 'Analytical Strategy & Impurity Profile Specifications',
          description: 'ICH Q3A/B impurity qualification limits, nitrosamine risk evaluation, and stability-indicating method strategy established.',
          completed: false
        },
        {
          id: 3206,
          name: 'Primary Packaging Concept & Barrier Requirements',
          description: 'Blister foil / HDPE bottle moisture, light, and oxygen barrier specifications determined based on drug substance stability sensitivity.',
          completed: false
        }
      ]
    },
    {
      id: 5,
      name: 'S3 - Formulation and Product Concept Development',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 301,
          name: 'Pre-formulation and material characterization package',
          description: 'Compile and obtain cross-functional approval of the pre-formulation and material characterization package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 3011,
              name: 'API and excipient compatibility assessment',
              description: 'Complete api and excipient compatibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3012,
              name: 'Pre-formulation characterization plan',
              description: 'Complete pre-formulation characterization plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3013,
              name: 'Prototype formulation design',
              description: 'Complete prototype formulation design by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3014,
              name: 'Excipient selection and justification',
              description: 'Complete excipient selection and justification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3015,
              name: 'Dosage form and delivery system selection',
              description: 'Complete dosage form and delivery system selection by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 302,
          name: 'Prototype formulation and performance assessment',
          description: 'Compile and obtain cross-functional approval of the prototype formulation and performance assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 3021,
              name: 'Initial manufacturing process concept',
              description: 'Complete initial manufacturing process concept by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3022,
              name: 'Preliminary analytical control strategy',
              description: 'Complete preliminary analytical control strategy by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3023,
              name: 'Prototype performance and dissolution assessment',
              description: 'Complete prototype performance and dissolution assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3024,
              name: 'Stability risk assessment and initial protocol',
              description: 'Complete stability risk assessment and initial protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3025,
              name: 'Packaging concept and compatibility assessment',
              description: 'Complete packaging concept and compatibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3026,
              name: 'Preliminary scale-up feasibility assessment',
              description: 'Complete preliminary scale-up feasibility assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 303,
          name: 'Product concept and development risk review',
          description: 'Compile and obtain cross-functional approval of the product concept and development risk review deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 3031,
              name: 'Formulation design review',
              description: 'Complete formulation design review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3032,
              name: 'Prototype selection and rationale',
              description: 'Complete prototype selection and rationale by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3033,
              name: 'Preliminary CQA and CPP linkage assessment',
              description: 'Complete preliminary cqa and cpp linkage assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3034,
              name: 'Development batch design',
              description: 'Complete development batch design by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 3035,
              name: 'Reference product characterization',
              description: 'Complete reference product characterization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 304,
          name: 'Preliminary control and stability strategy',
          description: 'Compile and obtain cross-functional approval of the preliminary control and stability strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 3041,
              name: 'Concept formulation risk review',
              description: 'Complete concept formulation risk review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 6,
      name: 'Gate 3: Formulation concept and sourcing strategy approval',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3301,
          name: 'Pre-Formulation & Drug-Excipient Compatibility Sign-off',
          description: 'Differential scanning calorimetry (DSC), isothermal stress testing, and binary blend stability confirm zero adverse physical/chemical interactions.',
          completed: false
        },
        {
          id: 3302,
          name: 'Lead Prototype Formulation Selected via DoE',
          description: 'Statistically designed formulation screening batches demonstrate acceptable flowability, compressibility, and in-vitro dissolution similarity.',
          completed: false
        },
        {
          id: 3303,
          name: 'API & Critical Excipient Commercial Sourcing Agreements',
          description: 'Primary and secondary API vendors contracted with Quality Agreements, GMP audit sign-off, and pilot batch delivery confirmed.',
          completed: false
        },
        {
          id: 3304,
          name: 'Analytical Stability-Indicating Methods Qualified',
          description: 'HPLC assay and related substance analytical methods qualified for prototype screening and accelerated degradation evaluation.',
          completed: false
        },
        {
          id: 3305,
          name: 'Container Closure System Feasibility Validated',
          description: 'Container closure integrity and child-resistant/senior-friendly packaging compliance confirmed by vendor qualification data.',
          completed: false
        },
        {
          id: 3306,
          name: 'Technology Transfer Readiness Assessment to Pilot Plant',
          description: 'Manufacturing process train compatibility review completed between lab formulation equipment and pilot-scale GMP facility.',
          completed: false
        }
      ]
    },
    {
      id: 7,
      name: 'S4 - API, Excipient and Supplier Sourcing',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 401,
          name: 'Qualified API and excipient supply strategy',
          description: 'Compile and obtain cross-functional approval of the qualified api and excipient supply strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 4011,
              name: 'API supplier technical assessment',
              description: 'Complete api supplier technical assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 4012,
              name: 'Excipient and packaging vendor assessment',
              description: 'Complete excipient and packaging vendor assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 4013,
              name: 'Supplier quality agreement and audit planning',
              description: 'Complete supplier quality agreement and audit planning by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 4014,
              name: 'API specification and certificate review',
              description: 'Complete api specification and certificate review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 402,
          name: 'Supplier nomination and quality agreements',
          description: 'Compile and obtain cross-functional approval of the supplier nomination and quality agreements deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 4021,
              name: 'Vendor qualification and sample procurement',
              description: 'Complete vendor qualification and sample procurement by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 4022,
              name: 'Supply continuity and material risk assessment',
              description: 'Complete supply continuity and material risk assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 4023,
              name: 'Supplier selection and nomination',
              description: 'Complete supplier selection and nomination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 8,
      name: 'Gate 4: Formulation and process development approval',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3401,
          name: 'Formulation & Process Parameter Optimization Freeze',
          description: 'Design of Experiments (DoE) completes mapping of Critical Process Parameters (CPPs) to CQAs, defining preliminary design space.',
          completed: false
        },
        {
          id: 3402,
          name: 'Laboratory Stress & 3-Month Accelerated Stability Clearance',
          description: 'Prototype batches stored at 40°C/75% RH for 3 months demonstrate no out-of-specification degradation or dissolution drift.',
          completed: false
        },
        {
          id: 3403,
          name: 'Analytical Method Validation Protocol per ICH Q2(R1)',
          description: 'Formal validation protocol approved covering specificity, linearity, range, accuracy, precision, LOD/LOQ, and robustness.',
          completed: false
        },
        {
          id: 3404,
          name: 'Scale-Up Batch Execution & Process Train Verification',
          description: 'Pilot scale batch executed successfully on production-representative equipment with blend uniformity RSD < 3.0%.',
          completed: false
        },
        {
          id: 3405,
          name: 'Nitrosamine & Elemental Impurities Risk Assessment Sign-off',
          description: 'ICH Q3D and FDA/EMA nitrosamine risk assessments concluded with zero detected or quantified risks below toxicological limits.',
          completed: false
        },
        {
          id: 3406,
          name: 'Bioequivalence Pilot Study Batch Release Protocol',
          description: 'Clinical trial batch manufacturing formula, master production record, and release specification approved by QA.',
          completed: false
        }
      ]
    },
    {
      id: 9,
      name: 'S5 - Formulation and Process Development',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 501,
          name: 'Optimized formulation and process definition',
          description: 'Compile and obtain cross-functional approval of the optimized formulation and process definition deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5011,
              name: 'Formulation optimization and DoE studies',
              description: 'Complete formulation optimization and doe studies by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5012,
              name: 'API particle size and material attribute assessment',
              description: 'Complete api particle size and material attribute assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5013,
              name: 'Excipient grade and functionality optimization',
              description: 'Complete excipient grade and functionality optimization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5014,
              name: 'Manufacturing process parameter development',
              description: 'Complete manufacturing process parameter development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 502,
          name: 'Analytical methods and control strategy',
          description: 'Compile and obtain cross-functional approval of the analytical methods and control strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5021,
              name: 'Critical Process Parameters (CPP) identification',
              description: 'Complete critical process parameters (cpp) identification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5022,
              name: 'Critical Material Attributes (CMA) assessment',
              description: 'Complete critical material attributes (cma) assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5023,
              name: 'Analytical method development for assay and impurities',
              description: 'Complete analytical method development for assay and impurities by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5024,
              name: 'Dissolution method development',
              description: 'Complete dissolution method development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 503,
          name: 'Stability and packaging compatibility package',
          description: 'Compile and obtain cross-functional approval of the stability and packaging compatibility package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5031,
              name: 'Degradation pathway and impurity profiling',
              description: 'Complete degradation pathway and impurity profiling by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5032,
              name: 'Forced degradation study execution',
              description: 'Complete forced degradation study execution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5033,
              name: 'Container closure system selection',
              description: 'Complete container closure system selection by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5034,
              name: 'Packaging compatibility and protection assessment',
              description: 'Complete packaging compatibility and protection assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5035,
              name: 'Prototype batch manufacturing instructions',
              description: 'Complete prototype batch manufacturing instructions by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 504,
          name: 'Manufacturing process and scale-up package',
          description: 'Compile and obtain cross-functional approval of the manufacturing process and scale-up package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5041,
              name: 'In-process control strategy development',
              description: 'Complete in-process control strategy development by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5042,
              name: 'Cleaning process development assessment',
              description: 'Complete cleaning process development assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5043,
              name: 'Microbial risk assessment where applicable',
              description: 'Complete microbial risk assessment where applicable by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5044,
              name: 'Formulation design space and operating ranges',
              description: 'Complete formulation design space and operating ranges by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5045,
              name: 'Preliminary process capability assessment',
              description: 'Complete preliminary process capability assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5046,
              name: 'Accelerated stability study initiation',
              description: 'Complete accelerated stability study initiation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 505,
          name: 'Development specifications and batch documentation',
          description: 'Compile and obtain cross-functional approval of the development specifications and batch documentation deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5051,
              name: 'Long-term stability study initiation',
              description: 'Complete long-term stability study initiation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5052,
              name: 'Bioavailability or bioequivalence strategy assessment',
              description: 'Complete bioavailability or bioequivalence strategy assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5053,
              name: 'Scale-up and technology transfer risk review',
              description: 'Complete scale-up and technology transfer risk review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5054,
              name: 'Draft master batch record preparation',
              description: 'Complete draft master batch record preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 506,
          name: 'Formulation and process development report',
          description: 'Compile and obtain cross-functional approval of the formulation and process development report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 5061,
              name: 'Manufacturing equipment and facility fit assessment',
              description: 'Complete manufacturing equipment and facility fit assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5062,
              name: 'Process hazard and EHS assessment',
              description: 'Complete process hazard and ehs assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 5063,
              name: 'Formulation and process development report',
              description: 'Complete formulation and process development report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 10,
      name: 'S6 - Development Batches and Verification',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 601,
          name: 'Development batch and test results',
          description: 'Compile and obtain cross-functional approval of the development batch and test results deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 6011,
              name: 'Pilot batch manufacturing and documentation',
              description: 'Complete pilot batch manufacturing and documentation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6012,
              name: 'Development batch sampling and testing',
              description: 'Complete development batch sampling and testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 602,
          name: 'Analytical and product performance verification',
          description: 'Compile and obtain cross-functional approval of the analytical and product performance verification deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 6021,
              name: 'Analytical method verification',
              description: 'Complete analytical method verification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6022,
              name: 'Assay, impurities and dissolution testing',
              description: 'Complete assay, impurities and dissolution testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6023,
              name: 'Physical and chemical characterization',
              description: 'Complete physical and chemical characterization by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 603,
          name: 'Stability and packaging assessment',
          description: 'Compile and obtain cross-functional approval of the stability and packaging assessment deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 6031,
              name: 'Microbiological testing where applicable',
              description: 'Complete microbiological testing where applicable by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6032,
              name: 'Packaging line and pack presentation trials',
              description: 'Complete packaging line and pack presentation trials by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6033,
              name: 'Stability protocol execution and trending',
              description: 'Complete stability protocol execution and trending by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6034,
              name: 'Deviation and out-of-specification investigation',
              description: 'Complete deviation and out-of-specification investigation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6035,
              name: 'Process parameter and yield evaluation',
              description: 'Complete process parameter and yield evaluation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6036,
              name: 'Batch record review and reconciliation',
              description: 'Complete batch record review and reconciliation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 604,
          name: 'Development verification report',
          description: 'Compile and obtain cross-functional approval of the development verification report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 6041,
              name: 'Product specification refinement',
              description: 'Complete product specification refinement by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 6042,
              name: 'Formulation and process verification report',
              description: 'Complete formulation and process verification report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 11,
      name: 'S7 - Facility, Equipment and Process Readiness',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 701,
          name: 'Facility and equipment qualification plan',
          description: 'Compile and obtain cross-functional approval of the facility and equipment qualification plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 7011,
              name: 'Facility and equipment gap assessment',
              description: 'Complete facility and equipment gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7012,
              name: 'Equipment qualification planning (DQ/IQ/OQ/PQ)',
              description: 'Complete equipment qualification planning (dq/iq/oq/pq) by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7013,
              name: 'Utilities and environmental control readiness',
              description: 'Complete utilities and environmental control readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7014,
              name: 'Manufacturing process risk assessment',
              description: 'Complete manufacturing process risk assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 702,
          name: 'GMP manufacturing and laboratory readiness',
          description: 'Compile and obtain cross-functional approval of the gmp manufacturing and laboratory readiness deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 7021,
              name: 'Cleaning validation strategy and protocol',
              description: 'Complete cleaning validation strategy and protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7022,
              name: 'Computerized system and data integrity readiness',
              description: 'Complete computerized system and data integrity readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7023,
              name: 'Material flow and contamination control review',
              description: 'Complete material flow and contamination control review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7024,
              name: 'GMP documentation and SOP preparation',
              description: 'Complete gmp documentation and sop preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7025,
              name: 'Analytical laboratory readiness assessment',
              description: 'Complete analytical laboratory readiness assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 703,
          name: 'Process validation and cleaning strategy',
          description: 'Compile and obtain cross-functional approval of the process validation and cleaning strategy deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 7031,
              name: 'Preventive maintenance and calibration planning',
              description: 'Complete preventive maintenance and calibration planning by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7032,
              name: 'Training and competency qualification',
              description: 'Complete training and competency qualification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 7033,
              name: 'Process validation master plan',
              description: 'Complete process validation master plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 12,
      name: 'Gate 5: Facility and manufacturing readiness approval',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3501,
          name: 'Commercial Manufacturing Facility GMP Qualification',
          description: 'Cleanroom HVAC qualification (ISO Class 8/Grade C/D), differential pressure cascades, and utility validations (PW/WFI) verified.',
          completed: false
        },
        {
          id: 3502,
          name: 'Commercial Equipment IQ/OQ/PQ & Calibrations Complete',
          description: 'High-shear granulator, fluid bed dryer, tablet press, and blister packaging line fully qualified and release-certified.',
          completed: false
        },
        {
          id: 3503,
          name: 'Cleaning Validation & Maximum Allowable Carryover (MAC) Limits',
          description: 'Analytical swab and rinse cleaning test methods validated; cleaning verification protocol approved for drug contact surfaces.',
          completed: false
        },
        {
          id: 3504,
          name: 'Commercial Batch Records (MBR/BPR) & Standard Operating Procedures',
          description: 'Master batch manufacturing and packaging records signed off by MS&T, Production Operations, and Quality Assurance.',
          completed: false
        },
        {
          id: 3505,
          name: 'Raw Material Commercial Inventory Release for Registration Batches',
          description: 'API and all compendial excipients received, sampled, QC tested, and released under active quarantine/inventory management.',
          completed: false
        }
      ]
    },
    {
      id: 13,
      name: 'S8 - Analytical Validation and Technology Transfer',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 801,
          name: 'Validated analytical methods package',
          description: 'Compile and obtain cross-functional approval of the validated analytical methods package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 8011,
              name: 'Analytical method validation protocol approval',
              description: 'Complete analytical method validation protocol approval by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8012,
              name: 'Assay and impurity method validation',
              description: 'Complete assay and impurity method validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8013,
              name: 'Dissolution method validation',
              description: 'Complete dissolution method validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 802,
          name: 'Technology transfer and method transfer report',
          description: 'Compile and obtain cross-functional approval of the technology transfer and method transfer report deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 8021,
              name: 'Microbiological method suitability or validation',
              description: 'Complete microbiological method suitability or validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8022,
              name: 'Reference standards and critical reagents qualification',
              description: 'Complete reference standards and critical reagents qualification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8023,
              name: 'Technology transfer package preparation',
              description: 'Complete technology transfer package preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8024,
              name: 'Receiving site method transfer execution',
              description: 'Complete receiving site method transfer execution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 8025,
              name: 'Method transfer discrepancy resolution',
              description: 'Complete method transfer discrepancy resolution by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 14,
      name: 'S9 - Registration and Process Validation Batches',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 901,
          name: 'Process performance qualification package',
          description: 'Compile and obtain cross-functional approval of the process performance qualification package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 9011,
              name: 'Registration batch manufacturing plan',
              description: 'Complete registration batch manufacturing plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9012,
              name: 'Process performance qualification protocol',
              description: 'Complete process performance qualification protocol by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9013,
              name: 'Commercial-scale batch manufacturing',
              description: 'Complete commercial-scale batch manufacturing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9014,
              name: 'Process validation sampling and testing',
              description: 'Complete process validation sampling and testing by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 902,
          name: 'Registration batch and stability data package',
          description: 'Compile and obtain cross-functional approval of the registration batch and stability data package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 9021,
              name: 'Batch documentation and quality review',
              description: 'Complete batch documentation and quality review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9022,
              name: 'Stability batches placement and monitoring',
              description: 'Complete stability batches placement and monitoring by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9023,
              name: 'Packaging and serialization readiness',
              description: 'Complete packaging and serialization readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9024,
              name: 'Process validation deviation assessment',
              description: 'Complete process validation deviation assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 903,
          name: 'Validation summary and commercial process readiness',
          description: 'Compile and obtain cross-functional approval of the validation summary and commercial process readiness deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 9031,
              name: 'Batch release testing and disposition',
              description: 'Complete batch release testing and disposition by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9032,
              name: 'Continued process verification plan',
              description: 'Complete continued process verification plan by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 9033,
              name: 'Registration batch summary report',
              description: 'Complete registration batch summary report by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 15,
      name: 'Gate 6: Validation and regulatory submission readiness',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3601,
          name: 'Process Performance Qualification (PPQ) 3 Batches Execution',
          description: 'Three consecutive commercial-scale batches manufactured meeting all predefined intra-batch and inter-batch acceptance criteria.',
          completed: false
        },
        {
          id: 3602,
          name: 'Registration Batch ICH Stability Data (6-Month Accelerated & Long-Term)',
          description: 'Mandatory minimum 6 months stability data at 40°C/75% RH and 25°C/60% RH complies with all finished product specifications.',
          completed: false
        },
        {
          id: 3603,
          name: 'Pivotal In-Vivo Bioequivalence (BE) Study Clinical Report',
          description: '90% confidence intervals for Cmax and AUC ratios fall within 80.00% - 125.00% bioequivalence acceptance limits.',
          completed: false
        },
        {
          id: 3604,
          name: 'eCTD Regulatory Dossier Compilation & Publishing',
          description: 'Modules 1 through 5 compiled in eCTD format with zero critical technical validation errors; ready for gateway dispatch.',
          completed: false
        },
        {
          id: 3605,
          name: 'Pre-Approval Inspection (PAI) Readiness Audit Clearance',
          description: 'Mock GMP regulatory inspection completed across development laboratory and commercial manufacturing site with zero open CAPAs.',
          completed: false
        }
      ]
    },
    {
      id: 16,
      name: 'S10 - Regulatory Submission and Approval',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 1001,
          name: 'Regulatory submission dossier',
          description: 'Compile and obtain cross-functional approval of the regulatory submission dossier deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 10011,
              name: 'Regulatory dossier content gap assessment',
              description: 'Complete regulatory dossier content gap assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10012,
              name: 'CTD/eCTD quality module preparation',
              description: 'Complete ctd/ectd quality module preparation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10013,
              name: 'Drug substance and drug product section compilation',
              description: 'Complete drug substance and drug product section compilation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10014,
              name: 'Nonclinical and clinical evidence compilation',
              description: 'Complete nonclinical and clinical evidence compilation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10015,
              name: 'Stability data and shelf-life justification',
              description: 'Complete stability data and shelf-life justification by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 1002,
          name: 'Regulatory approval and commitments tracker',
          description: 'Compile and obtain cross-functional approval of the regulatory approval and commitments tracker deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 10021,
              name: 'Labeling, prescribing information and artwork review',
              description: 'Complete labeling, prescribing information and artwork review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10022,
              name: 'Regulatory quality review and submission readiness',
              description: 'Complete regulatory quality review and submission readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10023,
              name: 'Submission publishing and electronic validation',
              description: 'Complete submission publishing and electronic validation by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 10024,
              name: 'Regulatory authority query response coordination',
              description: 'Complete regulatory authority query response coordination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 17,
      name: 'S11 - Commercial Launch and Lifecycle Management',
      type: 'stage',
      completed: false,
      modules: [
        {
          id: 1101,
          name: 'Commercial launch readiness package',
          description: 'Compile and obtain cross-functional approval of the commercial launch readiness package deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 11011,
              name: 'Commercial supply and launch readiness review',
              description: 'Complete commercial supply and launch readiness review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11012,
              name: 'Final product release and distribution readiness',
              description: 'Complete final product release and distribution readiness by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11013,
              name: 'Market launch and supply coordination',
              description: 'Complete market launch and supply coordination by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11014,
              name: 'Post-approval commitment tracking',
              description: 'Complete post-approval commitment tracking by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11015,
              name: 'Product quality complaint and pharmacovigilance handoff',
              description: 'Complete product quality complaint and pharmacovigilance handoff by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        },
        {
          id: 1102,
          name: 'Product lifecycle and post-approval management plan',
          description: 'Compile and obtain cross-functional approval of the product lifecycle and post-approval management plan deliverable. Consolidate supporting activity outputs, verify traceability to product requirements and applicable GMP, quality and regulatory expectations, resolve gaps or document accepted risks, and retain controlled evidence for the next review or gate.',
          completed: false,
          tasks: [
            {
              id: 11021,
              name: 'Change control and post-approval variation assessment',
              description: 'Complete change control and post-approval variation assessment by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11022,
              name: 'Ongoing stability program management',
              description: 'Complete ongoing stability program management by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11023,
              name: 'Continued process verification and trending',
              description: 'Complete continued process verification and trending by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11024,
              name: 'Supplier performance and quality monitoring',
              description: 'Complete supplier performance and quality monitoring by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            },
            {
              id: 11025,
              name: 'Product lifecycle and improvement review',
              description: 'Complete product lifecycle and improvement review by defining the scope and acceptance criteria, coordinating the responsible pharmaceutical development functions, generating and reviewing the required data or documentation, recording deviations and risks, and obtaining the required quality or functional review. Sequencing context: follow the approved development plan and documented predecessor activities.',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 18,
      name: 'Gate 7: Commercial launch authorization',
      type: 'gate',
      completed: false,
      modules: [],
      tasks: [
        {
          id: 3701,
          name: 'Marketing Authorization Approval & Product License Granted',
          description: 'Official approval letters, approved package insert/SmPC, and marketing authorization received from regulatory authorities.',
          completed: false
        },
        {
          id: 3702,
          name: 'Pre-Approval Inspection (PAI) Clearance & Site License',
          description: 'Health authority GMP inspection successfully passed with official Establishment Inspection Report (EIR) or GMP certificate issued.',
          completed: false
        },
        {
          id: 3703,
          name: 'Commercial Supply Chain & Distribution Pipeline Stocked',
          description: 'Launch quantities manufactured, packaged in market-specific commercial cartons, and positioned at regional distribution centers.',
          completed: false
        },
        {
          id: 3704,
          name: 'Pharmacovigilance (PV) & Post-Marketing Risk Management Ready',
          description: 'Adverse drug reaction (ADR) reporting systems, safety database, and Risk Evaluation and Mitigation Strategy (REMS) operational.',
          completed: false
        },
        {
          id: 3705,
          name: 'Commercial Operations Launch Authorization & Handover',
          description: 'Executive committee sign-off transferring responsibility from R&D project team to commercial supply and brand management.',
          completed: false
        }
      ]
    }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    // Default to the first stage (Feasibility, id: 1)
    const defaultStage = this.stagesAndGates[0];
    this.selectStage(defaultStage);
  }

  // --- Migrated Methods ---

  selectStage(stage: StageItem) {
    this.selectedStage = stage;
    if (stage.modules && stage.modules.length > 0) {
      this.selectedModule = stage.modules[0];
    } else {
      this.selectedModule = null;
    }
  }

  selectModule(moduleItem: ModuleItem) {
    this.selectedModule = moduleItem;
  }

  openAddDeliverableDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.deliverableName || result.name)) {
        const newModule: ModuleItem = {
          id: Date.now(),
          name: result.deliverableName || result.name,
          description: result.description || '',
          completed: false,
          tasks: []
        };
        if (!this.selectedStage!.modules) {
          this.selectedStage!.modules = [];
        }
        this.selectedStage!.modules.push(newModule);
        this.selectedModule = newModule;
      }
    });
  }

  openAddActivityDialog(): void {
    if (!this.selectedStage || this.selectedStage.type === 'gate') return;

    const deliverables = this.selectedStage.modules?.map(m => m.name) || [];
    const currentDeliverable = this.selectedModule?.name || (deliverables.length > 0 ? deliverables[0] : '');

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        deliverable: currentDeliverable,
        deliverables: deliverables.length > 0 ? deliverables : [currentDeliverable || 'Deliverable'],
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.activityName || result.task)) {
        const newActivity: TaskItem = {
          id: Date.now(),
          name: result.activityName || result.task,
          description: result.description || '',
          completed: false
        };

        let targetModule = this.selectedModule;
        if (result.deliverable && this.selectedStage?.modules) {
          const found = this.selectedStage.modules.find(m => m.name === result.deliverable);
          if (found) targetModule = found;
        }

        if (targetModule) {
          if (!targetModule.tasks) {
            targetModule.tasks = [];
          }
          targetModule.tasks.push(newActivity);
        }
      }
    });
  }

  openAddCriteriaDialog(): void {
    if (!this.selectedStage || this.selectedStage.type !== 'gate') return;

    const dialogRef = this.dialog.open(AddCriteriaComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        stage: this.selectedStage.name,
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.subject || result.question || result.name)) {
        const newCriterion: TaskItem = {
          id: Date.now(),
          name: result.subject || result.question || result.name || '',
          description: result.description || '',
          completed: false
        };

        if (this.selectedStage) {
          if (!this.selectedStage.tasks) {
            this.selectedStage.tasks = [];
          }
          this.selectedStage.tasks.push(newCriterion);
        }
      }
    });
  }

  editItem(item: any, type: string) {
    if (type === 'Criterion') {
      const dialogRef = this.dialog.open(AddCriteriaComponent, {
        width: '900px',
        maxWidth: '95vw',
        height: 'auto',
        data: {
          mode: 'edit',
          id: item.id,
          subject: item.name,
          question: item.name,
          description: item.description,
          priority: item.priority || 'High',
          mandatory: item.mandatory || false
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.subject || result.question || result.name || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Module' || type === 'Deliverable') {
      const dialogRef = this.dialog.open(AddDeliverableComponent, {
        width: '600px',
        maxWidth: '90vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverableName: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && (result.deliverableName || result.name)) {
          item.name = result.deliverableName || result.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    } else if (type === 'Task' || type === 'Activity') {
      const deliverables = this.selectedStage?.modules?.map(m => m.name) || [];
      const dialogRef = this.dialog.open(AddActivityComponent, {
        width: '1000px',
        maxWidth: '95vw',
        data: {
          mode: 'edit',
          stage: this.selectedStage?.name || '',
          deliverable: this.selectedModule?.name || '',
          deliverables: deliverables.length > 0 ? deliverables : [this.selectedModule?.name || 'Deliverable'],
          activityName: item.name,
          task: item.name,
          description: item.description
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          item.name = result.activityName || result.task || item.name;
          item.description = result.description !== undefined ? result.description : item.description;
        }
      });
    }
  }

  deleteItem(item: any, type: string) {
    if (type === 'Task' || type === 'Criterion' || type === 'Activity') {
      if (this.selectedStage?.type === 'gate' && this.selectedStage.tasks) {
        const idx = this.selectedStage.tasks.indexOf(item);
        if (idx > -1) this.selectedStage.tasks.splice(idx, 1);
      } else if (this.selectedModule && this.selectedModule.tasks) {
        const idx = this.selectedModule.tasks.indexOf(item);
        if (idx > -1) this.selectedModule.tasks.splice(idx, 1);
      }
    } else if (type === 'Module' || type === 'Deliverable') {
      if (this.selectedStage && this.selectedStage.modules) {
        const idx = this.selectedStage.modules.indexOf(item);
        if (idx > -1) {
          this.selectedStage.modules.splice(idx, 1);
          if (this.selectedModule === item) {
            this.selectedModule = this.selectedStage.modules[0] || null;
          }
        }
      }
    }
  }

  toggleCompleted(event: Event, item: any) {
    event.stopPropagation();
    item.completed = !item.completed;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
    });
  }

}