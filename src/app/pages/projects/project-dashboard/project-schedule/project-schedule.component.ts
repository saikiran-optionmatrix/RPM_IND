import { Component, OnInit, ElementRef, ViewChild, HostListener, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HoursProjectPopComponent } from '../../../hours/hours-project-pop/hours-project-pop.component';

export interface AllocationTaskDetail {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description?: string;
}

export interface AllocationEntry {
  id?: number | string;
  dateObj: Date;
  name: string;
  workHours?: number;
  projectsCount: number;
  projects?: string[];
  tasks?: string;
  tasksList: AllocationTaskDetail[];
  approved: number;
  declined: number;
  pending: number;
  totalHours: number;
  hours?: number;
  totalWorkHours?: number;
  loadPercentage: number;
}

export interface AllocationCalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

export interface ScheduleTask {
  id: string;
  name: string;
  module: string;
  assignee: string;
  planStart: Date;
  planEnd: Date;
  actualStartObj: Date | null;
  actualEndObj: Date | null;
  status: 'Pending' | 'In Process' | 'Completed' | 'Overdue';
  completion: number;
  stage: string;
  sprint?: string;
}

export interface TimelineDay {
  date: number;
  name: string;
}

export interface TimelineMonth {
  name: string;
  daysCount: number;
  width: number;
}

export interface GanttBar {
  left: number;
  width: number;
  color: string;
  label: string;
  completion?: number;
}

@Component({
  selector: 'app-project-schedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  templateUrl: './project-schedule.component.html',
  styleUrl: './project-schedule.component.scss'
})
export class ProjectScheduleComponent implements OnInit {
  @ViewChild('ganttViewport') ganttViewport!: ElementRef<HTMLDivElement>;
  @ViewChild('allocationTasksDialog') allocationTasksDialog!: TemplateRef<any>;
  @ViewChild('allocationProjectsDialog') allocationProjectsDialog!: TemplateRef<any>;

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  viewMode: 'grid' | 'gantt' | 'allocation' = 'gantt';
  isMaskingPending: boolean = false;
  isCriticalPath: boolean = false;

  filterToggle: boolean = false;
  stages: string[] = [
    'Feasibility',
    'Formulation',
    'Development',
    'Testing',
    'Validation',
    'Regulatory'
  ];
  stageFilter: string = 'Feasibility';
  sprints: string[] = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
  sprintFilter: string = 'all';
  modules: string[] = [
    'Feasibility',
    'Formulation',
    'Development',
    'Testing',
    'Validation',
    'Regulatory'
  ];
  moduleFilter: string = 'all';

  // Custom splitter state
  leftPaneWidth: number = 560;
  isResizing: boolean = false;
  timelineDays: TimelineDay[] = [];
  timelineMonths: TimelineMonth[] = [];
  dayWidth: number = 36; // width in pixels of each day column
  private startResizeX: number = 0;
  private startPaneWidth: number = 0;
  private containerElemWidth: number = 1200;

  // Allocation calendar & data state
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  currentAllocationDate: Date = new Date(2026, 5, 1);
  selectedAllocationDate: Date | null = null;
  allocationCalendarDays: AllocationCalendarDay[] = [];
  filteredAllocations: AllocationEntry[] = [];
  paginatedAllocations: AllocationEntry[] = [];
  allocationPageSize: number = 10;
  allocationCurrentPage: number = 1;

  defaultAllocationProjects: string[] = [
    '2026/GEN/001 - Generic Tablet Development',
    '2026/RD/001 - Abiraterone Acetate Film Coated',
    '2026/RD/002 - Apremilast Tablets',
    '2026/RD/003 - Brivaracetam Film Coated Tablets'
  ];

