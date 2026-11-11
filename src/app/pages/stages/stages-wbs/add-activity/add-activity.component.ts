import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PredecessorItem {
  id?: string | number;
  stage: string;
  deliverable?: string;
  activity: string;
  type?: string;
}

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.scss'
})
export class AddActivityComponent implements OnInit, AfterViewInit {
  activeTab: 'activity' | 'predecessor' = 'activity';

  activityForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  deliverables: string[] = [];
  uploadedFileNames: string[] = [];

  departmentOptions: string[] = [
    'R&D',
    'FR&D',
    'ARD',
    'RA',
    'QA',
    'QC',
    'Clinical',
    'Procurement',
    'Production',
    'PMO/Management',
    'PMO/Management/RA',
    'PMO/Management/Finance',
    'Steering Committee',
    'Supply Chain',
    'Packaging'
  ];

  // Predecessor Tab Data
  predecessorPageIndex = 0;
  predecessorPageSize = 5;

  readonly typeOptions: string[] = [
    'FS - Finish to Start - Finish A to Start B',
    'SF - Start to Finish - B must be started to finish A',
    'SS - Start to Start - A must start before B is started',
    'FF - Finish to Finish - B can be finished only after A is finished'
  ];

  stageOptions: string[] = [
    'S1 - Opportunity and Portfolio Assessment',
    'S2 - Product Definition and Project Charter',
    'S3 - Formulation and Product Concept Development',
    'S4 - API, Excipient and Supplier Sourcing',
    'S5 - Formulation and Process Development',
    'S6 - Development Batches and Verification',
    'S7 - Facility, Equipment and Process Readiness',
    'S8 - Analytical Validation and Technology Transfer',
    'S9 - Registration and Process Validation Batches',
    'S10 - Regulatory Submission and Approval',
    'S11 - Commercial Launch and Lifecycle Management'
  ];

  stageDeliverablesMap: { [key: string]: string[] } = {
    'S1 - Opportunity and Portfolio Assessment': [
      '1.1 - Market and therapeutic opportunity assessment',
      '1.2 - Program economics and feasibility assessment',
      '1.3 - Concept and portfolio approval package'
    ],
    'S2 - Product Definition and Project Charter': [
      '2.1 - Product requirements and target profile',
      '2.2 - Regulatory, quality and IP strategy',
      '2.3 - Development plan, budget and project charter',
      '2.4 - Risk and resource management plan',
      '2.5 - Product development feasibility assessment'
    ],
    'S3 - Formulation and Product Concept Development': [
      '3.1 - Pre-formulation and material characterization package',
      '3.2 - Prototype formulation and performance assessment',
      '3.3 - Product concept and development risk review',
      '3.4 - Preliminary control and stability strategy'
    ],
    'S4 - API, Excipient and Supplier Sourcing': [
      '4.1 - Qualified API and excipient supply strategy',
      '4.2 - Supplier nomination and quality agreements'
    ],
    'S5 - Formulation and Process Development': [
      '5.1 - Optimized formulation and process definition',
      '5.2 - Analytical methods and control strategy',
      '5.3 - Stability and packaging compatibility package',
      '5.4 - Manufacturing process and scale-up package',
      '5.5 - Development specifications and batch documentation',
      '5.6 - Formulation and process development report'
    ],
    'S6 - Development Batches and Verification': [
      '6.1 - Development batch and test results',
      '6.2 - Analytical and product performance verification',
      '6.3 - Stability and packaging assessment',
      '6.4 - Development verification report'
    ],
    'S7 - Facility, Equipment and Process Readiness': [
      '7.1 - Facility and equipment qualification plan',
      '7.2 - GMP manufacturing and laboratory readiness',
      '7.3 - Process validation and cleaning strategy'
    ],
    'S8 - Analytical Validation and Technology Transfer': [
      '8.1 - Validated analytical methods package',
      '8.2 - Technology transfer and method transfer report'
    ],
    'S9 - Registration and Process Validation Batches': [
      '9.1 - Process performance qualification package',
      '9.2 - Registration batch and stability data package',
      '9.3 - Validation summary and commercial process readiness'
    ],
    'S10 - Regulatory Submission and Approval': [
      '10.1 - Regulatory submission dossier',
      '10.2 - Regulatory approval and commitments tracker'
    ],
    'S11 - Commercial Launch and Lifecycle Management': [
      '11.1 - Commercial launch readiness package',
      '11.2 - Product lifecycle and post-approval management plan'
    ]
  };

