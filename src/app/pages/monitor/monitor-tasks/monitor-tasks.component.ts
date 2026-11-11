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
    'Formulation R&D',
    'Analytical Development',
    'Pre-Formulation R&D',
    'Regulatory Affairs',
    'Quality Assurance',
    'Quality Control',
    'MS&T / Process Engineering',
    'Packaging Development',
    'Clinical & Medical Affairs',
    'Sourcing & Procurement'
  ];

  roleOptions: string[] = [
    'Lead Formulation Scientist',
    'Lead Analytical Scientist',
    'Regulatory Affairs Director',
    'Quality Assurance Specialist',
    'Process Validation Engineer',
    'QC Stability Scientist',
    'Packaging Specialist',
    'Medical Director'
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
        ProjectCode: '2026/RD/001',
        TaskName: 'Active Pharmaceutical Ingredient (API) Solid-State Characterization',
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        Department: 'Pre-Formulation R&D',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'ICH Q6A polymorphic purity and crystalline form verified by XRPD and DSC.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/001',
        TaskName: 'API Vendor Qualification and DMF Assessment',
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        Department: 'Sourcing & Procurement',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'Awaiting secondary source DMF Type II letter of authorization from API manufacturer.',
        isDateExceeded: true,
        delayReason: 'Secondary API Source DMF Access Letter Pending'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/RD/002',
        TaskName: 'Reference Listed Drug (RLD) Multi-Media Dissolution Characterization',
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        Department: 'Analytical Development',
        Role: 'Lead Analytical Scientist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'Dissolution profiles established across pH 1.2, 4.5, and 6.8 buffer media.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: false,
        Done: false,
        ProjectCode: '2026/RD/002',
        TaskName: 'Formulation Optimization via DoE Design Space Mapping',
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        Department: 'Formulation R&D',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Statistical DoE matrix for hydrophilic polymer ratio screening underway.',
        isDateExceeded: false
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/003',
        TaskName: 'Enteric Film Coating Weight Gain & Acid Resistance Evaluation',
        ProjectName: 'Pantoprazole Gastro-Resistant Tablets',
        Department: 'Formulation R&D',
        Role: 'Process Validation Engineer',
        DueDate: '2026-02-25',
        CompletedDate: '',
        Remarks: 'Acid resistance in 0.1N HCl for 2 hours demonstrates < 2% drug release.',
        isDateExceeded: true,
        delayReason: 'Perforated Coating Pan Spray Nozzle Clogging'
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/RD/004',
        TaskName: 'Sterile Powder Filling Machine Particulate Validation',
        ProjectName: 'Ceftriaxone Powder for Injection',
        Department: 'MS&T / Process Engineering',
        Role: 'Process Validation Engineer',
        DueDate: '2026-01-15',
        CompletedDate: '2026-01-14',
        Remarks: 'Non-viable airborne particulate counts in ISO 5 filling zone fully compliant.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/005',
        TaskName: 'Aerodynamic Particle Size Distribution (APSD) by Next Generation Impactor (NGI)',
        ProjectName: 'Budesonide Inhalation Suspension',
        Department: 'Analytical Development',
        Role: 'Lead Analytical Scientist',
        DueDate: '2026-03-05',
        CompletedDate: '',
        Remarks: 'Fine particle fraction (FPF) assessment across commercial nebules ongoing.',
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
