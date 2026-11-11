import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Optional, Output, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { WbsActivityItem } from '../project-wbs.component';
import { AddWbsTasksComponent } from './add-wbs-tasks/add-wbs-tasks.component';
import { DocumentsPopComponent } from '../../../../../../common/shared/documents-pop/documents-pop.component';

export interface TaskItem {
  id?: string | number;
  active?: boolean;
  done: boolean;
  approved?: boolean;
  taskName: string;
  taskCode?: string;
  reference?: string;
  section?: string;
  jobCode?: string;
  dueDate: string;
  completedDate: string;
  responsibility?: string;
  department: string;
  role?: string;
  remarks?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
  isEditing?: boolean;
  isNew?: boolean;
  _backup?: Partial<TaskItem>;
}

@Component({
  selector: 'app-project-wbs-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-tasks.component.html',
  styleUrl: './project-wbs-tasks.component.scss',
})
export class ProjectWbsTasksComponent implements OnInit {
  @Input() activity?: WbsActivityItem | null;
  @Input() stageName?: string;
  @Input() stageCode?: string;
  @Input() gateName?: string;
  @Input() gateCode?: string;
  @Input() projectName?: string;
  @Input() projectCode?: string;
  @Output() back = new EventEmitter<any>();

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  title: string = 'Assign Tasks';
  pageIndex = 0;
  pageSize = 5;
  source?: string;

  @ViewChild('completionDialog') completionDialog!: TemplateRef<any>;
  activeTaskForDone?: TaskItem;
  selectedCompletionDate: string = '';
  completionDialogRef?: MatDialogRef<any>;

  tasksList: TaskItem[] = [];