  stageActivitiesMap: { [key: string]: string[] } = {
    '1.1 - Market and therapeutic opportunity assessment': [
      '1.1.1 - Market and therapeutic-area assessment',
      '1.1.2 - Unmet medical need and target product profile research',
      '1.1.3 - Competitor and reference product benchmarking',
      '1.1.4 - Target markets and regulatory pathway shortlist'
    ],
    '1.2 - Program economics and feasibility assessment': [
      '1.2.1 - Patient population and demand forecast',
      '1.2.2 - Preliminary pricing and access assessment',
      '1.2.3 - Initial product feasibility and risk screening'
    ],
    '1.3 - Concept and portfolio approval package': [
      '1.3.1 - Portfolio committee concept approval'
    ],
    '2.1 - Product requirements and target profile': [
      '2.1.1 - Target Product Profile (TPP) definition',
      '2.1.2 - Quality Target Product Profile (QTPP) definition',
      '2.1.3 - Preliminary Critical Quality Attributes (CQA) identification',
      '2.1.4 - Regulatory strategy and submission pathway assessment',
      '2.1.5 - Intellectual property and freedom-to-operate review'
    ],
    '2.2 - Regulatory, quality and IP strategy': [
      '2.2.1 - Product development strategy and project charter',
      '2.2.2 - Development budget and resource estimate',
      '2.2.3 - Integrated project schedule and milestone plan',
      '2.2.4 - Cross-functional responsibility matrix'
    ],
    '2.3 - Development plan, budget and project charter': [
      '2.3.1 - Preliminary risk register and mitigation plan',
      '2.3.2 - Commercial forecast and profitability assessment',
      '2.3.3 - Make-or-buy and external partner strategy'
    ],
    '2.4 - Risk and resource management plan': [
      '2.4.1 - Project charter review and approval',
      '2.4.2 - Product specification and acceptance criteria draft',
      '2.4.3 - Clinical and nonclinical evidence gap assessment'
    ],
    '2.5 - Product development feasibility assessment': [
      '2.5.1 - Data integrity and documentation strategy',
      '2.5.2 - Development governance and change-control plan'
    ],
    '3.1 - Pre-formulation and material characterization package': [
      '3.1.1 - API and excipient compatibility assessment',
      '3.1.2 - Pre-formulation characterization plan',
      '3.1.3 - Prototype formulation design',
      '3.1.4 - Excipient selection and justification',
      '3.1.5 - Dosage form and delivery system selection'
    ],
    '3.2 - Prototype formulation and performance assessment': [
      '3.2.1 - Initial manufacturing process concept',
      '3.2.2 - Preliminary analytical control strategy',
      '3.2.3 - Prototype performance and dissolution assessment',
      '3.2.4 - Stability risk assessment and initial protocol',
      '3.2.5 - Packaging concept and compatibility assessment',
      '3.2.6 - Preliminary scale-up feasibility assessment'
    ],
    '3.3 - Product concept and development risk review': [
      '3.3.1 - Formulation design review',
      '3.3.2 - Prototype selection and rationale',
      '3.3.3 - Preliminary CQA and CPP linkage assessment',
      '3.3.4 - Development batch design',
      '3.3.5 - Reference product characterization'
    ],
    '3.4 - Preliminary control and stability strategy': [
      '3.4.1 - Concept formulation risk review'
    ],
    '4.1 - Qualified API and excipient supply strategy': [
      '4.1.1 - API supplier technical assessment',
      '4.1.2 - Excipient and packaging vendor assessment',
      '4.1.3 - Supplier quality agreement and audit planning',
      '4.1.4 - API specification and certificate review'
    ],
    '4.2 - Supplier nomination and quality agreements': [
      '4.2.1 - Vendor qualification and sample procurement',
      '4.2.2 - Supply continuity and material risk assessment',
      '4.2.3 - Supplier selection and nomination'
    ],
    '5.1 - Optimized formulation and process definition': [
      '5.1.1 - Formulation optimization and DoE studies',
      '5.1.2 - API particle size and material attribute assessment',
      '5.1.3 - Excipient grade and functionality optimization',
      '5.1.4 - Manufacturing process parameter development'
    ],
    '5.2 - Analytical methods and control strategy': [
      '5.2.1 - Critical Process Parameters (CPP) identification',
      '5.2.2 - Critical Material Attributes (CMA) assessment',
      '5.2.3 - Analytical method development for assay and impurities',
      '5.2.4 - Dissolution method development'
    ],
    '5.3 - Stability and packaging compatibility package': [
      '5.3.1 - Degradation pathway and impurity profiling',
      '5.3.2 - Forced degradation study execution',
      '5.3.3 - Container closure system selection',
      '5.3.4 - Packaging compatibility and protection assessment',
      '5.3.5 - Prototype batch manufacturing instructions'
    ],
    '5.4 - Manufacturing process and scale-up package': [
      '5.4.1 - In-process control strategy development',
      '5.4.2 - Cleaning process development assessment',
      '5.4.3 - Microbial risk assessment where applicable',
      '5.4.4 - Formulation design space and operating ranges',
      '5.4.5 - Preliminary process capability assessment',
      '5.4.6 - Accelerated stability study initiation'
    ],
    '5.5 - Development specifications and batch documentation': [
      '5.5.1 - Long-term stability study initiation',
      '5.5.2 - Bioavailability or bioequivalence strategy assessment',
      '5.5.3 - Scale-up and technology transfer risk review',
      '5.5.4 - Draft master batch record preparation'
    ],
    '5.6 - Formulation and process development report': [
      '5.6.1 - Manufacturing equipment and facility fit assessment',
      '5.6.2 - Process hazard and EHS assessment',
      '5.6.3 - Formulation and process development report'
    ],
    '6.1 - Development batch and test results': [
      '6.1.1 - Pilot batch manufacturing and documentation',
      '6.1.2 - Development batch sampling and testing'
    ],
    '6.2 - Analytical and product performance verification': [
      '6.2.1 - Analytical method verification',
      '6.2.2 - Assay, impurities and dissolution testing',
      '6.2.3 - Physical and chemical characterization'
    ],
    '6.3 - Stability and packaging assessment': [
      '6.3.1 - Microbiological testing where applicable',
      '6.3.2 - Packaging line and pack presentation trials',
      '6.3.3 - Stability protocol execution and trending',
      '6.3.4 - Deviation and out-of-specification investigation',
      '6.3.5 - Process parameter and yield evaluation',
      '6.3.6 - Batch record review and reconciliation'
    ],
    '6.4 - Development verification report': [
      '6.4.1 - Product specification refinement',
      '6.4.2 - Formulation and process verification report'
    ],
    '7.1 - Facility and equipment qualification plan': [
      '7.1.1 - Facility and equipment gap assessment',
      '7.1.2 - Equipment qualification planning (DQ/IQ/OQ/PQ)',
      '7.1.3 - Utilities and environmental control readiness',
      '7.1.4 - Manufacturing process risk assessment'
    ],
    '7.2 - GMP manufacturing and laboratory readiness': [
      '7.2.1 - Cleaning validation strategy and protocol',
      '7.2.2 - Computerized system and data integrity readiness',
      '7.2.3 - Material flow and contamination control review',
      '7.2.4 - GMP documentation and SOP preparation',
      '7.2.5 - Analytical laboratory readiness assessment'
    ],
    '7.3 - Process validation and cleaning strategy': [
      '7.3.1 - Preventive maintenance and calibration planning',
      '7.3.2 - Training and competency qualification',
      '7.3.3 - Process validation master plan'
    ],
    '8.1 - Validated analytical methods package': [
      '8.1.1 - Analytical method validation protocol approval',
      '8.1.2 - Assay and impurity method validation',
      '8.1.3 - Dissolution method validation'
    ],
    '8.2 - Technology transfer and method transfer report': [
      '8.2.1 - Microbiological method suitability or validation',
      '8.2.2 - Reference standards and critical reagents qualification',
      '8.2.3 - Technology transfer package preparation',
      '8.2.4 - Receiving site method transfer execution',
      '8.2.5 - Method transfer discrepancy resolution'
    ],
    '9.1 - Process performance qualification package': [
      '9.1.1 - Registration batch manufacturing plan',
      '9.1.2 - Process performance qualification protocol',
      '9.1.3 - Commercial-scale batch manufacturing',
      '9.1.4 - Process validation sampling and testing'
    ],
    '9.2 - Registration batch and stability data package': [
      '9.2.1 - Batch documentation and quality review',
      '9.2.2 - Stability batches placement and monitoring',
      '9.2.3 - Packaging and serialization readiness',
      '9.2.4 - Process validation deviation assessment'
    ],
    '9.3 - Validation summary and commercial process readiness': [
      '9.3.1 - Batch release testing and disposition',
      '9.3.2 - Continued process verification plan',
      '9.3.3 - Registration batch summary report'
    ],
    '10.1 - Regulatory submission dossier': [
      '10.1.1 - Regulatory dossier content gap assessment',
      '10.1.2 - CTD/eCTD quality module preparation',
      '10.1.3 - Drug substance and drug product section compilation',
      '10.1.4 - Nonclinical and clinical evidence compilation',
      '10.1.5 - Stability data and shelf-life justification'
    ],
    '10.2 - Regulatory approval and commitments tracker': [
      '10.2.1 - Labeling, prescribing information and artwork review',
      '10.2.2 - Regulatory quality review and submission readiness',
      '10.2.3 - Submission publishing and electronic validation',
      '10.2.4 - Regulatory authority query response coordination'
    ],
    '11.1 - Commercial launch readiness package': [
      '11.1.1 - Commercial supply and launch readiness review',
      '11.1.2 - Final product release and distribution readiness',
      '11.1.3 - Market launch and supply coordination',
      '11.1.4 - Post-approval commitment tracking',
      '11.1.5 - Product quality complaint and pharmacovigilance handoff'
    ],
    '11.2 - Product lifecycle and post-approval management plan': [
      '11.2.1 - Change control and post-approval variation assessment',
      '11.2.2 - Ongoing stability program management',
      '11.2.3 - Continued process verification and trending',
      '11.2.4 - Supplier performance and quality monitoring',
      '11.2.5 - Product lifecycle and improvement review'
    ]
  };

