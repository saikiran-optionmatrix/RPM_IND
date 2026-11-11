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
    'Generic Tablet Development';
  projectCode: string =
    this.route.snapshot.queryParamMap.get('projectCode') ||
    this.route.snapshot.queryParamMap.get('code') ||
    '2026/GEN/001';
  gateCode: string = this.route.snapshot.queryParamMap.get('gateCode') || 'Gate 1';
  gateName: string = this.route.snapshot.queryParamMap.get('gateName') || 'Business Case';

  isFilterVisible: boolean = false;
  filterDepartment: string = '';
  filterPriority: string = '';
  filterStatus: string = '';

  departments: string[] = ['R&D / Formulation', 'Analytical QA', 'Regulatory Affairs', 'Project Management', 'Quality Assurance', 'Supply Chain'];
  priorities: string[] = ['High', 'Medium', 'Low'];
  responsibilities: string[] = ['Dr. Sarah Jenkins', 'Michael Chang', 'Dr. Priya Nair', 'Alex Rivera', 'Emily Watson', 'David Miller'];

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
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
        { id: 1, activityName: 'Formal Freedom-to-Operate (FTO) Opinion', jobCode: 'JB-101', department: 'Regulatory Affairs', responsibility: 'Alex Rivera', priority: 'High', status: true, done: true, tasks: '4/13', activitiesCount: '5/9', delayReason: 'Raw Material Shortage', planStart: '2026-01-05', planEnd: '2026-01-15', actualStart: '2026-01-05', actualEnd: '2026-01-14', eta: '2026-01-15', planDuration: '10 days', actualDuration: '9 days', planEffort: '40 hrs', actualEffort: '36 hrs', buffer: '1 day', remarks: 'FTO cleared without patent infringement risk' },
        { id: 2, activityName: 'API Source & Vendor Qualification', jobCode: 'JB-102', department: 'Supply Chain', responsibility: 'David Miller', priority: 'High', status: true, done: true, tasks: '1/13', activitiesCount: '2/9', delayReason: 'Regulatory Approval Pending', planStart: '2026-01-10', planEnd: '2026-01-25', actualStart: '2026-01-10', actualEnd: '2026-01-24', eta: '2026-01-25', planDuration: '15 days', actualDuration: '14 days', planEffort: '30 hrs', actualEffort: '30 hrs', buffer: '1 day', remarks: '2 DMF approved vendors qualified' },
        { id: 3, activityName: 'Reference Listed Drug (RLD) Characterization', jobCode: 'JB-103', department: 'Analytical QA', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '7/9', delayReason: 'Vendor Dispatch Delay', planStart: '2026-01-15', planEnd: '2026-02-05', actualStart: '2026-01-15', actualEnd: '2026-02-04', eta: '2026-02-05', planDuration: '20 days', actualDuration: '20 days', planEffort: '45 hrs', actualEffort: '45 hrs', buffer: '2 days', remarks: 'Physicochemical characterization completed' },
        { id: 4, activityName: 'Target Product Profile (TPP) Documentation', jobCode: 'JB-104', department: 'R&D / Formulation', responsibility: 'Dr. Sarah Jenkins', priority: 'High', status: true, done: true, tasks: '6/13', activitiesCount: '4/9', planStart: '2026-01-20', planEnd: '2026-02-08', actualStart: '2026-01-20', actualEnd: '2026-02-07', eta: '2026-02-08', planDuration: '18 days', actualDuration: '18 days', planEffort: '25 hrs', actualEffort: '25 hrs', buffer: '1 day', remarks: 'TPP baseline signed off' },
        { id: 5, activityName: 'Formulation Complexity Risk Rating', jobCode: 'JB-105', department: 'R&D / Formulation', responsibility: 'Michael Chang', priority: 'Medium', status: true, done: true, tasks: '10/13', activitiesCount: '3/9', planStart: '2026-01-25', planEnd: '2026-02-10', actualStart: '2026-01-25', actualEnd: '2026-02-09', eta: '2026-02-10', planDuration: '16 days', actualDuration: '15 days', planEffort: '20 hrs', actualEffort: '20 hrs', buffer: '1 day', remarks: 'Low-to-medium risk profile confirmed' },
        { id: 6, activityName: 'Cost of Goods Sold (COGS) Feasibility', jobCode: 'JB-106', department: 'Project Management', responsibility: 'Emily Watson', priority: 'Medium', status: true, done: true, tasks: '7/13', activitiesCount: '6/9', planStart: '2026-01-28', planEnd: '2026-02-12', actualStart: '2026-01-28', actualEnd: '2026-02-12', eta: '2026-02-12', planDuration: '15 days', actualDuration: '15 days', planEffort: '18 hrs', actualEffort: '18 hrs', buffer: '0 days', remarks: 'Target COGS within projected budget' },
        { id: 7, activityName: 'Regulatory Submission Pathway Confirmation', jobCode: 'JB-107', department: 'Regulatory Affairs', responsibility: 'Alex Rivera', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '5/9', planStart: '2026-02-01', planEnd: '2026-02-15', actualStart: '2026-02-01', actualEnd: '2026-02-14', eta: '2026-02-15', planDuration: '14 days', actualDuration: '13 days', planEffort: '22 hrs', actualEffort: '22 hrs', buffer: '1 day', remarks: 'ANDA 505(j) pathway confirmed' }
      ];
    } else if (this.gateCode === 'Gate 2') {
      this.activities = [
        { id: 1, activityName: 'Prototype Batches Manufacturing', jobCode: 'JB-201', department: 'R&D / Formulation', responsibility: 'Dr. Sarah Jenkins', priority: 'High', status: true, done: true, tasks: '9/13', activitiesCount: '7/9', planStart: '2026-02-16', planEnd: '2026-03-30', actualStart: '2026-02-16', actualEnd: '2026-03-28', eta: '2026-03-30', planDuration: '42 days', actualDuration: '40 days', planEffort: '80 hrs', actualEffort: '75 hrs', buffer: '2 days', remarks: '3 prototype formulations generated' },
        { id: 2, activityName: 'Comparative Dissolution Profile (f2 ≥ 50)', jobCode: 'JB-202', department: 'Analytical QA', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '8/13', activitiesCount: '6/9', planStart: '2026-03-15', planEnd: '2026-04-20', actualStart: '2026-03-15', actualEnd: '2026-04-18', eta: '2026-04-20', planDuration: '36 days', actualDuration: '34 days', planEffort: '60 hrs', actualEffort: '58 hrs', buffer: '2 days', remarks: 'f2 similarity factor > 65 across all media' },
        { id: 3, activityName: 'Critical Quality Attributes (CQAs) Target Ranges', jobCode: 'JB-203', department: 'Quality Assurance', responsibility: 'Emily Watson', priority: 'High', status: true, done: true, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-04-01', planEnd: '2026-05-10', actualStart: '2026-04-01', actualEnd: '2026-05-08', eta: '2026-05-10', planDuration: '39 days', actualDuration: '37 days', planEffort: '40 hrs', actualEffort: '40 hrs', buffer: '2 days', remarks: 'CQAs established with risk mitigation matrix' },
        { id: 4, activityName: 'Excipient Compatibility Study Completion', jobCode: 'JB-204', department: 'Analytical QA', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-04-15', planEnd: '2026-05-25', actualStart: '2026-04-15', actualEnd: '2026-05-23', eta: '2026-05-25', planDuration: '40 days', actualDuration: '38 days', planEffort: '50 hrs', actualEffort: '48 hrs', buffer: '2 days', remarks: 'No incompatibility found with active moiety' },
        { id: 5, activityName: 'Manufacturing Unit Operations Mapping', jobCode: 'JB-205', department: 'R&D / Formulation', responsibility: 'Michael Chang', priority: 'Medium', status: true, done: true, tasks: '4/13', activitiesCount: '3/9', planStart: '2026-05-01', planEnd: '2026-06-15', actualStart: '2026-05-01', actualEnd: '2026-06-14', eta: '2026-06-15', planDuration: '45 days', actualDuration: '44 days', planEffort: '45 hrs', actualEffort: '44 hrs', buffer: '1 day', remarks: 'Wet granulation and compression parameters set' },
        { id: 6, activityName: 'Preliminary Impurity Profile Evaluation', jobCode: 'JB-206', department: 'Analytical QA', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: true, tasks: '11/13', activitiesCount: '8/9', planStart: '2026-05-15', planEnd: '2026-06-30', actualStart: '2026-05-15', actualEnd: '2026-06-28', eta: '2026-06-30', planDuration: '46 days', actualDuration: '44 days', planEffort: '55 hrs', actualEffort: '52 hrs', buffer: '2 days', remarks: 'Degradation impurities within ICH limits' }
      ];
    } else {
      this.activities = [
        { id: 1, activityName: `${this.gateName} - Method Protocol & Design`, jobCode: 'JB-301', department: 'Analytical QA', responsibility: 'Dr. Priya Nair', priority: 'High', status: true, done: false, tasks: '5/13', activitiesCount: '4/9', planStart: '2026-07-01', planEnd: '2026-07-31', actualStart: '2026-07-01', actualEnd: '', eta: '2026-07-31', planDuration: '30 days', actualDuration: '15 days', planEffort: '50 hrs', actualEffort: '25 hrs', buffer: '3 days', remarks: 'Protocol draft under internal review' },
        { id: 2, activityName: `${this.gateName} - Execution & Batch Verification`, jobCode: 'JB-302', department: 'R&D / Formulation', responsibility: 'Dr. Sarah Jenkins', priority: 'High', status: true, done: false, tasks: '7/13', activitiesCount: '5/9', planStart: '2026-08-01', planEnd: '2026-08-31', actualStart: '', actualEnd: '', eta: '2026-08-31', planDuration: '30 days', actualDuration: '', planEffort: '60 hrs', actualEffort: '', buffer: '4 days', remarks: 'Awaiting intermediate batch release' },
        { id: 3, activityName: `${this.gateName} - Summary Report & Sign-off`, jobCode: 'JB-303', department: 'Quality Assurance', responsibility: 'Emily Watson', priority: 'Medium', status: true, done: false, tasks: '3/13', activitiesCount: '2/9', planStart: '2026-09-01', planEnd: '2026-09-15', actualStart: '', actualEnd: '', eta: '2026-09-15', planDuration: '15 days', actualDuration: '', planEffort: '30 hrs', actualEffort: '', buffer: '2 days', remarks: 'Pending study conclusion' }
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
