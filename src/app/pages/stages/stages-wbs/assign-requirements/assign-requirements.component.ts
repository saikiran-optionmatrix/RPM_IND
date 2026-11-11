import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<RequirementItem>;
}

@Component({
  selector: 'app-assign-requirements',
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
  templateUrl: './assign-requirements.component.html',
  styleUrl: './assign-requirements.component.scss',
})
export class AssignRequirementsComponent implements OnInit {
  private readonly router = inject(Router);

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  requirementsList: RequirementItem[] = [
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

  get paginatedRequirements(): RequirementItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<AssignRequirementsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.row?.requirementsData && Array.isArray(this.data.row.requirementsData)) {
      this.requirementsList = this.data.row.requirementsData.map((item: any, idx: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(idx),
        isEditing: false
      }));
    } else if (this.data?.requirements && Array.isArray(this.data.requirements)) {
      this.requirementsList = this.data.requirements.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            active: true,
            done: false,
            requirementName: item,
            department: '',
            role: '',
            dueDate: '',
            completedDate: '',
            remarks: '',
            historyCount: this.getHistoryCount(idx),
            isEditing: false
          };
        }
        return {
          ...item,
          historyCount: item.historyCount || this.getHistoryCount(idx),
          isEditing: false
        };
      });
    } else {
      this.requirementsList.forEach((req, idx) => {
        if (!req.historyCount) req.historyCount = this.getHistoryCount(idx);
      });
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addRequirement(): void {
    const newReq: RequirementItem = {
      active: true,
      done: false,
      requirementName: '',
      department: '',
      role: '',
      dueDate: '',
      completedDate: '',
      remarks: '',
      historyCount: 1,
      isEditing: true,
      isNew: true
    };
    this.pageIndex = 0;
    this.requirementsList.unshift(newReq);
  }

  startEdit(row: RequirementItem): void {
    row._backup = {
      active: row.active,
      done: row.done,
      requirementName: row.requirementName,
      department: row.department,
      role: row.role,
      dueDate: row.dueDate,
      completedDate: row.completedDate,
      remarks: row.remarks
    };
    row.isEditing = true;
  }

  saveRow(row: RequirementItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;
  }

  cancelEdit(row: RequirementItem): void {
    if (row.isNew) {
      const index = this.requirementsList.indexOf(row);
      if (index > -1) {
        this.requirementsList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
          this.pageIndex = Math.max(0, this.pageIndex - 1);
        }
      }
    } else {
      if (row._backup) {
        Object.assign(row, row._backup);
        delete row._backup;
      }
      row.isEditing = false;
    }
  }

  deleteRequirement(row: RequirementItem): void {
    const index = this.requirementsList.indexOf(row);
    if (index > -1) {
      this.requirementsList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.requirementsList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.requirementsList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
    });

    this.dialogRef.close({
      requirements: this.requirementsList,
      count: this.requirementsList.length
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openHistory(row: RequirementItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.dialogRef.close();
    this.router.navigate(['/stages/wbs/requirements/history'], {
      queryParams: {
        requirementName: row.requirementName,
        activityName: this.data?.row?.task || '',
        activityCode: this.data?.row?.activityCode || this.data?.row?.taskCode || '',
        stageCode: this.data?.row?.stageCode || '',
        stageName: this.data?.row?.stageName || '',
        gateCode: this.data?.row?.gateCode || '',
        historyCount: historyCount
      }
    });
  }
}