  allActivities: string[] = [
    '1.1.1 - Market and therapeutic-area assessment',
    '1.1.2 - Unmet medical need and target product profile research',
    '1.1.3 - Competitor and reference product benchmarking',
    '1.1.4 - Target markets and regulatory pathway shortlist',
    '1.2.1 - Patient population and demand forecast',
    '1.2.2 - Preliminary pricing and access assessment',
    '1.2.3 - Initial product feasibility and risk screening',
    '1.3.1 - Portfolio committee concept approval',
    '2.1.1 - Target Product Profile (TPP) definition',
    '2.1.2 - Quality Target Product Profile (QTPP) definition',
    '2.1.3 - Preliminary Critical Quality Attributes (CQA) identification',
    '2.1.4 - Regulatory strategy and submission pathway assessment',
    '2.1.5 - Intellectual property and freedom-to-operate review',
    '2.2.1 - Product development strategy and project charter',
    '2.2.2 - Development budget and resource estimate',
    '2.2.3 - Integrated project schedule and milestone plan',
    '2.2.4 - Cross-functional responsibility matrix',
    '2.3.1 - Preliminary risk register and mitigation plan',
    '2.3.2 - Commercial forecast and profitability assessment',
    '2.3.3 - Make-or-buy and external partner strategy',
    '2.4.1 - Project charter review and approval',
    '2.4.2 - Product specification and acceptance criteria draft',
    '2.4.3 - Clinical and nonclinical evidence gap assessment',
    '2.5.1 - Data integrity and documentation strategy',
    '2.5.2 - Development governance and change-control plan',
    '3.1.1 - API and excipient compatibility assessment',
    '3.1.2 - Pre-formulation characterization plan',
    '3.1.3 - Prototype formulation design',
    '3.1.4 - Excipient selection and justification',
    '3.1.5 - Dosage form and delivery system selection',
    '3.2.1 - Initial manufacturing process concept',
    '3.2.2 - Preliminary analytical control strategy',
    '3.2.3 - Prototype performance and dissolution assessment',
    '3.2.4 - Stability risk assessment and initial protocol',
    '3.2.5 - Packaging concept and compatibility assessment',
    '3.2.6 - Preliminary scale-up feasibility assessment',
    '3.3.1 - Formulation design review',
    '3.3.2 - Prototype selection and rationale',
    '3.3.3 - Preliminary CQA and CPP linkage assessment',
    '3.3.4 - Development batch design',
    '3.3.5 - Reference product characterization',
    '3.4.1 - Concept formulation risk review',
    '4.1.1 - API supplier technical assessment',
    '4.1.2 - Excipient and packaging vendor assessment',
    '4.1.3 - Supplier quality agreement and audit planning',
    '4.1.4 - API specification and certificate review',
    '4.2.1 - Vendor qualification and sample procurement',
    '4.2.2 - Supply continuity and material risk assessment',
    '4.2.3 - Supplier selection and nomination',
    '5.1.1 - Formulation optimization and DoE studies',
    '5.1.2 - API particle size and material attribute assessment',
    '5.1.3 - Excipient grade and functionality optimization',
    '5.1.4 - Manufacturing process parameter development',
    '5.2.1 - Critical Process Parameters (CPP) identification',
    '5.2.2 - Critical Material Attributes (CMA) assessment',
    '5.2.3 - Analytical method development for assay and impurities',
    '5.2.4 - Dissolution method development',
    '5.3.1 - Degradation pathway and impurity profiling',
    '5.3.2 - Forced degradation study execution',
    '5.3.3 - Container closure system selection',
    '5.3.4 - Packaging compatibility and protection assessment',
    '5.3.5 - Prototype batch manufacturing instructions',
    '5.4.1 - In-process control strategy development',
    '5.4.2 - Cleaning process development assessment',
    '5.4.3 - Microbial risk assessment where applicable',
    '5.4.4 - Formulation design space and operating ranges',
    '5.4.5 - Preliminary process capability assessment',
    '5.4.6 - Accelerated stability study initiation',
    '5.5.1 - Long-term stability study initiation',
    '5.5.2 - Bioavailability or bioequivalence strategy assessment',
    '5.5.3 - Scale-up and technology transfer risk review',
    '5.5.4 - Draft master batch record preparation',
    '5.6.1 - Manufacturing equipment and facility fit assessment',
    '5.6.2 - Process hazard and EHS assessment',
    '5.6.3 - Formulation and process development report',
    '6.1.1 - Pilot batch manufacturing and documentation',
    '6.1.2 - Development batch sampling and testing',
    '6.2.1 - Analytical method verification',
    '6.2.2 - Assay, impurities and dissolution testing',
    '6.2.3 - Physical and chemical characterization',
    '6.3.1 - Microbiological testing where applicable',
    '6.3.2 - Packaging line and pack presentation trials',
    '6.3.3 - Stability protocol execution and trending',
    '6.3.4 - Deviation and out-of-specification investigation',
    '6.3.5 - Process parameter and yield evaluation',
    '6.3.6 - Batch record review and reconciliation',
    '6.4.1 - Product specification refinement',
    '6.4.2 - Formulation and process verification report',
    '7.1.1 - Facility and equipment gap assessment',
    '7.1.2 - Equipment qualification planning (DQ/IQ/OQ/PQ)',
    '7.1.3 - Utilities and environmental control readiness',
    '7.1.4 - Manufacturing process risk assessment',
    '7.2.1 - Cleaning validation strategy and protocol',
    '7.2.2 - Computerized system and data integrity readiness',
    '7.2.3 - Material flow and contamination control review',
    '7.2.4 - GMP documentation and SOP preparation',
    '7.2.5 - Analytical laboratory readiness assessment',
    '7.3.1 - Preventive maintenance and calibration planning',
    '7.3.2 - Training and competency qualification',
    '7.3.3 - Process validation master plan',
    '8.1.1 - Analytical method validation protocol approval',
    '8.1.2 - Assay and impurity method validation',
    '8.1.3 - Dissolution method validation',
    '8.2.1 - Microbiological method suitability or validation',
    '8.2.2 - Reference standards and critical reagents qualification',
    '8.2.3 - Technology transfer package preparation',
    '8.2.4 - Receiving site method transfer execution',
    '8.2.5 - Method transfer discrepancy resolution',
    '9.1.1 - Registration batch manufacturing plan',
    '9.1.2 - Process performance qualification protocol',
    '9.1.3 - Commercial-scale batch manufacturing',
    '9.1.4 - Process validation sampling and testing',
    '9.2.1 - Batch documentation and quality review',
    '9.2.2 - Stability batches placement and monitoring',
    '9.2.3 - Packaging and serialization readiness',
    '9.2.4 - Process validation deviation assessment',
    '9.3.1 - Batch release testing and disposition',
    '9.3.2 - Continued process verification plan',
    '9.3.3 - Registration batch summary report',
    '10.1.1 - Regulatory dossier content gap assessment',
    '10.1.2 - CTD/eCTD quality module preparation',
    '10.1.3 - Drug substance and drug product section compilation',
    '10.1.4 - Nonclinical and clinical evidence compilation',
    '10.1.5 - Stability data and shelf-life justification',
    '10.2.1 - Labeling, prescribing information and artwork review',
    '10.2.2 - Regulatory quality review and submission readiness',
    '10.2.3 - Submission publishing and electronic validation',
    '10.2.4 - Regulatory authority query response coordination',
    '11.1.1 - Commercial supply and launch readiness review',
    '11.1.2 - Final product release and distribution readiness',
    '11.1.3 - Market launch and supply coordination',
    '11.1.4 - Post-approval commitment tracking',
    '11.1.5 - Product quality complaint and pharmacovigilance handoff',
    '11.2.1 - Change control and post-approval variation assessment',
    '11.2.2 - Ongoing stability program management',
    '11.2.3 - Continued process verification and trending',
    '11.2.4 - Supplier performance and quality monitoring',
    '11.2.5 - Product lifecycle and improvement review'
  ];

