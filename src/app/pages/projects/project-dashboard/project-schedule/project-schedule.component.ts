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

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Industrial Equipment Line Expansion - 2026/IND/001';

  viewMode: 'grid' | 'gantt' | 'allocation' = 'gantt';
  isMaskingPending: boolean = false;
  isCriticalPath: boolean = false;

  filterToggle: boolean = false;
  stages: string[] = [
    'Feasibility',
    'Concept Engg',
    'Detailed Engg',
    'Fabrication',
    'Installation',
    'Commissioning'
  ];
  stageFilter: string = 'Feasibility';
  sprints: string[] = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
  sprintFilter: string = 'all';
  modules: string[] = [
    'Feasibility',
    'Concept Engg',
    'Detailed Engg',
    'Fabrication',
    'Installation',
    'Commissioning'
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
    '2026/IND/001 - Industrial Equipment Line Expansion',
    '2026/IND/002 - Automated Material Handling System',
    '2026/IND/003 - Robotics Assembly Cell Installation',
    '2026/IND/004 - Heavy Press Machine Overhaul'
  ];

  allocationEntries: AllocationEntry[] = [
    {
      id: 1,
      dateObj: new Date(2026, 5, 2),
      name: 'Rajesh Kumar',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/002 - Automated Material Handling System', '2026/IND/003 - Robotics Assembly Cell Installation'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Feasibility', task: 'Plant Throughput & Bottleneck Study', hours: 4.5, description: 'Assembly line takt-time and equipment cycle benchmarking' },
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Concept Engg', task: 'AGV Conveyor Routing Study', hours: 3.5, description: 'Bay transfer palletizer flow simulation' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/003 - Robotics Assembly Cell Installation'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Detailed Engg', task: '3D CAD Assembly & Structural FEA', hours: 4.5, description: 'Finite element stress modeling and frame deflection analysis' },
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Concept Engg', task: 'Gantry Reachability Envelope Check', hours: 3.0, description: 'Workcell interference zone and weld jig kinematics' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/005 - Smart Factory SCADA & PLC Upgrade'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Detailed Engg', task: 'PLC / SCADA Control Schematics', hours: 5.0, description: 'Safety interlock I/O list and EPLAN schematic checks' },
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Commissioning', task: 'OPC-UA Telemetry Loop Verification', hours: 3.5, description: 'Edge gateway MQTT/OPC tag latency testing' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion'],
      tasks: '1/2',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Fabrication', task: 'OEM Vendor Tooling & Spindle Qualification', hours: 6.5, description: 'Spindle runout audit and critical spare-parts SLA sign-off' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/004 - Heavy Press Machine Overhaul'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Feasibility', task: 'User Requirements Specification (URS)', hours: 4.0, description: 'URS acceptance criteria and target OEE envelope' },
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Concept Engg', task: 'Hydraulic Power Unit Sizing', hours: 4.0, description: 'Peak tonnage and accumulator thermal duty study' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/004 - Heavy Press Machine Overhaul', '2026/IND/006 - CNC Machining Line Capacity Expansion'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Fabrication', task: 'Instrument Calibration & Metrology Plan', hours: 4.5, description: 'CMM and force transducer traceable calibration schedule' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Fabrication', task: '5-Axis Spindle Runout Verification', hours: 3.5, description: 'Laser interferometer pitch and yaw accuracy check' }
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
      name: 'Ananya Rao',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/002 - Automated Material Handling System'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Commissioning', task: 'CE / ISO 13849 Machine Safety Audit', hours: 5.0, description: 'PLd emergency-stop circuit and guarding validation' },
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Commissioning', task: 'Operations & TTD Handover Review', hours: 3.0, description: 'As-built drawing package and CMMS PM checklist' }
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
      name: 'Arun Joseph',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/004 - Heavy Press Machine Overhaul'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Installation', task: 'Shop-Floor Foundation & Anchor Prep', hours: 4.0, description: 'Vibration isolation pad cure and anchor bolt layout' },
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Installation', task: '480V Feeder & Chilled Water Tie-In', hours: 3.5, description: 'Substation breaker sizing and pipe pressure test' }
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
      name: 'Deepa Nair',
      workHours: 8.0,
      projectsCount: 3,
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/002 - Automated Material Handling System', '2026/IND/006 - CNC Machining Line Capacity Expansion'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Feasibility', task: 'CapEx Costing & Resource Planning', hours: 4.0, description: 'Equipment CapEx ROI modeling and milestones' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Commissioning', task: 'OEM FAT Witness Sign-Off', hours: 4.0, description: 'Factory acceptance dry-run and punch-list review' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/006 - CNC Machining Line Capacity Expansion'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Detailed Engg', task: 'Design FMEA Risk Assessment Matrix', hours: 5.5, description: 'Structural and wear failure modes analysis (FMEA)' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Detailed Engg', task: 'Workholding Fixture CAD Release', hours: 3.5, description: 'Hydraulic clamp fixture tolerance stack-up' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/003 - Robotics Assembly Cell Installation'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Fabrication', task: 'PLC Safety Interlock Bench Simulation', hours: 4.5, description: 'Dual-channel E-stop and light curtain fault trip tests' },
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Fabrication', task: 'Vision Sensor Calibration Verification', hours: 3.5, description: '2D/3D camera pick-place accuracy repeatability' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/005 - Smart Factory SCADA & PLC Upgrade'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Fabrication', task: 'Prototype Tooling Fabrication Witness', hours: 5.0, description: 'Endurance testing at OEM fabrication bay' },
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Installation', task: 'Industrial Control Panel Inspection', hours: 2.5, description: 'UL508A panel thermal imaging and wire-ferrule check' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/002 - Automated Material Handling System'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Installation', task: 'Heavy Rigging & Laser Bed Alignment', hours: 4.0, description: 'Sub-millimeter optical laser leveling on Plant A bay' },
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Installation', task: 'Conveyor Track Encoder Sync', hours: 4.0, description: 'Line speed synchronization across 6 transfer zones' }
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
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/006 - CNC Machining Line Capacity Expansion'],
      tasks: '2/3',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Commissioning', task: 'SAT Cpk Capability & OEE Endurance Run', hours: 4.5, description: 'Validating 120 units/hr sustained multi-shift output' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Commissioning', task: 'CMM First-Article Inspection Study', hours: 3.5, description: '30-piece capability run GD&T statistical report' }
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
      name: 'Lakshmi Devi',
      workHours: 8.0,
      projectsCount: 2,
      projects: ['2026/IND/001 - Industrial Equipment Line Expansion', '2026/IND/004 - Heavy Press Machine Overhaul'],
      tasks: '2/4',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Commissioning', task: 'CMMS PM Schedule & Spares Handover', hours: 4.5, description: 'Plant maintenance asset tree & LOTO SOP certification' },
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Commissioning', task: 'Final Operations TTD Package Sign-Off', hours: 3.5, description: 'As-built drawings and PLC golden backup archival' }
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
      name: 'Plant Throughput & URS Scope Baseline',
      module: 'Feasibility',
      assignee: 'Ananya Rao',
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
      name: '3D CAD Line Layout & PLC Architecture',
      module: 'Concept Engg',
      assignee: 'Rajesh Kumar',
      planStart: new Date(2026, 5, 19),
      planEnd: new Date(2026, 6, 8),
      actualStartObj: new Date(2026, 5, 19),
      actualEndObj: new Date(2026, 6, 8),
      status: 'Completed',
      completion: 100,
      stage: 'Concept Engg',
      sprint: 'Sprint 2'
    },
    {
      id: 'CP-3',
      name: 'Structural FEA, BOM & Control Schematics',
      module: 'Detailed Engg',
      assignee: 'Anita Desai',
      planStart: new Date(2026, 6, 9),
      planEnd: new Date(2026, 6, 30),
      actualStartObj: new Date(2026, 6, 9),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Detailed Engg',
      sprint: 'Sprint 3'
    },
    {
      id: 'CP-4',
      name: 'Long-Lead CNC & Prototype Tooling Build',
      module: 'Fabrication',
      assignee: 'Priya Reddy',
      planStart: new Date(2026, 6, 31),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: new Date(2026, 6, 31),
      actualEndObj: null,
      status: 'In Process',
      completion: 40,
      stage: 'Fabrication',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-5',
      name: 'OEM Factory Acceptance Test (FAT)',
      module: 'Fabrication',
      assignee: 'Suresh Naidu',
      planStart: new Date(2026, 7, 21),
      planEnd: new Date(2026, 8, 10),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Fabrication',
      sprint: 'Sprint 4'
    },
    {
      id: 'CP-6',
      name: 'Rigging, Laser Alignment & Utility Tie-In',
      module: 'Installation',
      assignee: 'Arun Joseph',
      planStart: new Date(2026, 8, 11),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Installation',
      sprint: 'Sprint 5'
    },
    {
      id: 'CP-7',
      name: 'SAT Performance Run, OQ & Plant Handover',
      module: 'Commissioning',
      assignee: 'Amit Patel',
      planStart: new Date(2026, 9, 3),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Commissioning',
      sprint: 'Sprint 5'
    }
  ];

  allTasks: ScheduleTask[] = [
    // Feasibility Stage
    {
      id: 'T1',
      name: 'Plant Throughput & Bottleneck Study',
      module: 'Feasibility',
      assignee: 'Ananya Rao',
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
      name: 'User Requirements Specification (URS)',
      module: 'Feasibility',
      assignee: 'Rajesh Kumar',
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
      name: 'OEM Equipment Vendor Pre-Qualification',
      module: 'Feasibility',
      assignee: 'Suresh Naidu',
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
      name: 'Power, Air & Utility Load Sizing',
      module: 'Feasibility',
      assignee: 'Arun Joseph',
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
      name: 'CE / ISO 13849 Machine Safety Review',
      module: 'Feasibility',
      assignee: 'Deepa Nair',
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
      name: 'CapEx ROI & Payback Financial Model',
      module: 'Feasibility',
      assignee: 'Lakshmi Devi',
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
      name: 'Integrated Program Charter Sign-Off',
      module: 'Feasibility',
      assignee: 'Ananya Rao',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Feasibility',
      sprint: 'Sprint 2'
    },
    // Concept Engg Stage
    {
      id: 'T8',
      name: 'Line Layout & Material Flow Concept',
      module: 'Concept Engg',
      assignee: 'Anita Desai',
      planStart: new Date(2026, 5, 10),
      planEnd: new Date(2026, 5, 24),
      actualStartObj: new Date(2026, 5, 10),
      actualEndObj: new Date(2026, 5, 23),
      status: 'Completed',
      completion: 100,
      stage: 'Concept Engg',
      sprint: 'Sprint 1'
    },
    {
      id: 'T9',
      name: 'Automation & PLC Architecture Design',
      module: 'Concept Engg',
      assignee: 'Priya Reddy',
      planStart: new Date(2026, 5, 18),
      planEnd: new Date(2026, 6, 2),
      actualStartObj: new Date(2026, 5, 18),
      actualEndObj: new Date(2026, 6, 2),
      status: 'Completed',
      completion: 100,
      stage: 'Concept Engg',
      sprint: 'Sprint 2'
    },
    {
      id: 'T10',
      name: 'Cycle-Time & OEE Simulation Modeling',
      module: 'Concept Engg',
      assignee: 'Rajesh Kumar',
      planStart: new Date(2026, 5, 25),
      planEnd: new Date(2026, 6, 10),
      actualStartObj: new Date(2026, 5, 25),
      actualEndObj: new Date(2026, 6, 10),
      status: 'Completed',
      completion: 100,
      stage: 'Concept Engg',
      sprint: 'Sprint 2'
    },
    // Detailed Engg Stage
    {
      id: 'T11',
      name: '3D CAD Assembly & Structural FEA',
      module: 'Detailed Engg',
      assignee: 'Anita Desai',
      planStart: new Date(2026, 6, 1),
      planEnd: new Date(2026, 6, 18),
      actualStartObj: new Date(2026, 6, 1),
      actualEndObj: null,
      status: 'In Process',
      completion: 75,
      stage: 'Detailed Engg',
      sprint: 'Sprint 2'
    },
    {
      id: 'T12',
      name: 'GD&T Tolerance Stack-Up & BOM Release',
      module: 'Detailed Engg',
      assignee: 'Amit Patel',
      planStart: new Date(2026, 6, 10),
      planEnd: new Date(2026, 6, 28),
      actualStartObj: new Date(2026, 6, 10),
      actualEndObj: null,
      status: 'In Process',
      completion: 50,
      stage: 'Detailed Engg',
      sprint: 'Sprint 3'
    },
    {
      id: 'T13',
      name: 'Electrical Panel Wiring & E-Stop Logic',
      module: 'Detailed Engg',
      assignee: 'Priya Reddy',
      planStart: new Date(2026, 6, 18),
      planEnd: new Date(2026, 7, 5),
      actualStartObj: new Date(2026, 6, 18),
      actualEndObj: null,
      status: 'Overdue',
      completion: 30,
      stage: 'Detailed Engg',
      sprint: 'Sprint 3'
    },
    {
      id: 'T14',
      name: 'Design FMEA & HAZOP Risk Closure',
      module: 'Detailed Engg',
      assignee: 'Deepa Nair',
      planStart: new Date(2026, 6, 25),
      planEnd: new Date(2026, 7, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Detailed Engg',
      sprint: 'Sprint 3'
    },
    // Fabrication Stage
    {
      id: 'T15',
      name: 'Prototype Tooling & Fixture Fabrication',
      module: 'Fabrication',
      assignee: 'Suresh Naidu',
      planStart: new Date(2026, 7, 1),
      planEnd: new Date(2026, 7, 20),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Fabrication',
      sprint: 'Sprint 4'
    },
    {
      id: 'T16',
      name: 'Factory Acceptance Test (FAT) Execution',
      module: 'Fabrication',
      assignee: 'Amit Patel',
      planStart: new Date(2026, 7, 12),
      planEnd: new Date(2026, 7, 30),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Fabrication',
      sprint: 'Sprint 4'
    },
    // Installation Stage
    {
      id: 'T17',
      name: 'Shop-Floor Foundation & Rigging Prep',
      module: 'Installation',
      assignee: 'Arun Joseph',
      planStart: new Date(2026, 7, 22),
      planEnd: new Date(2026, 8, 12),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Installation',
      sprint: 'Sprint 4'
    },
    {
      id: 'T18',
      name: 'Laser Alignment & SCADA Integration',
      module: 'Installation',
      assignee: 'Priya Reddy',
      planStart: new Date(2026, 8, 1),
      planEnd: new Date(2026, 8, 22),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Installation',
      sprint: 'Sprint 5'
    },
    // Commissioning Stage
    {
      id: 'T19',
      name: 'IQ & Site Acceptance Test (SAT) Run',
      module: 'Commissioning',
      assignee: 'Amit Patel',
      planStart: new Date(2026, 8, 15),
      planEnd: new Date(2026, 9, 2),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Commissioning',
      sprint: 'Sprint 5'
    },
    {
      id: 'T20',
      name: 'OQ 3-Shift OEE Endurance Qualification',
      module: 'Commissioning',
      assignee: 'Rajesh Kumar',
      planStart: new Date(2026, 8, 25),
      planEnd: new Date(2026, 9, 15),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Commissioning',
      sprint: 'Sprint 5'
    },
    {
      id: 'T21',
      name: 'CMMS Spares, LOTO SOP & Plant Handover',
      module: 'Commissioning',
      assignee: 'Ananya Rao',
      planStart: new Date(2026, 9, 5),
      planEnd: new Date(2026, 9, 28),
      actualStartObj: null,
      actualEndObj: null,
      status: 'Pending',
      completion: 0,
      stage: 'Commissioning',
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
