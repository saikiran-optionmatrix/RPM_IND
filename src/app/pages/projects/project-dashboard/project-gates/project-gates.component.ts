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
import { INDUSTRIAL_STAGES_MASTER } from '../../../stages/industrial-stages.data';

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

  readonly projectName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Industrial Equipment Line Expansion';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/IND/001';

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

  redirectStageOptions: string[] = INDUSTRIAL_STAGES_MASTER.map(s => `${s.stageCode} - ${s.stageName}`);

  gates: GateItem[] = [
    {
      gateCode: 'Gate 1',
      gateName: 'Business Case Approval',
      status: 'Approved',
      remarks: 'Plant throughput scope, CapEx ROI model, and URS signed off',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '5/5',
      updatedDate: '2026-02-15',
      timelineDate: '2026-02-15',
      planStart: '2026-01-05',
      planEnd: '2026-02-15',
      actualStart: '2026-01-05',
      actualEnd: '2026-02-14',
      eta: '2026-02-15',
      planDuration: '40 days',
      actualDuration: '39 days',
      planEffort: '180 hrs',
      actualEffort: '175 hrs',
      buffer: '2 days',
      description: 'Formal executive gate review validating plant capacity opportunity, User Requirements Specification (URS), CapEx/OpEx financial payback, safety/CE compliance pathway, and integrated master charter.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'User Requirements Specification (URS) & Throughput Envelope Signed Off', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Preliminary CapEx, OpEx & Payback ROI Model Approved', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'CE / ISO Machine Safety & Statutory Compliance Pathway Verified', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'OEM Equipment Vendor Longlist & Lead-Time Risk Screened', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Site Utility, Footprint & Power Availability Assessment Complete', done: true, mandatory: true, priority: 'High' },
        { id: 6, text: 'Steering Committee Project Charter & Stage Funding Authorization', done: true, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 2',
      gateName: 'Concept Selection & Design Freeze',
      status: 'Approved',
      remarks: '3D CAD layout, PLC control philosophy, and Design FMEA frozen',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '4/5',
      updatedDate: '2026-05-10',
      timelineDate: '2026-05-10',
      planStart: '2026-02-16',
      planEnd: '2026-05-10',
      actualStart: '2026-02-16',
      actualEnd: '2026-05-09',
      eta: '2026-05-10',
      planDuration: '84 days',
      actualDuration: '83 days',
      planEffort: '420 hrs',
      actualEffort: '410 hrs',
      buffer: '4 days',
      description: 'Formal engineering decision gate to freeze 3D CAD equipment layout, structural FEA, PLC/SCADA control schematics, Design FMEA/HAZOP risk mitigation, and primary OEM vendor qualification prior to procurement.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: '3D CAD Assembly, P&ID & Structural FEA Package Frozen', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Design FMEA & HAZOP Machine Safety Risk Matrix Closed', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'PLC / HMI / SCADA Architecture & Safety Interlock Spec Approved', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Primary OEM Suppliers Qualified & Commercial Bids Awarded', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Tolerance Stack-Up & Critical Spare-Parts BOM Finalized', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Execution CapEx Baseline & Long-Lead Procurement Released', done: true, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 3',
      gateName: 'Procurement & Build Readiness',
      status: 'Pending',
      remarks: 'Prototype tooling trials complete; OEM FAT protocols under final review',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '3/5',
      updatedDate: '2026-10-20',
      timelineDate: '2026-10-20',
      planStart: '2026-05-11',
      planEnd: '2026-10-20',
      actualStart: '2026-05-11',
      actualEnd: '',
      eta: '2026-10-20',
      planDuration: '162 days',
      actualDuration: '110 days',
      planEffort: '650 hrs',
      actualEffort: '440 hrs',
      buffer: '5 days',
      description: 'Formal decision gate evaluating prototype subassembly validation, instrument metrology calibration, Factory Acceptance Test (FAT) sign-off, long-lead equipment delivery status, and plant floor rigging readiness.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Prototype Tooling & Subassembly Endurance Trials Passed', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Factory Acceptance Test (FAT) Witness Inspection Signed Off', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Instrument Calibration & NIST/NABL Metrology Plan Verified', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Capital Equipment Shipment & Customs Logistics Cleared', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Shop-Floor Foundation, Anchor Bolts & Utility Tie-Ins Ready', done: false, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Rigging Lift Plan & EHS Contractor Work Permits Approved', done: false, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 4',
      gateName: 'Commissioning & Performance Acceptance',
      status: 'Pending',
      remarks: 'SAT performance test scripts and OEE endurance criteria scheduled',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '2/5',
      updatedDate: '2027-04-25',
      timelineDate: '2027-04-25',
      planStart: '2026-10-21',
      planEnd: '2027-04-25',
      actualStart: '',
      actualEnd: '',
      eta: '2027-04-25',
      planDuration: '186 days',
      actualDuration: '0 days',
      planEffort: '780 hrs',
      actualEffort: '0 hrs',
      buffer: '6 days',
      description: 'Formal commissioning gate verifying physical installation alignment, Installation Qualification (IQ), emergency-stop and safety interlocks, Site Acceptance Test (SAT) performance, and sustained OEE throughput runs.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Installation Qualification (IQ) & Laser Alignment Verified', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Site Acceptance Test (SAT) Rated Cycle Time & Cpk Achieved', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Multi-Shift OEE >= 85% Endurance Run Completed', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'EHS Final Machine Guarding, Noise & LOTO Sign-off', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Operator & Maintenance Technician SOP Certification Complete', done: false, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 5',
      gateName: 'Operational Handover Approval',
      status: 'Pending',
      remarks: 'Awaiting OQ validation completion and As-Built TTD package sign-off',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '1/5',
      updatedDate: '2027-08-31',
      timelineDate: '2027-08-31',
      planStart: '2027-04-26',
      planEnd: '2027-08-31',
      actualStart: '',
      actualEnd: '',
      eta: '2027-08-31',
      planDuration: '127 days',
      actualDuration: '0 days',
      planEffort: '420 hrs',
      actualEffort: '0 hrs',
      buffer: '4 days',
      description: 'Final executive handover gate confirming Operational Qualification (OQ) stability, as-built technical transfer dossier (TTD) archival, CMMS preventive maintenance setup, critical spares stocking, and formal Plant Operations handover.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Operational Qualification (OQ) 3-Run Validation Summary Approved', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'As-Built CAD, PLC Code Backup & TTD Dossier Archived', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Critical Spare Parts Stocked & CMMS Preventive Maintenance Active', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'Commissioning Punch-List & Engineering Change Notices Closed', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Plant Operations Handover & Capital Closeout Signed Off', done: false, mandatory: true, priority: 'High' }
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
    const defaultUpdaters = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu'];
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
        code: this.projectCode || '2026/IND/001',
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
