import { Component, ElementRef, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { EditBacklogTaskComponent } from '../../../../projects/project-dashboard/project-scrum/edit-backlog-task/edit-backlog-task.component';
import { AddSprintComponent } from '../../../../projects/project-dashboard/project-scrum/add-sprint/add-sprint.component';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export type Stage =
  | 'Opportunity and Portfolio Assessment'
  | 'Product Definition and Project Charter'
  | 'Formulation and Product Concept Development'
  | 'API, Excipient and Supplier Sourcing'
  | 'Formulation and Process Development'
  | 'Development Batches and Verification'
  | 'Facility, Equipment and Process Readiness'
  | 'Analytical Validation and Technology Transfer'
  | 'Registration and Process Validation Batches'
  | 'Regulatory Submission and Approval'
  | 'Commercial Launch and Lifecycle Management'
  | 'Opportunity Assessment'
  | 'Program Definition'
  | 'Concept Development'
  | 'Supplier Sourcing and Nomination'
  | 'Detailed Engineering'
  | 'Prototype Build and Verification'
  | 'Tooling and Plant Readiness'
  | 'Supplier Part Approval'
  | 'Pre-Series Builds'
  | 'Homologation and Certification'
  | 'Launch and Ramp-up'
  | 'Feasibility'
  | 'Formulation'
  | 'Development'
  | 'Testing'
  | 'Validation'
  | 'Regulatory'
  | (string & {});
export type SprintKind = 'backlog' | 'completed' | 'active';

export interface AssignTask {
  id: string;
  name: string;
  code: string;
  module: string;
  duration: string;
  effort: string;
  selected: boolean;
}

export interface TaskBar {
  planStart: string;
  planFinish: string;
  stage?: Stage;
  effort?: number;
}

export interface Task {
  id: string;
  task: string;
  taskCode: string;
  jobCode: string;
  planStart: string;
  planFinish: string;
  effort: number;
  duration: number;
  description: string;
  stage: Stage;
  assigned?: string;
  eta?: string;
  actualStart?: string;
  actualFinish?: string;
  expenses?: number;
  status?: string;
  approved?: boolean;
  notes?: { sender: string; date: string; text: string }[];
  progress?: number;
  expanded?: boolean;
  bars?: TaskBar[];
}

export interface Sprint {
  id: string;
  label: string;
  kind: SprintKind;
  tasks: Task[];
}

export interface CalendarCell {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

@Component({
  selector: 'app-template-scrum',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    DragDropModule,
  ],
  templateUrl: './template-scrum.component.html',
  styleUrl: './template-scrum.component.scss',
})
export class TemplateScrumComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Oral Solid Dosage (OSD) Formulation & Commercialization';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/GEN/001';
  dynamicBreadcrumb: string = 'Scrum';

  team = ['Aarav Shah', 'Priya Nair', 'Diego Ruiz', 'Mei Tanaka', 'Olivia Brown'];
  stages: Stage[] = [
    'Opportunity and Portfolio Assessment',
    'Product Definition and Project Charter',
    'Formulation and Product Concept Development',
    'API, Excipient and Supplier Sourcing',
    'Formulation and Process Development',
    'Development Batches and Verification',
    'Facility, Equipment and Process Readiness',
    'Analytical Validation and Technology Transfer',
    'Registration and Process Validation Batches',
    'Regulatory Submission and Approval',
    'Commercial Launch and Lifecycle Management',
    'Feasibility',
    'Formulation',
    'Development',
    'Testing',
    'Validation',
    'Regulatory'
  ];
  stageFilter: 'all' | Stage = 'all';

  showAssignmentView = false;
  isAddSprintMode = false;
  selectedAssignmentSprintId: string = 'sprint-2';

  assignAvailableTasks: AssignTask[] = [
    { id: 'AT1', name: 'API Characterization & Solid-State Screening', code: 'T-001', module: 'Pre-Formulation', duration: '5d', effort: '40h', selected: false },
    { id: 'AT2', name: 'Excipient Compatibility & Binary Blend DSC', code: 'T-002', module: 'Formulation', duration: '7d', effort: '56h', selected: false },
    { id: 'AT3', name: 'HPLC Assay & Related Substances Method Dev', code: 'T-003', module: 'Analytical R&D', duration: '5d', effort: '40h', selected: false },
    { id: 'AT4', name: 'High-Shear Wet Granulation Optimization', code: 'T-004', module: 'Process Dev', duration: '10d', effort: '80h', selected: false },
    { id: 'AT5', name: 'Dissolution Profiling in Multi-Media Buffers', code: 'T-005', module: 'Analytical R&D', duration: '4d', effort: '32h', selected: false },
    { id: 'AT6', name: 'Container Closure Integrity & Barrier Testing', code: 'T-006', module: 'Packaging Dev', duration: '6d', effort: '48h', selected: false },
    { id: 'AT7', name: 'Accelerated Stability Chamber Protocol (40°C/75% RH)', code: 'T-007', module: 'Quality Control', duration: '5d', effort: '40h', selected: false },
  ];

  assignAssignedTasks: AssignTask[] = [
    { id: 'AT8', name: 'Microbial Enumeration & Sterility Validation', code: 'T-008', module: 'Microbiology', duration: '4d', effort: '32h', selected: false },
    { id: 'AT9', name: 'Pilot-Scale Fluid Bed Dryer Qualification', code: 'T-009', module: 'Engineering', duration: '3d', effort: '24h', selected: false },
    { id: 'AT10', name: 'GCP Clinical Bioequivalence Protocol Review', code: 'T-010', module: 'Clinical / Medical', duration: '2d', effort: '16h', selected: false },
    { id: 'AT11', name: 'eCTD Module 3 Quality Dossier Compilation', code: 'T-011', module: 'Regulatory Affairs', duration: '3d', effort: '24h', selected: false },
  ];

  onAssignmentSprintChange(): void {
    const sprint = this.sprints.find((s) => s.id === this.selectedAssignmentSprintId);
    if (sprint && sprint.tasks && sprint.tasks.length > 0) {
      this.assignAssignedTasks = sprint.tasks.map((t, idx) => ({
        id: `AT-S-${idx + 1}`,
        name: t.task,
        code: t.taskCode || `T-00${idx + 8}`,
        module: t.stage || 'General',
        duration: `${t.duration || 4}d`,
        effort: `${t.effort || 32}h`,
        selected: false,
      }));
    } else {
      this.assignAssignedTasks = [
        { id: 'AT8', name: 'Unit Testing', code: 'T-008', module: 'QA', duration: '4d', effort: '32h', selected: false },
        { id: 'AT9', name: 'Deployment Setup', code: 'T-009', module: 'DevOps', duration: '3d', effort: '24h', selected: false },
        { id: 'AT10', name: 'User Training', code: 'T-010', module: 'Support', duration: '2d', effort: '16h', selected: false },
        { id: 'AT11', name: 'Documentation', code: 'T-011', module: 'Support', duration: '3d', effort: '24h', selected: false },
      ];
    }
  }

  toggleAssignAvailable(t: AssignTask): void {
    t.selected = !t.selected;
  }

  toggleAssignAssigned(t: AssignTask): void {
    t.selected = !t.selected;
  }

  canAddAssignTasks(): boolean {
    return this.assignAvailableTasks.some((t) => t.selected);
  }

  canRemoveAssignTasks(): boolean {
    return this.assignAssignedTasks.some((t) => t.selected);
  }

  addSelectedAssignTasks(): void {
    const toMove = this.assignAvailableTasks.filter((t) => t.selected);
    this.assignAvailableTasks = this.assignAvailableTasks.filter((t) => !t.selected);
    toMove.forEach((t) => (t.selected = false));
    this.assignAssignedTasks.push(...toMove);
  }

  removeSelectedAssignTasks(): void {
    const toMove = this.assignAssignedTasks.filter((t) => t.selected);
    this.assignAssignedTasks = this.assignAssignedTasks.filter((t) => !t.selected);
    toMove.forEach((t) => (t.selected = false));
    this.assignAvailableTasks.push(...toMove);
  }

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineTask: Task | null = null;

  openTimelineModal(task: Task) {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }

  activeTabId = 'backlog';
  activeView: 'grid' | 'kanban' | 'calendar' | 'gantt' = 'grid';

  kanbanStatuses: string[] = ['Pending', 'Allocated', 'In Process', 'On Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<string, Task[]> = {};

  // Calendar state
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDate: Date = new Date(2026, 6, 1);
  calendarCells: CalendarCell[] = [];
  hoveredCellIndex: number = -1;

  sprints: Sprint[] = [
    {
      id: 'backlog',
      label: 'Backlog',
      kind: 'backlog',
      tasks: [
        this.t('Reference Product Characterization', 'TSK-101', 'JOB-21', '2026-01-05', '2026-01-20', 24, 10, "Analyze the reference product's dosage form, strength, physical characteristics, and target quality attributes.", 'Feasibility', 'Pending'),
        this.t('Target Product Profile Definition', 'TSK-102', 'JOB-21', '2026-02-01', '2026-02-25', 20, 8, 'Define the desired quality, performance, and formulation requirements for the generic tablet.', 'Feasibility', 'Pending'),
        this.t('API Characterization', 'TSK-103', 'JOB-22', '2026-03-02', '2026-03-20', 32, 14, 'Evaluate API properties relevant to formulation development and product performance.', 'Formulation', 'Allocated'),
        this.t('API–Excipient Compatibility Study', 'TSK-104', 'JOB-22', '2026-04-05', '2026-04-26', 40, 18, 'Assess potential interactions between the API and selected excipients.', 'Formulation', 'In Process'),
        this.t('Excipient Screening', 'TSK-105', 'JOB-23', '2026-05-02', '2026-05-28', 36, 15, 'Evaluate and shortlist suitable excipients for the tablet formulation.', 'Formulation', 'In Process'),
        this.t('Prototype Formulation Design', 'TSK-106', 'JOB-23', '2026-06-01', '2026-06-22', 48, 20, 'Develop preliminary formulation compositions using the selected API and excipients.', 'Formulation', 'On Hold'),
        this.t('Laboratory Prototype Batch', 'TSK-107', 'JOB-24', '2026-07-01', '2026-07-15', 56, 22, 'Prepare laboratory-scale prototype batches and document formulation and process parameters.', 'Formulation', 'Cancelled'),
        this.t('Dissolution Testing', 'TSK-108', 'JOB-24', '2026-08-03', '2026-08-25', 40, 18, 'Evaluate dissolution performance of prototype batches against predefined targets.', 'Formulation', 'Completed'),
        this.t('Formulation Optimization', 'TSK-109', 'JOB-25', '2026-09-01', '2026-09-18', 60, 25, 'Analyze experimental results and optimize formulation composition and process parameters.', 'Formulation', 'Completed'),
      ],
    },
    {
      id: 'sprint-1',
      label: 'Sprint 1',
      kind: 'completed',
      tasks: [
        { ...this.t('Reference Product Characterization', 'TSK-001', 'JOB-10', '2026-06-01', '2026-06-02', 4, 1, 'Innovator RLD dissolution profile & crystalline form benchmarking.', 'Feasibility', 'Completed'), assigned: 'Aarav Shah', status: 'completed', approved: true, progress: 100, eta: '2026-06-02', actualStart: '2026-06-01', actualFinish: '2026-06-02', expenses: 250 },
        { ...this.t('Target Product Profile Definition', 'TSK-002', 'JOB-10', '2026-06-02', '2026-06-03', 6, 1, 'Define QTPP criteria: assay, purity, content uniformity, stability.', 'Feasibility', 'Completed'), assigned: 'Diego Ruiz', status: 'completed', approved: true, progress: 85, eta: '2026-06-03', actualStart: '2026-06-02', actualFinish: '2026-06-03', expenses: 0 },
        { ...this.t('API Characterization', 'TSK-003', 'JOB-11', '2026-06-03', '2026-06-04', 8, 1, 'Powder XRD, particle size distribution (D10/D50/D90) & DSC analysis.', 'Formulation', 'In Process'), assigned: 'Mei Tanaka', status: 'inprocess', approved: false, progress: 60, eta: '2026-06-04', actualStart: '2026-06-03', actualFinish: '', expenses: 50 },
        { ...this.t('API–Excipient Compatibility Study', 'TSK-004', 'JOB-12', '2026-06-03', '2026-06-05', 6, 2, 'Isothermal stress testing with binders, disintegrants, and lubricants.', 'Formulation', 'Completed'), assigned: 'Olivia Brown', status: 'completed', approved: true, progress: 100, eta: '2026-06-05', actualStart: '2026-06-03', actualFinish: '2026-06-05', expenses: 1200 },
        { ...this.t('Excipient Screening', 'TSK-005', 'JOB-12', '2026-06-02', '2026-06-04', 8, 2, 'Pharmacopoeial compliance and grade selection (USP-NF / Ph. Eur.).', 'Formulation', 'Allocated'), assigned: 'Diego Ruiz', status: 'allocated', approved: false, progress: 25, eta: '2026-06-04', actualStart: '2026-06-02', actualFinish: '', expenses: 0 },
      ],
    },
    {
      id: 'sprint-2',
      label: 'Sprint 2',
      kind: 'active',
      tasks: [
        { ...this.t('Prototype Formulation Design', 'TSK-201', 'JOB-30', '2026-06-25', '2026-07-02', 16, 5, 'DOE formulation trial design matrix across 3 binder concentrations.', 'Formulation', 'In Process'), assigned: 'Priya Nair', status: 'inprocess', approved: false, progress: 75, eta: '2026-07-02', actualStart: '2026-06-26', actualFinish: '', expenses: 120, notes: [{ sender: 'Admin', date: '2026-07-02', text: 'Granulation complete, awaiting compression tool set.' }] },
        { ...this.t('Laboratory Prototype Batch', 'TSK-202', 'JOB-30', '2026-06-26', '2026-06-30', 6, 2, '1 kg pilot blend compression and tablet hardness testing.', 'Formulation', 'Completed'), assigned: 'Priya Nair', status: 'completed', approved: true, progress: 100, eta: '2026-06-30', actualStart: '2026-06-26', actualFinish: '2026-06-29', expenses: 0 },
        { ...this.t('Dissolution Testing', 'TSK-203', 'JOB-31', '2026-06-27', '2026-07-03', 10, 4, 'USP Apparatus II paddle dissolution at pH 1.2, 4.5, and 6.8.', 'Formulation', 'In Process'), assigned: 'Mei Tanaka', status: 'inprocess', approved: false, progress: 40, eta: '2026-07-03', actualStart: '2026-06-28', actualFinish: '', expenses: 50 },
        { ...this.t('Formulation Optimization', 'TSK-204', 'JOB-31', '2026-06-29', '2026-07-01', 4, 2, 'Optimize disintegration time and friability (< 0.5%).', 'Formulation', 'Allocated'), assigned: 'Aarav Shah', status: 'allocated', approved: false, progress: 0, eta: '2026-07-01', actualStart: '', actualFinish: '', expenses: 0 },
      ],
    },
  ];

  private t(
    task: string,
    taskCode: string,
    jobCode: string,
    ps: string,
    pf: string,
    eff: number,
    dur: number,
    desc: string,
    stage: Stage,
    status: string = 'Pending',
  ): Task {
    return { id: taskCode, task, taskCode, jobCode, planStart: ps, planFinish: pf, effort: eff, duration: dur, description: desc, stage, status };
  }

  get activeSprint(): Sprint {
    return this.sprints.find((s) => s.id === this.activeTabId) || this.sprints[0];
  }

  get filteredTasks(): Task[] {
    const tasks = this.activeSprint.tasks;
    return this.stageFilter === 'all' ? tasks : tasks.filter((t) => t.stage === this.stageFilter);
  }

  selectTab(id: string) {
    this.activeTabId = id;
    this.initViewData();
  }

  initials(name?: string): string {
    if (!name) return '';
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  openAddSprint(): void {
    const defaultName = `Sprint ${this.sprints.filter((s) => s.kind !== 'backlog').length + 1}`;
    const dialogRef = this.dialog.open(AddSprintComponent, {
      width: '650px',
      data: { defaultName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.name) {
        const name = result.name.trim();
        const id = name.toLowerCase().replace(/\s+/g, '-');
        this.sprints.push({ id, label: name, kind: 'active', tasks: [] });
        this.activeTabId = id;
        this.initViewData();
      }
    });
  }

  trackById(_i: number, item: { id: string }) {
    return item.id;
  }

  // Calendar View State
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5];
  calendarCards: any[] = [];

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const statusColors: Record<string, string> = {
      Completed: '#a0e4ff',
      completed: '#a0e4ff',
      Progress: '#ffea9f',
      inprocess: '#90ee90',
      'In Process': '#90ee90',
      Hold: '#ffcdd2',
      onhold: '#ffcdd2',
      'On Hold': '#ffcdd2',
      Pending: '#e3b2ff',
      allocated: '#ffea9f',
      Allocated: '#ffea9f',
      Cancelled: '#ffcdd2',
    };

    const pastelPalette = ['#a0e4ff', '#ffea9f', '#ffcdd2', '#90ee90', '#e3b2ff'];
    const daysToDistribute = this.showWeekend ? 7 : 5;

    let tasksToMap = this.filteredTasks;
    if (this.excludeCompleted) {
      tasksToMap = tasksToMap.filter((t) => (t.status || '').toLowerCase() !== 'completed');
    }

    this.calendarCards = tasksToMap.map((task, i) => {
      const pInitials = task.taskCode || task.task.substring(0, 2).toUpperCase();
      const user = task.assigned || this.team[i % this.team.length];
      const statusLabel = this.getStatusLabel(task.status || 'Pending');

      return {
        id: task.id,
        user: user,
        dayPlacement: (i % daysToDistribute) + 1,
        taskName: task.task,
        taskCode: task.taskCode,
        jobCode: task.jobCode,
        projectName: this.projectName || 'Generic Pharma Development',
        stage: task.stage,
        status: statusLabel,
        planStart: task.planStart,
        planFinish: task.planFinish,
        effort: task.effort,
        color: statusColors[task.status || ''] || pastelPalette[i % pastelPalette.length],
        pInitials: pInitials,
        originalTask: task,
      };
    });
  }

  isTemplate: boolean = false;

  setView(view: 'grid' | 'kanban' | 'calendar' | 'gantt') {
    if (this.isTemplate && (view === 'kanban' || view === 'calendar')) return;
    this.activeView = view;
    if (view === 'calendar') {
      this.generateCalendarData();
    }
  }

  getTasksByStage(stage: Stage): Task[] {
    return this.filteredTasks.filter((t) => t.stage === stage);
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.calendarDate.getMonth()]} ${this.calendarDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.calendarDate = new Date(this.calendarDate.getFullYear(), this.calendarDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const cells: CalendarCell[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      cells.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth: cellDate.getMonth() === month,
        isToday: this.isSameDay(cellDate, today),
        tasks: this.getTasksForDate(cellDate),
      });
    }
    this.calendarCells = cells;
  }

  getTasksForDate(date: Date): Task[] {
    const d = this.stripTime(date);
    return this.filteredTasks.filter((t) => {
      if (!t.planStart || !t.planFinish) return false;
      const start = this.stripTime(new Date(t.planStart));
      const end = this.stripTime(new Date(t.planFinish));
      return d >= start && d <= end;
    });
  }

  stripTime(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  initViewData() {
    const tasks = this.filteredTasks;
    if (tasks && tasks.length > 0) {
      let earliest = new Date(tasks[0].planStart);
      for (const t of tasks) {
        const d = new Date(t.planStart);
        if (d < earliest) {
          earliest = d;
        }
      }
      this.calendarDate = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    } else {
      this.calendarDate = new Date(2026, 6, 1);
    }

    const cards: Record<string, Task[]> = {};
    this.kanbanStatuses.forEach((status) => {
      cards[status] = tasks.filter((t) => {
        const s = t.status || 'Pending';
        if (status === 'In Process') return s === 'In Process' || s === 'inprocess' || s === 'Process';
        if (status === 'On Hold') return s === 'On Hold' || s === 'onhold' || s === 'Hold';
        if (status === 'Completed') return s === 'Completed' || s === 'completed' || s === 'Closed';
        return s.toLowerCase() === status.toLowerCase();
      });
    });
    this.kanbanCards = cards;

    this.buildCalendar();
    this.generateCalendarData();
  }

  dropStatus(event: CdkDragDrop<Task[]>, targetStatus: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const task = event.container.data[event.currentIndex];
      task.status = targetStatus;
    }
  }

  // Gantt View logic
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'JAN', fullYear: 2026, monthIndex: 0 },
      { name: 'FEB', fullYear: 2026, monthIndex: 1 },
      { name: 'MAR', fullYear: 2026, monthIndex: 2 },
      { name: 'APR', fullYear: 2026, monthIndex: 3 },
      { name: 'MAY', fullYear: 2026, monthIndex: 4 },
      { name: 'JUN', fullYear: 2026, monthIndex: 5 },
      { name: 'JUL', fullYear: 2026, monthIndex: 6 },
      { name: 'AUG', fullYear: 2026, monthIndex: 7 },
      { name: 'SEP', fullYear: 2026, monthIndex: 8 },
      { name: 'OCT', fullYear: 2026, monthIndex: 9 },
      { name: 'NOV', fullYear: 2026, monthIndex: 10 },
      { name: 'DEC', fullYear: 2026, monthIndex: 11 },
    ];
  }

  get ganttWeeks(): { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] {
    const weeks: { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] = [];
    const months = this.ganttMonths;
    months.forEach((m) => {
      ['W1', 'W2', 'W3', 'W4'].forEach((wLabel, wIdx) => {
        weeks.push({
          label: wLabel,
          monthName: m.name,
          monthIndex: m.monthIndex,
          weekInMonth: wIdx + 1,
        });
      });
    });
    return weeks;
  }

  get ganttDays(): Date[] {
    const tasks = this.filteredTasks;
    if (!tasks || tasks.length === 0) return [];

    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const t of tasks) {
      if (!t.planStart || !t.planFinish) continue;
      const start = new Date(t.planStart);
      const finish = new Date(t.planFinish);
      if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

      if (!minDate || start < minDate) minDate = start;
      if (!maxDate || finish > maxDate) maxDate = finish;
    }

    if (!minDate || !maxDate) return [];

    const days: Date[] = [];
    let current = new Date(minDate);
    let count = 0;
    while (current <= maxDate && count < 120) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      count++;
    }
    return days;
  }

  private getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  getGanttBars(t: Task): TaskBar[] {
    if (this.ganttScale === 'daily') {
      return [{ planStart: t.planStart, planFinish: t.planFinish, stage: t.stage, effort: t.effort }];
    }
    if (t.bars && t.bars.length > 0) {
      return t.bars;
    }
    return this.generateRandomBarsForTask(t);
  }

  generateRandomBarsForTask(t: Task): TaskBar[] {
    const seed = (t.taskCode || t.id || 'TSK-100').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = 2 + (seed % 3);
    const bars: TaskBar[] = [];

    const startMonths = [
      seed % 3,
      3 + (seed % 3),
      6 + (seed % 3),
      9 + ((seed + 1) % 3),
    ];

    const stages: Stage[] = ['Feasibility', 'Formulation', 'Development', 'Testing', 'Validation', 'Regulatory'];

    for (let i = 0; i < count; i++) {
      const m = startMonths[i];
      const startDay = 1 + ((seed * (i + 1) * 7) % 12);
      const durationDays = 12 + ((seed * (i + 1) * 3) % 10);

      const monthStr = (m + 1).toString().padStart(2, '0');
      const dayStr = startDay.toString().padStart(2, '0');
      const startIso = `2026-${monthStr}-${dayStr}`;

      const finishDate = new Date(2026, m, startDay + durationDays);
      const finishMonthStr = (finishDate.getMonth() + 1).toString().padStart(2, '0');
      const finishDayStr = finishDate.getDate().toString().padStart(2, '0');
      const finishIso = `2026-${finishMonthStr}-${finishDayStr}`;

      const barStage = stages[(seed + i) % stages.length];
      const barEffort = 8 + ((seed * (i + 1)) % 28);

      bars.push({
        planStart: startIso,
        planFinish: finishIso,
        stage: barStage,
        effort: barEffort,
      });
    }

    return bars;
  }

  getGanttBarStyleFor(bar: TaskBar): any {
    if (!bar || !bar.planStart || !bar.planFinish) return { display: 'none' };

    const start = new Date(bar.planStart);
    const finish = new Date(bar.planFinish);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

    if (this.ganttScale === 'monthly') {
      const totalMonths = 12;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startVal = startM + (startD - 1) / startDaysTotal;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishVal = finishM + finishD / finishDaysTotal;

      const leftPercent = (startVal / totalMonths) * 100;
      const widthPercent = Math.max(0.8, ((finishVal - startVal) / totalMonths) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`,
      };
    } else if (this.ganttScale === 'weekly') {
      const totalWeeks = 48;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startWeekVal = startM * 4 + ((startD - 1) / startDaysTotal) * 4;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishWeekVal = finishM * 4 + (finishD / finishDaysTotal) * 4;

      const leftPercent = (startWeekVal / totalWeeks) * 100;
      const widthPercent = Math.max(0.8, ((finishWeekVal - startWeekVal) / totalWeeks) * 100);

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`,
      };
    } else {
      const days = this.ganttDays;
      const totalDays = days.length;
      if (totalDays === 0) return { display: 'none' };

      const startStripped = this.stripTime(start);
      const finishStripped = this.stripTime(finish);

      let startIndex = -1;
      for (let i = 0; i < days.length; i++) {
        if (this.stripTime(days[i]).getTime() === startStripped.getTime()) {
          startIndex = i;
          break;
        }
      }
      if (startIndex === -1) {
        if (startStripped < this.stripTime(days[0])) {
          startIndex = 0;
        } else {
          return { display: 'none' };
        }
      }

      let spanDays = Math.round((finishStripped.getTime() - startStripped.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (spanDays <= 0) spanDays = 1;

      if (startIndex + spanDays > totalDays) {
        spanDays = totalDays - startIndex;
      }

      const leftPercent = (startIndex / totalDays) * 100;
      const widthPercent = (spanDays / totalDays) * 100;

      return {
        left: `${leftPercent.toFixed(2)}%`,
        width: `${widthPercent.toFixed(2)}%`,
      };
    }
  }

  getGanttBarStyle(t: Task): any {
    return this.getGanttBarStyleFor({ planStart: t.planStart, planFinish: t.planFinish });
  }

  getTabClasses(s: Sprint): string[] {
    const classes = ['tab-btn'];
    if (this.activeTabId === s.id) {
      classes.push('tab-btn--active', `tab-btn--${s.kind}`);
    }
    classes.push(`tab-btn--${s.id}`);
    return classes;
  }

  getStageClasses(stage: Stage | string): string[] {
    const s = (stage || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ['stage-badge', `stage-badge--${s}`];
  }

  getStatusClasses(status: string): string[] {
    const s = (status || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ['status-badge', `status-badge--${s}`];
  }

  getStatusLabel(status: string): string {
    if (!status) return '—';
    if (status === 'inprocess') return 'In Process';
    if (status === 'onhold') return 'On Hold';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  colSpanForActiveSprint(): number {
    return this.activeSprint.kind === 'backlog' ? 9 : 11;
  }

  deleteAsset(item: Task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this task record?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const sprint = this.activeSprint;
        sprint.tasks = sprint.tasks.filter((t) => t.id !== item.id);
        this.initViewData();
      }
    });
  }

  editAsset(item: Task): void {
    const dialogRef = this.dialog.open(EditBacklogTaskComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      data: {
        task: item,
        isSprint: this.activeSprint.kind !== 'backlog',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(item, result);
        this.initViewData();
      }
    });
  }

  @ViewChild('notesDialog') notesDialog!: TemplateRef<any>;

  getSliderColor(percent: number): string {
    if (!percent && percent !== 0) return '#0000ff';
    if (percent <= 30) return '#0000ff';
    if (percent > 30 && percent <= 80) return '#ffb300';
    if (percent === 100) return '#ff0000';
    return '#008000';
  }

  openNotesDialog(task: Task): void {
    this.dialog.open(this.notesDialog, {
      width: '500px',
      data: task,
    });
  }

  addNoteMessage(task: Task, text: string): void {
    if (!text || !text.trim()) return;
    if (!task.notes) {
      task.notes = [];
    }
    task.notes.push({
      sender: 'Admin',
      date: new Date().toISOString().split('T')[0],
      text: text.trim(),
    });
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

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

  private subs = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location,
  ) {
    this.initViewData();
  }

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      this.isTemplate =
        params['isTemplate'] === 'true' ||
        params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' ||
        params['fromTemplate'] === true;
      if (this.isTemplate && (this.activeView === 'kanban' || this.activeView === 'calendar')) {
        this.activeView = 'grid';
      }
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.subs.add(sub);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openAssignmentPopup(mode: 'sprint' | 'task' = 'sprint'): void {
    this.isAddSprintMode = mode === 'sprint';
    if (this.isAddSprintMode) {
      if (this.activeTabId && this.activeTabId !== 'backlog') {
        this.selectedAssignmentSprintId = this.activeTabId;
      } else if (this.sprints.length > 1) {
        this.selectedAssignmentSprintId = this.sprints[1].id;
      }
    } else {
      this.selectedAssignmentSprintId = this.activeTabId;
    }
    this.onAssignmentSprintChange();
    this.showAssignmentView = true;
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }
}
