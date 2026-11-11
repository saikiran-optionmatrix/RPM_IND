import { Component, OnInit, ViewChild, ElementRef, TemplateRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HoursProjectPopComponent } from './hours-project-pop/hours-project-pop.component';
import { HoursTimesheetComponent } from '../projects/project-dashboard/project-hours/hours-timesheet/hours-timesheet.component';
import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';

export interface HourMessage {
  sender: string;
  date: string;
  text: string;
}

export interface HourTaskDetail {
  module: string;
  task: string;
  hours: number;
  description: string;
}

export interface HourEntry {
  dateObj: Date;
  jobCode: string;
  name: string;
  projectsCount?: number;
  tasksList: HourTaskDetail[];
  totalHours: number;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  isOvertime?: boolean;
  overtimeHours?: number;
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
  selector: 'app-hours',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss']
})
export class HoursComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  @ViewChild('tableWrapper') tableWrapper!: ElementRef;
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;
  @ViewChild('tasksDialog') tasksDialog!: TemplateRef<any>;

  readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  readonly dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  currentDate: Date = new Date(2026, 5, 1); // June 2026
  selectedDate: Date | null = null;

  projectName: string = '';
  projectCode: string = '';
  dynamicBreadcrumb: string = 'Hours';

  // Data Arrays
  entries: HourEntry[] = [];
  filteredEntries: HourEntry[] = [];
  paginatedEntries: HourEntry[] = [];
  calendarDays: CalendarDay[] = [];

  // Pagination
  pageSize: number = 10;
  currentPage: number = 1;
  totalSize: number = 0;

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['name'] && params['code']) {
        this.projectName = params['name'];
        this.projectCode = params['code'];
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      }
    });
  }

  ngOnInit(): void {
    this.loadMockData();
    this.buildCalendar();

    const targetDefault = new Date(2026, 5, 2);
    const defaultDay = this.calendarDays.find(d => d.inCurrentMonth && this.isSameDay(d.date, targetDefault))
      ?? this.calendarDays.find(d => d.inCurrentMonth)!;

    this.filterByDate(defaultDay);
  }

  private loadMockData(): void {
    const pharmaTasksPool: { module: string; task: string; description: string }[] = [
      { module: 'Product Selection', task: 'Patent Freedom to Operate Assessment', description: 'Review patent claim scope and non-infringing formulation strategies' },
      { module: 'Product Selection', task: 'Reference Listed Drug (RLD) Sourcing', description: 'Procure EU and US reference listed drug lots with certificates of analysis' },
      { module: 'Product Selection', task: 'Competitor Patent Landscaping', description: 'Filing date, priority date, and orange book therapeutic equivalence review' },
      { module: 'Product Selection', task: 'Market Exclusivity & Paragraph IV Evaluation', description: 'Review 180-day exclusivity potential and orange book listed patent claims' },
      { module: 'Product Selection', task: 'Reference Product Characterization', description: 'Physicochemical characterization and comparative profiling of reference product' },
      { module: 'Pre-Formulation', task: 'API Physicochemical Profiling', description: 'Evaluate crystalline polymorph, melting point, hygroscopicity, and pKa' },
      { module: 'Pre-Formulation', task: 'Initial Solubility & Permeability Study', description: 'BCS class confirmation in simulated gastric and intestinal fluids' },
      { module: 'Pre-Formulation', task: 'Excipient Compatibility Screening', description: 'Binary blend stress testing with microcrystalline cellulose and lactose' },
      { module: 'Pre-Formulation', task: 'Thermal Analysis (DSC & TGA)', description: 'Evaluate glass transition temperature and dehydration endotherms' },
      { module: 'Pre-Formulation', task: 'Solid State XRD Polymorph Verification', description: 'X-ray powder diffraction testing for polymorphic stability' },
      { module: 'Pre-Formulation', task: 'Particle Size Distribution (Laser Diffraction)', description: 'Malvern Mastersizer D10, D50, D90 determination' },
      { module: 'Pre-Formulation', task: 'API–Excipient Compatibility', description: 'Isothermal stress testing and binary blend compatibility studies' },
      { module: 'Pre-Formulation', task: 'Moisture Adsorption Isotherm Testing', description: 'DVS analysis of API-excipient blends at 25°C/60% RH to 40°C/75% RH' },
      { module: 'Pre-Formulation', task: 'API Particle Size Micronization Trial', description: 'Air jet mill trial to achieve target D90 < 10 microns' },
      { module: 'Pre-Formulation', task: 'Micronized API Flow Property Testing', description: 'Angle of repose, bulk density, and tapped density testing' },
      { module: 'Pre-Formulation', task: 'Excipient Sourcing & Vendor Audit', description: 'Co-processed excipient vendor qualification and DMF audit' },
      { module: 'Pre-Formulation', task: 'Intrinsic Dissolution Rate (IDR) Measurement', description: 'Rotating disk apparatus test for intrinsic dissolution velocity' },
      { module: 'Pre-Formulation', task: 'API Stability in Simulated Body Fluids', description: 'Chemical degradation profiling in SGF and SIF at 37°C' },
      { module: 'Formulation Development', task: 'Binder Selection Study', description: 'Screen PVP K30, HPC, and HPMC for granulation binding efficiency' },
      { module: 'Formulation Development', task: 'Disintegrant Efficiency Analysis', description: 'Evaluate Croscarmellose Sodium vs Sodium Starch Glycolate' },
      { module: 'Formulation Development', task: 'Prototype Formulation Design', description: 'Designing target product profile (QTPP) and prototype trial compositions' },
      { module: 'Formulation Development', task: 'Laboratory Prototype Batch Compounding', description: 'Compounding and wet granulation processing for lab prototype batch' },
      { module: 'Formulation Development', task: 'High Shear Granulator Parameters Setup', description: 'Optimize impeller speed, chopper speed, and binder addition rate' },
      { module: 'Formulation Development', task: 'Fluid Bed Dryer Optimization', description: 'Inlet air temperature control and loss on drying (LOD) monitoring' },
      { module: 'Formulation Development', task: 'Granule Sieve Analysis & Flowability', description: 'Hausner ratio and Carr index evaluation for tableting readiness' },
      { module: 'Formulation Development', task: 'Lubricant Sensitivity Profiling', description: 'Evaluate blending time impact of Magnesium Stearate on compactibility' },
      { module: 'Formulation Development', task: 'Direct Compression vs Wet Granulation Trials', description: 'Comparing tablet hardness, friability, and dissolution profiles' },
      { module: 'Formulation Development', task: 'Granulation Fluid Optimization', description: 'Water vs Isopropanol solvent impact on impurity profile' },
      { module: 'Formulation Development', task: 'Film Coating Polymer Screening', description: 'Opadry II vs Kollicoat Protect coating suspension preparation' },
      { module: 'Formulation Development', task: 'DoE Factorial Design Execution', description: '3-factor 2-level experimental design for binder and disintegrant concentration' },
      { module: 'Formulation Development', task: 'Core Tablet Friability Testing', description: 'Ensuring weight loss < 0.5% after 4 minutes tumbling' },
      { module: 'Analytical Development', task: 'Analytical Method Development', description: 'RP-HPLC chromatographic method development and assay validation' },
      { module: 'Analytical Development', task: 'HPLC Column Selection & Precision Testing', description: 'C18 vs C8 column selectivity, retention time, and peak tailing factor' },
      { module: 'Analytical Development', task: 'Related Substances Method Validation', description: 'Forced degradation study (acid, base, peroxide, thermal, and photolytic)' },
      { module: 'Analytical Development', task: 'Dissolution Profiling in 4 Buffer Media', description: 'pH 1.2 HCl, pH 4.5 Acetate, pH 6.8 Phosphate, and Water' },
      { module: 'Analytical Development', task: 'f1 and f2 Similarity Factor Calculation', description: 'Mathematical comparison of dissolution curves against innovator' },
      { module: 'Analytical Development', task: 'Chromatographic Assay Method Precision', description: 'Repeatability and intermediate precision RSD calculation (< 1.0%)' },
      { module: 'Analytical Development', task: 'Filter Compatibility Study', description: 'PTFE vs PVDF vs Nylon syringe filter recovery testing' },
      { module: 'Analytical Development', task: 'Organic Impurities Profiling by LC-MS', description: 'Identification of degradation products exceeding ICH identification threshold' },
      { module: 'Analytical Development', task: 'Method Validation Summary Report (MVSR)', description: 'Compiling linearity, range, precision, accuracy, and LOD/LOQ data' },
      { module: 'Prototype & Optimization', task: 'Dissolution Testing', description: 'In-vitro multi-media comparative dissolution rate evaluation' },
      { module: 'Prototype & Optimization', task: 'Formulation Optimization', description: 'Optimizing tablet compression parameters, hardness, and friability' },
      { module: 'Prototype & Optimization', task: 'Compression Tooling & Feeder Speed Tuning', description: 'Evaluated D-tooling punch penetration depth and force feeder RPM' },
      { module: 'Prototype & Optimization', task: 'Tablet Friability & Disintegration Testing', description: 'Tested 100-revolution Roche friabilator and USP disintegration apparatus' },
      { module: 'Prototype & Optimization', task: 'Tablet Disintegration Time Optimization', description: 'Targeting < 3 minutes disintegration in water at 37°C' },
      { module: 'Prototype & Optimization', task: 'Weight Variation Statistical Analysis', description: 'Assessing RSD across 100 individual tablet samples' },
      { module: 'Prototype & Optimization', task: 'Aqueous Film Coating Trial', description: 'Pan speed, spray rate, and bed temperature optimization' },
      { module: 'Prototype & Optimization', task: 'Coating Weight Gain & Uniformity Assessment', description: 'Target 3.0% weight gain verification with colour difference analysis' },
      { module: 'Scale-Up', task: 'Scale-Up & Pilot Batch Setup', description: 'Pilot scale high shear granulator and compression trial setup' },
      { module: 'Scale-Up', task: 'Batch Yield & Reconciliation Report', description: 'Granule weight reconciliation and theoretical yield computation' },
      { module: 'Scale-Up', task: 'Scale-Up & Pilot Batch Calculations', description: 'Scale-up parameter calculation for fluid bed processor and high shear mixer' },
      { module: 'Scale-Up', task: 'Fluid Bed Granulation Pilot Trial Setup', description: 'Top-spray granulation parameter setup with peristaltic pump calibration' },
      { module: 'Scale-Up', task: 'Granule Flow & Bulk Density Confirmation', description: 'Testing tapped density and compressibility index on pilot batch' },
      { module: 'Scale-Up', task: 'High Speed Rotary Press Pilot Run', description: 'Pilot run at 120,000 tablets/hr with compression force transducer logging' },
      { module: 'Testing & Validation', task: 'Stability Study Sample Loading', description: 'Stability protocol execution and sample loading in ICH climate chambers' },
      { module: 'Testing & Validation', task: 'ICH Chamber Calibration & Monitoring', description: 'Checked 25°C/60% RH and 40°C/75% RH sensor mappings and data loggers' },
      { module: 'Testing & Validation', task: 'Packaging Leak & Seal Strength Testing', description: 'Vacuum decay and dye ingress testing on blister packed blisters' },
      { module: 'BA/BE & Stability', task: 'Bioequivalence Readiness Assessment', description: 'Evaluating bioequivalence study readiness and comparator profile similarity' },
      { module: 'BA/BE & Stability', task: 'In-Vitro In-Vivo Correlation (IVIVC) Modeling', description: 'GastroPlus simulation for plasma concentration-time curve matching' },
      { module: 'Regulatory Submission', task: 'Regulatory Dossier Preparation', description: 'Compiling Module 3 Quality CMC documentation for regulatory filing' },
      { module: 'Regulatory Submission', task: 'Regulatory Review & Gap Assessment', description: 'Internal regulatory gap assessment and compliance review' },
      { module: 'Regulatory Submission', task: 'Drug Master File (DMF) Completeness Check', description: 'Verified Letter of Access (LoA) and active substance starting materials' },
      { module: 'Regulatory Submission', task: 'Summary of Product Characteristics (SmPC) Draft', description: 'Drafted Section 4.2 Posology and Section 6.1 Excipient list' },
      { module: 'Manufacturing Readiness', task: 'Commercial Manufacturing Readiness', description: 'Manufacturing transfer protocols and batch manufacturing record (BMR) drafts' },
      { module: 'Manufacturing Readiness', task: 'Equipment Qualification (IQ/OQ/PQ) Review', description: 'Rotary press and automated blister packaging line signoff protocols' },
      { module: 'Commercialization', task: 'Launch Readiness Plan', description: 'Commercial supply chain alignment and packaging artwork verification' },
      { module: 'Commercialization', task: 'Primary Packaging Integrity (HVLD & Bubble Test)', description: 'Alu-Alu blister leak testing and moisture barrier confirmation' }
    ];

    const teamMembers = [
      { name: 'Rajesh Kumar', code: 'JB-301' },
      { name: 'Anita Desai', code: 'JB-302' },
      { name: 'Priya Reddy', code: 'JB-303' },
      { name: 'Amit Patel', code: 'JB-304' },
      { name: 'Suresh Naidu', code: 'JB-305' },
      { name: 'Arun Joseph', code: 'JB-306' },
      { name: 'Lakshmi Devi', code: 'JB-307' },
      { name: 'Deepa Nair', code: 'JB-308' },
      { name: 'Vikram Singh', code: 'JB-309' },
      { name: 'Sneha Sharma', code: 'JB-310' }
    ];

    // Day task distributions: Target total tasks per day = 40, 55, 60, etc.
    const daySchedules: { day: number; targetTasks: number; empCount: number }[] = [
      { day: 1, targetTasks: 40, empCount: 6 },
      { day: 2, targetTasks: 55, empCount: 8 },
      { day: 3, targetTasks: 60, empCount: 8 },
      { day: 4, targetTasks: 40, empCount: 6 },
      { day: 5, targetTasks: 55, empCount: 8 },
      { day: 8, targetTasks: 60, empCount: 8 },
      { day: 9, targetTasks: 40, empCount: 6 },
      { day: 10, targetTasks: 55, empCount: 8 },
      { day: 11, targetTasks: 60, empCount: 8 },
      { day: 12, targetTasks: 40, empCount: 6 },
      { day: 15, targetTasks: 55, empCount: 8 },
      { day: 16, targetTasks: 60, empCount: 8 },
      { day: 17, targetTasks: 40, empCount: 6 },
      { day: 18, targetTasks: 55, empCount: 8 },
      { day: 19, targetTasks: 60, empCount: 8 },
      { day: 22, targetTasks: 55, empCount: 8 },
      { day: 23, targetTasks: 60, empCount: 8 },
      { day: 24, targetTasks: 40, empCount: 6 },
      { day: 25, targetTasks: 55, empCount: 8 },
      { day: 26, targetTasks: 60, empCount: 8 },
      { day: 29, targetTasks: 40, empCount: 6 },
      { day: 30, targetTasks: 60, empCount: 8 }
    ];

    const entries: HourEntry[] = [];
    let taskPoolIdx = 0;

    daySchedules.forEach((schedule, schedIdx) => {
      const dateObj = new Date(2026, 5, schedule.day);
      const employees = teamMembers.slice(0, schedule.empCount);
      const totalTasks = schedule.targetTasks;
      
      const baseTasksPerEmp = Math.floor(totalTasks / employees.length);
      const remainder = totalTasks % employees.length;

      employees.forEach((emp, empIdx) => {
        const count = baseTasksPerEmp + (empIdx < remainder ? 1 : 0);
        const tasksList: HourTaskDetail[] = [];
        let empTotalHours = 0;

        // Overtime for few records (~25% of records)
        const isOvertime = (schedIdx * 2 + empIdx) % 4 === 1;
        const targetHours = isOvertime ? Number((10.0 + ((empIdx * 3) % 4) * 0.5).toFixed(1)) : 8.0;

        for (let t = 0; t < count; t++) {
          const taskTemplate = pharmaTasksPool[taskPoolIdx % pharmaTasksPool.length];
          taskPoolIdx++;
          const hourAlloc = Number(((targetHours / count) + (t % 2 === 0 ? 0.2 : -0.2)).toFixed(1));
          empTotalHours += hourAlloc;

          tasksList.push({
            module: taskTemplate.module,
            task: taskTemplate.task,
            hours: hourAlloc > 0 ? hourAlloc : 1.0,
            description: taskTemplate.description
          });
        }

        const isPending = (schedIdx + empIdx) % 5 === 0;
        const isDeclined = (schedIdx + empIdx) % 7 === 0 && !isPending;
        const isApproved = !isPending && !isDeclined;

        entries.push({
          dateObj,
          jobCode: `${emp.code}-${schedule.day}`,
          name: emp.name,
          projectsCount: 3,
          tasksList,
          totalHours: Number(empTotalHours.toFixed(1)) || targetHours,
          approved: isApproved,
          declined: isDeclined,
          pending: isPending,
          isOvertime,
          overtimeHours: isOvertime ? Number((empTotalHours - 8.0).toFixed(1)) : 0,
          messages: empIdx === 0 ? [{ sender: emp.name, date: `2026-06-${String(schedule.day).padStart(2, '0')}`, text: `Completed all assigned batch tasks for day ${schedule.day}.` }] : []
        });
      });
    });

    this.entries = entries;
  }

  // --- Calendar Logic ---

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  get totalClaimsInRange(): number {
    return this.calendarDays.filter(d => d.inCurrentMonth).reduce((sum, d) => sum + d.claims, 0);
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
    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());
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
        claims: inCurrentMonth
          ? this.entries
              .filter(e => this.isSameDay(e.dateObj, cellDate))
              .reduce((sum, e) => sum + (e.tasksList?.length || 0), 0)
          : 0
      });
    }
    this.calendarDays = days;
  }

  filterByDate(day: CalendarDay): void {
    if (!day.inCurrentMonth) return;

    this.selectedDate = day.date;
    this.filteredEntries = this.entries.filter(e => this.isSameDay(e.dateObj, day.date));
    this.totalSize = this.filteredEntries.length;
    this.calendarDays.forEach(d => d.isSelected = this.isSameDay(d.date, day.date));

    this.currentPage = 1;
    this.updatePagination();
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  formatDate(d: Date): string {
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${String(d.getFullYear()).slice(-2)}`;
  }

  // --- Pagination ---

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.paginatedEntries = this.filteredEntries.slice(startIndex, startIndex + this.pageSize);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  // --- Status & Actions ---

  toggleRowStatus(entry: HourEntry, field: 'approved' | 'declined' | 'pending'): void {
    if (field === 'approved') {
      entry.approved = !entry.approved;
      if (entry.approved) { entry.declined = false; entry.pending = false; }
    } else if (field === 'declined') {
      entry.declined = !entry.declined;
      if (entry.declined) { entry.approved = false; entry.pending = false; }
    } else if (field === 'pending') {
      entry.pending = !entry.pending;
      if (entry.pending) { entry.approved = false; entry.declined = false; }
    }
  }

  openTasksDialog(entry: HourEntry): void {
    this.dialog.open(this.tasksDialog, { width: '1100px', maxWidth: '95vw', data: entry });
  }

  openMessagesDialog(entry: HourEntry): void {
    this.dialog.open(this.messageDialog, { width: '600px', maxWidth: '95vw', data: entry });
  }

  addMessage(entry: HourEntry, text: string): void {
    if (!text.trim()) return;
    if (!entry.messages) entry.messages = [];
    entry.messages.push({ sender: 'Current User', date: new Date().toISOString().split('T')[0], text: text.trim() });
  }

  // addTimesheet(): void {
  //   const dialogRef = this.dialog.open(AddHoursPopComponent, { width: '800px', height: 'auto', data: null });
  //   dialogRef.afterClosed().subscribe((result: any) => {
  //     if (result) {
  //       const tasks: HourTaskDetail[] = (result.rows || []).map((r: any) => ({
  //         module: r.module || 'General', task: r.task || 'Task Log',
  //         hours: Number(r.hours) || 0, description: r.description || ''
  //       }));

  //       const newEntry: HourEntry = {
  //         dateObj: result.dateObj, jobCode: `JB-${200 + this.entries.length + 1}`,
  //         name: result.name || 'Anonymous',
  //         tasksList: tasks.length ? tasks : [{ module: 'General', task: 'Task Log', hours: 1, description: 'General work' }],
  //         totalHours: tasks.reduce((sum, t) => sum + t.hours, 0) || 1,
  //         approved: false, declined: false, pending: true, messages: []
  //       };

  //       this.entries.push(newEntry);
  //       this.buildCalendar();
  //       if (this.selectedDate) this.filterByDate(this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!))!);
  //     }
  //   });
  // }

  editEntry(entry: HourEntry): void {
    const dialogRef = this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: {
        dateObj: entry.dateObj,
        name: entry.name,
        tasksList: entry.tasksList
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        entry.dateObj = result.dateObj;
        entry.name = result.name;
        if (result.rows && result.rows.length > 0) {
          entry.tasksList = result.rows.map((r: any) => ({
            module: r.module || 'General',
            task: r.task || 'Task Log',
            hours: Number(r.hours) || 0,
            description: r.description || ''
          }));
          entry.totalHours = entry.tasksList.reduce((sum, t) => sum + t.hours, 0);
          entry.isOvertime = entry.totalHours > 8.0;
          entry.overtimeHours = entry.isOvertime ? Number((entry.totalHours - 8.0).toFixed(1)) : 0;
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
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: entry
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.entries = this.entries.filter(e => e !== entry);
        this.buildCalendar();
        if (this.selectedDate) {
          this.filterByDate(this.calendarDays.find(d => this.isSameDay(d.date, this.selectedDate!))!);
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
    this.router.navigate(['/app/testing/projects/dashboard/analytics'], { queryParams: { code: "2026/GEN/001", name: "Generic Tablet Development" } });
  }
}