  allocationEntries: AllocationEntry[] = [
    {
      id: 1,
      dateObj: new Date(2026, 5, 2),
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated', '2026/RD/002 - Apremilast Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Feasibility', task: 'Reference Product Characterization', hours: 4.5, description: 'Physicochemical characterization and comparative profiling' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Pre-Formulation', task: 'API Solid State Testing', hours: 3.5, description: 'Evaluation of solid-state properties and polymorphic form' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 2,
      dateObj: new Date(2026, 5, 2),
      name: 'Anita Desai',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/002 - Apremilast Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Formulation', task: 'API–Excipient Compatibility', hours: 4.5, description: 'Isothermal stress testing and binary blend studies' },
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Pre-Formulation', task: 'Excipient Screening', hours: 3.0, description: 'Functional screening of binders and disintegrants' }
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94
    },
    {
      id: 3,
      dateObj: new Date(2026, 5, 2),
      name: 'Priya Reddy',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/003 - Brivaracetam Film Coated Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Development', task: 'Comparative Dissolution Testing', hours: 5.0, description: 'Dissolution profile testing across pH buffers' },
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Analytical Development', task: 'Method Robustness Study', hours: 3.5, description: 'Assay method robustness testing' }
      ],
      approved: 5.0,
      declined: 0.0,
      pending: 3.5,
      totalHours: 8.5,
      hours: 8.5,
      totalWorkHours: 8.5,
      loadPercentage: 106
    },
    {
      id: 4,
      dateObj: new Date(2026, 5, 2),
      name: 'Suresh Naidu',
      workHours: 8.0,
      projectsCount: 1,
      projects: ['2026/GEN/001 - Generic Tablet Development'],
      tasks: '1/2',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Validation', task: 'Granulation Parameter Optimization', hours: 6.5, description: 'Binder addition rate and endpoint determination' }
      ],
      approved: 0.0,
      declined: 0.0,
      pending: 6.5,
      totalHours: 6.5,
      hours: 6.5,
      totalWorkHours: 6.5,
      loadPercentage: 81
    },
    {
      id: 5,
      dateObj: new Date(2026, 5, 3),
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Feasibility', task: 'Target Product Profile Formulation', hours: 4.0, description: 'TPP matrix parameter establishment' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Pre-Formulation', task: 'Solubility & Permeability Assay', hours: 4.0, description: 'BCS class determination assay' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 6,
      dateObj: new Date(2026, 5, 3),
      name: 'Amit Patel',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/003 - Brivaracetam Film Coated Tablets', '2026/RD/010 - Olaparib Film Coated Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Development', task: 'Compression Trial Hardness Testing', hours: 4.5, description: 'Tablet compression parameter study' },
        { project: '2026/RD/010 - Olaparib Film Coated Tablets', module: 'Development', task: 'Film Coating Uniformity Trial', hours: 3.5, description: 'Pan speed and spray rate calibration' }
      ],
      approved: 4.5,
      declined: 0.0,
      pending: 3.5,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 7,
      dateObj: new Date(2026, 5, 5),
      name: 'Diego Ruiz',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Regulatory', task: 'Regulatory Strategy Definition', hours: 5.0, description: 'FDA and EMA regulatory pathway review' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Regulatory', task: 'Module 3 Dossier Review', hours: 3.0, description: 'Quality overall summary review' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 8,
      dateObj: new Date(2026, 5, 5),
      name: 'Aarav Shah',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/002 - Apremilast Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Testing', task: 'Stability Testing Protocol Setup', hours: 4.0, description: 'Accelerated and real-time stability chamber allocation' },
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Testing', task: 'Photostability Testing Protocol', hours: 3.5, description: 'ICH Q1B light stress trial' }
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94
    },
    {
      id: 9,
      dateObj: new Date(2026, 5, 8),
      name: 'Olivia Brown',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated', '2026/RD/002 - Apremilast Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Feasibility', task: 'Project Costing & Resource Planning', hours: 4.0, description: 'Project budget estimation and milestones' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Regulatory', task: 'External CRO Negotiation', hours: 4.0, description: 'Clinical study budget and contract finalizing' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 10,
      dateObj: new Date(2026, 5, 10),
      name: 'Anita Desai',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/010 - Olaparib Film Coated Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Formulation', task: 'QbD Risk Assessment Matrix', hours: 5.5, description: 'Failure modes and effect analysis (FMEA)' },
        { project: '2026/RD/010 - Olaparib Film Coated Tablets', module: 'Formulation', task: 'Prototype Trial Formulation', hours: 3.5, description: 'Initial small scale pilot blend' }
      ],
      approved: 0.0,
      declined: 9.0,
      pending: 0.0,
      totalHours: 9.0,
      hours: 9.0,
      totalWorkHours: 9.0,
      loadPercentage: 113
    },
    {
      id: 11,
      dateObj: new Date(2026, 5, 12),
      name: 'Priya Reddy',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/003 - Brivaracetam Film Coated Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Testing', task: 'Degradation Products Identification', hours: 4.5, description: 'Forced degradation study (acid, base, peroxide, heat)' },
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Testing', task: 'Assay Method Validation Protocol', hours: 3.5, description: 'Linearity and precision verification' }
      ],
      approved: 4.5,
      declined: 0.0,
      pending: 3.5,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 12,
      dateObj: new Date(2026, 5, 15),
      name: 'Suresh Naidu',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/002 - Apremilast Tablets'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Development', task: 'Pilot Scale Batch Manufacturing', hours: 5.0, description: 'Batch execution in GMP pilot plant' },
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Scale-Up', task: 'Equipment Train Compatibility', hours: 2.5, description: 'Capacity calculation for production blender' }
      ],
      approved: 7.5,
      declined: 0.0,
      pending: 0.0,
      totalHours: 7.5,
      hours: 7.5,
      totalWorkHours: 7.5,
      loadPercentage: 94
    },
    {
      id: 13,
      dateObj: new Date(2026, 5, 18),
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Testing', task: 'Accelerated 1-Month Stability Pull', hours: 4.0, description: 'Physical and chemical testing at 40°C/75% RH' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Testing', task: 'Dissolution Profiling Stability Pull', hours: 4.0, description: 'Dissolution comparison against innovator' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 14,
      dateObj: new Date(2026, 5, 22),
      name: 'Amit Patel',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/010 - Olaparib Film Coated Tablets'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Validation', task: 'Process Validation Protocol Drafting', hours: 4.5, description: 'Critical process parameter (CPP) definition' },
        { project: '2026/RD/010 - Olaparib Film Coated Tablets', module: 'Validation', task: 'Hold-Time Study Protocol', hours: 3.5, description: 'Granule and core tablet hold-time evaluation' }
      ],
      approved: 8.0,
      declined: 0.0,
      pending: 0.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    },
    {
      id: 15,
      dateObj: new Date(2026, 5, 25),
      name: 'Diego Ruiz',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/GEN/001 - Generic Tablet Development', '2026/RD/001 - Abiraterone Acetate Film Coated'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/GEN/001 - Generic Tablet Development', module: 'Regulatory', task: 'Bioequivalence Study Protocol Review', hours: 4.5, description: 'Clinical study design and sample size verification' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Regulatory', task: 'Ethics Committee Submission Package', hours: 3.5, description: 'Informed consent and investigator brochure assembly' }
      ],
      approved: 0.0,
      declined: 0.0,
      pending: 8.0,
      totalHours: 8.0,
      hours: 8.0,
      totalWorkHours: 8.0,
      loadPercentage: 100
    }
  ];

  // ─── Critical Path Tasks (Sequential, Non-overlapping chain) ─────────────
  criticalPathTasks: ScheduleTask[] = [
    {
      id: 'CP-1',
      name: 'Reference Product Characterization',
      module: 'Feasibility',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 1),
      planEnd: new Date(2026, 5, 18),
      actualStartObj: new Date(2026, 5, 1),
      actualEndObj: new Date(2026, 5, 18),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'CP-2',
      name: 'API–Excipient Compatibility Study',
      module: 'Formulation',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 19),
      planEnd: new Date(2026, 6, 8),
      actualStartObj: new Date(2026, 5, 19),
      actualEndObj: new Date(2026, 6, 8),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'CP-3',
      name: 'Laboratory Prototype Batch',
      module: 'Formulation',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 9),
      planEnd: new Date(2026, 6, 30),
      actualStartObj: new Date(2026, 6, 9),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'CP-4',
      name: 'Analytical Method Development',
      module: 'Development',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 31),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: new Date(2026, 6, 31),
      actualEndObj: null,
      status: 'In Process',
      completion: 40,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-5',
      name: 'Pilot Batch Scale-Up',
      module: 'Testing',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 7, 21),
      planEnd: new Date(2026, 8, 10),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-6',
      name: 'Process Validation Batches',
      module: 'Validation',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 11),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    {
      id: 'CP-7',
      name: 'Regulatory Dossier Preparation & Filing',
      module: 'Regulatory',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 9, 3),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    }
  ];

  allTasks: ScheduleTask[] = [
    // Feasibility Stage
    {
      id: 'T1',
      name: 'Reference Product Characterization',
      module: 'Feasibility',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 1),
      planEnd: new Date(2026, 5, 10),
      actualStartObj: new Date(2026, 5, 1),
      actualEndObj: new Date(2026, 5, 10),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T2',
      name: 'Target Product Profile (TPP) Definition',
      module: 'Feasibility',
      assignee: 'Ravi Shah',
      planStart: new Date(2026, 5, 5),
      planEnd: new Date(2026, 5, 18),
      actualStartObj: new Date(2026, 5, 5),
      actualEndObj: new Date(2026, 5, 18),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T3',
      name: 'API Source & Vendor Qualification',
      module: 'Feasibility',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 10),
      planEnd: new Date(2026, 5, 25),
      actualStartObj: new Date(2026, 5, 10),
      actualEndObj: new Date(2026, 5, 25),
      status: 'Completed',
      completion: 100,
      stage: 'Feasibility',
      sprint: 'Sprint 1'
    },
    {
      id: 'T4',
      name: 'Preformulation & Physicochemical Testing',
      module: 'Feasibility',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 5, 15),
      planEnd: new Date(2026, 6, 5),
      actualStartObj: new Date(2026, 5, 15),
      actualEndObj: null,
      status: 'In Process',
      completion: 80,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T5',
      name: 'Freedom-to-Operate (FTO) Patent Assessment',
      module: 'Feasibility',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 5, 20),
      planEnd: new Date(2026, 6, 10),
      actualStartObj: new Date(2026, 5, 20),
      actualEndObj: null,
      status: 'In Process',
      completion: 60,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T6',
      name: 'Cost of Goods Sold (COGS) Feasibility Model',
      module: 'Feasibility',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 5, 25),
      planEnd: new Date(2026, 6, 15),
      actualStartObj: new Date(2026, 5, 25),
      actualEndObj: null,
      status: 'Overdue',
      completion: 40,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    {
      id: 'T7',
      name: 'Regulatory Pathway & Risk Evaluation',
      module: 'Feasibility',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    // Formulation Stage
    {
      id: 'T8',
      name: 'API Characterization',
      module: 'Formulation',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 10),
      planEnd: new Date(2026, 5, 24),
      actualStartObj: new Date(2026, 5, 10),
      actualEndObj: new Date(2026, 5, 23),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 1'
    },
    {
      id: 'T9',
      name: 'API–Excipient Compatibility Study',
      module: 'Formulation',
      assignee: 'Mia Chen',
      planStart: new Date(2026, 5, 18),
      planEnd: new Date(2026, 6, 2),
      actualStartObj: new Date(2026, 5, 18),
      actualEndObj: new Date(2026, 6, 2),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T10',
      name: 'Excipient Screening',
      module: 'Formulation',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 5, 25),
      planEnd: new Date(2026, 6, 10),
      actualStartObj: new Date(2026, 5, 25),
      actualEndObj: new Date(2026, 6, 10),
      status: 'Completed',
      completion: 100,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T11',
      name: 'Prototype Formulation Design',
      module: 'Formulation',
      assignee: 'Ravi Shah',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 18),
      actualStartObj: new Date(2026, 6, 1),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Formulation',
      sprint: 'Sprint 2'
    },
    {
      id: 'T12',
      name: 'Laboratory Prototype Batch',
      module: 'Formulation',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 6, 10),
      planEnd: new Date(2026, 6, 28),
      actualStartObj: new Date(2026, 6, 10),
      actualEndObj: null,
      status: 'In Process',
      completion: 50,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'T13',
      name: 'Dissolution Testing',
      module: 'Formulation',
      assignee: 'Ana Vega',
      planStart: new Date(2026, 6, 18),
      planEnd: new Date(2026, 7, 5),
      actualStartObj: new Date(2026, 6, 18),
      actualEndObj: null,
      status: 'Overdue',
      completion: 30,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    {
      id: 'T14',
      name: 'Formulation Optimization',
      module: 'Formulation',
      assignee: 'Mei Tanaka',
      planStart: new Date(2026, 6, 25),
      planEnd: new Date(2026, 7, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Formulation',
      sprint: 'Sprint 3'
    },
    // Development Stage
    {
      id: 'T15',
      name: 'Analytical Method Development',
      module: 'Development',
      assignee: 'Sara Iqbal',
      planStart: new Date(2026, 7, 1),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    {
      id: 'T16',
      name: 'Stability Studies Initiation',
      module: 'Development',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 7, 12),
      planEnd: new Date(2026, 7, 30),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Development',
      sprint: 'Sprint 4'
    },
    // Testing Stage
    {
      id: 'T17',
      name: 'Pilot Batch Scale-Up',
      module: 'Testing',
      assignee: 'Priya Nair',
      planStart: new Date(2026, 7, 22),
      planEnd: new Date(2026, 8, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 4'
    },
    {
      id: 'T18',
      name: 'Bioequivalence (BE) Study Readiness',
      module: 'Testing',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 1),
      planEnd: new Date(2026, 8, 22),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Testing',
      sprint: 'Sprint 5'
    },
    // Validation Stage
    {
      id: 'T19',
      name: 'Process Validation Batches',
      module: 'Validation',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 8, 15),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    {
      id: 'T20',
      name: 'Commercial Site Tech Transfer',
      module: 'Validation',
      assignee: 'Diego Ruiz',
      planStart: new Date(2026, 8, 25),
      planEnd: new Date(2026, 9, 15),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Validation',
      sprint: 'Sprint 5'
    },
    // Regulatory Stage
    {
      id: 'T21',
      name: 'Regulatory Dossier Preparation & Filing',
      module: 'Regulatory',
      assignee: 'Olivia Brown',
      planStart: new Date(2026, 9, 5),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Regulatory',
      sprint: 'Sprint 5'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['view'] && ['grid', 'gantt', 'allocation'].includes(params['view'])) {
        this.viewMode = params['view'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.initializeTimelineDays();

    // Initialize allocation calendar & default selected date (June 2, 2026)
    this.buildAllocationCalendar();
    const defaultAllocationDay =
      this.allocationCalendarDays.find(d => d.inCurrentMonth && d.dayNumber === 2) ||
      this.allocationCalendarDays.find(d => d.inCurrentMonth);
    if (defaultAllocationDay) {
      this.filterAllocationByDate(defaultAllocationDay);
    }
  }

  toggleCriticalPath(): void {
    this.isCriticalPath = !this.isCriticalPath;
  }

  onStageChange(): void {
    if (this.isCriticalPath) {
      this.isCriticalPath = false;
    }
  }

  get stats() {
    let tasks = this.isCriticalPath ? this.criticalPathTasks : this.allTasks;
    if (!this.isCriticalPath) {
      if (this.stageFilter && this.stageFilter !== 'all') {
        tasks = tasks.filter(t => t.stage === this.stageFilter);
      }
      if (this.sprintFilter && this.sprintFilter !== 'all') {
        tasks = tasks.filter(t => t.sprint === this.sprintFilter);
      }
      if (this.moduleFilter && this.moduleFilter !== 'all') {
        tasks = tasks.filter(t => t.module === this.moduleFilter);
      }
    }
    return {
      pending: tasks.filter(t => t.status === 'Pending').length,
      inProcess: tasks.filter(t => t.status === 'In Process').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length
    };
  }

  applyFilter(): void {
    if (this.isCriticalPath) {
      this.isCriticalPath = false;
    }
  }

  clearFilter(): void {
    this.isCriticalPath = false;
    this.stageFilter = 'Feasibility';
    this.sprintFilter = 'all';
    this.moduleFilter = 'all';
  }

  get displayedTasks(): ScheduleTask[] {
    let tasks = this.isCriticalPath ? this.criticalPathTasks : this.allTasks;
    if (this.isMaskingPending) {
      tasks = tasks.filter(x => x.status !== 'Pending');
    }
    if (!this.isCriticalPath) {
      if (this.stageFilter && this.stageFilter !== 'all') {
        tasks = tasks.filter(x => x.stage === this.stageFilter);
      }
      if (this.sprintFilter && this.sprintFilter !== 'all') {
        tasks = tasks.filter(x => x.sprint === this.sprintFilter);
      }
      if (this.moduleFilter && this.moduleFilter !== 'all') {
        tasks = tasks.filter(x => x.module === this.moduleFilter);
      }
    }
    return tasks;
  }

  getStatusClass(status: string): string {
    return (status || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  get totalTimelineWidth(): number {
    return this.timelineDays.length * this.dayWidth;
  }

  initializeTimelineDays(): void {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const tempDays: TimelineDay[] = [];
    const tempMonths: TimelineMonth[] = [];

    const startDate = new Date(2026, 5, 1); // 1 Jun 2026
    const endDate = new Date(2026, 9, 31);   // 31 Oct 2026

    const monthNames = ['June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026'];
    let current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let currentMonthName = '';
    let currentMonthCount = 0;

    while (current <= endDate) {
      const dayLetter = daysOfWeek[current.getDay()];
      const mIdx = current.getMonth() - 5;
      const mName = (mIdx >= 0 && mIdx < monthNames.length) ? monthNames[mIdx] : '';

      tempDays.push({
        date: current.getDate(),
        name: dayLetter
      });

      if (mName !== currentMonthName) {
        if (currentMonthName !== '') {
          tempMonths.push({
            name: currentMonthName,
            daysCount: currentMonthCount,
            width: currentMonthCount * this.dayWidth
          });
        }
        currentMonthName = mName;
        currentMonthCount = 0;
      }
      currentMonthCount++;

      current.setDate(current.getDate() + 1);
    }

    if (currentMonthCount > 0) {
      tempMonths.push({
        name: currentMonthName,
        daysCount: currentMonthCount,
        width: currentMonthCount * this.dayWidth
      });
    }

    this.timelineDays = tempDays;
    this.timelineMonths = tempMonths;
  }

  setView(mode: 'grid' | 'gantt' | 'allocation'): void {
    this.viewMode = mode;
  }

  toggleMaskPending(): void {
    this.isMaskingPending = !this.isMaskingPending;
  }

  formatDate(d: Date | null): string {
    if (!d) return '—';
    const monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${monthList[d.getMonth()]}`;
  }

  scrollGantt(direction: 'left' | 'right'): void {
    if (this.ganttViewport) {
      const scrollAmount = 350;
      const element = this.ganttViewport.nativeElement;
      const targetScroll = direction === 'right' ? element.scrollLeft + scrollAmount : element.scrollLeft - scrollAmount;
      element.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  }

  // ─── Custom Resizable Splitter Logic ────────────────────────────────────

  initResize(event: MouseEvent): void {
    this.isResizing = true;
    event.preventDefault();

    this.startResizeX = event.clientX;
    this.startPaneWidth = this.leftPaneWidth;

    const container = (event.target as HTMLElement).closest('.gantt-split-container');
    if (container) {
      this.containerElemWidth = container.clientWidth;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isResizing) {
      const deltaX = event.clientX - this.startResizeX;
      this.leftPaneWidth = Math.max(200, Math.min(this.containerElemWidth - 100, this.startPaneWidth + deltaX));
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.isResizing) {
      this.isResizing = false;
    }
  }

  // ─── Gantt Bars Calculation ─────────────────────────────────────────────

  getDayOffset(d: Date): number {
    const timelineStart = new Date(2026, 5, 1);
    const startOfD = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const startOfTimeline = new Date(timelineStart.getFullYear(), timelineStart.getMonth(), timelineStart.getDate());
    const diffTime = startOfD.getTime() - startOfTimeline.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getPlanBar(task: ScheduleTask): GanttBar | null {
    if (!task.planStart || !task.planEnd) return null;
    const startOffset = this.getDayOffset(task.planStart);
    const endOffset = this.getDayOffset(task.planEnd);

    const totalDays = this.timelineDays.length;
    const startDay = Math.max(0, Math.min(totalDays - 1, startOffset));
    const endDay = Math.max(0, Math.min(totalDays - 1, endOffset));

    const left = startDay * this.dayWidth;
    const width = Math.max(this.dayWidth, (endDay - startDay + 1) * this.dayWidth);

    return {
      left,
      width,
      color: '#86efac', // Soft pastel green for Planned schedule
      label: 'Plan'
    };
  }

  getActualBar(task: ScheduleTask): GanttBar | null {
    if (!task.actualStartObj) return null;
    const startOffset = this.getDayOffset(task.actualStartObj);

    // If ongoing, actual spans to late August 2026 tracking date
    const endOffset = task.actualEndObj
      ? this.getDayOffset(task.actualEndObj)
      : this.getDayOffset(new Date(2026, 7, 27));

    const totalDays = this.timelineDays.length;
    const startDay = Math.max(0, Math.min(totalDays - 1, startOffset));
    const endDay = Math.max(0, Math.min(totalDays - 1, endOffset));

    const left = startDay * this.dayWidth;
    const width = Math.max(this.dayWidth, (endDay - startDay + 1) * this.dayWidth);

    let color = '#10b981'; // Rich emerald green for Completed
    if (task.status === 'In Process') {
      color = '#3b82f6';
    } else if (task.status === 'Overdue') {
      color = '#ef4444';
    }

    return {
      left,
      width,
      color,
      label: 'Actual',
      completion: task.completion
    };
  }

  getCriticalPathBar(task: ScheduleTask): GanttBar | null {
    if (!task.planStart || !task.planEnd) return null;
    const startOffset = this.getDayOffset(task.planStart);
    const endOffset = this.getDayOffset(task.planEnd);

    const totalDays = this.timelineDays.length;
    const startDay = Math.max(0, Math.min(totalDays - 1, startOffset));
    const endDay = Math.max(0, Math.min(totalDays - 1, endOffset));

    const left = startDay * this.dayWidth;
    const width = Math.max(this.dayWidth, (endDay - startDay + 1) * this.dayWidth);

    return {
      left,
      width,
      color: '#ef4444', // Red color for Critical Path
      label: 'Critical Path',
      completion: task.completion
    };
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  // ─── Allocation Calendar & Methods ──────────────────────────────────────────

  get currentAllocationMonthLabel(): string {
    return `${this.monthNames[this.currentAllocationDate.getMonth()]} ${this.currentAllocationDate.getFullYear()}`;
  }

  prevAllocationMonth(): void {
    this.currentAllocationDate = new Date(this.currentAllocationDate.getFullYear(), this.currentAllocationDate.getMonth() - 1, 1);
    this.buildAllocationCalendar();
  }

  nextAllocationMonth(): void {
    this.currentAllocationDate = new Date(this.currentAllocationDate.getFullYear(), this.currentAllocationDate.getMonth() + 1, 1);
    this.buildAllocationCalendar();
  }

  buildAllocationCalendar(): void {
    const year = this.currentAllocationDate.getFullYear();
    const month = this.currentAllocationDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const days: AllocationCalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const inCurrentMonth = cellDate.getMonth() === month;
      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday: this.isSameDay(cellDate, today),
        isSelected: this.selectedAllocationDate ? this.isSameDay(cellDate, this.selectedAllocationDate) : false,
        claims: inCurrentMonth ? this.allocationEntries.filter(e => this.isSameDay(e.dateObj, cellDate)).length : 0
      });
    }
    this.allocationCalendarDays = days;
  }

  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  filterAllocationByDate(day: AllocationCalendarDay): void {
    if (!day.inCurrentMonth) return;

    this.selectedAllocationDate = day.date;
    this.filteredAllocations = this.allocationEntries.filter(e => this.isSameDay(e.dateObj, day.date));

    for (const d of this.allocationCalendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }

    this.allocationCurrentPage = 1;
    this.updateAllocationPagination();
  }

  updateAllocationPagination(): void {
    const startIndex = (this.allocationCurrentPage - 1) * this.allocationPageSize;
    const endIndex = startIndex + Number(this.allocationPageSize);
    this.paginatedAllocations = this.filteredAllocations.slice(startIndex, endIndex);
  }

  handleAllocationPageEvent(event: PageEvent): void {
    this.allocationCurrentPage = event.pageIndex + 1;
    this.allocationPageSize = event.pageSize;
    this.updateAllocationPagination();
  }

  get totalAllocationsInRange(): number {
    return this.allocationCalendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  formatAllocationDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  getTaskFraction(entry: AllocationEntry): string {
    if (entry.tasks && entry.tasks.includes('/')) {
      const parts = entry.tasks.split('/');
      const num = parseInt(parts[0], 10);
      const den = parseInt(parts[1], 10);
      if (!isNaN(num) && !isNaN(den) && den > 0) {
        return num <= den ? `${num}/${den}` : `${den}/${num}`;
      }
      return entry.tasks;
    }
    const numerator = entry.tasksList ? entry.tasksList.length : 1;
    const denominator = Math.max(numerator, numerator + 2);
    return `${numerator}/${denominator}`;
  }

  getAllocationTotal(entry: AllocationEntry): number {
    return Number(((entry.approved || 0) + (entry.declined || 0) + (entry.pending || 0)).toFixed(1));
  }

  openAllocationTasks(entry: AllocationEntry): void {
    this.router.navigate(['/projects/dashboard/schedule/tasks'], {
      queryParams: {
        resource: entry.name,
        date: this.formatAllocationDate(entry.dateObj),
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  // openAllocationProjects(entry: AllocationEntry): void {
  //   if (this.allocationProjectsDialog) {
  //     this.dialog.open(this.allocationProjectsDialog, {
  //       width: '550px',
  //       maxWidth: '95vw',
  //       data: entry
  //     });
  //   }
  // }


   openAllocationProjects(entry: AllocationEntry): void {
      this.dialog.open(HoursProjectPopComponent, {
        width: '650px',
        maxWidth: '95vw',
        data: { entry }
      });
    }
}
