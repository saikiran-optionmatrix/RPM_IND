import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HoursTimesheetComponent } from '../../../../projects/project-dashboard/project-hours/hours-timesheet/hours-timesheet.component';
import { AddProjActivityComponent } from '../../../../projects/project-dashboard/project-activities/add-proj-activity/add-proj-activity.component';

export interface ProjectActivityItem {
  id?: string | number;
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;
  stage?: string;
  PercentCompletion: number;
  Deliverable: string;
  TaskName: string;
  TaskType: string;
  Responsibility: string;
  Duration: string;
  Effort: string;
  Description: string;
  PlanStart: string;
  PlanEnd: string;
  ActualStart: string;
  ActualEnd: string;
  ETA: string;
  Status: string;
  Priority: string;
  Complexity: string;
  Template: string;
  Done?: boolean;
  Tasks?: string | number;
  Requirements?: string | number;
  tasks?: string | number;
  requirements?: string | number;
  activities?: string;
  delayReason?: string;
}

@Component({
  selector: 'app-template-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './template-activities.component.html',
  styleUrl: './template-activities.component.scss'
})
export class TemplateActivitiesComponent implements OnInit, OnDestroy {
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
  dynamicBreadcrumb: string = 'Activities';

  showFilter: boolean = false;
  showTimelineModal: boolean = false;
  selectedTimelineTask: ProjectActivityItem | null = null;
  excludeCompleted: boolean = false;

  // Add / Edit Modal State
  showActivityModal: boolean = false;
  isEditMode: boolean = false;
  editingItem: ProjectActivityItem | null = null;
  activityFormData: Partial<ProjectActivityItem> = {};

  // Timesheet Modal State
  showTimesheetModal: boolean = false;
  timesheetTask: ProjectActivityItem | null = null;

