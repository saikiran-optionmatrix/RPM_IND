import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { INDUSTRIAL_DEFAULT_TASKS, INDUSTRIAL_JOB_CODES } from '../../industrial-stages.data';

export interface TaskItem {
  id?: string | number;
  active: boolean;
  done: boolean;
  taskName: string;
  taskCode?: string;
  jobCode?: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  historyCount?: number;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-assign-tasks',
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
  templateUrl: './assign-tasks.component.html',
  styleUrl: './assign-tasks.component.scss',
})
export class AssignTasksComponent implements OnInit {
  private readonly router = inject(Router);

  pageIndex = 0;
  pageSize = 5;

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  jobCodeOptions: string[] = INDUSTRIAL_JOB_CODES;

  tasksList: TaskItem[] = INDUSTRIAL_DEFAULT_TASKS.map(t => ({ ...t }));

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialogRef: MatDialogRef<AssignTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData)) {
      this.tasksList = this.data.row.tasksData.map((item: any, idx: number) => ({
        ...item,
        taskCode: item.taskCode || `IND-10${idx + 1}`,
        jobCode: item.jobCode || 'ENG01',
        historyCount: item.historyCount || this.getHistoryCount(idx),
        isEditing: false
      }));
    } else if (this.data?.tasks && Array.isArray(this.data.tasks)) {
      this.tasksList = this.data.tasks.map((item: any, idx: number) => {
        if (typeof item === 'string') {
          return {
            active: true,
            done: false,
            taskName: item,
            taskCode: `IND-10${idx + 1}`,
            jobCode: 'ENG01',
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
          taskCode: item.taskCode || `IND-10${idx + 1}`,
          jobCode: item.jobCode || 'ENG01',
          historyCount: item.historyCount || this.getHistoryCount(idx),
          isEditing: false
        };
      });
    } else {
      this.tasksList.forEach((t, idx) => {
        if (!t.historyCount) t.historyCount = this.getHistoryCount(idx);
      });
    }
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addTask(): void {
    const nextNum = this.tasksList.length + 1;
    const newTask: TaskItem = {
      active: true,
      done: false,
      taskName: '',
      taskCode: `IND-10${nextNum}`,
      jobCode: this.jobCodeOptions[0] || 'ENG01',
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
    this.tasksList.unshift(newTask);
  }

  startEdit(row: TaskItem): void {
    row._backup = { ...row };
    row.isEditing = true;
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    delete row.isNew;
    delete row._backup;
  }

  cancelEdit(row: TaskItem): void {
    if (row.isNew) {
      const index = this.tasksList.indexOf(row);
      if (index > -1) {
        this.tasksList.splice(index, 1);
        if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
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

  deleteTask(row: TaskItem): void {
    const index = this.tasksList.indexOf(row);
    if (index > -1) {
      this.tasksList.splice(index, 1);
      if (this.pageIndex > 0 && this.pageIndex * this.pageSize >= this.tasksList.length) {
        this.pageIndex = Math.max(0, this.pageIndex - 1);
      }
    }
  }

  save(): void {
    // Finalize any rows left in edit mode
    this.tasksList.forEach(r => {
      r.isEditing = false;
      delete r.isNew;
      delete r._backup;
    });

    this.dialogRef.close({
      tasks: this.tasksList,
      count: this.tasksList.length
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  openHistory(row: TaskItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.dialogRef.close();
    this.router.navigate(['/stages/wbs/tasks/history'], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        jobCode: row.jobCode,
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
