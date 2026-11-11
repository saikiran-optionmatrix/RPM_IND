import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddProjActivityComponent } from '../../projects/project-dashboard/project-activities/add-proj-activity/add-proj-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface ActivityTask {
  IsActive: boolean;
  ProjectName: string;
  ProjectCode: string;
  Stage?: string;       // <--- Added for Stage column
  Module?: string;      // <--- Added for Deliverable column
  PercentCompletion: number;
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
  delayReason?: string;
}

export interface CalendarCard {
  hour: string;
  user: string;
  dayPlacement: number;
  taskName: string;
  projectName: string;
  status: string;
  planStart: string;
  color: string;
  pInitials: string;
}

@Component({
  selector: 'app-monitor-activities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule
],
  templateUrl: './monitor-activities.component.html',
  styleUrls: ['./monitor-activities.component.scss']
})
export class MonitorActivitiesComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  // View & Toggle States
  showFilter: boolean = false;
  isCalendarView: boolean = false;
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  isOverdueOnly: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5]; // Default: Mon-Fri

  // Modal States
  showTimelineModal: boolean = false;
  selectedTimelineTask: ActivityTask | null = null;

  // Data Arrays
  rawProjects: ActivityTask[] = [];
  allProjects: ActivityTask[] = [];
  calendarCards: CalendarCard[] = [];

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalSize: number = 0;

  // Permissions
  readonly canUpdate: boolean = true;
  readonly canDelete: boolean = true;

  // Clock
  currentTime: string = '';
  private timeInterval: any;

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectName: [null],
    DateType: [null],
    FromDate: [null],
    ToDate: [null],
    Status: [null],
    Priority: [null],
    Complexity: [null],
    ActiveOnly: [false]
  });

  // Master Lists
  readonly hoursList: string[] = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];

  ngOnInit(): void {
    this.getAllProjects();
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 60000);

    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.overdueSub?.unsubscribe();
  }

