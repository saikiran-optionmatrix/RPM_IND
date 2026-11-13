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
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/001',
        Stage: 'S1 - Business Need & Opportunity Assessment',
        Module: 'Plant requirements and existing equipment analysis',
        PercentCompletion: 100,
        TaskName: 'Plant capacity audit and existing line bottleneck benchmarking',
        TaskType: 'Planning',
        Responsibility: 'Ananya Rao',
        Duration: '10 days',
        Effort: '80',
        Description: 'Evaluate plant throughput targets, line takt time, OEE losses, and existing CNC/conveyor capacity constraints.',
        PlanStart: '2026-01-05',
        PlanEnd: '2026-01-15',
        ActualStart: '2026-01-05',
        ActualEnd: '2026-01-14',
        ETA: '2026-01-14',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'Industrial Equipment Line Expansion Program'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/001',
        Stage: 'S1 - Business Need & Opportunity Assessment',
        Module: 'Project economics and execution risk screening',
        PercentCompletion: 75,
        TaskName: 'Patent freedom-to-operate clearance and CapEx ROI sensitivity check',
        TaskType: 'Compliance',
        Responsibility: 'Rajesh Kumar',
        Duration: '12 days',
        Effort: '96',
        Description: 'Review proprietary tooling patents, controller licensing IP, and validate capital payback model.',
        PlanStart: '2026-01-16',
        PlanEnd: '2026-01-28',
        ActualStart: '2026-01-16',
        ActualEnd: '',
        ETA: '2026-01-30',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Industrial Equipment Line Expansion Program',
        delayReason: 'Tier-1 OEM Structural Data Generation Delay'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Equipment Line Expansion',
        ProjectCode: '2026/IND/001',
        Stage: 'S3 - Concept Engineering & Solution Development',
        Module: '3D CAD layout & control architecture',
        PercentCompletion: 40,
        TaskName: 'Spindle drive thermal simulation and EtherCAT bus topology design',
        TaskType: 'Engineering',
        Responsibility: 'Anita Desai',
        Duration: '15 days',
        Effort: '120',
        Description: 'Complete cooling manifold CFD analysis, structural FEA load modeling, and PLC I/O architecture layout.',
        PlanStart: '2026-02-01',
        PlanEnd: '2026-02-15',
        ActualStart: '2026-02-01',
        ActualEnd: '',
        ETA: '2026-02-18',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'Very High',
        Template: 'Industrial Equipment Line Expansion Program',
        delayReason: 'Cooling Manifold CFD Iteration & Drive Sizing Review'
      },
      {
        IsActive: true,
        ProjectName: 'CNC Machining Process Optimization',
        ProjectCode: '2026/IND/002',
        Stage: 'S2 - Project Scope & Feasibility Validation',
        Module: 'URS & critical-to-quality tolerance spec',
        PercentCompletion: 100,
        TaskName: 'Multi-axis spindle accuracy benchmarking and GD&T tolerance cascade',
        TaskType: 'Planning',
        Responsibility: 'Priya Reddy',
        Duration: '10 days',
        Effort: '60',
        Description: 'Benchmark ISO 230-2 positioning accuracy and define datum schemes across roughing and finishing cells.',
        PlanStart: '2026-01-10',
        PlanEnd: '2026-01-20',
        ActualStart: '2026-01-10',
        ActualEnd: '2026-01-19',
        ETA: '2026-01-19',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'Medium',
        Template: 'CNC Machining Line Capacity Expansion'
      },
      {
        IsActive: true,
        ProjectName: 'CNC Machining Process Optimization',
        ProjectCode: '2026/IND/002',
        Stage: 'S2 - Project Scope & Feasibility Validation',
        Module: 'Safety, CE / ISO & statutory compliance roadmap',
        PercentCompletion: 60,
        TaskName: 'Machine guarding PLd risk assessment and CE / UL 508A panel audit',
        TaskType: 'Compliance',
        Responsibility: 'Suresh Naidu',
        Duration: '8 days',
        Effort: '48',
        Description: 'Compile ISO 12100 machinery hazard matrix, E-stop stopping time envelope, and BIS safety permit checklist.',
        PlanStart: '2026-01-22',
        PlanEnd: '2026-01-30',
        ActualStart: '2026-01-22',
        ActualEnd: '',
        ETA: '2026-02-05',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'CNC Machining Line Capacity Expansion',
        delayReason: 'TUV / Third-Party Safety Audit Slot Unavailable'
      },
      {
        IsActive: false,
        ProjectName: 'CNC Machining Process Optimization',
        ProjectCode: '2026/IND/002',
        Stage: 'S3 - Concept Engineering & Solution Development',
        Module: 'Control architecture and automation allocation',
        PercentCompletion: 20,
        TaskName: 'PLC / SCADA HMI screen architecture and alarm interlock definition',
        TaskType: 'Engineering',
        Responsibility: 'Amit Patel',
        Duration: '14 days',
        Effort: '110',
        Description: 'Define EtherNet/IP servo drive handshakes, fault recovery sequences, and MES telemetry tags.',
        PlanStart: '2026-02-05',
        PlanEnd: '2026-02-19',
        ActualStart: '',
        ActualEnd: '',
        ETA: '2026-02-22',
        Status: 'Pending',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'CNC Machining Line Capacity Expansion'
      },
      {
        IsActive: true,
        ProjectName: 'Automated Packaging Line Development',
        ProjectCode: '2026/IND/003',
        Stage: 'S3 - Concept Engineering & Solution Development',
        Module: 'Workcell ergonomics and robotic reach simulation',
        PercentCompletion: 90,
        TaskName: 'Robotic palletizer reach envelope and conveyor buffer optimization',
        TaskType: 'Engineering',
        Responsibility: 'Ananya Rao',
        Duration: '12 days',
        Effort: '90',
        Description: 'Optimize 6-axis case packer cycle rate, vacuum EOAT payload margin, and inline checkweigher layout.',
        PlanStart: '2026-01-15',
        PlanEnd: '2026-01-27',
        ActualStart: '2026-01-15',
        ActualEnd: '2026-01-26',
        ETA: '2026-01-26',
        Status: 'Completed',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Automated Production Line Upgrade Program'
      },
      {
        IsActive: true,
        ProjectName: 'High-Pressure Centrifugal Pump Assembly',
        ProjectCode: '2026/IND/004',
        Stage: 'S5 - Concept Selection & Design Freeze',
        Module: 'Make-or-buy & Tier-1 component supplier qualification',
        PercentCompletion: 70,
        TaskName: 'Mechanical seal OEM qualification and hydrostatic casting plant audit',
        TaskType: 'Sourcing',
        Responsibility: 'Vikram Singh',
        Duration: '16 days',
        Effort: '128',
        Description: 'Audit duplex stainless foundry vendor and verify API 610 hydrostatic casing pressure test certifications.',
        PlanStart: '2026-02-10',
        PlanEnd: '2026-02-26',
        ActualStart: '2026-02-10',
        ActualEnd: '',
        ETA: '2026-03-01',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'High',
        Template: 'Industrial Control System Development',
        delayReason: 'Casting Foundry Non-Destructive (NDT) Audit Reschedule'
      },
      {
        IsActive: true,
        ProjectName: 'Oil-Free Rotary Screw Compressor System',
        ProjectCode: '2026/IND/005',
        Stage: 'S8 - Installation Planning & Site Installation Readiness',
        Module: 'Plant utilities & foundation pad readiness',
        PercentCompletion: 50,
        TaskName: 'Vibration-isolated concrete pad, 480V busway & cooling loop readiness',
        TaskType: 'Engineering',
        Responsibility: 'Deepa Nair',
        Duration: '15 days',
        Effort: '120',
        Description: 'Qualify compressed-air receiver skid location, acoustic enclosure ventilation, and PLC plant SCADA drop.',
        PlanStart: '2026-02-18',
        PlanEnd: '2026-03-05',
        ActualStart: '2026-02-18',
        ActualEnd: '',
        ETA: '2026-03-10',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'Industrial Compressor Platform Development'
      },
      {
        IsActive: true,
        ProjectName: 'CNC Machining Line Capacity Expansion',
        ProjectCode: '2026/IND/006',
        Stage: 'S4 - Detailed Engineering & Design Optimization',
        Module: 'Spindle Fixture & Tool Magazine Architecture',
        PercentCompletion: 65,
        TaskName: '120-pocket ATC tool magazine layout and pallet shuttle structural FEA',
        TaskType: 'Engineering',
        Responsibility: 'Ananya Rao',
        Duration: '14 days',
        Effort: '112',
        Description: 'Verify dual-pallet FMS floor footprint, hydraulic clamping pressure, and coolant chip auger sizing.',
        PlanStart: '2026-02-20',
        PlanEnd: '2026-03-06',
        ActualStart: '2026-02-20',
        ActualEnd: '',
        ETA: '2026-03-09',
        Status: 'In Progress',
        Priority: 'High',
        Complexity: 'High',
        Template: 'CNC Machining Line Capacity Expansion',
        delayReason: 'Hydraulic Chuck Clamp Lead-Time Review'
      },
      {
        IsActive: true,
        ProjectName: 'Industrial Pump Assembly Line Upgrade',
        ProjectCode: '2026/IND/007',
        Stage: 'S6 - Process Engineering & Equipment Design',
        Module: 'Hydrostatic Test Loop & Balancing Rig',
        PercentCompletion: 35,
        TaskName: 'Closed-loop impeller balancing & 1.5x pressure test stand engineering',
        TaskType: 'Design',
        Responsibility: 'Rajesh Kumar',
        Duration: '18 days',
        Effort: '144',
        Description: 'Design quick-seal clamping fixture and calibrated pressure transducer manifold for API 610 loop.',
        PlanStart: '2026-02-24',
        PlanEnd: '2026-03-14',
        ActualStart: '2026-02-25',
        ActualEnd: '',
        ETA: '2026-03-18',
        Status: 'In Progress',
        Priority: 'Critical',
        Complexity: 'Very High',
        Template: 'Commercial Production Line Transfer & Ramp-Up',
        delayReason: 'Calibration Traceability Lab Slot Unavailable'
      },
      {
        IsActive: true,
        ProjectName: 'Factory Utilities & Material Handling Upgrade',
        ProjectCode: '2026/IND/008',
        Stage: 'S2 - Project Scope & Feasibility Validation',
        Module: 'Plant Compressed Air & Chilled Water Balance',
        PercentCompletion: 80,
        TaskName: 'Compressed air ring-main pressure drop & chilled water loop flow audit',
        TaskType: 'Engineering',
        Responsibility: 'Anita Desai',
        Duration: '12 days',
        Effort: '96',
        Description: 'Model peak shift air/chiller kW demand and size redundant N+1 variable-speed air receiver banks.',
        PlanStart: '2026-02-12',
        PlanEnd: '2026-02-24',
        ActualStart: '2026-02-12',
        ActualEnd: '',
        ETA: '2026-02-27',
        Status: 'In Progress',
        Priority: 'Medium',
        Complexity: 'Medium',
        Template: 'Industrial Equipment & Plant Engineering'
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

    const { Keyword, ProjectName, Status, Priority, Complexity } = this.filterForm.value;
    if (Keyword && Keyword.trim()) {
      const kw = Keyword.trim().toLowerCase();
      filtered = filtered.filter(p =>
        (p.TaskName || '').toLowerCase().includes(kw) ||
        (p.ProjectName || '').toLowerCase().includes(kw) ||
        (p.ProjectCode || '').toLowerCase().includes(kw) ||
        (p.Stage || '').toLowerCase().includes(kw) ||
        (p.Module || '').toLowerCase().includes(kw) ||
        (p.Responsibility || '').toLowerCase().includes(kw)
      );
    }
    if (ProjectName && ProjectName.trim()) {
      const pn = ProjectName.trim().toLowerCase();
      filtered = filtered.filter(p => (p.ProjectName || '').toLowerCase().includes(pn));
    }
    if (Status && Status !== 'null') {
      filtered = filtered.filter(p => p.Status === Status);
    }
    if (Priority && Priority !== 'null') {
      filtered = filtered.filter(p => p.Priority === Priority);
    }
    if (Complexity && Complexity !== 'null') {
      filtered = filtered.filter(p => p.Complexity === Complexity);
    }

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