  predecessorList: PredecessorItem[] = [
    {
      stage: 'S1 - Opportunity and Portfolio Assessment',
      deliverable: '1.1 - Therapeutic area and market opportunity assessment',
      activity: '1.1.1 - Epidemiological and disease prevalence assessment',
      type: 'FS - Finish to Start - Finish A to Start B'
    },
    {
      stage: 'S1 - Opportunity and Portfolio Assessment',
      deliverable: '1.1 - Therapeutic area and market opportunity assessment',
      activity: '1.1.2 - Standard-of-care, unmet medical needs and competitive landscape analysis',
      type: 'SS - Start to Start - A must start before B is started'
    }
  ];

  get paginatedPredecessors(): PredecessorItem[] {
    const startIndex = this.predecessorPageIndex * this.predecessorPageSize;
    return this.predecessorList.slice(startIndex, startIndex + this.predecessorPageSize);
  }

  normalizeType(val?: string): string {
    if (!val) return this.typeOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.typeOptions.find(t =>
      t.toLowerCase() === cleanVal ||
      t.toLowerCase().startsWith(cleanVal) ||
      cleanVal.startsWith(t.toLowerCase().slice(0, 2))
    );
    return found || this.typeOptions[0];
  }

  normalizeStage(val?: string): string {
    if (!val) return this.stageOptions[0];
    const cleanVal = val.trim().toLowerCase();
    const found = this.stageOptions.find(s =>
      s.toLowerCase() === cleanVal ||
      s.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(s.toLowerCase().split(' - ')[1]?.toLowerCase() || '') ||
      cleanVal.includes(s.toLowerCase().split(' - ')[0]?.toLowerCase() || '')
    );
    return found || this.stageOptions[0];
  }

