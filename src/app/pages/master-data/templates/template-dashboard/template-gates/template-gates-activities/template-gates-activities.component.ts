import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
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
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

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
}

@Component({
  selector: 'app-template-gates-activities',
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
  templateUrl: './template-gates-activities.component.html',
  styleUrl: './template-gates-activities.component.scss',
})
export class TemplateGatesActivitiesComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';
  projectCode: string =
    this.route.snapshot.queryParamMap.get('projectCode') ||
    this.route.snapshot.queryParamMap.get('code') ||
    'TPL/IND/001';
  gateCode: string = this.route.snapshot.queryParamMap.get('gateCode') || 'Gate 1';
  gateName: string = this.route.snapshot.queryParamMap.get('gateName') || 'Business Case Approval';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = ['Engineering & R&D', 'Automation & Controls', 'Quality & Inspection', 'EHS & Compliance', 'Commissioning & Qualification', 'Sourcing & Procurement'];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];

  readonly delayReasonOptions: string[] = [
    'Critical Component / Raw Material Shortage',
    'Site Permit / Statutory Compliance Approval Pending',
    'Long-Lead Equipment / Vendor Shipment Delay',
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

  // Add / Edit Activity Modal
  showActivityModal: boolean = false;
  activityModalStep = 1;
  isEditActivityMode: boolean = false;
  activityModalData: Partial<GateActivityItem> = {};
  activityModalIndex = -1;

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['name'] || params['projectName'] || params['templateName']) {
        this.projectName = params['name'] || params['projectName'] || params['templateName'];
      }
      if (params['code'] || params['projectCode']) {
        this.projectCode = params['code'] || params['projectCode'];
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
    this.routeSub?.unsubscribe();
    this.setBodyScrollLock(false);
  }

  initActivitiesForGate(): void {
    if (this.gateCode === 'Gate 1') {
      this.activities = [
        { id: 1, activityName: 'Plant Throughput & Takt-Time Bottleneck Audit', jobCode: 'ENG-101', department: 'Engineering & R&D', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '4/13', activitiesCount: '5/9', delayReason: 'Critical Component / Raw Material Shortage', planStart: '2026-01-05', planEnd: '2026-01-15', actualStart: '2026-01-05', actualEnd: '2026-01-14', eta: '2026-01-15', planDuration: '10 days', actualDuration: '9 days', planEffort: '40 hrs', actualEffort: '36 hrs', buffer: '1 day', remarks: 'Cycle-time and OEE targets validated' },
        { id: 2, activityName: 'OEM & Tier-1 Component Vendor Pre-Qualification', jobCode: 'SCM-102', department: 'Sourcing & Procurement', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '1/13', activitiesCount: '2/9', delayReason: 'Site Permit / Statutory Compliance Approval Pending', planStart: '2026-01-10', planEnd: '2026-01-25', actualStart: '2026-01-10', actualEnd: '2026-01-24', eta: '2026-01-25', planDuration: '15 days', actualDuration: '14 days', planEffort: '30 hrs', actualEffort: '30 hrs', buffer: '1 day', remarks: 'Two ISO 9001 OEM vendors shortlisted' },
        { id: 3, activityName: 'Existing Production Line Technical Benchmarking', jobCode: 'QLT-103', department: 'Quality & Inspection', responsibility: 'Priya Reddy', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '7/9', delayReason: 'Long-Lead Equipment / Vendor Shipment Delay', planStart: '2026-01-15', planEnd: '2026-02-05', actualStart: '2026-01-15', actualEnd: '2026-02-04', eta: '2026-02-05', planDuration: '20 days', actualDuration: '20 days', planEffort: '45 hrs', actualEffort: '45 hrs', buffer: '2 days', remarks: 'Baseline vibration and Cpk data documented' },
        { id: 4, activityName: 'User Requirements Specification (URS) Baseline', jobCode: 'ENG-104', department: 'Engineering & R&D', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '4/9', planStart: '2026-01-20', planEnd: '2026-02-08', actualStart: '2026-01-20', actualEnd: '2026-02-07', eta: '2026-02-08', planDuration: '18 days', actualDuration: '18 days', planEffort: '25 hrs', actualEffort: '25 hrs', buffer: '1 day', remarks: 'URS footprint and utility envelope signed off' },
        { id: 5, activityName: 'Freedom-to-Operate (FTO) & Tooling Patent Check', jobCode: 'EHS-105', department: 'EHS & Compliance', responsibility: 'Anita Desai', priority: 'Medium', status: true, done: true, tasks: '10/13', activitiesCount: '3/9', planStart: '2026-01-25', planEnd: '2026-02-10', actualStart: '2026-01-25', actualEnd: '2026-02-09', eta: '2026-02-10', planDuration: '16 days', actualDuration: '15 days', planEffort: '20 hrs', actualEffort: '20 hrs', buffer: '1 day', remarks: 'Zero proprietary tooling IP conflicts' },
        { id: 6, activityName: 'CapEx / ROI & Payback Financial Modeling', jobCode: 'ENG-106', department: 'Engineering & R&D', responsibility: 'Suresh Naidu', priority: 'Medium', status: true, done: true, tasks: '7/13', activitiesCount: '6/9', planStart: '2026-01-28', planEnd: '2026-02-12', actualStart: '2026-01-28', actualEnd: '2026-02-12', eta: '2026-02-12', planDuration: '15 days', actualDuration: '15 days', planEffort: '18 hrs', actualEffort: '18 hrs', buffer: '0 days', remarks: 'NPV and 2.4-year payback approved' },
        { id: 7, activityName: 'CE / ISO 13849 & Environmental Permit Roadmap', jobCode: 'EHS-107', department: 'EHS & Compliance', responsibility: 'Anita Desai', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '5/9', planStart: '2026-02-01', planEnd: '2026-02-15', actualStart: '2026-02-01', actualEnd: '2026-02-14', eta: '2026-02-15', planDuration: '14 days', actualDuration: '13 days', planEffort: '22 hrs', actualEffort: '22 hrs', buffer: '1 day', remarks: 'Machinery Directive and UL 508A path confirmed' }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.activities = [
        { id: 1, activityName: '3D CAD Assembly & Structural FEA Simulation', jobCode: 'ENG-201', department: 'Engineering & R&D', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2026-02-16', planEnd: '2026-03-30', actualStart: '2026-02-16', actualEnd: '2026-03-28', eta: '2026-03-30', planDuration: '42 days', actualDuration: '40 days', planEffort: '80 hrs', actualEffort: '75 hrs', buffer: '2 days', remarks: 'Modal frequency and deflection margins verified' },
        { id: 2, activityName: 'PLC / SCADA Control & Safety Interlock Spec', jobCode: 'AUT-202', department: 'Automation & Controls', responsibility: 'Suresh Naidu', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-03-15', planEnd: '2026-04-20', actualStart: '2026-03-15', actualEnd: '2026-04-18', eta: '2026-04-20', planDuration: '36 days', actualDuration: '34 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'EtherCAT bus timing and PLd interlocks frozen' },
        { id: 3, activityName: 'Critical-to-Quality (CTQ) GD&T Tolerance Spec', jobCode: 'QLT-203', department: 'Quality & Inspection', responsibility: 'Priya Reddy', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-04-01', planEnd: '2026-05-10', actualStart: '2026-04-01', actualEnd: '2026-05-08', eta: '2026-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '40 hrs', actualEffort: '40 hrs', buffer: '2 days', remarks: 'CMM datum scheme approved' },
        { id: 4, activityName: 'Design for Manufacturing & Assembly (DFMA) Audit', jobCode: 'ENG-204', department: 'Engineering & R&D', responsibility: 'Ananya Rao', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-04-15', planEnd: '2026-05-25', actualStart: '2026-04-15', actualEnd: '2026-05-23', eta: '2026-05-25', planDuration: '40 days', actualDuration: '38 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'SMED fixture quick-change verified' },
        { id: 5, activityName: 'EPLAN Panel Schematics & LOTO Hazard Audit', jobCode: 'EHS-205', department: 'EHS & Compliance', responsibility: 'Anita Desai', priority: 'Medium', status: true, done: true, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-05-01', planEnd: '2026-06-15', actualStart: '2026-05-01', actualEnd: '2026-06-14', eta: '2026-06-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '45 hrs', actualEffort: '44 hrs', buffer: '1 day', remarks: 'Dual-channel LOTO isolation verified' },
        { id: 6, activityName: 'Preliminary Cycle-Time & Power Load Simulation', jobCode: 'AUT-206', department: 'Automation & Controls', responsibility: 'Amit Patel', priority: 'High', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2026-05-15', planEnd: '2026-06-30', actualStart: '2026-05-15', actualEnd: '2026-06-28', eta: '2026-06-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '2 days', remarks: 'Peak 480V kVA demand within feeder margin' }
      ];
    } else {
      this.activities = [
        { id: 1, activityName: `${this.gateName} - Engineering Protocol & Test Spec`, jobCode: 'CQV-301', department: 'Commissioning & Qualification', responsibility: 'Priya Reddy', priority: 'High', status: true, done: false, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-07-01', planEnd: '2026-07-31', actualStart: '2026-07-01', actualEnd: '', eta: '2026-07-31', planDuration: '30 days', actualDuration: '15 days', planEffort: '50 hrs', actualEffort: '25 hrs', buffer: '3 days', remarks: 'Protocol draft under internal review' },
        { id: 2, activityName: `${this.gateName} - Execution & Acceptance Verification`, jobCode: 'ENG-302', department: 'Engineering & R&D', responsibility: 'Rajesh Kumar', priority: 'High', status: true, done: false, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-08-01', planEnd: '2026-08-31', actualStart: '', actualEnd: '', eta: '2026-08-31', planDuration: '30 days', actualDuration: '', planEffort: '60 hrs', actualEffort: '', buffer: '4 days', remarks: 'Awaiting OEM subassembly sign-off' },
        { id: 3, activityName: `${this.gateName} - Summary Dossier & Sign-off`, jobCode: 'QLT-303', department: 'Quality & Inspection', responsibility: 'Anita Desai', priority: 'Medium', status: true, done: false, tasks: '3/13', activitiesCount: '2/9', planStart: '2026-09-01', planEnd: '2026-09-15', actualStart: '', actualEnd: '', eta: '2026-09-15', planDuration: '15 days', actualDuration: '', planEffort: '30 hrs', actualEffort: '', buffer: '2 days', remarks: 'Pending commissioning conclusion' }
      ];
    }
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
    this.location.back();
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
    this.router.navigate(['../../wbs/tasks'], {
      relativeTo: this.route,
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
      },
      queryParamsHandling: 'merge'
    });
  }

  onActivitiesClick(item: GateActivityItem): void {
    this.router.navigate(['../../wbs/requirements'], {
      relativeTo: this.route,
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
      },
      queryParamsHandling: 'merge'
    });
  }

  private setBodyScrollLock(lock: boolean): void {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }
}
