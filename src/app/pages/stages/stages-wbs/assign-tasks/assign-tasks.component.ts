import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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

  jobCodeOptions: string[] = [
    'RND-01',
    'RND-02',
    'RND-03',
    'QA-01',
    'REG-01',
    'CLIN-01',
    'BC01',
    'BC02',
    'ACT1',
    'ACT2',
    'FORM1',
    'PROC1'
  ];

  tasksList: TaskItem[] = [
    {
      active: true,
      done: true,
      taskName: 'API Solubility, Stability, and Solid-State Characterization Specification',
      taskCode: 'TC-101',
      jobCode: 'RND-01',
      department: 'Pre-Formulation R&D',
      role: 'Lead Scientist',
      dueDate: '2026-05-15',
      completedDate: '2026-05-14',
      remarks: 'Completed within polymorphic purity specifications',
      isEditing: false
    },
    {
      active: true,
      done: true,
      taskName: 'Finished Dosage Form Dissolution Profile and Release Criteria',
      taskCode: 'TC-102',
      jobCode: 'RND-02',
      department: 'Formulation R&D',
      role: 'Lead Formulation Scientist',
      dueDate: '2026-05-20',
      completedDate: '2026-05-19',
      remarks: 'Apparatus II paddle speed and dissolution profiles matching RLD curve',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Reference Product Characterization and Comparative Assessment Protocol',
      taskCode: 'TC-103',
      jobCode: 'RND-03',
      department: 'Analytical Development',
      role: 'Lead Analytical Scientist',
      dueDate: '2026-06-01',
      completedDate: '',
      remarks: 'Quantitative excipient deconstruction completed against innovator benchmark',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Analytical Method Development for API, Impurities, and Degradation Products',
      taskCode: 'TC-104',
      jobCode: 'RND-04',
      department: 'Formulation R&D',
      role: 'Senior Scientist',
      dueDate: '2026-06-05',
      completedDate: '',
      remarks: 'RP-HPLC method optimization ongoing for critical degradation pairs',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'API–Excipient Compatibility Study Protocol',
      taskCode: 'TC-105',
      jobCode: 'RND-05',
      department: 'Packaging Development',
      role: 'Packaging Specialist',
      dueDate: '2026-06-10',
      completedDate: '',
      remarks: 'DSC and isothermal binary blend stability analysis ongoing',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Formulation Prototype Batch Manufacturing and Documentation Protocol',
      taskCode: 'TC-106',
      jobCode: 'RND-06',
      department: 'MS&T / Process Engineering',
      role: 'Process Lead',
      dueDate: '2026-06-15',
      completedDate: '',
      remarks: 'Blend uniformity and compression machine compaction profiles acceptable',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Accelerated and Long-Term Stability Study Protocol',
      taskCode: 'TC-107',
      jobCode: 'RND-07',
      department: 'QC Stability',
      role: 'Stability Scientist',
      dueDate: '2026-06-20',
      completedDate: '',
      remarks: 'Climatic chamber loading schedules and pull testing protocol established',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Container Closure System Suitability and Compatibility Evaluation Report',
      taskCode: 'TC-108',
      jobCode: 'RND-08',
      department: 'Analytical Development',
      role: 'Analytical Chemist',
      dueDate: '2026-06-25',
      completedDate: '',
      remarks: 'Alu-Alu vs PVC/PVDC moisture transmission rate comparison underway',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Preformulation Assessment and Biopharmaceutical Risk Screening',
      taskCode: 'TC-109',
      jobCode: 'RND-09',
      department: 'Regulatory Affairs',
      role: 'RA Specialist',
      dueDate: '2026-06-30',
      completedDate: '',
      remarks: 'BCS classification and permeability screening evaluation in progress',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Bioequivalence Study Design and Protocol Development',
      taskCode: 'TC-110',
      jobCode: 'RND-10',
      department: 'Quality Assurance',
      role: 'QA Director',
      dueDate: '2026-07-05',
      completedDate: '',
      remarks: 'Two-way crossover in-vivo study design and power calculation protocol drafted',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Chromatographic Analytical Method Validation Protocol',
      taskCode: 'TC-111',
      jobCode: 'RND-11',
      department: 'Analytical Development',
      role: 'Method Validation Specialist',
      dueDate: '2026-07-10',
      completedDate: '',
      remarks: 'Specificity, linearity, precision, and range protocol signed off',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Microbial Limits and Specified Microorganisms Method Validation Framework',
      taskCode: 'TC-112',
      jobCode: 'RND-12',
      department: 'Microbiology QC',
      role: 'QC Microbiologist',
      dueDate: '2026-07-15',
      completedDate: '',
      remarks: 'USP <61> / <62> microbial bioburden testing validation execution',
      isEditing: false
    },
    {
      active: true,
      done: false,
      taskName: 'Raw Material and API Supplier Qualification, Audit, and Quality Agreement Review',
      taskCode: 'TC-113',
      jobCode: 'RND-13',
      department: 'Quality Assurance',
      role: 'QA Director',
      dueDate: '2026-07-20',
      completedDate: '',
      remarks: 'Supplier audit checklist and quality technical agreements review completed',
      isEditing: false
    }
  ];

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
        taskCode: item.taskCode || `TC-10${idx + 1}`,
        jobCode: item.jobCode || 'RND-01',
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
            taskCode: `TC-10${idx + 1}`,
            jobCode: 'RND-01',
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
          taskCode: item.taskCode || `TC-10${idx + 1}`,
          jobCode: item.jobCode || 'RND-01',
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
      taskCode: `TC-10${nextNum}`,
      jobCode: this.jobCodeOptions[0] || 'RND-01',
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