  rawProjects: ProjectActivityItem[] = [];
  allProjects: ProjectActivityItem[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  filterKeyword: string = '';
  filterProjectName: string = '';
  filterDateType: string = '';
  filterFromDate: string = '';
  filterToDate: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterComplexity: string = '';
  filterActive: boolean = false;

  teamMembers = [
    'Ananya Rao',
    'Rajesh Kumar',
    'Anita Desai',
    'Priya Reddy',
    'Suresh Naidu',
    'Amit Patel',
    'Deepa Nair',
    'Vikram Singh',
    'Arun Joseph',
    'Lakshmi Devi'
  ];
  statuses = ['Pending', 'Allocation', 'Progress', 'In Progress', 'Testing', 'Review', 'Hold', 'Cancelled', 'Completed'];
  priorities = ['Critical', 'High', 'Medium', 'Low'];
  complexities = ['Very High', 'High', 'Medium', 'Low'];

  readonly delayReasonOptions: string[] = [
    'Critical Component / Raw Material Shortage',
    'Site Permit / Statutory Compliance Approval Pending',
    'Long-Lead Equipment / Vendor Shipment Delay',
  ];

  private routeSub?: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  getAllProjects(): void {
    const mockData: ProjectActivityItem[] = [
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/001',
        Stage: 'S1',
        PercentCompletion: 100,
        Deliverable: 'Plant Requirements & Existing Asset Review',
        TaskName: 'Line Takt-Time & Capacity Bottleneck Audit',
        TaskType: 'Planning',
        Responsibility: 'Ananya Rao',
        Duration: '5 days',
        Effort: '20',
        Description: 'Audit existing transfer station cycle times, OEE downtime logs, and throughput constraints.',
        PlanStart: '2026-01-01',
        PlanEnd: '2026-01-05',
        ActualStart: '2026-01-01',
        ActualEnd: '2026-01-05',
        ETA: '2026-01-05',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Industrial Equipment Line Expansion Program'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/002',
        Stage: 'S2',
        PercentCompletion: 45,
        Deliverable: 'URS & Functional Specification',
        TaskName: 'URS Footprint & 480V Utility Envelope Verification',
        TaskType: 'Engineering',
        Responsibility: 'Rajesh Kumar',
        Duration: '8 days',
        Effort: '32',
        Description: 'Define machine footprint, 480V feeder headroom, and compressed air SCFM demand.',
        PlanStart: '2026-01-07',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-08',
        ActualEnd: '',
        ETA: '2026-01-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Industrial Equipment Line Expansion Program'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/003',
        Stage: 'S3',
        PercentCompletion: 25,
        Deliverable: '3D CAD Layout & Control Architecture',
        TaskName: '3D Workcell Kinematics & Clash Detection',
        TaskType: 'Design',
        Responsibility: 'Anita Desai',
        Duration: '10 days',
        Effort: '48',
        Description: 'Complete 3D solid modeling for gantry transfer rails and robotic end-of-arm tooling.',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-26',
        ActualStart: '2026-01-16',
        ActualEnd: '',
        ETA: '2026-01-28',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Automated Production Line Upgrade Program'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/004',
        Stage: 'S4',
        PercentCompletion: 60,
        Deliverable: 'PLC / SCADA Control & Safety Architecture',
        TaskName: 'EPLAN Panel Schematics & ISO 13849 PLd Interlocks',
        TaskType: 'Automation',
        Responsibility: 'Priya Reddy',
        Duration: '12 days',
        Effort: '56',
        Description: 'Generate electrical cabinet schematics, safety relay logic, and EtherCAT motion bus map.',
        PlanStart: '2026-01-27',
        PlanEnd: '2026-02-08',
        ActualStart: '2026-01-27',
        ActualEnd: '',
        ETA: '2026-02-10',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Industrial Control System Development'
      },
      {
        IsActive: false,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/005',
        Stage: 'S5',
        PercentCompletion: 0,
        Deliverable: 'DFMA Review & Tolerance Allocation',
        TaskName: 'GD&T Datum Scheme & CMM Gage R&R Plan',
        TaskType: 'Quality',
        Responsibility: 'Suresh Naidu',
        Duration: '6 days',
        Effort: '24',
        Description: 'Lock critical bore concentricity tolerances and inline laser micrometer Gage R&R plan.',
        PlanStart: '2026-02-09',
        PlanEnd: '2026-02-15',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-02-16',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Industrial Equipment Line Expansion Program'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/006',
        Stage: 'S6',
        PercentCompletion: 45,
        Deliverable: 'Process Engineering & Fixture Design',
        TaskName: 'SMED Quick-Change Fixture Tooling Design',
        TaskType: 'Design',
        Responsibility: 'Amit Patel',
        Duration: '8 days',
        Effort: '40',
        Description: 'Design zero-point hydraulic clamping fixture supporting sub-5-minute part changeover.',
        PlanStart: '2026-02-16',
        PlanEnd: '2026-02-24',
        ActualStart: '2026-02-16',
        ActualEnd: '',
        ETA: '2026-02-26',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Automated Production Line Upgrade Program'
      },
      {
        IsActive: false,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/007',
        Stage: 'S7',
        PercentCompletion: 100,
        Deliverable: 'Prototype Fabrication & Validation',
        TaskName: 'First-Article Fixture & Subassembly CMM Run',
        TaskType: 'Validation',
        Responsibility: 'Deepa Nair',
        Duration: '5 days',
        Effort: '30',
        Description: 'Verify first-article machined subassemblies and spindle thermal stability test.',
        PlanStart: '2026-02-25',
        PlanEnd: '2026-03-02',
        ActualStart: '2026-02-25',
        ActualEnd: '2026-03-01',
        ETA: '2026-03-01',
        Status: 'Completed',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Industrial Compressor Platform Development'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/008',
        Stage: 'S8',
        PercentCompletion: 20,
        Deliverable: 'Installation Planning & Site Readiness',
        TaskName: 'Concrete Pad Leveling & Rigging Path Clearance',
        TaskType: 'Facilities',
        Responsibility: 'Vikram Singh',
        Duration: '10 days',
        Effort: '60',
        Description: 'Verify vibration-isolated foundation curing, anchor layout, and overhead crane clearance.',
        PlanStart: '2026-03-03',
        PlanEnd: '2026-03-13',
        ActualStart: '2026-03-04',
        ActualEnd: '',
        ETA: '2026-03-15',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Commercial Production Line Transfer & Ramp-Up'
      },
      {
        IsActive: false,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/009',
        Stage: 'S9',
        PercentCompletion: 75,
        Deliverable: 'Equipment Installation & Integration',
        TaskName: 'Factory Acceptance Test (FAT) & OEM Punchlist',
        TaskType: 'Integration',
        Responsibility: 'Arun Joseph',
        Duration: '7 days',
        Effort: '42',
        Description: 'Witness OEM shop-floor dry/wet run-off and close all Priority-1 FAT punchlist items.',
        PlanStart: '2026-03-14',
        PlanEnd: '2026-03-21',
        ActualStart: '2026-03-14',
        ActualEnd: '',
        ETA: '2026-03-23',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Industrial Control System Development'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/010',
        Stage: 'S10',
        PercentCompletion: 10,
        Deliverable: 'Commissioning & Performance Testing',
        TaskName: 'IQ / OQ Loop Check & 50-Part Cpk Study',
        TaskType: 'Commissioning',
        Responsibility: 'Lakshmi Devi',
        Duration: '9 days',
        Effort: '36',
        Description: 'Execute Site Acceptance Test (SAT) and verify process capability Cpk >= 1.67.',
        PlanStart: '2026-03-22',
        PlanEnd: '2026-03-31',
        ActualStart: '2026-03-22',
        ActualEnd: '',
        ETA: '2026-04-02',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Commercial Production Line Transfer & Ramp-Up'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/011',
        Stage: 'S11',
        PercentCompletion: 55,
        Deliverable: 'Operational Qualification & Ramp-Up',
        TaskName: '3-Shift Endurance Run (>= 85% OEE Validation)',
        TaskType: 'Qualification',
        Responsibility: 'Rajesh Kumar',
        Duration: '14 days',
        Effort: '84',
        Description: 'Run three consecutive shifts verifying thermal equilibrium and sustained OEE targets.',
        PlanStart: '2026-04-01',
        PlanEnd: '2026-04-15',
        ActualStart: '2026-04-01',
        ActualEnd: '',
        ETA: '2026-04-17',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'Commercial Production Line Transfer & Ramp-Up'
      },
      {
        IsActive: false,
        ProjectName: 'Industrial Equipment Line Expansion Program',
        ProjectCode: 'TPL/IND/012',
        Stage: 'S12',
        PercentCompletion: 100,
        Deliverable: 'As-Built TTD & CMMS Handover',
        TaskName: 'CMMS Spares Crib & Operator LOTO Sign-off',
        TaskType: 'Handover',
        Responsibility: 'Ananya Rao',
        Duration: '6 days',
        Effort: '32',
        Description: 'Archive as-built EPLAN/PLC files, load CMMS PM tasks, and certify shift operators.',
        PlanStart: '2026-04-16',
        PlanEnd: '2026-04-22',
        ActualStart: '2026-04-16',
        ActualEnd: '2026-04-22',
        ETA: '2026-04-22',
        Status: 'Completed',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Industrial Equipment Line Expansion Program'
      }
    ];

    const taskCounts = ['4/13', '1/13', '8/13', '6/13', '10/13', '7/13', '9/13', '11/13', '5/13', '2/13', '12/13', '3/13'];
    const reqCounts = ['5/9', '2/9', '7/9', '4/9', '6/9', '8/9', '3/9', '5/9', '1/9', '7/9', '4/9', '2/9'];
    const delayReasons = ['Critical Component / Raw Material Shortage', 'Site Permit / Statutory Compliance Approval Pending', 'Long-Lead Equipment / Vendor Shipment Delay'];
    this.rawProjects = mockData.map((item, idx) => ({
      ...item,
      Tasks: item.Tasks ?? taskCounts[idx % taskCounts.length],
      Requirements: item.Requirements ?? reqCounts[idx % reqCounts.length],
      delayReason: item.delayReason ?? delayReasons[idx % delayReasons.length]
    }));
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = this.rawProjects;

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.filterKeyword && this.filterKeyword.trim()) {
      const kw = this.filterKeyword.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.TaskName && p.TaskName.toLowerCase().includes(kw)) ||
        (p.Stage && p.Stage.toLowerCase().includes(kw)) ||
        (p.Deliverable && p.Deliverable.toLowerCase().includes(kw)) ||
        (p.ProjectName && p.ProjectName.toLowerCase().includes(kw)) ||
        (p.ProjectCode && p.ProjectCode.toLowerCase().includes(kw)) ||
        (p.Responsibility && p.Responsibility.toLowerCase().includes(kw)) ||
        (p.Description && p.Description.toLowerCase().includes(kw))
      );
    }

    if (this.filterProjectName && this.filterProjectName.trim()) {
      const pn = this.filterProjectName.toLowerCase().trim();
      filtered = filtered.filter(p => p.ProjectName && p.ProjectName.toLowerCase().includes(pn));
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => p.Status === this.filterStatus);
    }

    if (this.filterPriority) {
      filtered = filtered.filter(p => p.Priority === this.filterPriority);
    }

    if (this.filterComplexity) {
      filtered = filtered.filter(p => p.Complexity === this.filterComplexity);
    }

    if (this.filterActive) {
      filtered = filtered.filter(p => p.IsActive === true);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.allProjects = filtered.slice(start, end);
  }

  clearFilter(): void {
    this.filterKeyword = '';
    this.filterProjectName = '';
    this.filterDateType = '';
    this.filterFromDate = '';
    this.filterToDate = '';
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterComplexity = '';
    this.filterActive = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newItem: ProjectActivityItem = {
          IsActive: true,
          ProjectName: this.projectName,
          ProjectCode: this.projectCode,
          Stage: result.stage || result.Stage || 'S1',
          PercentCompletion: 0,
          Deliverable: result.Deliverable || 'Module1',
          TaskName: result.TaskName || '',
          TaskType: 'Development',
          Responsibility: 'Alice Johnson',
          Duration: result.planDuration || '5 days',
          Effort: result.planEffort || '20',
          Description: result.Description || '',
          PlanStart: result.PlanStart || new Date().toISOString().split('T')[0],
          PlanEnd: result.PlanEnd || '',
          ActualStart: result.ActualStart || '',
          ActualEnd: result.ActualEnd || '',
          ETA: '',
          Status: result.Status || 'In Progress',
          Priority: 'Medium',
          Complexity: 'Medium',
          Template: 'Dev Template'
        };
        this.rawProjects.unshift(newItem);
        this.applyFilter();
      }
    });
  }

  openEditDialog(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { ...item, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Stage: result.stage || result.Stage || item.Stage || 'S1',
          Deliverable: result.Deliverable || item.Deliverable,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.applyFilter();
      }
    });
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.editingItem = null;
    this.activityFormData = {};
  }

  deleteConfirmation(item: ProjectActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this activity record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  toggleActive(item: ProjectActivityItem): void {
    // Toggles state directly
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  openPdf(fileName: string): void {
    const pdfUrl = `assets/${fileName}`;
    window.open(pdfUrl, '_blank');
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  openTimelineModal(task: ProjectActivityItem): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  opentimesheet(): void {
    this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });
  }

  closeTimesheetModal(): void {
    this.showTimesheetModal = false;
    this.timesheetTask = null;
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  onTasksClick(item: ProjectActivityItem): void {
    const rawStage = item.Stage || item.stage || 'S1';
    const stageNum = rawStage.replace(/\D/g, '') || '1';
    const stageName = `Stage ${stageNum}`;

    this.router.navigate(['../wbs/tasks'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: stageName,
        stageCode: rawStage,
        projectName: this.projectName,
        projectCode: this.projectCode,
        code: this.projectCode,
        tasks: item.Tasks ?? item.tasks ?? '0/13',
        source: 'activities'
      },
      queryParamsHandling: 'merge'
    });
  }

  onRequirementsClick(item: ProjectActivityItem): void {
    const rawStage = item.Stage || item.stage || 'S1';
    const stageNum = rawStage.replace(/\D/g, '') || '1';
    const stageName = `Stage ${stageNum}`;

    this.router.navigate(['../wbs/requirements'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: stageName,
        stageCode: rawStage,
        projectName: this.projectName,
        projectCode: this.projectCode,
        code: this.projectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '0/9',
        source: 'activities'
      },
      queryParamsHandling: 'merge'
    });
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
}
