import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';

export interface GateActivityItem {
  id: number;
  activityName: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
  done?: boolean;
  tasks?: string | number;
  activitiesCount?: string | number;
  activities?: string;
  requirements?: string;
  delayReason?: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  actualDuration?: string;
  actualEffort?: string;
  buffer?: string;
  remarks?: string;
  description?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-proj-gates-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './proj-gates-activities.component.html',
  styleUrl: './proj-gates-activities.component.scss',
})
export class ProjGatesActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  gateCode: string = 'Gate 1';
  gateName: string = 'Business Case Approval';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = [
    'Engineering & R&D',
    'Mechanical Design',
    'Automation & Controls',
    'Manufacturing & Operations',
    'Quality Assurance',
    'Procurement & Supply Chain',
    'EHS & Compliance',
    'Commissioning & Qualification'
  ];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];

  readonly delayReasonOptions: string[] = [
    'Raw Material / Component Shortage',
    'Safety / Statutory Inspection Pending',
    'OEM Vendor Dispatch Delay',
  ];

  activities: GateActivityItem[] = [];
  filteredActivities: GateActivityItem[] = [];
  pagedActivities: GateActivityItem[] = [];

  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal
  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  readonly historySequence: number[] = [4, 2, 5, 2, 4, 7, 8, 3, 5, 2, 6, 4, 8, 2, 5, 7, 3, 6, 4, 2];
  readonly documentsSequence: number[] = [2, 5, 1, 4, 3, 2, 6, 1, 4, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  // Add / Edit Activity Modal
  showActivityModal: boolean = false;
  activityModalStep = 1;
  isEditActivityMode: boolean = false;
  activityModalData: Partial<GateActivityItem> = {};
  activityModalIndex = -1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] || params['projectName']) {
        this.projectName = params['name'] || params['projectName'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      this.initActivitiesForGate();
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.setBodyScrollLock(false);
  }

  initActivitiesForGate(): void {
    if (this.gateCode === 'Gate 1') {
      this.activities = [
        { id: 1, activityName: 'Plant Throughput & Bottleneck Capacity Audit', jobCode: 'ENG-101', department: 'Manufacturing & Operations', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '4/13', activitiesCount: '5/9', delayReason: 'Raw Material / Component Shortage', planStart: '2026-01-05', planEnd: '2026-01-15', actualStart: '2026-01-05', actualEnd: '2026-01-14', eta: '2026-01-15', planDuration: '10 days', actualDuration: '9 days', planEffort: '40 hrs', actualEffort: '36 hrs', buffer: '1 day', remarks: 'Line capacity gap of 28% validated across shift schedules' },
        { id: 2, activityName: 'OEM Vendor Longlist & Long-Lead Screening', jobCode: 'PRC-102', department: 'Procurement & Supply Chain', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: true, tasks: '1/13', activitiesCount: '2/9', delayReason: 'Safety / Statutory Inspection Pending', planStart: '2026-01-10', planEnd: '2026-01-25', actualStart: '2026-01-10', actualEnd: '2026-01-24', eta: '2026-01-25', planDuration: '15 days', actualDuration: '14 days', planEffort: '30 hrs', actualEffort: '30 hrs', buffer: '1 day', remarks: '3 ISO 9001 certified OEM suppliers pre-qualified' },
        { id: 3, activityName: 'User Requirements Specification (URS) Baseline', jobCode: 'ENG-103', department: 'Engineering & R&D', responsibility: 'Anita Desai', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '7/9', delayReason: 'OEM Vendor Dispatch Delay', planStart: '2026-01-15', planEnd: '2026-02-05', actualStart: '2026-01-15', actualEnd: '2026-02-04', eta: '2026-02-05', planDuration: '20 days', actualDuration: '20 days', planEffort: '45 hrs', actualEffort: '45 hrs', buffer: '2 days', remarks: 'URS cycle time and OEE acceptance criteria locked' },
        { id: 4, activityName: 'CapEx / OpEx & ROI Financial Model Sign-off', jobCode: 'PMO-104', department: 'Engineering & R&D', responsibility: 'Priya Reddy', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '4/9', planStart: '2026-01-20', planEnd: '2026-02-08', actualStart: '2026-01-20', actualEnd: '2026-02-07', eta: '2026-02-08', planDuration: '18 days', actualDuration: '18 days', planEffort: '25 hrs', actualEffort: '25 hrs', buffer: '1 day', remarks: '2.1-year CapEx payback period approved by Finance' },
        { id: 5, activityName: 'Utility, Footprint & Power Envelope Review', jobCode: 'FAC-105', department: 'Manufacturing & Operations', responsibility: 'Suresh Naidu', priority: 'Medium', status: true, done: true, tasks: '10/13', activitiesCount: '3/9', planStart: '2026-01-25', planEnd: '2026-02-10', actualStart: '2026-01-25', actualEnd: '2026-02-09', eta: '2026-02-10', planDuration: '16 days', actualDuration: '15 days', planEffort: '20 hrs', actualEffort: '20 hrs', buffer: '1 day', remarks: '480V substation feeder capacity verified sufficient' },
        { id: 6, activityName: 'CE / ISO Machine Safety & Statutory Review', jobCode: 'EHS-106', department: 'EHS & Compliance', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '6/9', planStart: '2026-01-28', planEnd: '2026-02-12', actualStart: '2026-01-28', actualEnd: '2026-02-12', eta: '2026-02-12', planDuration: '15 days', actualDuration: '15 days', planEffort: '18 hrs', actualEffort: '18 hrs', buffer: '0 days', remarks: 'ISO 13849 safety requirements incorporated into URS' },
        { id: 7, activityName: 'Integrated Master Schedule & Charter Approval', jobCode: 'PMO-107', department: 'Engineering & R&D', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '5/9', planStart: '2026-02-01', planEnd: '2026-02-15', actualStart: '2026-02-01', actualEnd: '2026-02-14', eta: '2026-02-15', planDuration: '14 days', actualDuration: '13 days', planEffort: '22 hrs', actualEffort: '22 hrs', buffer: '1 day', remarks: 'Gate 1 business case charter approved by executive board' }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.activities = [
        { id: 1, activityName: '3D CAD Line Layout & Structural FEA Freeze', jobCode: 'CAD-201', department: 'Mechanical Design', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2026-02-16', planEnd: '2026-03-30', actualStart: '2026-02-16', actualEnd: '2026-03-28', eta: '2026-03-30', planDuration: '42 days', actualDuration: '40 days', planEffort: '80 hrs', actualEffort: '75 hrs', buffer: '2 days', remarks: 'Structural vibration & load FEA verified with 2.4x safety factor' },
        { id: 2, activityName: 'PLC / SCADA Control & Safety Interlock Spec', jobCode: 'PLC-202', department: 'Automation & Controls', responsibility: 'Priya Reddy', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-03-15', planEnd: '2026-04-20', actualStart: '2026-03-15', actualEnd: '2026-04-18', eta: '2026-04-20', planDuration: '36 days', actualDuration: '34 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'OPC-UA SCADA telemetry and PLd safety interlocks approved' },
        { id: 3, activityName: 'Design FMEA & HAZOP Risk Closure', jobCode: 'QA-203', department: 'Quality Assurance', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-04-01', planEnd: '2026-05-10', actualStart: '2026-04-01', actualEnd: '2026-05-08', eta: '2026-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '40 hrs', actualEffort: '40 hrs', buffer: '2 days', remarks: 'All RPN > 100 failure modes mitigated' },
        { id: 4, activityName: 'OEM Supplier Technical & Commercial Bid Award', jobCode: 'PRC-204', department: 'Procurement & Supply Chain', responsibility: 'Suresh Naidu', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-04-15', planEnd: '2026-05-25', actualStart: '2026-04-15', actualEnd: '2026-05-23', eta: '2026-05-25', planDuration: '40 days', actualDuration: '38 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'Preferred OEM awarded under fixed-price turnkey SLA' },
        { id: 5, activityName: 'BOM, Tolerance Stack-Up & Tooling Strategy', jobCode: 'CAD-205', department: 'Mechanical Design', responsibility: 'Anita Desai', priority: 'Medium', status: true, done: true, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-05-01', planEnd: '2026-06-15', actualStart: '2026-05-01', actualEnd: '2026-06-14', eta: '2026-06-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '45 hrs', actualEffort: '44 hrs', buffer: '1 day', remarks: 'GD&T tolerance stack-up signed off for fabrication' },
        { id: 6, activityName: 'Execution CapEx & Long-Lead PO Release', jobCode: 'PMO-206', department: 'Engineering & R&D', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2026-05-15', planEnd: '2026-06-30', actualStart: '2026-05-15', actualEnd: '2026-06-28', eta: '2026-06-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '2 days', remarks: 'Gate 2 design freeze and procurement authorized' }
      ];
    } else {
      this.activities = [
        { id: 1, activityName: `${this.gateName} - Engineering Protocol & Test Spec`, jobCode: 'CQV-301', department: 'Commissioning & Qualification', responsibility: 'Priya Reddy', priority: 'High', status: true, done: false, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-07-01', planEnd: '2026-07-31', actualStart: '2026-07-01', actualEnd: '', eta: '2026-07-31', planDuration: '30 days', actualDuration: '15 days', planEffort: '50 hrs', actualEffort: '25 hrs', buffer: '3 days', remarks: 'FAT/SAT protocol draft under cross-functional engineering review' },
        { id: 2, activityName: `${this.gateName} - Build Execution & Performance Verification`, jobCode: 'ENG-302', department: 'Mechanical Design', responsibility: 'Ananya Rao', priority: 'High', status: true, done: false, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-08-01', planEnd: '2026-08-31', actualStart: '', actualEnd: '', eta: '2026-08-31', planDuration: '30 days', actualDuration: '', planEffort: '60 hrs', actualEffort: '', buffer: '4 days', remarks: 'Awaiting OEM subassembly readiness' },
        { id: 3, activityName: `${this.gateName} - Quality Audit & Gate Sign-off`, jobCode: 'QA-303', department: 'Quality Assurance', responsibility: 'Rajesh Kumar', priority: 'Medium', status: true, done: false, tasks: '3/13', activitiesCount: '2/9', planStart: '2026-09-01', planEnd: '2026-09-15', actualStart: '', actualEnd: '', eta: '2026-09-15', planDuration: '15 days', actualDuration: '', planEffort: '30 hrs', actualEffort: '', buffer: '2 days', remarks: 'Pending commissioning punch-list closure' }
      ];
    }

    const defaultUpdaters = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    this.activities.forEach((a, idx) => {
      a.historyCount = this.historySequence[idx % this.historySequence.length];
      a.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!a.updatedDate) {
        a.updatedDate = defaultDates[idx % defaultDates.length];
      }
      if (!a.updatedBy) {
        a.updatedBy = a.responsibility || defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
  }

  applyFilter(): void {
    this.filteredActivities = this.activities.filter(a => {
      const matchDept = !this.filterDepartment || a.department === this.filterDepartment;
      const matchPrio = !this.filterPriority || a.priority === this.filterPriority;
      const matchStatus = !this.filterStatus || (this.filterStatus === 'Active' ? a.status : !a.status);
      return matchDept && matchPrio && matchStatus;
    });
    this.currentPage = 0;
    this.updatePagedActivities();
  }

  resetFilter(): void {
    this.filterDepartment = '';
    this.filterPriority = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  updatePagedActivities(): void {
    const start = this.currentPage * this.pageSize;
    this.pagedActivities = this.filteredActivities.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedActivities();
  }

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

  goBack(): void {
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      }
    });
  }

  toggleStatus(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: `Are you sure you want to ${activity.status ? 'deactivate' : 'activate'} this activity?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        activity.status = !activity.status;
      }
    });
  }

  deleteActivity(activity: GateActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Activity',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.activities = this.activities.filter(a => a !== activity);
        this.applyFilter();
      }
    });
  }

  openTimelineModal(activity: GateActivityItem): void {
    this.selectedTimelineItem = { ...activity, name: activity.activityName };
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openAddActivity(): void {
    this.activityModalStep = 1;
    this.activityModalData = {
      activityName: '',
      jobCode: 'JB-' + (100 + this.activities.length + 1),
      department: this.departments[0],
      responsibility: this.responsibilities[0],
      priority: 'High',
      status: true,
      done: false,
      tasks: '0/13',
      activitiesCount: '0/9',
      planStart: '',
      planEnd: '',
      actualStart: '',
      actualEnd: '',
      eta: '',
      planDuration: '',
      planEffort: '',
      actualDuration: '',
      actualEffort: '',
      buffer: '',
      remarks: '',
      description: ''
    };
    this.isEditActivityMode = false;
    this.showActivityModal = true;
    this.setBodyScrollLock(true);
  }

  openEditActivity(activity: GateActivityItem, index: number): void {
    const actualIndex = this.activities.findIndex(a => a === activity);
    this.activityModalStep = 1;
    this.activityModalData = { ...activity };
    this.isEditActivityMode = true;
    this.activityModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showActivityModal = true;
    this.setBodyScrollLock(true);
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.setBodyScrollLock(false);
  }

  saveActivity(): void {
    if (!this.activityModalData.activityName) return;

    if (this.isEditActivityMode && this.activityModalIndex > -1) {
      this.activities[this.activityModalIndex] = {
        ...this.activities[this.activityModalIndex],
        ...this.activityModalData
      } as GateActivityItem;
    } else {
      const newAct: GateActivityItem = {
        ...(this.activityModalData as GateActivityItem),
        id: Date.now()
      };
      this.activities.push(newAct);
    }
    this.applyFilter();
    this.closeActivityModal();
  }

  onTasksClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.tasks,
        source: 'gates'
      }
    });
  }

  onActivitiesClick(item: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.activityName,
        jobCode: item.jobCode,
        department: item.department,
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.activitiesCount || item.activities,
        source: 'gates'
      }
    });
  }

  openHistory(activity: GateActivityItem): void {
    this.router.navigate(['/projects/dashboard/gates/activities/history'], {
      queryParams: {
        activityName: activity.activityName,
        jobCode: activity.jobCode,
        department: activity.department,
        responsibility: activity.responsibility,
        delayReason: activity.delayReason,
        priority: activity.priority,
        tasks: activity.tasks,
        requirements: activity.activitiesCount || activity.activities || activity.requirements,
        planDuration: activity.planDuration,
        planEffort: activity.planEffort,
        actualDuration: activity.actualDuration,
        actualEffort: activity.actualEffort,
        remarks: activity.remarks,
        gateName: this.gateName,
        gateCode: this.gateCode,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
