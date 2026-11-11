import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../template-stages-wbs.component';
import { AddWbsRequirementComponent } from '../../../../../../projects/project-dashboard/project-stages/project-wbs/project-wbs-requirements/add-wbs-requirement/add-wbs-requirement.component';

export interface RequirementItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-template-wbs-requirements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './template-wbs-requirements.component.html',
  styleUrl: './template-wbs-requirements.component.scss',
})
export class TemplateWbsRequirementsComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  title: string = 'Assign Requirements';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  requirementsList: RequirementItem[] = [];

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<TemplateWbsRequirementsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute,
    @Optional() private router?: Router,
    @Optional() private location?: Location
  ) {}

  ngOnInit(): void {
    this.route?.queryParams.subscribe(params => {
      if (params['activityName'] && !this.activity) {
        this.activity = {
          id: 0,
          activityName: params['activityName'],
          jobCode: params['jobCode'] || '',
          department: params['department'] || '',
          responsibility: '',
          priority: 'High',
          status: true,
          requirements: params['requirements']
        };
      }
      if (params['stageName'] && !this.stageName) this.stageName = params['stageName'];
      if (params['stageCode'] && !this.stageCode) this.stageCode = params['stageCode'];
      if (params['gateName'] && !this.gateName) this.gateName = params['gateName'];
      if (params['gateCode'] && !this.gateCode) this.gateCode = params['gateCode'];
      if (params['projectName'] && !this.projectName) this.projectName = params['projectName'];
      if (params['projectCode'] && !this.projectCode) this.projectCode = params['projectCode'];
      if (params['code'] && !this.projectCode) this.projectCode = params['code'];
      if (params['source']) this.source = params['source'];
    });

    if (this.data?.row && !this.activity) {
      this.activity = this.data.row;
    }

    if (this.activity?.activityName) {
      this.title = `Requirements — ${this.activity.activityName}`;
    } else if (this.data?.title) {
      this.title = this.data.title;
    } else {
      this.title = 'Assign Requirements';
    }

    this.initRequirementsList();
  }

  private initRequirementsList(): void {
    if (this.activity?.requirementsData && Array.isArray(this.activity.requirementsData)) {
      this.requirementsList = this.activity.requirementsData.map((item: any) => ({
        ...item,
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any) => ({
        ...item,
        isEditing: false
      }));
      return;
    }

    let targetCount = 6;
    if (this.activity?.requirements) {
      const parsed = parseInt(String(this.activity.requirements).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: RequirementItem[] = [
      {
        active: true,
        done: true,
        requirementName: 'API Solubility, Solid-State Form, and Stability Requirements',
        department: 'Formulation R&D',
        role: 'Lead Formulation Scientist',
        dueDate: '2026-05-15',
        completedDate: '2026-05-14',
        remarks: 'ICH Q6A compliant solid-state and crystal polymorphism screening complete',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Dosage Form Dissolution Profile and Drug Release Acceptance Criteria',
        department: 'Analytical Development',
        role: 'Lead Analytical Scientist',
        dueDate: '2026-06-01',
        completedDate: '2026-05-31',
        remarks: 'f2 similarity factor evaluation in progress across pH 1.2, 4.5 and 6.8 media',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Reference Product Selection and Characterization Requirements',
        department: 'Formulation R&D',
        role: 'Lead Formulation Scientist',
        dueDate: '2026-05-20',
        completedDate: '2026-05-19',
        remarks: 'Innovator benchmark deconstruction and physicochemical profiling complete',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Critical Quality Attribute Risk Assessment and Control Strategy Requirements',
        department: 'Regulatory Affairs',
        role: 'RA Director',
        dueDate: '2026-05-10',
        completedDate: '2026-05-09',
        remarks: 'ICH Q9 FMEA quality risk management matrix signed off',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Pharmaceutical Excipient Grade, Compendial Compliance, and CoA Requirements',
        department: 'Sourcing & Procurement',
        role: 'Procurement Manager',
        dueDate: '2026-05-12',
        completedDate: '2026-05-11',
        remarks: 'Vendor DMF access letters and USP/NF pharmacopoeial certificates verified',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Primary and Secondary Packaging Material Compatibility and Barrier Requirements',
        department: 'Packaging Development',
        role: 'Packaging Engineer',
        dueDate: '2026-06-05',
        completedDate: '',
        remarks: 'USP <671> and USP <1207> helium leak detection testing underway',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Impurity Limits, Degradation Pathways, and ICH Q3A/Q3B Assessment Requirements',
        department: 'Pre-Formulation R&D',
        role: 'Pre-Formulation Lead',
        dueDate: '2026-05-25',
        completedDate: '2026-05-24',
        remarks: 'Isothermal stress and binary blend HPLC analysis completed with mitigations',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Bioequivalence Study Design and Acceptance Criteria Requirements',
        department: 'Clinical & Regulatory',
        role: 'RA Specialist',
        dueDate: '2026-06-15',
        completedDate: '',
        remarks: '90% CI acceptance criteria (80.00% - 125.00%) study design established',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Accelerated and Long-Term Stability Study Requirements in Line with ICH Guidance',
        department: 'QC Stability',
        role: 'Stability Section Lead',
        dueDate: '2026-06-20',
        completedDate: '',
        remarks: 'ICH Q1A(R2) climatic chamber pull schedule protocol approved',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Microbial Enumeration and Specified Microorganism Acceptance Criteria',
        department: 'Microbiology QC',
        role: 'QC Microbiologist',
        dueDate: '2026-05-18',
        completedDate: '2026-05-17',
        remarks: 'USP <61> and USP <62> microbial limit criteria validated',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Container Closure Integrity and Package System Suitability Requirements',
        department: 'Packaging Development',
        role: 'Packaging Specialist',
        dueDate: '2026-06-10',
        completedDate: '',
        remarks: 'Container closure integrity testing and seal qualification in progress',
        isEditing: false
      },
      {
        active: true,
        done: true,
        requirementName: 'Analytical Method Verification, Validation, and Acceptance Limit Requirements',
        department: 'Analytical Development',
        role: 'Method Validation Specialist',
        dueDate: '2026-05-28',
        completedDate: '2026-05-27',
        remarks: 'ICH Q2(R1) specificity, linearity, precision, and accuracy validated',
        isEditing: false
      },
      {
        active: true,
        done: false,
        requirementName: 'Process Validation Sampling Plan and Batch Acceptance Requirements for Pharmaceutical Manufacturing',
        department: 'Validation Engineering',
        role: 'Validation Manager',
        dueDate: '2026-06-25',
        completedDate: '',
        remarks: 'Stage 2 process validation protocol and inter-batch uniformity criteria drafted',
        isEditing: false
      }
    ];

    this.requirementsList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        requirementName: template.requirementName || `Requirement ${i + 1}`,
        department: template.department || 'Analytical',
        role: template.role || 'Scientist',
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        remarks: template.remarks || 'Standard requirement',
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addRequirement(): void {
    const dialogRef = this.dialog.open(AddWbsRequirementComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newReq: RequirementItem = {
          id: Date.now(),
          active: true,
          done: false,
          requirementName: result.requirementName ?? '',
          department: result.department ?? 'Analytical',
          role: result.role ?? 'Scientist',
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          remarks: result.remarks ?? '',
          isEditing: false
        };
        this.requirementsList.unshift(newReq);
        this.pageIndex = 0;
      }
    });
  }

  startEdit(row: RequirementItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    row.isNew = false;
    delete row._backup;
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const idx = this.requirementsList.indexOf(row);
      if (idx !== -1) {
        this.requirementsList.splice(idx, 1);
      }
    } else if (row._backup) {
      Object.assign(row, row._backup);
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
  }

  deleteRequirement(row: RequirementItem): void {
    const idx = this.requirementsList.indexOf(row);
    if (idx !== -1) {
      this.requirementsList.splice(idx, 1);
      const totalPages = Math.max(1, Math.ceil(this.requirementsList.length / this.pageSize));
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(0, totalPages - 1);
      }
    }
  }

  save(): void {
    for (const r of this.requirementsList) {
      if (r.isEditing) {
        this.saveRow(r);
      }
    }

    const result = {
      requirements: this.requirementsList,
      count: this.requirementsList.length
    };

    if (this.activity) {
      this.activity.requirementsData = this.requirementsList;
    }

    if (this.dialogRef) {
      this.dialogRef.close(result);
    } else if (this.back.observed) {
      this.back.emit(result);
    } else {
      this.location?.back();
    }
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else if (this.back.observed) {
      this.back.emit();
    } else {
      this.location?.back();
    }
  }

  goBack(): void {
    this.close();
  }
}