  normalizeDeliverable(stage: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getDeliverablesForStage(stage);
    const found = list.find(d =>
      d.toLowerCase() === cleanVal ||
      d.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(d.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  normalizeActivity(stage: string, del: string, val?: string): string {
    if (!val) return '';
    const cleanVal = val.trim().toLowerCase();
    const list = this.getActivitiesFor(stage, del);
    const found = list.find(a =>
      a.toLowerCase() === cleanVal ||
      a.toLowerCase().includes(cleanVal) ||
      cleanVal.includes(a.toLowerCase().split(' - ')[1]?.toLowerCase() || '')
    );
    return found || val;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deliverables = this.data?.deliverables || [
      'Business Case Preparation',
      'Market Sizing & Commercial Modeling',
      'Gate 1 Business Case Review',
      'Project costing sheet preparation & Selection of Project / Product',
      'Provicinal Product Initiation Form (PPIF)',
      'Literature serach & MER',
      'Pre Product Development Strategy (PPDS) finalization',
      'Procurement - Developmental studies',
      'Formulation Development'
    ];

    if (this.data?.departments && Array.isArray(this.data.departments) && this.data.departments.length > 0) {
      this.departmentOptions = [...this.data.departments];
    }
    if (this.data?.department && !this.departmentOptions.includes(this.data.department)) {
      this.departmentOptions.unshift(this.data.department);
    }

    const initialDeliverable = this.data?.deliverable || (this.deliverables.length > 0 ? this.deliverables[0] : '');

    this.activityForm = this.fb.group({
      stage: [this.data?.stage || 'Business Case', [Validators.required]],
      deliverable: [initialDeliverable, [Validators.required]],
      activityName: ['', [Validators.required]],
      activityCode: [''],
      department: [this.data?.department || (this.departmentOptions[0] || 'R&D')],
      applicability: ['All Products'],
      description: [''],
      planDuration: [''],
      planEffort: [''],
      materialBudget: [''],
      predecessor: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      if (this.data.department && !this.departmentOptions.includes(this.data.department)) {
        this.departmentOptions.unshift(this.data.department);
      }
      this.activityForm.patchValue({
        stage: this.data.stage ?? 'Business Case',
        deliverable: this.data.deliverable ?? (this.deliverables[0] || ''),
        activityName: this.data.activityName ?? this.data.task ?? '',
        activityCode: this.data.activityCode ?? this.data.taskCode ?? '',
        department: this.data.department ?? (this.departmentOptions[0] || 'R&D'),
        applicability: this.data.applicability ?? 'All Products',
        description: this.data.description ?? '',
        planDuration: this.data.planDuration ?? this.data.duration ?? '',
        planEffort: this.data.planEffort ?? this.data.effort ?? '',
        materialBudget: this.data.materialBudget ?? this.data.cost ?? '',
        predecessor: this.data.predecessor ?? ''
      });

      const rawPreds = this.data.predecessorsData || this.data.predecessors;
      if (rawPreds && Array.isArray(rawPreds) && rawPreds.length > 0) {
        this.predecessorList = rawPreds.map((p: any) => {
          const stage = this.normalizeStage(p.stage);
          const deliverable = this.normalizeDeliverable(stage, p.deliverable);
          const activity = this.normalizeActivity(stage, deliverable, p.activity);
          const type = this.normalizeType(p.type);
          return {
            ...p,
            stage,
            deliverable,
            activity,
            type
          };
        });
      }
    }
  }

  ngAfterViewInit(): void {
    this.resetScroll();
  }

  private resetScroll(): void {
    setTimeout(() => {
      const dialogContent = document.querySelector('.mat-mdc-dialog-content');
      if (dialogContent) {
        dialogContent.scrollTop = 0;
      }
    }, 0);
  }

  setActiveTab(tab: 'activity' | 'predecessor'): void {
    this.activeTab = tab;
    this.resetScroll();
  }

  prevTab(): void {
    if (this.activeTab === 'predecessor') {
      this.activeTab = 'activity';
    }
  }

  nextTab(): void {
    if (this.activeTab === 'activity') {
      this.activeTab = 'predecessor';
    }
  }

  handlePredecessorPage(event: PageEvent): void {
    this.predecessorPageIndex = event.pageIndex;
    this.predecessorPageSize = event.pageSize;
  }

  getDeliverablesForStage(stage: string): string[] {
    if (!stage) {
      return Object.values(this.stageDeliverablesMap).flat();
    }
    if (this.stageDeliverablesMap[stage]) {
      return this.stageDeliverablesMap[stage];
    }
    const matchedKey = Object.keys(this.stageDeliverablesMap).find(k =>
      k.toLowerCase().includes(stage.toLowerCase()) || stage.toLowerCase().includes(k.toLowerCase())
    );
    if (matchedKey && this.stageDeliverablesMap[matchedKey]) {
      return this.stageDeliverablesMap[matchedKey];
    }
    return Object.values(this.stageDeliverablesMap).flat();
  }

  getActivitiesFor(stage: string, deliverable?: string): string[] {
    if (deliverable && this.stageActivitiesMap[deliverable]) {
      return this.stageActivitiesMap[deliverable];
    }
    if (deliverable) {
      const matchedDel = Object.keys(this.stageActivitiesMap).find(k =>
        k.toLowerCase().includes(deliverable.toLowerCase()) || deliverable.toLowerCase().includes(k.toLowerCase())
      );
      if (matchedDel && this.stageActivitiesMap[matchedDel]) {
        return this.stageActivitiesMap[matchedDel];
      }
    }
    if (stage) {
      const deliverables = this.getDeliverablesForStage(stage);
      const acts: string[] = [];
      deliverables.forEach(d => {
        if (this.stageActivitiesMap[d]) {
          acts.push(...this.stageActivitiesMap[d]);
        }
      });
      if (acts.length > 0) return acts;
    }
    return this.allActivities;
  }

  onPredecessorStageChange(row: PredecessorItem): void {
    const availableDeliverables = this.getDeliverablesForStage(row.stage);
    if (row.deliverable && !availableDeliverables.includes(row.deliverable)) {
      row.deliverable = '';
    }
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  onPredecessorDeliverableChange(row: PredecessorItem): void {
    const availableActs = this.getActivitiesFor(row.stage, row.deliverable);
    if (row.activity && !availableActs.includes(row.activity)) {
      row.activity = availableActs[0] || '';
    }
  }

  addPredecessorRow(): void {
    const currentStage = this.activityForm.get('stage')?.value;
    const stage = this.normalizeStage(currentStage);
    const newRow: PredecessorItem = {
      stage,
      deliverable: '',
      activity: '',
      type: this.typeOptions[0]
    };
    this.predecessorPageIndex = 0;
    this.predecessorList.unshift(newRow);
  }

  deletePredecessorRow(row: PredecessorItem): void {
    const index = this.predecessorList.indexOf(row);
    if (index > -1) {
      this.predecessorList.splice(index, 1);
      if (this.predecessorPageIndex > 0 && this.predecessorPageIndex * this.predecessorPageSize >= this.predecessorList.length) {
        this.predecessorPageIndex = Math.max(0, this.predecessorPageIndex - 1);
      }
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedFileNames.push(files[i].name);
      }
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.activityForm.invalid) {
      this.activeTab = 'activity';
      return;
    }

    const result = {
      ...this.data,
      ...this.activityForm.value,
      files: this.uploadedFileNames,
      predecessors: this.predecessorList,
      predecessorsData: this.predecessorList,
      predecessor: this.predecessorList.length > 0
        ? String(this.predecessorList.length + 3)
        : (this.activityForm.get('predecessor')?.value || '—')
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
