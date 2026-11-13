import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { HoursTimesheetComponent } from './hours-timesheet/hours-timesheet.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HoursProjectPopComponent } from '../../../hours/hours-project-pop/hours-project-pop.component';

export interface HourMessage {
  sender: string;
  date: string;
  text: string;
}

export interface HourTaskDetail {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description: string;
}

export interface HourEntry {
  dateObj: Date;
  jobCode: string;
  name: string;
  project?: number | string;
  projectsCount?: number;
  tasksList: HourTaskDetail[];
  totalHours: number;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  messages?: HourMessage[];
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  claims: number;
}

@Component({
  selector: 'app-project-hours',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-hours.component.html',
  styleUrl: './project-hours.component.scss'
})
export class ProjectHoursComponent implements OnInit {
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('tasksDialog') tasksDialog!: TemplateRef<any>;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Hours';

  filteredEntries: HourEntry[] = [];
  paginatedEntries: HourEntry[] = [];
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 15, 20];

  calendarDays: CalendarDay[] = [];

  entries: HourEntry[] = [
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'ENG-301',
      name: 'Rajesh Kumar',
      project: '2026/IND/001 - Industrial Equipment Line Expansion',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Business Need Assessment', task: 'Plant Throughput & Bottleneck Study', hours: 4.0, description: 'Shop-floor cycle time benchmarking and assembly bottleneck analysis' },
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Project Scope & Feasibility', task: 'User Requirements Specification (URS)', hours: 3.5, description: 'Documenting rated line throughput, footprint, and utility envelope criteria' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [
        { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Submitted timesheet for URS and capacity assessment.' },
        { sender: 'Program Manager', date: '2026-06-03', text: 'Approved.' }
      ]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'CAD-302',
      name: 'Anita Desai',
      project: '2026/IND/002 - Automated Material Handling System',
      tasksList: [
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Detailed Engineering', task: '3D CAD Assembly & Structural FEA', hours: 4.5, description: 'Structural deflection modeling and gantry load simulation' },
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Detailed Engineering', task: 'Design FMEA & HAZOP Risk Assessment', hours: 3.0, description: 'Mechanical interference clearance and fatigue factor review' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Anita Desai', date: '2026-06-02', text: 'Structural FEA iteration completed.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'PLC-303',
      name: 'Priya Reddy',
      project: '2026/IND/003 - Robotics Assembly Cell Installation',
      tasksList: [
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Detailed Engineering', task: 'PLC / SCADA Control Schematics', hours: 4.5, description: 'Developing EPLAN panel schematics and safety interlock ladder logic' },
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Prototype & Validation', task: 'Factory Acceptance Test (FAT)', hours: 3.5, description: 'Dry-run interlock verification for dual robotic weld cells' }
      ],
      totalHours: 8.0,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'MET-304',
      name: 'Amit Patel',
      project: '2026/IND/004 - Heavy Press Machine Overhaul',
      tasksList: [
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Prototype & Validation', task: 'Instrument Calibration & Metrology Plan', hours: 4.0, description: 'Hydraulic pressure transducer and bolster flatness CMM inspection' },
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Process & Equipment Design', task: 'Prototype Tooling & Endurance Trial', hours: 4.0, description: 'Die cushion load testing and slide gib alignment verification' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Amit Patel', date: '2026-06-02', text: 'Metrology calibration logs uploaded.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'PRC-305',
      name: 'Suresh Naidu',
      project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade',
      tasksList: [
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Design Freeze & Risk', task: 'OEM Vendor Technical Qualification', hours: 4.5, description: 'Evaluating industrial gateway suppliers and cyber-security compliance' },
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Process & Equipment Design', task: 'PLC / SCADA Control Schematics', hours: 3.5, description: 'OPC-UA historian mapping across 14 packaging stations' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Suresh Naidu', date: '2026-06-02', text: 'Vendor bid comparison finalized.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'CQV-306',
      name: 'Arun Joseph',
      project: '2026/IND/006 - CNC Machining Line Capacity Expansion',
      tasksList: [
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Equipment Installation', task: 'Mechanical Rigging & Laser Alignment', hours: 4.5, description: 'Precision laser bed leveling and anchor bolt grouting checks' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Commissioning & SAT', task: 'Site Acceptance Test (SAT) Execution', hours: 3.0, description: 'Multi-axis spindle repeatability and Cpk run-off verification' }
      ],
      totalHours: 7.5,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'FAC-307',
      name: 'Lakshmi Devi',
      project: '2026/IND/001 - Industrial Equipment Line Expansion',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Installation Planning', task: 'Utility Piping & Electrical Tie-In', hours: 4.5, description: 'Chilled water header pressure drop and 480V busbar routing' },
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Operational Handover', task: 'CMMS Preventive Maintenance Setup', hours: 3.0, description: 'Creating spare-parts min/max BOM and quarterly PM schedules' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Lakshmi Devi', date: '2026-06-02', text: 'Utility tie-in schedule signed off.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'OPS-308',
      name: 'Deepa Nair',
      project: '2026/IND/002 - Automated Material Handling System',
      tasksList: [
        { project: '2026/IND/002 - Automated Material Handling System', module: 'OQ & Production Ramp-Up', task: 'Operational Qualification (OQ) Ramp-Up', hours: 4.5, description: 'Conveyor sortation accuracy and peak pallet throughput validation' },
        { project: '2026/IND/002 - Automated Material Handling System', module: 'Operational Handover', task: 'CMMS Preventive Maintenance Setup', hours: 3.5, description: 'Operator LOTO SOP training and as-built TTD dossier review' }
      ],
      totalHours: 8.0,
      approved: false,
      declined: true,
      pending: false,
      messages: [{ sender: 'Plant Director', date: '2026-06-02', text: 'Awaiting updated guard interlock signoff before approval.' }]
    },
    {
      dateObj: new Date(2026, 5, 5),
      jobCode: 'ENG-309',
      name: 'Rajesh Kumar',
      project: '2026/IND/003 - Robotics Assembly Cell Installation',
      tasksList: [
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Business Need Assessment', task: 'Plant Throughput & Bottleneck Study', hours: 4.0, description: 'Cycle-time simulation report for Spot-Weld Station 4' },
        { project: '2026/IND/003 - Robotics Assembly Cell Installation', module: 'Project Scope & Feasibility', task: 'User Requirements Specification (URS)', hours: 4.0, description: 'Reachability envelope and weld torch dress-pack spec' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 8),
      jobCode: 'CAD-310',
      name: 'Anita Desai',
      project: '2026/IND/004 - Heavy Press Machine Overhaul',
      tasksList: [
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Detailed Engineering', task: '3D CAD Assembly & Structural FEA', hours: 4.5, description: 'Crown tie-rod preload analysis and finite element mesh check' },
        { project: '2026/IND/004 - Heavy Press Machine Overhaul', module: 'Design Freeze & Risk', task: 'Design FMEA & HAZOP Risk Assessment', hours: 3.5, description: 'Clutch/brake failover safety review' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 18),
      jobCode: 'PLC-311',
      name: 'Priya Reddy',
      project: '2026/IND/001 - Industrial Equipment Line Expansion',
      tasksList: [
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Detailed Engineering', task: 'PLC / SCADA Control Schematics', hours: 5.0, description: 'Safety PLC dual-channel E-stop matrix programming' },
        { project: '2026/IND/001 - Industrial Equipment Line Expansion', module: 'Commissioning & SAT', task: 'Site Acceptance Test (SAT) Execution', hours: 3.0, description: 'Alarm annunciation and HMI fault recovery verification' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 22),
      jobCode: 'PRC-312',
      name: 'Suresh Naidu',
      project: '2026/IND/006 - CNC Machining Line Capacity Expansion',
      tasksList: [
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Process & Equipment Design', task: 'OEM Vendor Technical Qualification', hours: 5.0, description: 'Spindle runout witness inspection at OEM plant' },
        { project: '2026/IND/006 - CNC Machining Line Capacity Expansion', module: 'Prototype & Validation', task: 'Factory Acceptance Test (FAT)', hours: 2.5, description: 'Tool changer endurance cycling and coolant filtration check' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 30),
      jobCode: 'MET-313',
      name: 'Amit Patel',
      project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade',
      tasksList: [
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Prototype & Validation', task: 'Instrument Calibration & Metrology Plan', hours: 4.5, description: 'Edge vibration accelerometer loop calibration across spindles' },
        { project: '2026/IND/005 - Smart Factory SCADA & PLC Upgrade', module: 'Commissioning & SAT', task: 'Site Acceptance Test (SAT) Execution', hours: 3.5, description: 'MES work-order scan robustness testing' }
      ],
      totalHours: 8.0,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2); // June 2nd, 2026
    const defaultDay =
      this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault)) ??
      this.calendarDays.find(d => d.inCurrentMonth)!;

    this.filterByDate(defaultDay);
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  buildCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(year, month, 1 - startOffset);
    const today = new Date();
    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
      const cellDate = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
      const inCurrentMonth = cellDate.getMonth() === month;
      days.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        inCurrentMonth,
        isToday: this.isSameDay(cellDate, today),
        isSelected: this.selectedDate ? this.isSameDay(cellDate, this.selectedDate) : false,
        claims: inCurrentMonth ? this.entries.filter(e => this.isSameDay(e.dateObj, cellDate)).length : 0
      });
    }
    this.calendarDays = days;
  }

  isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  filterByDate(day: CalendarDay): void {
    if (!day.inCurrentMonth) return;

    this.selectedDate = day.date;
    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));

    for (const d of this.calendarDays) {
      d.isSelected = this.isSameDay(d.date, day.date);
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + Number(this.pageSize);
    this.paginatedEntries = this.filteredEntries.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
  }

  formatDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${dd}-${yy}`;
  }

  toggleRowStatus(entry: HourEntry, field: 'approved' | 'declined' | 'pending'): void {
    if (field === 'approved') {
      entry.approved = !entry.approved;
      if (entry.approved) {
        entry.declined = false;
        entry.pending = false;
      }
    } else if (field === 'declined') {
      entry.declined = !entry.declined;
      if (entry.declined) {
        entry.approved = false;
        entry.pending = false;
      }
    } else if (field === 'pending') {
      entry.pending = !entry.pending;
      if (entry.pending) {
        entry.approved = false;
        entry.declined = false;
      }
    }
  }

  openTasksDialog(entry: HourEntry): void {
    this.dialog.open(this.tasksDialog, {
      width: '750px',
      maxWidth: '95vw',
      data: entry
    });
  }

  openMessagesDialog(entry: HourEntry): void {
    this.dialog.open(this.messageDialog, {
      width: '550px',
      maxWidth: '95vw',
      data: entry
    });
  }

  addMessage(entry: HourEntry, text: string): void {
    if (!text || !text.trim()) return;
    if (!entry.messages) {
      entry.messages = [];
    }
    entry.messages.push({
      sender: 'Lead Reviewer',
      date: new Date().toISOString().split('T')[0],
      text: text.trim()
    });
  }

  addTimesheet(): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const tasks: HourTaskDetail[] = (result.rows || []).map((r: any) => ({
          project: r.project || '2026/IND/001 - Industrial Equipment Line Expansion',
          module: r.module || 'General',
          task: r.task || 'Task Log',
          hours: Number(r.hours) || 0,
          description: r.description || ''
        }));
        const total = tasks.reduce((sum, t) => sum + t.hours, 0);

        const newEntry: HourEntry = {
          dateObj: result.dateObj,
          jobCode: 'ENG-' + (200 + this.entries.length + 1),
          name: result.name || 'Anonymous',
          project: tasks.length > 0 ? (tasks[0].project || '2026/IND/001 - Industrial Equipment Line Expansion') : '2026/IND/001 - Industrial Equipment Line Expansion',
          tasksList: tasks.length > 0 ? tasks : [
            {
              project: '2026/IND/001 - Industrial Equipment Line Expansion',
              module: 'General',
              task: 'Task Log',
              hours: 1,
              description: 'General work'
            }
          ],
          totalHours: total > 0 ? total : 1,
          approved: false,
          declined: false,
          pending: true,
          messages: []
        };
        this.entries.unshift(newEntry);

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  editEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: {
        dateObj: entry.dateObj,
        name: entry.name,
        tasksList: entry.tasksList,
        project: entry.project
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        entry.dateObj = result.dateObj;
        entry.name = result.name;
        if (result.rows && result.rows.length > 0) {
          entry.tasksList = result.rows.map((r: any) => ({
            project: r.project || '2026/IND/001 - Industrial Equipment Line Expansion',
            module: r.module || 'General',
            task: r.task || 'Task Log',
            hours: Number(r.hours) || 0,
            description: r.description || ''
          }));
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
          entry.project = entry.tasksList[0].project;
        }

        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  deleteEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this timesheet entry?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.entries = this.entries.filter(e => e !== entry);
        this.buildCalendar();
        if (this.selectedDate) {
          const selectedDay = this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!));
          if (selectedDay) {
            this.filterByDate(selectedDay);
          }
        }
      }
    });
  }

  openProjectsDialog(entry: HourEntry): void {
    this.dialog.open(HoursProjectPopComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: { entry }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
    });
  }
}
