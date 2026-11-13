import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddProjActivityComponent } from './add-proj-activity/add-proj-activity.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { HoursTimesheetComponent } from '../project-hours/hours-timesheet/hours-timesheet.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';


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
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-activities',
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
  templateUrl: './project-activities.component.html',
  styleUrl: './project-activities.component.scss'
})
export class ProjectActivitiesComponent implements OnInit {

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
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

  teamMembers = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel', 'Arun Joseph', 'Lakshmi Devi', 'Deepa Nair', 'Harish Babu'];
  statuses = ['Pending', 'Allocation', 'Progress', 'In Progress', 'Testing', 'Review', 'Hold', 'Cancelled', 'Completed'];
  priorities = ['Critical', 'High', 'Medium', 'Low'];
  complexities = ['Very High', 'High', 'Medium', 'Low'];

  readonly delayReasonOptions: string[] = [
    'Raw Material / Component Shortage',
    'Safety / Statutory Inspection Pending',
    'OEM Vendor Dispatch Delay',
  ];

  readonly historySequence: number[] = [3, 5, 3, 2, 1, 6, 8, 3, 5, 2, 4, 7, 3, 6, 1, 5, 8, 2, 4, 3];
  readonly documentsSequence: number[] = [4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 2, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
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

    this.getAllProjects();
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
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/001',
        Stage: 'S1',
        PercentCompletion: 100,
        Deliverable: 'Plant Needs & Capacity Opportunity Assessment',
        TaskName: 'Plant Throughput & Bottleneck Assessment',
        TaskType: 'Engineering',
        Responsibility: 'Ananya Rao',
        Duration: '5 days',
        Effort: '20',
        Description: 'Evaluate shop-floor assembly bottlenecks and target equipment cycle times.',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-10',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-10',
        ETA: '2026-01-10',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Industrial Scope Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/002',
        Stage: 'S2',
        PercentCompletion: 100,
        Deliverable: 'Operational Requirements & Functional Spec',
        TaskName: 'User Requirements Specification (URS) Definition',
        TaskType: 'Engineering',
        Responsibility: 'Rajesh Kumar',
        Duration: '8 days',
        Effort: '32',
        Description: 'Define OEE >= 85% targets, utilities envelope, and ISO 13849 safety limits.',
        PlanStart: '2026-01-12',
        PlanEnd: '2026-01-20',
        ActualStart: '2026-01-12',
        ActualEnd: '2026-01-20',
        ETA: '2026-01-20',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'URS Engineering Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/003',
        Stage: 'S3',
        PercentCompletion: 85,
        Deliverable: 'Equipment Architecture & Plant Layout Concepts',
        TaskName: 'Automation & PLC Architecture Concept Design',
        TaskType: 'Controls',
        Responsibility: 'Priya Reddy',
        Duration: '12 days',
        Effort: '48',
        Description: 'Architect SCADA telemetry, emergency-stop safety relays, and HMI flow.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-15',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-15',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'PLC Architecture Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/004',
        Stage: 'S4',
        PercentCompletion: 60,
        Deliverable: 'Mechanical, Structural & CAD Engineering Package',
        TaskName: '3D CAD Assembly & Structural Stress Analysis',
        TaskType: 'Mechanical Design',
        Responsibility: 'Anita Desai',
        Duration: '14 days',
        Effort: '64',
        Description: 'Complete gantry finite element load modeling and GD&T stack-up.',
        PlanStart: '2026-03-01',
        PlanEnd: '2026-03-18',
        ActualStart: '2026-03-01',
        ActualEnd: '',
        ETA: '2026-03-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'CAD Mechanical Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/005',
        Stage: 'S5',
        PercentCompletion: 40,
        Deliverable: 'Design Verification & HAZOP Risk Assessment',
        TaskName: 'Design FMEA & Machine Safety HAZOP Review',
        TaskType: 'Compliance',
        Responsibility: 'Amit Patel',
        Duration: '6 days',
        Effort: '24',
        Description: 'Mitigate failure modes above RPN 100 and lock safety circuit logic.',
        PlanStart: '2026-04-01',
        PlanEnd: '2026-04-08',
        ActualStart: '2026-04-02',
        ActualEnd: '',
        ETA: '2026-04-09',
        Status: 'Testing',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'FMEA Audit Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/006',
        Stage: 'S6',
        PercentCompletion: 35,
        Deliverable: 'Long-Lead Equipment Procurement Package',
        TaskName: 'OEM Supplier Technical Evaluation & PO Release',
        TaskType: 'Procurement',
        Responsibility: 'Suresh Naidu',
        Duration: '10 days',
        Effort: '40',
        Description: 'Issue turnkey POs for 5-axis CNC machining center and robotic weld cells.',
        PlanStart: '2026-05-01',
        PlanEnd: '2026-05-12',
        ActualStart: '2026-05-01',
        ActualEnd: '',
        ETA: '2026-05-14',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'OEM Procurement Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/007',
        Stage: 'S7',
        PercentCompletion: 20,
        Deliverable: 'Prototype Fabrication & FAT Witness Validation',
        TaskName: 'Factory Acceptance Test (FAT) Witness Trials',
        TaskType: 'Qualification',
        Responsibility: 'Deepa Nair',
        Duration: '10 days',
        Effort: '50',
        Description: 'Run dry-cycle endurance, Cpk capability, and interlock trip trials at OEM.',
        PlanStart: '2026-06-10',
        PlanEnd: '2026-06-22',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-06-24',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'FAT Protocol Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/008',
        Stage: 'S8',
        PercentCompletion: 15,
        Deliverable: 'Site Foundation & Utility Tie-In Preparation',
        TaskName: 'Shop-Floor Foundation & 480V Utility Readiness',
        TaskType: 'Facilities',
        Responsibility: 'Arun Joseph',
        Duration: '10 days',
        Effort: '60',
        Description: 'Verify concrete vibration isolation pad, compressed air, and chilled water drops.',
        PlanStart: '2026-07-15',
        PlanEnd: '2026-07-26',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-07-28',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Site Readiness Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/009',
        Stage: 'S9',
        PercentCompletion: 0,
        Deliverable: 'Mechanical Rigging & SCADA Integration',
        TaskName: 'Precision Laser Alignment & Line Integration',
        TaskType: 'Installation',
        Responsibility: 'Lakshmi Devi',
        Duration: '12 days',
        Effort: '72',
        Description: 'Rig capital machinery onto bay anchors and connect OPC-UA SCADA nodes.',
        PlanStart: '2026-08-10',
        PlanEnd: '2026-08-22',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-08-24',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Rigging & Integration Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/010',
        Stage: 'S10',
        PercentCompletion: 0,
        Deliverable: 'Commissioning & Site Acceptance Test Package',
        TaskName: 'Full-Load SAT Performance & OEE Endurance Run',
        TaskType: 'Commissioning',
        Responsibility: 'Harish Babu',
        Duration: '14 days',
        Effort: '84',
        Description: 'Validate 72-hour multi-shift SAT production rate >= 120 units/hr.',
        PlanStart: '2026-09-15',
        PlanEnd: '2026-09-29',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-10-01',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'SAT Commissioning Template'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/011',
        Stage: 'S11',
        PercentCompletion: 0,
        Deliverable: 'Operational Qualification & Plant Handover',
        TaskName: 'CMMS Preventive Maintenance & Operator SOP Handover',
        TaskType: 'Handover',
        Responsibility: 'Ananya Rao',
        Duration: '6 days',
        Effort: '32',
        Description: 'Finalize critical spares min/max inventory and LOTO operator certification.',
        PlanStart: '2026-10-15',
        PlanEnd: '2026-10-22',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-10-22',
        Status: 'Pending',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Operations Handover Template'
      }
    ];

    const taskCounts = ['4/13', '1/13', '8/13', '6/13', '10/13', '7/13', '9/13', '11/13', '5/13', '2/13', '12/13', '3/13', '4/13', '8/13'];
    const reqCounts = ['5/9', '2/9', '7/9', '4/9', '6/9', '8/9', '3/9', '5/9', '1/9', '7/9', '4/9', '2/9', '6/9', '5/9'];
    const defaultUpdaters = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu'];
    const defaultDates = ['2026-02-15', '2026-03-01', '2026-03-12', '2026-04-05', '2026-05-20'];
    const delayReasons = this.delayReasonOptions;
    this.rawProjects = mockData.map((item, idx) => ({
      ...item,
      historyCount: this.getHistoryCount(idx),
      documentsCount: this.getDocumentsCount(idx),
      updatedDate: item.updatedDate ?? defaultDates[idx % defaultDates.length],
      updatedBy: item.updatedBy ?? item.Responsibility ?? defaultUpdaters[idx % defaultUpdaters.length],
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

  openProject(item: ProjectActivityItem): void {
    this.router.navigate(['/app/testing/projects/dashboard/analytics'], {
      queryParams: { code: item.ProjectCode || this.projectCode, name: item.ProjectName || this.projectName }
    });
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
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
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
    this.router.navigate(['/projects/dashboard/analytics']);
  }


  onTasksClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/tasks'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        tasks: item.Tasks ?? item.tasks ?? '0/13',
        source: 'activities'
      }
    });
  }

  onRequirementsClick(item: ProjectActivityItem): void {
    this.router.navigate(['/projects/dashboard/wbs/requirements'], {
      queryParams: {
        activityName: item.TaskName,
        jobCode: item.ProjectCode,
        stageName: item.Stage || item.stage || 'S1',
        projectName: this.projectName,
        projectCode: this.projectCode,
        requirements: item.Requirements ?? item.requirements ?? item.activities ?? '0/9',
        source: 'activities'
      }
    });
  }



  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

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

  openHistory(item?: any): void {
    const act = typeof item === 'object' && item !== null ? item : { TaskName: item };
    this.router.navigate(['/projects/dashboard/activities/history'], {
      queryParams: {
        activityName: act.TaskName || act.activityName,
        delayReason: act.delayReason,
        stage: act.Stage || act.stage,
        deliverable: act.Deliverable || act.deliverable,
        responsibility: act.Responsibility || act.responsibility,
        startDate: act.PlanStart || act.startDate,
        duration: act.Duration || act.duration,
        effort: act.Effort || act.effort,
        status: act.Status || act.status,
        priority: act.Priority || act.priority,
        complexity: act.Complexity || act.complexity,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
