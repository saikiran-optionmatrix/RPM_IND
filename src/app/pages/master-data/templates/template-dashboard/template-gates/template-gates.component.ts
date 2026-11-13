import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { ChecklistPopComponent, ChecklistItem } from '../../../../projects/project-dashboard/project-gates/checklist-pop/checklist-pop.component';
import { ProjectGatesWorkflowComponent, GateWorkflowSignee } from '../../../../projects/project-dashboard/project-gates/project-gates-workflow/project-gates-workflow.component';
import { INDUSTRIAL_STAGES_MASTER } from '../../../../stages/industrial-stages.data';

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
  decision: 'Go' | 'Kill' | 'Hold' | 'Redirect' | null;
  redirectToStage?: string;
  isReadonly?: boolean;
}

@Component({
  selector: 'app-template-gates',
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
  templateUrl: './template-gates.component.html',
  styleUrl: './template-gates.component.scss',
})
export class TemplateGatesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || 'TPL/IND/001';

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

  redirectStageOptions: string[] = INDUSTRIAL_STAGES_MASTER.map(
    (s) => `${s.stageCode} - ${s.stageName}`
  );

  gates: GateItem[] = [
    {
      gateCode: 'Gate 1',
      gateName: 'Business Case Approval',
      status: 'Approved',
      remarks: 'Plant capacity need, URS baseline, and CapEx ROI approved',
      checklistCount: 7,
      activitiesCount: 7,
      workflow: '5/5',
      updatedDate: '2026-03-12',
      timelineDate: '2026-03-12',
      planStart: '2026-01-05',
      planEnd: '2026-03-12',
      actualStart: '2026-01-05',
      actualEnd: '2026-03-12',
      eta: '2026-03-12',
      planDuration: '66 days',
      actualDuration: '66 days',
      planEffort: '700 hrs',
      actualEffort: '700 hrs',
      buffer: '4 days',
      description: 'Formal gate review to evaluate plant capacity need, URS baseline, OEM vendor landscape, safety compliance roadmap, CapEx/ROI financials, and executive program charter approval.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Plant Capacity & Operational Need Assessment Complete', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'User Requirements Specification (URS) Baseline Sign-off', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Patent Landscape & Freedom-to-Operate (FTO) Review', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Preliminary Business Case & CapEx / ROI Financial Model', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'OEM & Tier-1 Vendor Qualification Feasibility', done: true, mandatory: true, priority: 'High' },
        { id: 6, text: 'Safety, CE / ISO 13849 & Statutory Compliance Roadmap', done: true, mandatory: true, priority: 'High' },
        { id: 7, text: 'Executive Committee Gate 1 Program Charter Release', done: true, mandatory: false, priority: 'Medium' }
      ]
    },
    {
      gateCode: 'Gate 2',
      gateName: 'Concept Selection & Design Freeze',
      status: 'Approved',
      remarks: '3D CAD/FEA models, PLC/SCADA controls, and GD&T tolerances frozen',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '3/5',
      updatedDate: '2026-06-30',
      timelineDate: '2026-06-30',
      planStart: '2026-03-13',
      planEnd: '2026-06-30',
      actualStart: '2026-03-13',
      actualEnd: '2026-06-30',
      eta: '2026-06-30',
      planDuration: '110 days',
      actualDuration: '110 days',
      planEffort: '1,800 hrs',
      actualEffort: '1,800 hrs',
      buffer: '5 days',
      description: 'Formal decision gate to review finalized 3D CAD assembly, structural FEA, PLC/SCADA control architecture, CTQ tolerances, DFMA review, and safety guarding before long-lead procurement.',
      decision: 'Go',
      isReadonly: false,
      checklistItems: [
        { id: 1, text: '3D CAD Assembly & Structural FEA Simulation Approved', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Critical-to-Quality (CTQ) Tolerances & Metrology Plan', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'PLC / SCADA Control Philosophy & Safety Interlock Architecture', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'DFMA Review & Cross-Functional Schedule Commitment', done: true, mandatory: true, priority: 'High' },
        { id: 5, text: 'Ergonomics, Chip Removal & Maintenance Access Review', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Machine Guarding & Hazardous Energy (LOTO) Isolation Spec', done: true, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 3',
      gateName: 'Procurement & Build Readiness',
      status: 'Pending',
      remarks: 'OEM subassembly fabrication, Gage R&R, and site utilities in progress',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '4/5',
      updatedDate: '2026-10-15',
      timelineDate: '2026-10-15',
      planStart: '2026-07-01',
      planEnd: '2026-10-15',
      actualStart: '2026-07-01',
      actualEnd: '',
      eta: '2026-10-15',
      planDuration: '107 days',
      actualDuration: '65 days',
      planEffort: '3,200 hrs',
      actualEffort: '1,950 hrs',
      buffer: '6 days',
      description: 'Formal decision gate to verify long-lead component deliveries, first-article fixtures, Gage R&R metrology readiness, UL 508A control cabinet QA, and plant foundation/480V utility readiness.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Long-Lead Component & OEM Purchase Orders Released', done: true, mandatory: true, priority: 'High' },
        { id: 2, text: 'Prototype Fixture Tooling & First-Article Fabrication Verified', done: true, mandatory: true, priority: 'High' },
        { id: 3, text: 'Vendor Quality Agreements & Panel Shop Audit Signed Off', done: true, mandatory: true, priority: 'High' },
        { id: 4, text: 'Measurement System Analysis (Gage R&R < 10%) Qualified', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Protective Transit Packaging & Rigging Plan Approved', done: true, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Site Foundation, 480V Utility & Floor Readiness Verified', done: false, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 4',
      gateName: 'Commissioning & Performance Acceptance',
      status: 'Pending',
      remarks: 'FAT/SAT protocol execution, IQ/OQ verification, and Cpk run planned',
      checklistCount: 6,
      activitiesCount: 6,
      workflow: '2/5',
      updatedDate: '2027-02-20',
      timelineDate: '2027-02-20',
      planStart: '2026-10-16',
      planEnd: '2027-02-20',
      actualStart: '',
      actualEnd: '',
      eta: '2027-02-20',
      planDuration: '128 days',
      actualDuration: '0 days',
      planEffort: '4,800 hrs',
      actualEffort: '0 hrs',
      buffer: '7 days',
      description: 'Formal decision gate to review Factory & Site Acceptance Test (FAT/SAT) clearance, IQ/OQ checks, Cpk >= 1.67 capability results, EHS safety interlocks, and MES/SCADA telemetry.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Factory Acceptance Test (FAT) & Punchlist Clearance', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'Installation & Operational Qualification (IQ / OQ) Executed', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'Process Capability (Cpk >= 1.67) & Cycle-Time Study Passed', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'EHS Final Machine Safety & Acoustic Emission Sign-off', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'MES / SCADA Telemetry & Alarm Historian Validated', done: false, mandatory: false, priority: 'Medium' },
        { id: 6, text: 'Site Acceptance Test (SAT) Release for Pilot Ramp-Up', done: false, mandatory: true, priority: 'High' }
      ]
    },
    {
      gateCode: 'Gate 5',
      gateName: 'Operational Handover Approval',
      status: 'Pending',
      remarks: '3-shift OEE ramp-up, TTD compilation, CMMS setup, and plant handover',
      checklistCount: 5,
      activitiesCount: 5,
      workflow: '0/5',
      updatedDate: '2027-07-31',
      timelineDate: '2027-07-31',
      planStart: '2027-02-21',
      planEnd: '2027-07-31',
      actualStart: '',
      actualEnd: '',
      eta: '2027-07-31',
      planDuration: '160 days',
      actualDuration: '0 days',
      planEffort: '6,500 hrs',
      actualEffort: '0 hrs',
      buffer: '10 days',
      description: 'Final executive gate authorizing full operational handover after 3-shift OEE qualification, as-built technical transfer dossier sign-off, CMMS spares readiness, and operator certification.',
      decision: null,
      isReadonly: false,
      checklistItems: [
        { id: 1, text: 'Operational Qualification (OQ) & 3-Shift OEE Ramp-Up Acceptance', done: false, mandatory: true, priority: 'High' },
        { id: 2, text: 'As-Built Technical Transfer Dossier (TTD) & EPLAN/PLC Archive', done: false, mandatory: true, priority: 'High' },
        { id: 3, text: 'CMMS Preventive Maintenance Plan & Critical Spares Crib Stocked', done: false, mandatory: true, priority: 'High' },
        { id: 4, text: 'Operator, Technician & Lockout/Tagout (LOTO) Training Certified', done: false, mandatory: true, priority: 'High' },
        { id: 5, text: 'Executive Handover Authorization & Capital Project Closeout', done: false, mandatory: true, priority: 'High' }
      ]
    }
  ];

  // Pagination
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
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
    private cdr: ChangeDetectorRef,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.updatePagedGates();
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  // Pagination Logic
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
    const completed = gate.checklistItems.filter((item) => item.done).length;
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
    this.router.navigate(['gates/activities'], {
      relativeTo: this.route.parent,
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode || 'TPL/IND/001',
        gateCode: gate.gateCode,
        gateName: gate.gateName,
      },
      queryParamsHandling: 'merge',
    });
  }

  // Decision Checkbox Toggle (Go / Kill / Hold / Redirect)
  onDecisionChange(gate: GateItem, decisionType: 'Go' | 'Kill' | 'Hold' | 'Redirect', checked: boolean): void {
    if (checked) {
      gate.decision = decisionType;
      gate.updatedDate = new Date().toISOString().split('T')[0];

      if (decisionType === 'Go') {
        gate.status = 'Approved';
      } else if (decisionType === 'Kill') {
        gate.status = 'Rejected';
      } else if (decisionType === 'Hold') {
        gate.status = 'On Hold';
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

  // Timeline Modal Actions
  openTimelineModal(item: GateItem): void {
    this.selectedTimelineItem = {
      ...item,
      name: item.gateName,
    };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  // Checklist Modal Actions (Opens ChecklistPopComponent Dialog)
  openChecklistModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ChecklistPopComponent, {
      width: '600px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        checklistItems: gate.checklistItems || [],
        isReadonly: this.isGateReadonly(gate),
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.checklistItems) {
        gate.checklistItems = result.checklistItems;
        gate.checklistCount = result.checklistItems.length;
        this.cdr.detectChanges();
      }
    });
  }

  // Workflow Modal Actions (Opens ProjectGatesWorkflowComponent Dialog)
  openWorkflowModal(gate: GateItem): void {
    const dialogRef = this.dialog.open(ProjectGatesWorkflowComponent, {
      width: '650px',
      data: {
        gateCode: gate.gateCode,
        gateName: gate.gateName,
        workflow: gate.workflow || '3/5',
        signees: gate.signees,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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

  // Add / Edit Gate Modal Actions
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
      checklistItems: [],
    };
    this.isEditGateMode = false;
    this.showGateModal = true;
    this.setBodyScrollLock(true);
  }

  openEditGate(gate: GateItem, index: number): void {
    const actualIndex = this.gates.findIndex((g) => g === gate);
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
        ...this.gateModalData,
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
        content: 'Are you sure you want to delete this gate record?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gates = this.gates.filter((g) => g !== gate);
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
}
