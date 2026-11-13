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
    const industrialTasksPool: { module: string; task: string; description: string }[] = [
      { module: 'Opportunity & Feasibility', task: 'Plant Capacity & Bottleneck Audit', description: 'Evaluate line takt time, OEE baseline, and throughput constraints across workcenters' },
      { module: 'Opportunity & Feasibility', task: 'Benchmark OEM Equipment Sourcing', description: 'Compare OEM machinery specifications, spindle duty cycles, and lifecycle cost proposals' },
      { module: 'Opportunity & Feasibility', task: 'IP & Proprietary Tooling Review', description: 'Verify custom fixture patents, controller licensing, and freedom-to-operate clearance' },
      { module: 'Opportunity & Feasibility', task: 'CapEx & ROI Financial Modeling', description: 'Compute net present value, payback period, and capital sensitivity thresholds' },
      { module: 'Opportunity & Feasibility', task: 'Existing Line Technical Benchmarking', description: 'Inspect current machinery accuracy, cycle times, and utility consumption baselines' },
      { module: 'Concept & Scope Definition', task: 'URS & Functional Spec Drafting', description: 'Define equipment footprint, load envelope, cycle rate, and tolerance requirements' },
      { module: 'Concept & Scope Definition', task: 'Utilities & Infrastructure Audit', description: 'Verify 480V 3-phase power, compressed air SCFM, and chilled water capacity' },
      { module: 'Concept & Scope Definition', task: 'Safety & CE / ISO Risk Assessment', description: 'Conduct ISO 12100 machinery hazard identification and ISO 13849 PLd rating review' },
      { module: 'Concept & Scope Definition', task: '2D Plant Floor & Ergonomics Layout', description: 'Optimize operator reach, AGV material flow aisles, and maintenance access zones' },
      { module: 'Concept & Scope Definition', task: 'Thermal & Structural Load Envelope', description: 'Evaluate spindle thermal growth and dynamic vibration isolation requirements' },
      { module: 'Concept & Scope Definition', task: 'CMM Metrology Tolerance Allocation', description: 'Define GD&T datum schemes and statistical gauge R&R inspection targets' },
      { module: 'Concept & Scope Definition', task: 'Component Material Compatibility Check', description: 'Verify alloy fatigue ratings, weldability, and cutting fluid corrosion resistance' },
      { module: 'Concept & Scope Definition', task: 'Environmental & IP Enclosure Testing', description: 'Validate IP65 control cabinet sealing against coolant mist and metal swarf' },
      { module: 'Concept & Scope Definition', task: 'Precision Casting Machining Trial', description: 'Verify surface roughness Ra < 0.8 um and flatness tolerance across test coupons' },
      { module: 'Concept & Scope Definition', task: 'Raw Billet Incoming Hardness Verification', description: 'Perform Rockwell hardness, ultrasonic flaw check, and spectrochemical verification' },
      { module: 'Concept & Scope Definition', task: 'Tier-1 Component Vendor Audit', description: 'Qualify servo drive, ballscrew, and linear guide suppliers against ISO 9001' },
      { module: 'Concept & Scope Definition', task: 'Hydraulic Manifold Flow Rate Verification', description: 'Measure pressure drop and valve response time on hydraulic test rig' },
      { module: 'Concept & Scope Definition', task: 'Lubrication & Coolant Filtration Check', description: 'Test micron filtration efficiency and thermal heat exchanger duty cycle' },
      { module: 'Detailed Engineering', task: '3D CAD Assembly Modeling', description: 'Complete full parametric subassembly models and interference clash detection' },
      { module: 'Detailed Engineering', task: 'Structural & Frame FEA Simulation', description: 'Analyze deflection, modal frequency, and weldment stress under peak cutting loads' },
      { module: 'Detailed Engineering', task: 'PLC / SCADA Control Architecture', description: 'Design EtherCAT motion bus topology, HMI screen wireframes, and alarm interlocks' },
      { module: 'Detailed Engineering', task: 'EPLAN Electrical Panel Schematics', description: 'Generate panel wiring diagrams, VFD breaker sizing, and safety relay loops' },
      { module: 'Detailed Engineering', task: 'Pneumatic & Hydraulic Circuit Design', description: 'Specify dual-channel dump valves, accumulators, and proportional flow controls' },
      { module: 'Detailed Engineering', task: 'Thermal Stress & Chiller Sizing', description: 'Model spindle bearing heat rejection and specify closed-loop coolant chiller' },
      { module: 'Detailed Engineering', task: 'Automated Chip & Scrap Conveyor Design', description: 'Integrate coolant-wash auger conveyor and swarf bin level sensors' },
      { module: 'Detailed Engineering', task: 'Servo Axis Tuning & Kinematics Simulation', description: 'Simulate rapid traverse acceleration, jerk limits, and collision avoidance envelopes' },
      { module: 'Detailed Engineering', task: 'Modular Quick-Change Fixture Design', description: 'Design zero-point pneumatic clamping pallets for SMED changeover under 5 minutes' },
      { module: 'Detailed Engineering', task: 'Design for Manufacturing & Assembly (DFMA)', description: 'Standardize fasteners, reduce custom weldments, and verify tooling clearances' },
      { module: 'Detailed Engineering', task: 'Industrial Powder Coat & Surface Spec', description: 'Specify corrosion-resistant epoxy primer and textured polyurethane finish' },
      { module: 'Detailed Engineering', task: 'Design of Experiments (DoE) Parameter Matrix', description: 'Execute factorial trial optimizing feed rate, RPM, and tool life repeatability' },
      { module: 'Detailed Engineering', task: 'Safety Interlock & Light Curtain Placement', description: 'Verify ISO 13855 stopping-time safety distances and dual-channel E-stop loops' },
      { module: 'Quality & Metrology', task: 'CMM Inspection Program Authoring', description: 'Write offline PC-DMIS routines for critical bore concentricity and perpendicularity' },
      { module: 'Quality & Metrology', task: 'Ballbar Circularity & Laser Interferometry', description: 'Measure ISO 230-2 positioning accuracy and axis backlash across full stroke' },
      { module: 'Quality & Metrology', task: 'Gage Repeatability & Reproducibility (GR&R)', description: 'Execute 3-operator 10-part ANOVA gauge study targeting < 10% total variation' },
      { module: 'Quality & Metrology', task: 'Multi-Shift Process Capability (Cpk) Study', description: 'Analyze X-bar/R charts across 50 machined test parts targeting Cpk >= 1.67' },
      { module: 'Quality & Metrology', task: 'Vision Inspection Camera Calibration', description: 'Verify optical lens distortion, ring-light contrast, and pass/fail threshold repeatability' },
      { module: 'Quality & Metrology', task: 'Acoustic & Vibration Spectrum Profiling', description: 'Establish FFT bearing health baselines across full spindle RPM sweep' },
      { module: 'Quality & Metrology', task: 'Non-Destructive Weld (NDT / MPI) Inspection', description: 'Perform magnetic particle and dye penetrant checks on load-bearing frame welds' },
      { module: 'Quality & Metrology', task: 'Measurement Validation Summary Report', description: 'Compile linearity, bias, stability, and calibration traceability certificates' },
      { module: 'Prototyping & Fabrication', task: 'Prototype Fixture Machining & Assembly', description: 'Fabricate first-article workholding fixture and verify datum pin repeatability' },
      { module: 'Prototyping & Fabrication', task: 'Control Cabinet Wiring & Point-to-Point Test', description: 'Conduct continuity, hipots, and I/O loopback checkout per IEC 60204-1' },
      { module: 'Prototyping & Fabrication', task: 'CNC Spindle Run-In & Thermal Warmup', description: 'Execute stepped RPM run-in sequence while logging bearing temperature rise' },
      { module: 'Prototyping & Fabrication', task: 'Robotic End-of-Arm Tooling (EOAT) Trial', description: 'Verify gripper payload deflection and part release repeatability across 500 cycles' },
      { module: 'Prototyping & Fabrication', task: 'Cycle Time Optimization & Path Smoothing', description: 'Trim rapid-approach air cuts and synchronize gantry pick-and-place handshakes' },
      { module: 'Prototyping & Fabrication', task: 'First-Article Dimension & Surface Verification', description: 'Inspect first-off components against engineering drawings before lot sign-off' },
      { module: 'Prototyping & Fabrication', task: 'Enclosure Guarding & Mist Collector Fitment', description: 'Install polycarbonate safety glazing and verify oil-mist extraction airflow' },
      { module: 'Prototyping & Fabrication', task: 'PLC HMI Recipe & Interlock Debugging', description: 'Validate fault recovery sequences, dry-run mode, and part counter totals' },
      { module: 'Scale-Up & Pilot Trial', task: 'Pilot Production Cell Dry & Wet Run', description: 'Operate full multi-station cell under simulated production takt time' },
      { module: 'Scale-Up & Pilot Trial', task: 'Scrap Rate & Material Yield Reconciliation', description: 'Track raw bar-stock input vs finished good units and chip recovery ratio' },
      { module: 'Scale-Up & Pilot Trial', task: 'Batch Line Balancing & Buffer Sizing', description: 'Calculate WIP conveyor accumulation buffer between roughing and finishing cells' },
      { module: 'Scale-Up & Pilot Trial', task: 'Automatic Tool Changer (ATC) Endurance Test', description: 'Verify 2,000 consecutive tool swaps with zero magazine indexing faults' },
      { module: 'Scale-Up & Pilot Trial', task: 'Automated Packaging & Case Erector Sync', description: 'Calibrate checkweigher reject diverter and barcode print-and-apply labeler' },
      { module: 'Scale-Up & Pilot Trial', task: 'High-Speed Continuous 8-Hour Run', description: 'Monitor throughput stability, motor torque peaks, and thermal equilibrium' },
      { module: 'Commissioning & Qualification', task: 'Factory Acceptance Test (FAT) Witnessing', description: 'Execute OEM floor sign-off checklist prior to crating and rigging shipment' },
      { module: 'Commissioning & Qualification', task: 'IQ / OQ Equipment Protocol Execution', description: 'Verify foundation leveling, anchor torque, and operational safety interlocks' },
      { module: 'Commissioning & Qualification', task: 'Site Acceptance Test (SAT) Punchlist Closure', description: 'Resolve open field wiring, guarding, and sensor alignment items on plant floor' },
      { module: 'Compliance & Documentation', task: 'As-Built Technical Transfer Dossier', description: 'Compile final CAD drawings, EPLAN schematics, PLC source code, and BOMs' },
      { module: 'Compliance & Documentation', task: 'CE / UL / BIS Safety Compliance Dossier', description: 'Finalize risk assessment declaration of conformity and LOTO placards' },
      { module: 'Compliance & Documentation', task: 'CMMS Preventive Maintenance Plan Setup', description: 'Load lubrication schedules, wear-part min/max spares, and inspection intervals' },
      { module: 'Compliance & Documentation', task: 'Standard Operating Procedure (SOP) Authoring', description: 'Publish bilingual operator setup, alarm troubleshooting, and sanitation guides' },
      { module: 'Production Readiness', task: 'Plant Transfer & Operator Training Sign-Off', description: 'Deliver hands-on classroom and floor certification for 3 shifts of operators' },
      { module: 'Production Readiness', task: 'Performance Qualification (PQ) Ramp-Up Audit', description: 'Verify sustained >= 85% OEE across three consecutive production shift runs' },
      { module: 'Operational Handover', task: 'Spare Parts Kit & Warranty Handover', description: 'Receive critical servo/sensor spares into plant crib and sign SLA transfer' },
      { module: 'Operational Handover', task: 'Final Gate 5 Executive Closeout Review', description: 'Present post-implementation ROI, actual vs budget cost, and lessons learned' }
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
          const taskTemplate = industrialTasksPool[taskPoolIdx % industrialTasksPool.length];
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
          messages: empIdx === 0 ? [{ sender: emp.name, date: `2026-06-${String(schedule.day).padStart(2, '0')}`, text: `Completed all assigned engineering tasks for day ${schedule.day}.` }] : []
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
    this.router.navigate(['/app/testing/projects/dashboard/analytics'], { queryParams: { code: "2026/IND/001", name: "Industrial Equipment Line Expansion" } });
  }
}
