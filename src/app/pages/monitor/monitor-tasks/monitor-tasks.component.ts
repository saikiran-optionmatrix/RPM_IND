import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
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

import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ProjectWbsTasksComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-tasks/project-wbs-tasks.component';

export interface MonitorTaskItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  TaskName: string;
  ProjectName: string;
  Department: string;
  Role: string;
  DueDate: string;
  CompletedDate: string;
  Remarks?: string;
  isDateExceeded?: boolean;
  delayReason?: string;
}

@Component({
  selector: 'app-monitor-tasks',
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
  templateUrl: './monitor-tasks.component.html',
  styleUrl: './monitor-tasks.component.scss'
})
export class MonitorTasksComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  // View & Toggle States
  showFilter = false;
  excludeCompleted = false;
  isOverdueOnly = false;
  isFullKit = false;

  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalSize = 0;

  // Data
  rawTasks: MonitorTaskItem[] = [];
  paginatedTasks: MonitorTaskItem[] = [];

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    Keyword: [null],
    ProjectCode: [null],
    Department: [null],
    Role: [null],
    FromDate: [null],
    ToDate: [null],
    ActiveOnly: [false]
  });

  // Edit Modal State
  showEditModal = false;
  currentEditItem: MonitorTaskItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    TaskName: [''],
    ProjectName: [''],
    Department: [''],
    Role: [''],
    DueDate: [''],
    CompletedDate: [''],
    Remarks: [''],
    IsActive: [true],
    Done: [false]
  });

  departmentOptions: string[] = [
    'Engineering & R&D',
    'Automation & Controls',
    'Process Engineering',
    'Quality & Inspection',
    'Manufacturing & Operations',
    'Sourcing & Procurement',
    'Commissioning & Qualification',
    'EHS & Compliance',
    'Plant Facilities & Utilities',
    'Maintenance & Reliability'
  ];

  roleOptions: string[] = [
    'Lead Mechanical Engineer',
    'PLC / SCADA Controls Engineer',
    'Metrology & QC Lead',
    'EHS & Compliance Specialist',
    'Commissioning & Qualification Engineer',
    'Production Operations Manager',
    'Commodity Procurement Specialist',
    'Reliability & Maintenance Engineer'
  ];

  ngOnInit(): void {
    this.initMockTasks();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  initMockTasks(): void {
    this.rawTasks = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/001',
        TaskName: 'Existing Production Line Takt-Time & OEE Bottleneck Audit',
        ProjectName: 'Industrial Equipment Line Expansion',
        Department: 'Engineering & R&D',
        Role: 'Lead Mechanical Engineer',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Baseline cycle-time histogram and downtime Pareto validated across Shifts A–C.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/001',
        TaskName: 'Tier-1 OEM Drive & Servo Controller Cost Quote Evaluation',
        ProjectName: 'Industrial Equipment Line Expansion',
        Department: 'Sourcing & Procurement',
        Role: 'Commodity Procurement Specialist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Awaiting commercial lead-time breakdown for dual-axis servo drives and safety PLCs.',
        isDateExceeded: true,
        delayReason: 'OEM Drive & Servo Commercial Quote Pending'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/002',
        TaskName: '5-Axis Spindle Circularity & ISO 230-2 Accuracy Benchmarking',
        ProjectName: 'CNC Machining Process Optimization',
        Department: 'Quality & Inspection',
        Role: 'Metrology & QC Lead',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'Ballbar circularity within 4.5 microns and thermal drift mapped across 8-hr shift.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/IND/002',
        TaskName: 'CNC Toolpath DoE & Cutting Parameter Feed-Rate Optimization',
        ProjectName: 'CNC Machining Process Optimization',
        Department: 'Process Engineering',
        Role: 'Production Operations Manager',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Factorial DoE matrix comparing carbide insert geometry and high-pressure coolant pressure.',
        isDateExceeded: false
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/003',
        TaskName: 'Robotic Palletizer Safety Light-Curtain & PLd Interlock Audit',
        ProjectName: 'Automated Packaging Line Development',
        Department: 'EHS & Compliance',
        Role: 'EHS & Compliance Specialist',
        DueDate: '2026-02-25',
        CompletedDate: '',
        Remarks: 'Stopping-time measurement completed; perimeter guard interlock switch realignment pending.',
        isDateExceeded: true,
        delayReason: 'TUV / Third-Party Safety Audit Observation Closure Pending'
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/004',
        TaskName: 'API 610 Pump Casing Hydrostatic Pressure & NDT Inspection',
        ProjectName: 'High-Pressure Centrifugal Pump Assembly',
        Department: 'Quality & Inspection',
        Role: 'Commissioning & Qualification Engineer',
        DueDate: '2026-01-15',
        CompletedDate: '2026-01-14',
        Remarks: 'Magnetic particle and 1.5x hydrostatic test pressure hold passed with zero seepage.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/005',
        TaskName: 'ISO 8573-1 Class 0 Oil-Free Air Purity & Acoustic Spectrum Test',
        ProjectName: 'Oil-Free Rotary Screw Compressor System',
        Department: 'Commissioning & Qualification',
        Role: 'Reliability & Maintenance Engineer',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: 'Acoustic enclosure attenuation test (< 76 dBA) and variable speed drive efficiency curve ongoing.',
        isDateExceeded: false
      },
      {
        id: 8,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/006',
        TaskName: '4-Pallet FMS Shuttle Load/Unload Positioning Repeatability Check',
        ProjectName: 'CNC Machining Line Capacity Expansion',
        Department: 'Automation & Controls',
        Role: 'PLC / SCADA Controls Engineer',
        DueDate: '2026-02-10',
        CompletedDate: '2026-02-09',
        Remarks: 'Pallet zero-point taper repeatability measured within +/- 3 microns across 200 cycles.',
        isDateExceeded: false
      },
      {
        id: 9,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/007',
        TaskName: 'Closed-Loop Hydraulic Test Manifold Flow Sensor Calibration',
        ProjectName: 'Industrial Pump Assembly Line Upgrade',
        Department: 'Quality & Inspection',
        Role: 'Metrology & QC Lead',
        DueDate: '2026-02-22',
        CompletedDate: '',
        Remarks: 'NIST/NABL traceable turbine flowmeter calibration certificates awaiting third-party lab issue.',
        isDateExceeded: true,
        delayReason: 'Flowmeter Calibration Lab Certificate Delay'
      },
      {
        id: 10,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/008',
        TaskName: 'UL 508A Main MCC Switchgear Panel Arc-Flash & Thermal Study',
        ProjectName: 'Automated Packaging Line Installation',
        Department: 'Plant Facilities & Utilities',
        Role: 'EHS & Compliance Specialist',
        DueDate: '2026-03-18',
        CompletedDate: '',
        Remarks: 'Incident energy calculation and arc-flash boundary labels prepared for 480V feeder bay.',
        isDateExceeded: false
      },
      {
        id: 11,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/009',
        TaskName: 'AGV Magnetic Navigation Path & Charging Dock Interlock Commissioning',
        ProjectName: 'Factory Utilities & Material Handling Upgrade',
        Department: 'Automation & Controls',
        Role: 'PLC / SCADA Controls Engineer',
        DueDate: '2026-03-25',
        CompletedDate: '',
        Remarks: 'Floor RFID transponder layout mapped across raw billet storage and CNC bays.',
        isDateExceeded: false
      },
      {
        id: 12,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/010',
        TaskName: '72-Hour Continuous Pilot Production Endurance & OEE Baseline Audit',
        ProjectName: 'Pilot Production Line Trial',
        Department: 'Manufacturing & Operations',
        Role: 'Production Operations Manager',
        DueDate: '2026-04-02',
        CompletedDate: '',
        Remarks: 'Shift A/B/C operators assigned to log micro-stoppages and SMED changeover timings.',
        isDateExceeded: false
      }
    ];

    this.applyFilter();
  }

  // --- Filter & Pagination ---

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
    this.isFullKit = false;
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
    let filtered = [...this.rawTasks];
    const formVals = this.filterForm.value;

    if (this.excludeCompleted) {
      filtered = filtered.filter(t => !t.Done);
    }

    if (this.isOverdueOnly) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(t => !t.Done && t.DueDate && t.DueDate < today);
    }

    if (formVals.Keyword && formVals.Keyword.trim()) {
      const kw = formVals.Keyword.trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.ProjectCode.toLowerCase().includes(kw) ||
        t.TaskName.toLowerCase().includes(kw) ||
        t.ProjectName.toLowerCase().includes(kw) ||
        t.Department.toLowerCase().includes(kw) ||
        t.Role.toLowerCase().includes(kw) ||
        (t.Remarks && t.Remarks.toLowerCase().includes(kw))
      );
    }

    if (formVals.ProjectCode && formVals.ProjectCode.trim()) {
      const pc = formVals.ProjectCode.trim().toLowerCase();
      filtered = filtered.filter(t => t.ProjectCode.toLowerCase().includes(pc));
    }

    if (formVals.Department) {
      filtered = filtered.filter(t => t.Department === formVals.Department);
    }

    if (formVals.Role) {
      filtered = filtered.filter(t => t.Role === formVals.Role);
    }

    if (formVals.FromDate) {
      filtered = filtered.filter(t => t.DueDate >= formVals.FromDate);
    }

    if (formVals.ToDate) {
      filtered = filtered.filter(t => t.DueDate <= formVals.ToDate);
    }

    if (formVals.ActiveOnly) {
      filtered = filtered.filter(t => t.IsActive);
    }

    this.totalSize = filtered.length;
    const start = this.currentPage * this.pageSize;
    this.paginatedTasks = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorTaskItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(ProjectWbsTasksComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        tasks: item.TaskName
          ? [
              {
                name: item.TaskName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.tasks && result.tasks.length > 0) {
        const lastTask = result.tasks[result.tasks.length - 1];
        if (lastTask?.name) {
          item.TaskName = lastTask.name;
        }
        if (lastTask?.dueDate) {
          item.DueDate = lastTask.dueDate;
        }
        if (lastTask?.completedDate) {
          item.CompletedDate = lastTask.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditTask(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      TaskName: formVals.TaskName,
      ProjectName: formVals.ProjectName,
      Department: formVals.Department,
      Role: formVals.Role,
      DueDate: formVals.DueDate,
      CompletedDate: formVals.CompletedDate,
      Remarks: formVals.Remarks,
      IsActive: formVals.IsActive,
      Done: formVals.Done
    });
    this.closeEditModal();
    this.applyFilter();
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentEditItem = null;
  }

  onDeleteTask(item: MonitorTaskItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawTasks = this.rawTasks.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorTaskItem): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  // --- Date Exceeded Helper ---
  isDateExceeded(item: MonitorTaskItem): boolean {
    if (item.isDateExceeded !== undefined) {
      return item.isDateExceeded;
    }
    if (item.CompletedDate && item.DueDate) {
      return item.CompletedDate > item.DueDate;
    }
    if (!item.Done && item.DueDate) {
      const today = new Date().toISOString().split('T')[0];
      return item.DueDate < today;
    }
    return false;
  }

  // --- Scrolling logic ---
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
