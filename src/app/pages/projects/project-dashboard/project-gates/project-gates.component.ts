import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { ChecklistPopComponent, ChecklistItem } from './checklist-pop/checklist-pop.component';
import { ProjectGatesWorkflowComponent, GateWorkflowSignee } from './project-gates-workflow/project-gates-workflow.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';

export interface GateItem {
  id?: number;
  gateCode: string;
  gateName: string;
  status: 'Approved' | 'Pending' | 'On Hold' | 'Rejected' | 'Redirect pending' | 'Redirect';
  remarks: string;
  checklistCount: number;
  activitiesCount?: number;
  workflow?: string;
  signees?: GateWorkflowSignee[];
  checklistItems?: ChecklistItem[];
  updatedDate?: string;
  updatedBy?: string;
  timelineDate: string;
  planStart: string;
  planEnd: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  actualDuration?: string;
  planEffort?: string;
  actualEffort?: string;
  buffer?: string;
  description?: string;
  decision: 'Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect' | null;
  redirectToStage?: string;
  isReadonly?: boolean;
  historyCount?: number;
  documentsCount?: number;
}

@Component({
  selector: 'app-project-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
  ],
  templateUrl: './project-gates.component.html',
  styleUrl: './project-gates.component.scss',
})
export class ProjectGatesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  readonly projectName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Generic Tablet Development';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/GEN/001';

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  redirectStageOptions: string[] = [
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
    'S11 - Commercial Launch and Lifecycle Management',
  ];

  gates: GateItem[] = [
    {
      gateCode: 'Gate 1',
      gateName: 'Opportunity and portfolio approval',
      status: 'Approved',
      remarks: 'Therapeutic and market opportunity criteria approved',
      checklistCount: 7,
      activitiesCount: 7,
      workflow: '3/5',
      updatedDate: '2026-02-15',
      timelineDate: '2026-02-15',
      planStart: '2026-01-05',
      planEnd: '2026-01-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-01-15',
      eta: '2026-01-15',
      planDuration: '10 days',
      actualDuration: '10 days',
      planEffort: '80 hrs',
      actualEffort: '80 hrs',
      buffer: '2 days',
      description: 'Formal gate review to evaluate therapeutic and market opportunity assessment, target product profile, freedom-to-operate clearance, business case and preliminary risk screening, approving the opportunity into formal program definition.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Therapeutic Area & Unmet Medical Need Assessment', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Target Product Profile (TPP) Baseline Sign-off', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Patent Landscape & Freedom-to-Operate (FTO) Review', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Preliminary Business Case & Peak-Sales Financial Model', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'API Sourcing Feasibility & DMF Availability', done: true, mandatory: true, priority: 'High' },
        { id: 6, text: 'Regulatory Filing Pathway & Exclusivity Strategy', done: true, mandatory: true, priority: 'High' },
        { id: 7, text: 'Portfolio Steering Committee Concept Authorization', done: true, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 2',
      gateName: 'Product definition and project charter approval',
      status: 'Approved',
      remarks: 'Product definition, RLD characterization, and project charter established',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '2/5',
      updatedDate: '2026-01-25',
      timelineDate: '2026-01-25',
      planStart: '2026-01-16',
      planEnd: '2026-01-25',
      actualStart: '2026-01-16',
      actualEnd: '2026-01-25',
      eta: '2026-01-25',
      planDuration: '10 days',
      actualDuration: '10 days',
      planEffort: '60 hrs',
      actualEffort: '60 hrs',
      buffer: '2 days',
      description: 'Formal decision gate to review finalized target product profile, reference listed drug characterization, regulatory submission pathway, IP strategy, cross-functional program charter, and funding commitment before starting formulation development.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Reference Listed Drug (RLD) Characterization Complete', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Quality Target Product Profile (QTPP) Finalization', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Regulatory Strategy & Agency Scientific Advice Plan', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Cross-Functional Project Charter & Schedule Commitment', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Analytical Strategy & Impurity Profile Specifications', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Primary Packaging Concept & Barrier Requirements', done: true, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 3',
      gateName: 'Formulation concept and sourcing strategy approval',
      status: 'Approved',
      remarks: 'Pre-formulation compatibility and prototype formulation selected',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '4/5',
      updatedDate: '2026-03-27',
      timelineDate: '2026-03-27',
      planStart: '2026-01-26',
      planEnd: '2026-03-27',
      actualStart: '2026-01-26',
      actualEnd: '2026-03-27',
      eta: '2026-03-27',
      planDuration: '60 days',
      actualDuration: '60 days',
      planEffort: '120 hrs',
      actualEffort: '120 hrs',
      buffer: '5 days',
      description: 'Formal decision gate to evaluate pre-formulation findings, prototype formulation selection, API and critical excipient sourcing readiness, primary packaging selection, and project schedule before committing capital to full formulation and process development.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Pre-Formulation & Drug-Excipient Compatibility Sign-off', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Lead Prototype Formulation Selected via DoE', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'API & Critical Excipient Commercial Sourcing Agreements', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Analytical Stability-Indicating Methods Qualified', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Container Closure System Feasibility Validated', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Technology Transfer Readiness Assessment to Pilot Plant', done: true, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 4',
      gateName: 'Formulation and process development approval',
      status: 'Pending',
      remarks: 'DoE optimization and scale-up parameters under review',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '3/5',
      updatedDate: '2026-05-15',
      timelineDate: '2026-05-15',
      planStart: '2026-03-28',
      planEnd: '2026-05-15',
      actualStart: '2026-03-28',
      actualEnd: '',
      eta: '2026-05-15',
      planDuration: '48 days',
      actualDuration: '40 days',
      planEffort: '160 hrs',
      actualEffort: '130 hrs',
      buffer: '4 days',
      description: 'Formal decision gate to review formulation optimization, DoE stability data, manufacturing process train readiness, analytical method qualification, and supplier qualification before proceeding with development batch manufacturing.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Formulation & Process Parameter Optimization Freeze', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Laboratory Stress & 3-Month Accelerated Stability Clearance', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Analytical Method Validation Protocol per ICH Q2(R1)', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Scale-Up Batch Execution & Process Train Verification', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Nitrosamine & Elemental Impurities Risk Assessment Sign-off', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Bioequivalence Pilot Study Batch Release Protocol', done: false, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 5',
      gateName: 'Facility and manufacturing readiness approval',
      status: 'Pending',
      remarks: 'Commercial cleanroom and packaging line qualification in preparation',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '5/5',
      updatedDate: '2026-10-31',
      timelineDate: '2026-10-31',
      planStart: '2026-10-01',
      planEnd: '2026-10-31',
      actualStart: '',
      actualEnd: '',
      eta: '2026-10-31',
      planDuration: '30 days',
      actualDuration: '0 days',
      planEffort: '120 hrs',
      actualEffort: '0 hrs',
      buffer: '3 days',
      description: 'Formal decision gate to verify equipment and facility qualification, utility readiness, cleaning validation, operator training, and supply chain readiness before initiating registration and process validation batch manufacturing.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Commercial Manufacturing Facility GMP Qualification', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Commercial Equipment IQ/OQ/PQ & Calibrations Complete', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Cleaning Validation & Maximum Allowable Carryover (MAC) Limits', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'Commercial Batch Records (MBR/BPR) & Standard Operating Procedures', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Raw Material Commercial Inventory Release for Registration Batches', done: false, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 6',
      gateName: 'Validation and regulatory submission readiness',
      status: 'Pending',
      remarks: 'Validation batch manufacturing and registration stability testing planned',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '2/5',
      updatedDate: '2027-02-15',
      timelineDate: '2027-02-15',
      planStart: '2026-12-16',
      planEnd: '2027-02-15',
      actualStart: '',
      actualEnd: '',
      eta: '2027-02-15',
      planDuration: '61 days',
      actualDuration: '0 days',
      planEffort: '190 hrs',
      actualEffort: '0 hrs',
      buffer: '5 days',
      description: 'Formal decision gate to evaluate registration and process validation batch outcomes, stability data, dossier readiness, and bioequivalence / clinical study reports before authorizing filing with regulatory agencies.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Process Performance Qualification (PPQ) 3 Batches Execution', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Registration Batch ICH Stability Data (6-Month Accelerated & Long-Term)', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Pivotal In-Vivo Bioequivalence (BE) Study Clinical Report', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'eCTD Regulatory Dossier Compilation & Publishing', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Pre-Approval Inspection (PAI) Readiness Audit Clearance', done: false, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 7',
      gateName: 'Commercial launch authorization',
      status: 'Pending',
      remarks: 'Awaiting regulatory market authorization approval',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '4/5',
      updatedDate: '2027-08-31',
      timelineDate: '2027-08-31',
      planStart: '2027-06-01',
      planEnd: '2027-08-31',
      actualStart: '',
      actualEnd: '',
      eta: '2027-08-31',
      planDuration: '91 days',
      actualDuration: '0 days',
      planEffort: '150 hrs',
      actualEffort: '0 hrs',
      buffer: '4 days',
      description: 'Final formal gate to review market authorization approvals, manufacturing site inspection clearances, commercial supply chain readiness, distribution channel stocking, and pharmacovigilance setup before authorizing commercial distribution and sale.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Marketing Authorization Approval & Product License Granted', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Pre-Approval Inspection (PAI) Clearance & Site License', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Commercial Supply Chain & Distribution Pipeline Stocked', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'Pharmacovigilance (PV) & Post-Marketing Risk Management Ready', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Commercial Operations Launch Authorization & Handover', done: false, mandatory: true, priority: 'High' }
      ]
    }
  ];

  // Pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;
  pagedGatesList: GateItem[] = [];

  // Timeline Modal Popup State
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Gate Modal State
  showGateModal = false;
  gateModalStep = 1;
  isEditGateMode = false;
  gateModalData: Partial<GateItem> = {};
  gateModalIndex = -1;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  readonly historySequence: number[] = [5, 2, 3, 4, 5, 1, 6, 2, 4, 3, 5, 2, 6, 1, 4];
  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
    this.gates.forEach((g, idx) => {
      g.historyCount = this.historySequence[idx % this.historySequence.length];
      g.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!g.updatedBy) {
        g.updatedBy = defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagedGates();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  // --- Pagination Logic ---
  updatePagedGates(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedGatesList = this.gates.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedGates();
  }

  get pagedGates(): GateItem[] {
    return this.pagedGatesList;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.gates.length / this.pageSize));
  }

  isGateZero(gate: GateItem): boolean {
    if (!gate) return false;
    return (
      (gate.gateName && gate.gateName.toLowerCase().includes('gate 0')) ||
      gate.gateCode === 'Gate 0' ||
      gate.gateCode === 'GT000'
    );
  }

  isGateReadonly(gate: GateItem): boolean {
    if (!gate) return false;
    if (gate.isReadonly !== undefined) return gate.isReadonly;
    return gate.gateCode === 'Gate 3' || gate.gateCode === 'Gate 4' || gate.gateCode === 'Gate 5';
  }

  getChecklistFraction(gate: GateItem): string {
    if (!gate) return '0/0';
    if (!gate.checklistItems || gate.checklistItems.length === 0) {
      return gate.checklistCount ? `${gate.checklistCount}/${gate.checklistCount}` : '0/0';
    }
    const completed = gate.checklistItems.filter(item => item.done).length;
    const total = gate.checklistItems.length;
    return `${completed}/${total}`;
  }

  getActivitiesCount(gate: GateItem): number {
    if (!gate) return 0;
    if (gate.activitiesCount !== undefined) return gate.activitiesCount;
    if (gate.checklistItems && gate.checklistItems.length > 0) return gate.checklistItems.length;
    return gate.checklistCount || 6;
  }

  navigateToActivities(gate: GateItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || '2026/GEN/001',
        gateCode: gate.gateCode,
        gateName: gate.gateName
      }
    });
  }

  // --- Decision Checkbox Toggle (Go / Hold / Kill / Rework / Redirect) ---
  onDecisionChange(gate: GateItem, decisionType: 'Go' | 'Hold' | 'Kill' | 'Rework' | 'Redirect', checked: boolean): void {
    if (checked) {
      gate.decision = decisionType;
      gate.updatedDate = new Date().toISOString().split('T')[0];

      if (decisionType === 'Go') {
        gate.status = 'Approved';
      } else if (decisionType === 'Kill') {
        gate.status = 'Rejected';
      } else if (decisionType === 'Hold') {
        gate.status = 'On Hold';
      } else if (decisionType === 'Rework') {
        gate.status = 'Pending';
      } else if (decisionType === 'Redirect') {
        gate.status = 'Redirect pending';
      }
    } else {
      gate.decision = null;
      gate.status = 'Pending';
      gate.redirectToStage = undefined;
      gate.updatedDate = new Date().toISOString().split('T')[0];
    }
    this.cdr.detectChanges();
  }

  // --- Timeline Modal Actions ---
  openTimelineModal(item: GateItem): void {
    this.selectedTimelineItem = {
      ...item,
      name: item.gateName
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // --- Checklist Modal Actions (Opens ChecklistPopComponent Dialog) ---
  openChecklistModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ChecklistPopComponent, {
      width: '600px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        checklistItems: gate.checklistItems || [],
        isReadonly: this.isGateReadonly(gate)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.checklistItems) {
        gate.checklistItems = result.checklistItems;
        gate.checklistCount = result.checklistItems.length;
        this.cdr.detectChanges();
      }
    });
  }

  // --- Workflow Modal Actions (Opens ProjectGatesWorkflowComponent Dialog) ---
  openWorkflowModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ProjectGatesWorkflowComponent, {
      width: '650px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        workflow: gate.workflow || '3/5',
        signees: gate.signees
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.workflow) {
          gate.workflow = result.workflow;
        }
        if (result.signees) {
          gate.signees = result.signees;
        }
        this.cdr.detectChanges();
      }
    });
  }

  // --- Add / Edit Gate Modal Actions ---
  openAddGate(): void {
    this.gateModalStep = 1;
    const nextNum = String(this.gates.length + 1).padStart(2, '0');
    this.gateModalData = {
      gateCode: 'Gate-' + nextNum,
      gateName: '',
      status: 'Pending',
      remarks: '',
      checklistCount: 0,
      workflow: '0/5',
      updatedDate: new Date().toISOString().split('T')[0],
      timelineDate: '',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      planDuration: '',
      actualDuration: '',
      planEffort: '',
      actualEffort: '',
      buffer: '',
      description: '',
      decision: null,
      checklistItems: []
    };
    this.isEditGateMode = false;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  openEditGate(gate: GateItem, index: number): void {
    const actualIndex = this.gates.findIndex(g => g === gate);
    this.gateModalStep = 1;
    this.gateModalData = { ...gate };
    this.isEditGateMode = true;
    this.gateModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  closeGateModal(): void {
    this.showGateModal = false;
    this.setBodyScrollLock(false);
  }

  saveGate(): void {
    if (!this.gateModalData.gateName || !this.gateModalData.gateCode) return;

    if (this.isEditGateMode && this.gateModalIndex > -1) {
      this.gates[this.gateModalIndex] = {
        ...this.gates[this.gateModalIndex],
        ...this.gateModalData
      } as GateItem;
    } else {
      this.gates.push(this.gateModalData as GateItem);
    }
    this.updatePagedGates();
    this.closeGateModal();
  }

  deleteGate(gate: GateItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this gate record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gates = this.gates.filter(g => g !== gate);
        if (this.currentPage >= this.pageCount) {
          this.currentPage = Math.max(0, this.pageCount - 1);
        }
        this.updatePagedGates();
      }
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openHistory(gate?: any): void {
    const gateCode = (typeof gate === 'object' && gate !== null) ? gate.gateCode : '';
    const gateName = (typeof gate === 'object' && gate !== null) ? gate.gateName : (typeof gate === 'string' ? gate : 'Gate');

    this.router.navigate(['gates/history'], {
      relativeTo: this.route.parent,
      queryParams: {
        gateCode: gateCode,
        gateName: gateName
      },
      queryParamsHandling: 'merge'
    });
  }

   openFeasibilityReport(): void {
    window.open('/Feasibility%20Report.pdf', '_blank');
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
