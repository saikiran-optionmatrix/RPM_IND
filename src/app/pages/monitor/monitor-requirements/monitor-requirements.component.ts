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
import { ProjectWbsRequirementsComponent } from '../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/project-wbs-requirements.component';

export interface MonitorRequirementItem {
  id: number;
  IsActive: boolean;
  Done: boolean;
  ProjectCode: string;
  RequirementName: string;
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
  selector: 'app-monitor-requirements',
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
  templateUrl: './monitor-requirements.component.html',
  styleUrl: './monitor-requirements.component.scss'
})
export class MonitorRequirementsComponent implements OnInit, OnDestroy {
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
  rawRequirements: MonitorRequirementItem[] = [];
  paginatedRequirements: MonitorRequirementItem[] = [];

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
  currentEditItem: MonitorRequirementItem | null = null;
  editForm: FormGroup = this.fb.group({
    ProjectCode: [''],
    RequirementName: [''],
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
    this.initMockRequirements();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.isOverdueOnly = isOverdue;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  initMockRequirements(): void {
    this.rawRequirements = [
      {
        id: 1,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/RD/001',
        RequirementName: 'Finished Product Dissolution Specification USP / FDA Guidance Alignment',
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        Department: 'Analytical Development',
        Role: 'Lead Analytical Scientist',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Dissolution method validated with paddle 50 RPM in 0.1N HCl with surfactant.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/001',
        RequirementName: 'ICH Q3D Elemental Impurities Toxicological Safety Risk Assessment',
        ProjectName: 'Dapagliflozin Film-Coated Tablets',
        Department: 'Quality Assurance',
        Role: 'Quality Assurance Specialist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'ICP-MS screening of catalyst residues (Class 1 and Class 2A elements) in progress.',
        isDateExceeded: true,
        delayReason: 'ICP-MS Laboratory Testing Queue'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/RD/002',
        RequirementName: 'Extended Release Hydrophilic Matrix In-Vitro Dissolution Criteria',
        ProjectName: 'Levetiracetam Extended-Release Tablets',
        Department: 'Formulation R&D',
        Role: 'Lead Formulation Scientist',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'USP Apparatus 2 dissolution test specification and sampling time points verified.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/003',
        RequirementName: 'Pellet Acid-Stage Resistance and Delayed-Release In-Vitro Dissolution Specification',
        ProjectName: 'Pantoprazole Gastro-Resistant Tablets',
        Department: 'Regulatory Affairs',
        Role: 'Regulatory Affairs Director',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Ph. Eur. gastro-resistant tablet monograph test protocol finalized.',
        isDateExceeded: false
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/RD/004',
        RequirementName: 'Bacterial Endotoxin Testing (BET) and Sterility Acceptance Criteria per USP <85>',
        ProjectName: 'Ceftriaxone Powder for Injection',
        Department: 'Quality Control',
        Role: 'Quality Assurance Specialist',
        DueDate: '2026-03-20',
        CompletedDate: '',
        Remarks: 'Kinetic turbidimetric LAL method validation protocol under review.',
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
    let filtered = [...this.rawRequirements];
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
        t.RequirementName.toLowerCase().includes(kw) ||
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
    this.paginatedRequirements = filtered.slice(start, start + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilter();
  }

  // --- Row Actions ---

  onDoneChange(item: MonitorRequirementItem): void {
    if (item.Done && !item.CompletedDate) {
      item.CompletedDate = new Date().toISOString().split('T')[0];
    } else if (!item.Done) {
      item.CompletedDate = '';
    }
  }

  onEditRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(ProjectWbsRequirementsComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: item,
        requirements: item.RequirementName
          ? [
              {
                name: item.RequirementName,
                dueDate: item.DueDate || '2026-02-15',
                completedDate: item.CompletedDate || '2026-02-14'
              }
            ]
          : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.requirements && result.requirements.length > 0) {
        const lastReq = result.requirements[result.requirements.length - 1];
        if (lastReq?.name) {
          item.RequirementName = lastReq.name;
        }
        if (lastReq?.dueDate) {
          item.DueDate = lastReq.dueDate;
        }
        if (lastReq?.completedDate) {
          item.CompletedDate = lastReq.completedDate;
        }
        this.applyFilter();
      }
    });
  }

  saveEditRequirement(): void {
    if (!this.currentEditItem) return;
    const formVals = this.editForm.value;
    Object.assign(this.currentEditItem, {
      ProjectCode: formVals.ProjectCode,
      RequirementName: formVals.RequirementName,
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

  onDeleteRequirement(item: MonitorRequirementItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.rawRequirements = this.rawRequirements.filter(t => t.id !== item.id);
        this.applyFilter();
      }
    });
  }

  openProject(item: MonitorRequirementItem): void {
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
  isDateExceeded(item: MonitorRequirementItem): boolean {
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
