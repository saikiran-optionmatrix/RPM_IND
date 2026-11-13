import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { INDUSTRIAL_DEFAULT_REQUIREMENTS } from '../../industrial-stages.data';

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

  requirementsList: RequirementItem[] = INDUSTRIAL_DEFAULT_REQUIREMENTS.map(r => ({ ...r }));

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
