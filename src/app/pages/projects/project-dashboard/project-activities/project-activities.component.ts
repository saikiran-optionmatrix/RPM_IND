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

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
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

  teamMembers = ['Alice Johnson', 'Robert Smith', 'Clara Davis', 'Daniel Martinez', 'Evelyn Wright', 'Sophia Carter', 'Michael Johnson', 'Daniel Wilson', 'Emma Thompson', 'Olivia Martinez'];
  statuses = ['Pending', 'Allocation', 'Progress', 'In Progress', 'Testing', 'Review', 'Hold', 'Cancelled', 'Completed'];
  priorities = ['Critical', 'High', 'Medium', 'Low'];
  complexities = ['Very High', 'High', 'Medium', 'Low'];

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
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
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202605/Engg/001',
        Stage: 'S1',
        PercentCompletion: 100,
        Deliverable: 'API & Raw Material Assessment',
        TaskName: 'API & Product Assessment',
        TaskType: 'Development',
        Responsibility: 'Alice Johnson',
        Duration: '5 days',
        Effort: '20',
        Description: 'Implement the new dashboard UI layout.',
        PlanStart: '2025-01-01',
        PlanEnd: '2025-01-05',
        ActualStart: '2025-01-01',
        ActualEnd: '2025-01-06',
        ETA: '2025-01-06',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Dev Template v1'
      },
      {
        IsActive: false,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202605/Engg/002',
        Stage: 'S1',
        PercentCompletion: 45,
        Deliverable: 'Preformulation & Compatibility',
        TaskName: 'Preformulation & Feasibility',
        TaskType: 'Maintenance',
        Responsibility: 'Robert Smith',
        Duration: '3 days',
        Effort: '12',
        Description: 'Optimize slow running queries in production.',
        PlanStart: '2025-01-07',
        PlanEnd: '2025-01-09',
        ActualStart: '2025-01-08',
        ActualEnd: '',
        ETA: '2025-01-10',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'DB Task Template'
      },
      {
        IsActive: true,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202605/Tech/003',
        Stage: 'S2',
        PercentCompletion: 10,
        Deliverable: 'Formula Design & Excipients',
        TaskName: 'Formulation Development',
        TaskType: 'Documentation',
        Responsibility: 'Clara Davis',
        Duration: '2 days',
        Effort: '8',
        Description: 'Draft new sections for the v2.0 release features.',
        PlanStart: '2025-01-10',
        PlanEnd: '2025-01-11',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2025-01-12',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Doc Template Standard'
      },
      {
        IsActive: true,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202605/QA/004',
        Stage: 'S2',
        PercentCompletion: 60,
        Deliverable: 'Analytical Method Development',
        TaskName: 'Analytical Method Development',
        TaskType: 'Testing',
        Responsibility: 'Daniel Martinez',
        Duration: '4 days',
        Effort: '16',
        Description: 'Test all third-party API integrations for the new release.',
        PlanStart: '2025-01-13',
        PlanEnd: '2025-01-16',
        ActualStart: '2025-01-13',
        ActualEnd: '',
        ETA: '2025-01-17',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'QA Template v2'
      },
      {
        IsActive: false,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/Sec/001',
        Stage: 'S3',
        PercentCompletion: 0,
        Deliverable: 'Finished Product QC Testing',
        TaskName: 'Stability Studies',
        TaskType: 'Compliance',
        Responsibility: 'Evelyn Wright',
        Duration: '6 days',
        Effort: '24',
        Description: 'Conduct a full security audit on the production environment.',
        PlanStart: '2025-01-18',
        PlanEnd: '2025-01-23',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2025-01-24',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Security Audit Template'
      },
      {
        IsActive: true,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/CPR/002',
        Stage: 'S3',
        PercentCompletion: 45,
        Deliverable: 'Prototype Trial Batches',
        TaskName: 'Pilot Batch Manufacturing',
        TaskType: 'Design',
        Responsibility: 'Sophia Carter',
        Duration: '8 days',
        Effort: '40',
        Description: 'Design responsive user interface for the customer portal.',
        PlanStart: '2025-02-01',
        PlanEnd: '2025-02-08',
        ActualStart: '2025-02-01',
        ActualEnd: '',
        ETA: '2025-02-10',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'UI Design Template'
      },
      {
        IsActive: false,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/IMS/003',
        Stage: 'S4',
        PercentCompletion: 100,
        Deliverable: 'Comparative Dissolution Study',
        TaskName: 'Bioequivalence Study',
        TaskType: 'Development',
        Responsibility: 'Michael Johnson',
        Duration: '5 days',
        Effort: '30',
        Description: 'Create database schema and optimize indexes.',
        PlanStart: '2025-02-10',
        PlanEnd: '2025-02-14',
        ActualStart: '2025-02-10',
        ActualEnd: '2025-02-14',
        ETA: '2025-02-14',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Database Setup Template'
      },
      {
        IsActive: true,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/HRM/004',
        Stage: 'S4',
        PercentCompletion: 20,
        Deliverable: 'eCTD Dossier Preparation',
        TaskName: 'Regulatory Documentation',
        TaskType: 'Development',
        Responsibility: 'Daniel Wilson',
        Duration: '10 days',
        Effort: '60',
        Description: 'Develop secure employee authentication and authorization.',
        PlanStart: '2025-02-15',
        PlanEnd: '2025-02-24',
        ActualStart: '2025-02-16',
        ActualEnd: '',
        ETA: '2025-02-26',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Authentication Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/MBA/005',
        Stage: 'S5',
        PercentCompletion: 75,
        Deliverable: 'Scale-Up & Process Validation',
        TaskName: 'Scale-Up & Validation',
        TaskType: 'Integration',
        Responsibility: 'Emma Thompson',
        Duration: '7 days',
        Effort: '42',
        Description: 'Integrate payment gateway and account services APIs.',
        PlanStart: '2025-03-01',
        PlanEnd: '2025-03-07',
        ActualStart: '2025-03-01',
        ActualEnd: '',
        ETA: '2025-03-09',
        Status: 'Pending',
        Priority: 'High',
        Complexity: 'High',
        Template: 'API Integration Template'
      },
      {
        IsActive: true,
        ProjectName: 'Generic Pharma Development',
        ProjectCode: '202606/ECW/006',
        Stage: 'S5',
        PercentCompletion: 10,
        Deliverable: 'Tech Transfer Protocol',
        TaskName: 'Technology Transfer & Launch',
        TaskType: 'Development',
        Responsibility: 'Olivia Martinez',
        Duration: '9 days',
        Effort: '36',
        Description: 'Develop product listing and filtering functionality.',
        PlanStart: '2025-03-05',
        PlanEnd: '2025-03-13',
        ActualStart: '2025-03-05',
        ActualEnd: '',
        ETA: '2025-03-15',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Catalog Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Cloud Migration',
        ProjectCode: '202606/CLD/007',
        Stage: 'S6',
        PercentCompletion: 90,
        Deliverable: 'Infrastructure Setup',
        TaskName: 'Server Migration',
        TaskType: 'Infrastructure',
        Responsibility: 'James Anderson',
        Duration: '12 days',
        Effort: '72',
        Description: 'Migrate application servers to cloud infrastructure.',
        PlanStart: '2025-03-10',
        PlanEnd: '2025-03-21',
        ActualStart: '2025-03-10',
        ActualEnd: '',
        ETA: '2025-03-23',
        Status: 'Review',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Cloud Migration Template'
      },
      {
        IsActive: true,
        ProjectName: 'AI Chatbot',
        ProjectCode: '202606/AIB/008',
        Stage: 'S6',
        PercentCompletion: 55,
        Deliverable: 'NLP & AI Core',
        TaskName: 'Intent Recognition',
        TaskType: 'AI Development',
        Responsibility: 'Lucas Brown',
        Duration: '14 days',
        Effort: '84',
        Description: 'Implement NLP-based intent recognition for chatbot.',
        PlanStart: '2025-03-15',
        PlanEnd: '2025-03-28',
        ActualStart: '2025-03-15',
        ActualEnd: '',
        ETA: '2025-03-30',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'AI Module Template'
      },
      {
        IsActive: false,
        ProjectName: 'Payroll Automation',
        ProjectCode: '202606/PAY/009',
        Stage: 'S6',
        PercentCompletion: 100,
        Deliverable: 'Payroll Calculation Engine',
        TaskName: 'Salary Calculation',
        TaskType: 'Development',
        Responsibility: 'Ava Davis',
        Duration: '6 days',
        Effort: '32',
        Description: 'Implement automated salary and tax calculations.',
        PlanStart: '2025-04-01',
        PlanEnd: '2025-04-06',
        ActualStart: '2025-04-01',
        ActualEnd: '2025-04-06',
        ETA: '2025-04-06',
        Status: 'Completed',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Payroll Template'
      }
    ];

    const taskCounts = ['4/13', '1/13', '8/13', '6/13', '10/13', '7/13', '9/13', '11/13', '5/13', '2/13', '12/13', '3/13', '4/13', '8/13'];
    const reqCounts = ['5/9', '2/9', '7/9', '4/9', '6/9', '8/9', '3/9', '5/9', '1/9', '7/9', '4/9', '2/9', '6/9', '5/9'];
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'John Doe', 'Priya Sharma', 'Michael Chang', 'Alex Rivera'];
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