getAllProjects(): void {
    const mockData = [
      {
        IsActive: true,
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        ProjectCode: '2026/RD/001',
        Stage: 'Opportunity and Portfolio Assessment',
        Module: 'Therapeutic area and market opportunity assessment',
        PercentCompletion: 100,
        TaskName: 'Standard-of-care, unmet medical needs and competitive landscape analysis',
        TaskType: 'Planning',
        Responsibility: 'Dr. Sarah Jenkins',
        Duration: '10 days',
        Effort: '80',
        Description: 'Analyze competing SGLT2 inhibitor therapies, efficacy endpoints and patient adherence patterns.',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-14',
        ETA: '2026-01-14',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Oral Solid Dosage (OSD) Template'
      },
      {
        IsActive: true,
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        ProjectCode: '2026/RD/001',
        Stage: 'Opportunity and Portfolio Assessment',
        Module: 'Product concept, patent landscape and preliminary risk screening',
        PercentCompletion: 75,
        TaskName: 'Patent landscape, exclusivity dates and freedom-to-operate review',
        TaskType: 'Regulatory',
        Responsibility: 'Rajesh Kumar',
        Duration: '12 days',
        Effort: '96',
        Description: 'Review Orange Book listed formulation patents, crystal form exclusivities and Paragraph IV challenge feasibility.',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-28',
        ActualStart: '2026-01-16',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Oral Solid Dosage (OSD) Template',
        delayReason: 'Innovator Polymorph Patent Filing Review'
      },
      {
        IsActive: true,
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        ProjectCode: '2026/RD/001',
        Stage: 'Formulation and Product Concept Development',
        Module: 'Pre-formulation and API-excipient compatibility',
        PercentCompletion: 40,
        TaskName: 'Excipient compatibility screening and binary blend stability studies',
        TaskType: 'R&D',
        Responsibility: 'Anita Desai',
        Duration: '15 days',
        Effort: '120',
        Description: 'Conduct DSC, FTIR and isothermal binary blend stability studies for binder and disintegrant compatibility.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-15',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'Oral Solid Dosage (OSD) Template',
        delayReason: 'Binary Blend HPLC Column Equilibration'
      },
      {
        IsActive: true,
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        ProjectCode: '2026/RD/002',
        Stage: 'Product Definition and Project Charter',
        Module: 'Target product profile and reference product characterization',
        PercentCompletion: 100,
        TaskName: 'Reference listed drug (RLD) procurement, characterization and reverse engineering',
        TaskType: 'Planning',
        Responsibility: 'Priya Reddy',
        Duration: '10 days',
        Effort: '60',
        Description: 'Characterize multiple innovator tablet lots for extended-release polymer matrix dissolution and core hardness.',
        PlanStart: '2026-01-10',
        PlanEnd: '2026-01-20',
        ActualStart: '2026-01-10',
        ActualEnd: '2026-01-19',
        ETA: '2026-01-19',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Oral Solid Dosage (OSD) Template'
      },
      {
        IsActive: true,
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        ProjectCode: '2026/RD/002',
        Stage: 'Product Definition and Project Charter',
        Module: 'Regulatory pathway and intellectual property strategy',
        PercentCompletion: 60,
        TaskName: 'Target regulatory submission pathway, agency guidance and pharmacopoeial requirements',
        TaskType: 'Regulatory',
        Responsibility: 'Suresh Naidu',
        Duration: '8 days',
        Effort: '48',
        Description: 'Compile FDA bioequivalence guidance, dissolution apparatus qualification, and USP monograph requirements.',
        PlanStart: '2026-01-22',
        PlanEnd: '2026-01-30',
        ActualStart: '2026-01-22',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Oral Solid Dosage (OSD) Template',
        delayReason: 'FDA Controlled Correspondence Clarification'
      },
      {
        IsActive: false,
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        ProjectCode: '2026/RD/002',
        Stage: 'Formulation and Product Concept Development',
        Module: 'Prototype formulation and concept selection',
        PercentCompletion: 20,
        TaskName: 'Prototype formulation design, preparation and in-vitro characterization',
        TaskType: 'R&D',
        Responsibility: 'Amit Patel',
        Duration: '14 days',
        Effort: '110',
        Description: 'Formulate hydrophilic polymer matrix prototypes with variable hypromellose ratios for 24-hour release.',
        PlanStart: '2026-02-05',
        PlanEnd: '2026-02-19',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-02-22',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Oral Solid Dosage (OSD) Template'
      },
      {
        IsActive: true,
        ProjectName: 'Pantoprazole Gastro-Resistant Tablets',
        ProjectCode: '2026/RD/003',
        Stage: 'Formulation and Product Concept Development',
        Module: 'Prototype formulation and concept selection',
        PercentCompletion: 90,
        TaskName: 'Prototype formulation design, preparation and in-vitro characterization',
        TaskType: 'R&D',
        Responsibility: 'Dr. Sarah Jenkins',
        Duration: '12 days',
        Effort: '90',
        Description: 'Optimize enteric polymer sub-coating and methacrylic acid copolymer enteric film barrier.',
        PlanStart: '2026-01-15',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-15',
        ActualEnd: '2026-01-26',
        ETA: '2026-01-26',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Oral Solid Dosage (OSD) Template'
      },
      {
        IsActive: true,
        ProjectName: 'Ceftriaxone Powder for Injection',
        ProjectCode: '2026/RD/004',
        Stage: 'API, Excipient and Supplier Sourcing',
        Module: 'API and key starting material sourcing',
        PercentCompletion: 70,
        TaskName: 'API vendor identification, qualification and audit',
        TaskType: 'Sourcing',
        Responsibility: 'Vikram Sharma',
        Duration: '16 days',
        Effort: '128',
        Description: 'Audit sterile API crystallization facility and verify cephem antibiotic sterility testing certifications.',
        PlanStart: '2026-02-10',
        PlanEnd: '2026-02-26',
        ActualStart: '2026-02-10',
        ActualEnd: '',
        ETA: '2026-03-01',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Sterile Injectables Template',
        delayReason: 'Sterile API Vendor On-site Audit Reschedule'
      },
      {
        IsActive: true,
        ProjectName: 'Budesonide Inhalation Suspension',
        ProjectCode: '2026/RD/005',
        Stage: 'Facility, Equipment and Process Readiness',
        Module: 'Manufacturing facility and utility readiness',
        PercentCompletion: 50,
        TaskName: 'Facility HVAC, cleanroom qualification and environmental monitoring',
        TaskType: 'Engineering',
        Responsibility: 'Michael Chang',
        Duration: '15 days',
        Effort: '120',
        Description: 'Qualify aseptic suspension homogenization cleanroom suite and automated isolator filling line.',
        PlanStart: '2026-02-18',
        PlanEnd: '2026-03-05',
        ActualStart: '2026-02-18',
        ActualEnd: '',
        ETA: '2026-03-10',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Inhalation & Respiratory Template'
      }
    ];

    this.rawProjects = mockData;
    this.applyFilter();
  }

  getSliderColor(percent: number): string {
    if (percent <= 30) return '#2563eb'; // Blue
    if (percent > 30 && percent <= 80) return '#f59e0b'; // Amber
    if (percent === 100) return '#10b981'; // Green
    return '#3b82f6';
  }

  updateTime(): void {
    const now = new Date();
    const formattedHours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.currentTime = `${formattedHours}:${minutes} ${now.getHours() >= 12 ? "PM" : "AM"}`;
  }

  // --- Filtering & Pagination ---

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onClear(): void {
    this.filterForm.reset();
    this.excludeCompleted = false;
    this.isOverdueOnly = false;
    this.currentPage = 0;
    this.applyFilter();
  }

  onExcludeCompletedChange(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  onOverdueChange(): void {
    this.currentPage = 0;
    this.monitorStateService.setOverdue(this.isOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.isOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    let filtered = [...this.rawProjects];

    if (this.excludeCompleted) {
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(p => p.Status !== 'Completed' && p.PercentCompletion !== 100 && !!p.PlanEnd && p.PlanEnd < today);
    }

    // Add additional logic here to filter using this.filterForm.value

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.allProjects = filtered.slice(start, start + this.pageSize);
    this.generateCalendarData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  isDateExceeded(item: ActivityTask): boolean {
    if (item.Status === 'Completed' || item.PercentCompletion === 100) {
      return false;
    }
    if (!item.PlanEnd) {
      return false;
    }
    const today = new Date().toISOString().split('T')[0];
    return item.PlanEnd < today;
  }

  // --- View Toggles ---

  showCalendarView(): void { this.isCalendarView = true; }
  showGridView(): void { this.isCalendarView = false; }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const statusColors: Record<string, string> = {
      'Completed': '#a0e4ff',
      'Progress': '#ffea9f',
      'Hold': '#ffcdd2',
      'Pending': '#e3b2ff'
    };

    const daysToDistribute = this.showWeekend ? 7 : 5;

    this.calendarCards = this.allProjects.map((project, i) => ({
      hour: this.hoursList[i % this.hoursList.length],
      user: project.Responsibility,
      dayPlacement: (i % daysToDistribute) + 1,
      taskName: project.TaskName,
      projectName: project.ProjectName,
      status: project.Status,
      planStart: project.PlanStart,
      color: statusColors[project.Status] || '#d1fae5',
      pInitials: project.TaskName.substring(0, 2).toUpperCase()
    }));
  }

  // --- Actions ---

  // onAddTask(): void {
  //   this.dialog.open(AddProjActivityComponent, { width: '900px', maxWidth: '95vw', data: { isEditMode: false } });
  // }

  onEditTask(item: ActivityTask): void {
    const dialogRef = this.dialog.open(AddProjActivityComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        ...item,
        Deliverable: item.Module || (item as any).Deliverable || 'Module1',
        Stage: item.Stage || 'Feasibility',
        isEditMode: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(item, {
          TaskName: result.TaskName || item.TaskName,
          Module: result.Deliverable || item.Module,
          Stage: result.stage || item.Stage,
          Description: result.Description !== undefined ? result.Description : item.Description,
          Status: result.Status || item.Status,
          PlanStart: result.PlanStart || item.PlanStart,
          PlanEnd: result.PlanEnd || item.PlanEnd,
          ActualStart: result.ActualStart || item.ActualStart,
          ActualEnd: result.ActualEnd || item.ActualEnd,
          Duration: result.planDuration || item.Duration,
          Effort: result.planEffort || item.Effort
        });
        this.generateCalendarData();
        this.applyFilter();
      }
    });
  }

  onDeleteTask(item: ActivityTask): void {
    if (!this.canDelete) return;

    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawProjects = this.rawProjects.filter(p => p !== item);
        this.applyFilter();
      }
    });
  }

  // onStatusToggle(item: ActivityTask): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: { title: 'Change Status', content: 'Are you sure you want to Change the Status?' }
  //   });
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (!confirmed) {
  //       item.IsActive = !item.IsActive; // Revert change
  //     }
  //     this.generateCalendarData();
  //   });
  // }

  // openGridView(): void {
  //   this.dialog.open(FreezepanesDialogComponent, { width: 'auto', height: 'auto' });
  // }

  openProject(item: ActivityTask): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  openPdf(fileName: string): void {
    window.open(`assets/${fileName}`, '_blank');
  }

  // --- Timeline Modal ---

  openTimelineModal(task: ActivityTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  scrollLeft(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer?.nativeElement) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
