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

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
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
      jobCode: 'JB-301',
      name: 'Rajesh Kumar',
      project: '2026/RD/001 - Abiraterone Acetate Film Coated',
      tasksList: [
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Product Selection', task: 'Reference Product Characterization', hours: 4.0, description: 'Physicochemical characterization and comparative profiling of reference product' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Pre-Formulation', task: 'API Characterization', hours: 3.5, description: 'Evaluation of solid-state properties, particle size, and polymorphic form' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [
        { sender: 'Rajesh Kumar', date: '2026-06-02', text: 'Submitted timesheet for API and reference product assessment.' },
        { sender: 'QA Manager', date: '2026-06-03', text: 'Approved.' }
      ]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-302',
      name: 'Anita Desai',
      project: '2026/RD/002 - Apremilast Tablets',
      tasksList: [
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Pre-Formulation', task: 'API–Excipient Compatibility', hours: 4.5, description: 'Isothermal stress testing and binary blend compatibility studies' },
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Pre-Formulation', task: 'Excipient Screening', hours: 3.0, description: 'Functional screening of binders, disintegrants, and lubricants' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Anita Desai', date: '2026-06-02', text: 'Compatibility screening trial completed.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-303',
      name: 'Priya Reddy',
      project: '2026/RD/003 - Brivaracetam Film Coated Tablets',
      tasksList: [
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Formulation Development', task: 'Prototype Formulation Design', hours: 4.5, description: 'Designing target product profile (QTPP) and prototype trial compositions' },
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Formulation Development', task: 'Laboratory Prototype Batch', hours: 3.5, description: 'Compounding and wet granulation processing for lab prototype batch' }
      ],
      totalHours: 8.0,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-304',
      name: 'Amit Patel',
      project: '2026/RD/004 - Cabozantinib Tablets',
      tasksList: [
        { project: '2026/RD/004 - Cabozantinib Tablets', module: 'Prototype & Optimization', task: 'Dissolution Testing', hours: 4.0, description: 'In-vitro multi-media comparative dissolution rate evaluation' },
        { project: '2026/RD/004 - Cabozantinib Tablets', module: 'Analytical Development', task: 'Analytical Method Development', hours: 4.0, description: 'RP-HPLC chromatographic method development and assay validation' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Amit Patel', date: '2026-06-02', text: 'Dissolution method development parameters recorded.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-305',
      name: 'Suresh Naidu',
      project: '2026/RD/005 - Dapagliflozin Propanediol Tablets',
      tasksList: [
        { project: '2026/RD/005 - Dapagliflozin Propanediol Tablets', module: 'Prototype & Optimization', task: 'Formulation Optimization', hours: 4.5, description: 'Optimizing tablet compression parameters, hardness, and friability' },
        { project: '2026/RD/005 - Dapagliflozin Propanediol Tablets', module: 'Scale-Up', task: 'Scale-Up & Pilot Batch', hours: 3.5, description: 'Pilot scale high shear granulator and compression trial setup' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Suresh Naidu', date: '2026-06-02', text: 'Trial batch parameters optimized.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-306',
      name: 'Arun Joseph',
      project: '2026/RD/006 - Empagliflozin Tablets',
      tasksList: [
        { project: '2026/RD/006 - Empagliflozin Tablets', module: 'Testing & Validation', task: 'Stability Study', hours: 4.5, description: 'Stability protocol execution and sample loading in ICH climate chambers' },
        { project: '2026/RD/006 - Empagliflozin Tablets', module: 'BA/BE & Stability', task: 'Bioequivalence Readiness', hours: 3.0, description: 'Evaluating bioequivalence study readiness and comparator profile similarity' }
      ],
      totalHours: 7.5,
      approved: false,
      declined: false,
      pending: true,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-307',
      name: 'Lakshmi Devi',
      project: '2026/RD/007 - Fimasartan Potassium Tablets',
      tasksList: [
        { project: '2026/RD/007 - Fimasartan Potassium Tablets', module: 'Regulatory Submission', task: 'Regulatory Dossier Preparation', hours: 4.5, description: 'Compiling Module 3 Quality CMC documentation for regulatory filing' },
        { project: '2026/RD/007 - Fimasartan Potassium Tablets', module: 'Regulatory Approval', task: 'Regulatory Review', hours: 3.0, description: 'Internal regulatory gap assessment and compliance review' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: [{ sender: 'Lakshmi Devi', date: '2026-06-02', text: 'Regulatory documentation checklist completed.' }]
    },
    {
      dateObj: new Date(2026, 5, 2),
      jobCode: 'JB-308',
      name: 'Deepa Nair',
      project: '2026/RD/008 - Macitentan Film Coated Tablets',
      tasksList: [
        { project: '2026/RD/008 - Macitentan Film Coated Tablets', module: 'Manufacturing Readiness', task: 'Commercial Manufacturing Readiness', hours: 4.5, description: 'Manufacturing transfer protocols and batch manufacturing record (BMR) drafts' },
        { project: '2026/RD/008 - Macitentan Film Coated Tablets', module: 'Commercialization', task: 'Launch Readiness', hours: 3.5, description: 'Commercial supply chain alignment and packaging artwork verification' }
      ],
      totalHours: 8.0,
      approved: false,
      declined: true,
      pending: false,
      messages: [{ sender: 'Production Head', date: '2026-06-02', text: 'Awaiting updated equipment qualification signoff before approval.' }]
    },
    {
      dateObj: new Date(2026, 5, 5),
      jobCode: 'JB-309',
      name: 'Rajesh Kumar',
      project: '2026/RD/009 - Niraparib Tosylate Capsules',
      tasksList: [
        { project: '2026/RD/009 - Niraparib Tosylate Capsules', module: 'Product Selection', task: 'Reference Product Characterization', hours: 4.0, description: 'Final characterization report of RLD batch' },
        { project: '2026/RD/009 - Niraparib Tosylate Capsules', module: 'Pre-Formulation', task: 'API Characterization', hours: 4.0, description: 'Solubility profile determination across physiological pH range' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 8),
      jobCode: 'JB-310',
      name: 'Anita Desai',
      project: '2026/RD/010 - Olaparib Film Coated Tablets',
      tasksList: [
        { project: '2026/RD/010 - Olaparib Film Coated Tablets', module: 'Pre-Formulation', task: 'API–Excipient Compatibility', hours: 4.5, description: 'HPLC testing of 4-week binary excipient blend samples' },
        { project: '2026/RD/010 - Olaparib Film Coated Tablets', module: 'Pre-Formulation', task: 'Excipient Screening', hours: 3.5, description: 'Binder selection matrix and disintegration rate study' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 18),
      jobCode: 'JB-311',
      name: 'Priya Reddy',
      project: '2026/RD/001 - Abiraterone Acetate Film Coated',
      tasksList: [
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Formulation Development', task: 'Prototype Formulation Design', hours: 5.0, description: 'Formulation matrix design of experiments (DoE)' },
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'Prototype & Optimization', task: 'Formulation Optimization', hours: 3.0, description: 'Lubrication sensitivity analysis' }
      ],
      totalHours: 8.0,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 22),
      jobCode: 'JB-312',
      name: 'Suresh Naidu',
      project: '2026/RD/002 - Apremilast Tablets',
      tasksList: [
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Formulation Development', task: 'Laboratory Prototype Batch', hours: 5.0, description: 'Prototype batch granulating, drying, and blending operations' },
        { project: '2026/RD/002 - Apremilast Tablets', module: 'Scale-Up', task: 'Scale-Up & Pilot Batch', hours: 2.5, description: 'Scale-up parameter calculation for fluid bed processor' }
      ],
      totalHours: 7.5,
      approved: true,
      declined: false,
      pending: false,
      messages: []
    },
    {
      dateObj: new Date(2026, 5, 30),
      jobCode: 'JB-313',
      name: 'Amit Patel',
      project: '2026/RD/003 - Brivaracetam Film Coated Tablets',
      tasksList: [
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Prototype & Optimization', task: 'Dissolution Testing', hours: 4.5, description: 'Comparative dissolution testing across pH 1.2, 4.5, and 6.8' },
        { project: '2026/RD/003 - Brivaracetam Film Coated Tablets', module: 'Analytical Development', task: 'Analytical Method Development', hours: 3.5, description: 'Assay method robustness testing' }
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
          project: r.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
          module: r.module || 'General',
          task: r.task || 'Task Log',
          hours: Number(r.hours) || 0,
          description: r.description || ''
        }));
        const total = tasks.reduce((sum, t) => sum + t.hours, 0);

        const newEntry: HourEntry = {
          dateObj: result.dateObj,
          jobCode: 'JB-' + (200 + this.entries.length + 1),
          name: result.name || 'Anonymous',
          project: tasks.length > 0 ? (tasks[0].project || '2026/RD/001 - Abiraterone Acetate Film Coated') : '2026/RD/001 - Abiraterone Acetate Film Coated',
          tasksList: tasks.length > 0 ? tasks : [
            {
              project: '2026/RD/001 - Abiraterone Acetate Film Coated',
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
            project: r.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
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
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
    });
  }
}