  readonly historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];
  readonly documentsSequence: number[] = [2, 4, 1, 3, 5, 2, 3, 1, 4, 2, 5, 3];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  get paginatedTasks(): TaskItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksList.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private dialog: MatDialog,
    @Optional() private dialogRef?: MatDialogRef<ProjectWbsTasksComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any,
    @Optional() private route?: ActivatedRoute,
    @Optional() private router?: Router,
    @Optional() private location?: Location
  ) { }

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
          tasks: params['tasks']
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
      this.title = `Tasks — ${this.activity.activityName}`;
    } else if (this.data?.title) {
      this.title = this.data.title;
    } else {
      this.title = 'Assign Tasks';
    }

    this.initTasksList();
  }

  private initTasksList(): void {
    if (this.activity?.tasksData && Array.isArray(this.activity.tasksData)) {
      this.tasksList = this.activity.tasksData.map((item, index) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    if (this.data?.row?.tasksData && Array.isArray(this.data.row.tasksData)) {
      this.tasksList = this.data.row.tasksData.map((item: any, index: number) => ({
        ...item,
        historyCount: item.historyCount || this.getHistoryCount(index),
        documentsCount: item.documentsCount || this.getDocumentsCount(index),
        isEditing: false
      }));
      return;
    }

    // Generate items matching the count in fractional tasks (e.g. 6 from '6/16')
    let targetCount = 6;
    if (this.activity?.tasks) {
      const parsed = parseInt(String(this.activity.tasks).split('/')[0], 10);
      if (!isNaN(parsed) && parsed > 0) targetCount = parsed;
    }

    const baseCatalog: Partial<TaskItem>[] = [
      { taskName: 'API Solubility, Stability, and Solid-State Characterization Specification', taskCode: 'TC-01', reference: 'REF-AN-01', section: 'Pre-Formulation R&D', jobCode: 'JOB01', dueDate: '2026-01-18', completedDate: '2026-01-18', responsibility: 'Dr. Sarah Connor', department: 'Pre-Formulation R&D', active: true, done: true, approved: true },
      { taskName: 'Finished Dosage Form Dissolution Profile and Release Criteria', taskCode: 'TC-02', reference: 'REF-QC-02', section: 'Quality Control', jobCode: 'JOB02', dueDate: '2026-01-20', completedDate: '2026-01-20', responsibility: 'Emily Watson', department: 'Quality Control', active: true, done: true, approved: true },
      { taskName: 'Reference Product Characterization and Comparative Assessment Protocol', taskCode: 'TC-03', reference: 'REF-FD-03', section: 'Formulation Development', jobCode: 'JOB03', dueDate: '2026-01-24', completedDate: '2026-01-23', responsibility: 'Michael Scott', department: 'Formulation Development', active: true, done: true, approved: true },
      { taskName: 'Analytical Method Development for API, Impurities, and Degradation Products', taskCode: 'TC-04', reference: 'REF-AN-04', section: 'Analytical Development', jobCode: 'JOB04', dueDate: '2026-01-28', completedDate: '', responsibility: 'Dr. Sarah Connor', department: 'Analytical Development', active: true, done: false, approved: false },
      { taskName: 'API–Excipient Compatibility Study Protocol', taskCode: 'TC-05', reference: 'REF-FD-05', section: 'Formulation Development', jobCode: 'JOB05', dueDate: '2026-02-02', completedDate: '', responsibility: 'Robert Chen', department: 'Formulation Development', active: true, done: false, approved: false },
      { taskName: 'Formulation Prototype Batch Manufacturing and Documentation Protocol', taskCode: 'TC-06', reference: 'REF-FD-06', section: 'Formulation Development', jobCode: 'JOB06', dueDate: '2026-02-05', completedDate: '', responsibility: 'Robert Chen', department: 'Formulation Development', active: true, done: false, approved: false },
      { taskName: 'Accelerated and Long-Term Stability Study Protocol', taskCode: 'TC-07', reference: 'REF-ST-07', section: 'QC Stability', jobCode: 'JOB07', dueDate: '2026-02-10', completedDate: '', responsibility: 'David Kim', department: 'QC Stability', active: true, done: false, approved: false },
      { taskName: 'Container Closure System Suitability and Compatibility Evaluation Report', taskCode: 'TC-08', reference: 'REF-PK-08', section: 'Packaging Development', jobCode: 'JOB08', dueDate: '2026-02-15', completedDate: '', responsibility: 'David Kim', department: 'Packaging Development', active: true, done: false, approved: false },
      { taskName: 'Preformulation Assessment and Biopharmaceutical Risk Screening', taskCode: 'TC-09', reference: 'REF-PF-09', section: 'Pre-Formulation R&D', jobCode: 'JOB09', dueDate: '2026-02-20', completedDate: '', responsibility: 'Dr. Sarah Jenkins', department: 'Pre-Formulation R&D', active: true, done: false, approved: false },
      { taskName: 'Bioequivalence Study Design and Protocol Development', taskCode: 'TC-10', reference: 'REF-CL-10', section: 'Clinical & Regulatory', jobCode: 'JOB10', dueDate: '2026-02-25', completedDate: '', responsibility: 'Jessica Alba', department: 'Regulatory Affairs', active: true, done: false, approved: false },
      { taskName: 'Chromatographic Analytical Method Validation Protocol', taskCode: 'TC-11', reference: 'REF-AN-11', section: 'Analytical Development', jobCode: 'JOB11', dueDate: '2026-03-01', completedDate: '', responsibility: 'Dr. Sarah Connor', department: 'Analytical Development', active: true, done: false, approved: false },
      { taskName: 'Microbial Limits and Specified Microorganisms Method Validation Framework', taskCode: 'TC-12', reference: 'REF-MB-12', section: 'Microbiology', jobCode: 'JOB12', dueDate: '2026-03-05', completedDate: '', responsibility: 'Dr. Sarah Connor', department: 'Microbiology QC', active: true, done: false, approved: false },
      { taskName: 'Raw Material and API Supplier Qualification, Audit, and Quality Agreement Review', taskCode: 'TC-13', reference: 'REF-SC-13', section: 'Supply Chain & QA', jobCode: 'JOB13', dueDate: '2026-03-10', completedDate: '', responsibility: 'James Miller', department: 'Quality Assurance', active: true, done: false, approved: false }
    ];

    this.tasksList = Array.from({ length: targetCount }, (_, i) => {
      const template = baseCatalog[i % baseCatalog.length];
      const taskNum = String(i + 1).padStart(2, '0');
      return {
        id: Date.now() + i,
        active: template.active ?? true,
        done: template.done ?? (i < 3),
        approved: template.approved ?? (i < 3),
        taskName: template.taskName || `Task ${i + 1}`,
        taskCode: template.taskCode || `TC-${taskNum}`,
        reference: template.reference || `REF-WBS-${taskNum}`,
        section: template.section || 'Formulation Development',
        jobCode: template.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
        dueDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        completedDate: template.completedDate || (i < 3 ? `2026-02-${String(9 + (i % 18)).padStart(2, '0')}` : ''),
        responsibility: template.responsibility || (this.activity?.responsibility || 'Unassigned'),
        department: template.department || (this.activity?.department || 'Management'),
        role: template.role || 'Scientist',
        remarks: template.remarks || 'Standard task',
        historyCount: this.getHistoryCount(i),
        documentsCount: this.getDocumentsCount(i),
        updatedDate: template.dueDate || `2026-02-${String(10 + (i % 18)).padStart(2, '0')}`,
        updatedBy: template.responsibility || (this.activity?.responsibility || 'Dr. Sarah Jenkins'),
        isEditing: false
      };
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

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


  startEdit(row: TaskItem): void {
    this.editTask(row);
  }

  editTask(row: TaskItem): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '850px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        ...row,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        row.active = result.active ?? row.active;
        row.done = result.done ?? row.done;
        row.taskName = result.taskName ?? row.taskName;
        row.taskCode = result.taskCode ?? row.taskCode;
        row.reference = result.reference ?? row.reference;
        row.section = result.section ?? row.section;
        row.jobCode = result.jobCode ?? row.jobCode;
        row.dueDate = result.dueDate ?? row.dueDate;
        row.completedDate = result.completedDate ?? row.completedDate;
        row.responsibility = result.responsibility ?? row.responsibility;
        row.department = result.department ?? row.department;
        row.role = result.role ?? row.role;
        row.remarks = result.remarks ?? row.remarks;
        row.updatedDate = new Date().toISOString().split('T')[0];
        row.updatedBy = result.responsibility || row.responsibility || 'Dr. Sarah Jenkins';
      }
    });
  }

  saveRow(row: TaskItem): void {
    row.isEditing = false;
    row.isNew = false;
    row.updatedDate = new Date().toISOString().split('T')[0];
    row.updatedBy = row.responsibility || 'Dr. Sarah Jenkins';
    delete row._backup;
  }

  cancelEdit(row: TaskItem): void {
    if (row.isNew) {
      const idx = this.tasksList.indexOf(row);
      if (idx !== -1) {
        this.tasksList.splice(idx, 1);
      }
    } else if (row._backup) {
      Object.assign(row, row._backup);
      row.isEditing = false;
      delete row._backup;
    } else {
      row.isEditing = false;
    }
  }

  deleteTask(row: TaskItem): void {
    const idx = this.tasksList.indexOf(row);
    if (idx !== -1) {
      this.tasksList.splice(idx, 1);
      const totalPages = Math.max(1, Math.ceil(this.tasksList.length / this.pageSize));
      if (this.pageIndex >= totalPages) {
        this.pageIndex = Math.max(0, totalPages - 1);
      }
    }
  }

  save(): void {
    for (const t of this.tasksList) {
      if (t.isEditing) {
        this.saveRow(t);
      }
    }

    const result = {
      tasks: this.tasksList,
      count: this.tasksList.length
    };

    if (this.activity) {
      this.activity.tasksData = this.tasksList;
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
    } else if (this.source === 'gates' || this.gateCode) {
      this.router?.navigate(['/projects/dashboard/gates/activities'], {
        queryParams: {
          gateCode: this.gateCode || this.route?.snapshot.queryParamMap.get('gateCode'),
          gateName: this.gateName || this.route?.snapshot.queryParamMap.get('gateName'),
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else if (this.source === 'activities') {
      this.router?.navigate(['/projects/dashboard/activities'], {
        queryParams: {
          projectName: this.projectName || this.route?.snapshot.queryParamMap.get('projectName'),
          code: this.projectCode || this.route?.snapshot.queryParamMap.get('code') || this.route?.snapshot.queryParamMap.get('projectCode')
        }
      });
    } else {
      this.location?.back();
    }
  }

  goBack(): void {
    this.close();
  }

  openHistory(row: TaskItem, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    const currentUrl = this.router?.url || '';
    let targetPath = 'tasks/history';
    if (currentUrl.includes('/stages/wbs')) {
      targetPath = '/projects/dashboard/stages/wbs/tasks/history';
    } else if (currentUrl.includes('/wbs')) {
      targetPath = '/projects/dashboard/wbs/tasks/history';
    } else {
      targetPath = '/projects/dashboard/stages/wbs/tasks/history';
    }

    this.router?.navigate([targetPath], {
      queryParams: {
        taskName: row.taskName,
        taskCode: row.taskCode,
        jobCode: row.jobCode,
        dueDate: row.dueDate,
        completedDate: row.completedDate,
        done: row.done,
        responsibility: row.responsibility,
        department: row.department,
        activityName: this.activity?.activityName || '',
        jobCodeParam: this.activity?.jobCode || '',
        stageName: this.stageName || '',
        stageCode: this.stageCode || '',
        gateName: this.gateName || '',
        gateCode: this.gateCode || '',
        projectName: this.projectName || '',
        projectCode: this.projectCode || '',
        updatedDate: row.updatedDate || '',
        updatedBy: row.updatedBy || '',
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }







  addTask(): void {
    const dialogRef = this.dialog.open(AddWbsTasksComponent, {
      width: '850px',
      maxWidth: '95vw',

      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const nextId = this.tasksList.length + 1;
        const taskNum = String(nextId).padStart(2, '0');
        const newTask: TaskItem = {
          id: Date.now(),
          active: result.active ?? true,
          done: result.done ?? false,
          approved: result.approved ?? false,
          taskName: result.taskName ?? '',
          taskCode: result.taskCode || `TC-${taskNum}`,
          reference: result.reference || `REF-${taskNum}`,
          section: result.section || 'Formulation Development',
          jobCode: result.jobCode || (this.activity?.jobCode || `JOB${taskNum}`),
          dueDate: result.dueDate ?? '',
          completedDate: result.completedDate ?? '',
          responsibility: result.responsibility || (this.activity?.responsibility || 'Unassigned'),
          department: result.department ?? (this.activity?.department || 'Management'),
          role: result.role ?? 'Scientist',
          remarks: result.remarks ?? '',
          isEditing: false
        };
        this.tasksList.unshift(newTask);
        this.pageIndex = 0;
      }
    });
  }

  toggleApproved(row: TaskItem): void {
    row.approved = !row.approved;
  }

  openDoneDialog(row: TaskItem): void {
    this.activeTaskForDone = row;
    this.selectedCompletionDate = row.completedDate || this.getTodayDateString();
    this.completionDialogRef = this.dialog.open(this.completionDialog, {
      width: '460px',
      maxWidth: '95vw',
      disableClose: false
    });
  }

  saveCompletionDate(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = true;
      this.activeTaskForDone.completedDate = this.selectedCompletionDate || this.getTodayDateString();
    }
    this.closeCompletionDialog();
  }

  markIncomplete(): void {
    if (this.activeTaskForDone) {
      this.activeTaskForDone.done = false;
      this.activeTaskForDone.completedDate = '';
    }
    this.closeCompletionDialog();
  }

  closeCompletionDialog(): void {
    if (this.completionDialogRef) {
      this.completionDialogRef.close();
      this.completionDialogRef = undefined;
    }
  }

  private getTodayDateString(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
