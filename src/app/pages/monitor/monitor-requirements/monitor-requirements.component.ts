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
        ProjectCode: '2026/IND/001',
        RequirementName: 'Linear Transfer Gantry Cycle Time (<= 4.2 sec) & Repeatability (+/- 0.05 mm)',
        ProjectName: 'Industrial Equipment Line Expansion',
        Department: 'Engineering & R&D',
        Role: 'Lead Mechanical Engineer',
        DueDate: '2026-02-15',
        CompletedDate: '2026-02-14',
        Remarks: 'Laser interferometer repeatability verified across 500 unloaded cycles.',
        isDateExceeded: false
      },
      {
        id: 2,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/001',
        RequirementName: 'ISO 13849-1 Performance Level d (PLd) Dual-Channel Safety Circuit Compliance',
        ProjectName: 'Industrial Equipment Line Expansion',
        Department: 'EHS & Compliance',
        Role: 'EHS & Compliance Specialist',
        DueDate: '2026-02-28',
        CompletedDate: '',
        Remarks: 'SISTEMA MTTFd calculation updated; waiting for E-stop fault-injection test report.',
        isDateExceeded: true,
        delayReason: 'Safety Interlock Fault-Injection Lab Slot Delay'
      },
      {
        id: 3,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/002',
        RequirementName: '5-Axis Positioning Accuracy <= 5 um & Process Capability Cpk >= 1.67',
        ProjectName: 'CNC Machining Process Optimization',
        Department: 'Quality & Inspection',
        Role: 'Metrology & QC Lead',
        DueDate: '2026-01-20',
        CompletedDate: '2026-01-19',
        Remarks: 'CMM multi-part capability run confirmed Cpk 1.82 across critical bearing bores.',
        isDateExceeded: false
      },
      {
        id: 4,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/003',
        RequirementName: 'UL 508A / IEC 60204-1 Control Cabinet Short-Circuit & Thermal Rise Compliance',
        ProjectName: 'Automated Packaging Line Development',
        Department: 'Automation & Controls',
        Role: 'PLC / SCADA Controls Engineer',
        DueDate: '2026-03-10',
        CompletedDate: '',
        Remarks: 'Control panel arc-flash warning placards and UL panel shop inspection checklist finalized.',
        isDateExceeded: false
      },
      {
        id: 5,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/004',
        RequirementName: 'API 610 Hydrostatic Shell Test (1.5x MAWP) & Vibration < 2.8 mm/s Acceptance',
        ProjectName: 'High-Pressure Centrifugal Pump Assembly',
        Department: 'Commissioning & Qualification',
        Role: 'Commissioning & Qualification Engineer',
        DueDate: '2026-03-20',
        CompletedDate: '',
        Remarks: 'Closed-loop hydraulic test loop instrumentation calibration certificate under review.',
        isDateExceeded: false
      },
      {
        id: 6,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/005',
        RequirementName: 'ISO 8573-1 Class 0 Oil-Free Compressed Air Purity & ASME Sec VIII Vessel Sign-off',
        ProjectName: 'Oil-Free Rotary Screw Compressor System',
        Department: 'EHS & Compliance',
        Role: 'EHS & Compliance Specialist',
        DueDate: '2026-02-12',
        CompletedDate: '2026-02-11',
        Remarks: 'Pressure relief valve ASME certification and oil-vapor residual test passed.',
        isDateExceeded: false
      },
      {
        id: 7,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/006',
        RequirementName: 'SMED Pallet Zero-Point Clamping Changeover (< 5 min) & Repeatability <= 5 um',
        ProjectName: 'CNC Machining Line Capacity Expansion',
        Department: 'Manufacturing & Operations',
        Role: 'Production Operations Manager',
        DueDate: '2026-03-25',
        CompletedDate: '',
        Remarks: 'Automated RFID pallet recognition handshake with CNC controller undergoing FAT.',
        isDateExceeded: false
      },
      {
        id: 8,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/007',
        RequirementName: 'Redundant Chilled Water Flow (250 LPM) & Acoustic Enclosure < 78 dBA Spec',
        ProjectName: 'Industrial Pump Assembly Line Upgrade',
        Department: 'Plant Facilities & Utilities',
        Role: 'Reliability & Maintenance Engineer',
        DueDate: '2026-02-05',
        CompletedDate: '2026-02-18',
        Remarks: 'Sound-attenuated baffle panels installed and decibel grid survey verified.',
        isDateExceeded: true,
        delayReason: 'Acoustic Baffle Panel Vendor Delivery Delay'
      },
      {
        id: 9,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/008',
        RequirementName: 'CE Machinery Directive / BIS / OSHA Guarding Compliance Verification',
        ProjectName: 'Automated Packaging Line Installation',
        Department: 'EHS & Compliance',
        Role: 'EHS & Compliance Specialist',
        DueDate: '2026-04-02',
        CompletedDate: '',
        Remarks: 'Perimeter light curtains and dual-channel interlock risk assessment matrix complete.',
        isDateExceeded: false
      },
      {
        id: 10,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/009',
        RequirementName: 'Tier-1 OEM Servo Drive, Linear Guide & Foundry Vendor ISO 9001 Qualification',
        ProjectName: 'Factory Utilities & Material Handling Upgrade',
        Department: 'Sourcing & Procurement',
        Role: 'Commodity Procurement Specialist',
        DueDate: '2026-01-30',
        CompletedDate: '2026-01-29',
        Remarks: 'Primary and secondary servo/drive suppliers audited and approved on AVL.',
        isDateExceeded: false
      },
      {
        id: 11,
        IsActive: true,
        Done: false,
        ProjectCode: '2026/IND/010',
        RequirementName: '72-Hour Multi-Shift Pilot Endurance OEE >= 85% & Scrap Rate <= 0.8%',
        ProjectName: 'Pilot Production Line Trial',
        Department: 'Manufacturing & Operations',
        Role: 'Production Operations Manager',
        DueDate: '2026-04-10',
        CompletedDate: '',
        Remarks: 'SCADA automated downtime Pareto and SPC control charts enabled on HMI.',
        isDateExceeded: false
      },
      {
        id: 12,
        IsActive: true,
        Done: true,
        ProjectCode: '2026/IND/001',
        RequirementName: 'As-Built EPLAN Schematics, PLC Archive & CMMS Preventive Maintenance Handover',
        ProjectName: 'Industrial Equipment Line Expansion',
        Department: 'Engineering & R&D',
        Role: 'Lead Mechanical Engineer',
        DueDate: '2026-02-20',
        CompletedDate: '2026-02-19',
        Remarks: 'Technical Transfer Dossier (TTD) revision history and spare parts kit verified.',
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
