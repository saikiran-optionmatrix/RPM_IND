import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  INDUSTRIAL_DIVISIONS,
  INDUSTRIAL_LOCATIONS,
  INDUSTRIAL_PROJECT_NAMES,
} from '../industrial-dashboard.data';

@Component({
  selector: 'app-dashboard-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-timeline.component.html',
  styleUrls: ['./dashboard-timeline.component.scss']
})
export class DashboardTimelineComponent implements OnInit, AfterViewInit {

  @ViewChild('tableContainer') tableContainer!: ElementRef;

  canScrollLeft = false;
  canScrollRight = true;

  projects = INDUSTRIAL_PROJECT_NAMES;

  mainStages = [
    { key: 'g1', label: 'Business Case Approval (Gate 1)' },
    { key: 'g2', label: 'Concept Selection & Design Freeze (Gate 2)' },
    { key: 'g3', label: 'Procurement & Build Readiness (Gate 3)' },
    { key: 'g4', label: 'Commissioning & Performance Acceptance (Gate 4)' },
    { key: 'g5', label: 'Operational Handover Approval (Gate 5)' }
  ];

  selectedProject = INDUSTRIAL_PROJECT_NAMES[0];
  selectedStageFilter = 'g1';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = INDUSTRIAL_DIVISIONS;

  readonly locationsList: string[] = INDUSTRIAL_LOCATIONS;

  calendarDays: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  private readonly gateDeliverableTemplates = [
    // Gate 1: Business Case Approval
    { task: '1. Plant Needs Assessment & Existing Asset Review', startDay: 1, endDay: 8, completion: 100, gate: 'g1' },
    { task: '2. Process Requirements & Operational Feasibility Assessment', startDay: 5, endDay: 14, completion: 100, gate: 'g1' },
    { task: '3. Equipment Configuration & Technical Feasibility Assessment', startDay: 9, endDay: 18, completion: 100, gate: 'g1' },
    { task: '4. Engineering Concept Review & Performance Feasibility', startDay: 12, endDay: 22, completion: 100, gate: 'g1' },
    { task: '5. Preliminary Capital Cost & Operating Cost Assessment', startDay: 16, endDay: 25, completion: 100, gate: 'g1' },
    { task: '6. Business Case Go/No-Go Gate 1 Approval', startDay: 20, endDay: 28, completion: 100, gate: 'g1' },

    // Gate 2: Concept Selection & Design Freeze
    { task: '1. Equipment Architecture & Layout Concept Evaluation', startDay: 2, endDay: 11, completion: 90, gate: 'g2' },
    { task: '2. Detailed Mechanical, Electrical & Control Design', startDay: 8, endDay: 18, completion: 80, gate: 'g2' },
    { task: '3. Utility, Footprint & Safety Interlock Engineering', startDay: 13, endDay: 23, completion: 65, gate: 'g2' },
    { task: '4. Design FMEA & Cycle-Time / Throughput Simulation', startDay: 17, endDay: 27, completion: 50, gate: 'g2' },
    { task: '5. Concept Selection & Design Freeze Gate 2 Approval', startDay: 22, endDay: 30, completion: 30, gate: 'g2' },

    // Gate 3: Procurement & Build Readiness
    { task: '1. OEM & Vendor Technical Qualification & RFQ Review', startDay: 3, endDay: 14, completion: 75, gate: 'g3' },
    { task: '2. Long-Lead Equipment & Critical Component Procurement', startDay: 9, endDay: 20, completion: 60, gate: 'g3' },
    { task: '3. Prototype Fabrication & Subassembly Dimensional Inspection', startDay: 14, endDay: 25, completion: 45, gate: 'g3' },
    { task: '4. Site Readiness & Plant Utility Infrastructure Prep', startDay: 19, endDay: 29, completion: 30, gate: 'g3' },
    { task: '5. Procurement & Build Readiness Gate 3 Sign-off', startDay: 24, endDay: 30, completion: 15, gate: 'g3' },

    // Gate 4: Commissioning & Performance Acceptance
    { task: '1. Equipment Installation, Alignment & Panel Wiring', startDay: 4, endDay: 14, completion: 40, gate: 'g4' },
    { task: '2. PLC / SCADA Automation Integration & I/O Loop Checks', startDay: 11, endDay: 21, completion: 25, gate: 'g4' },
    { task: '3. Factory & Site Acceptance Testing (FAT / SAT)', startDay: 16, endDay: 27, completion: 15, gate: 'g4' },
    { task: '4. Commissioning & Performance Acceptance Gate 4 Approval', startDay: 20, endDay: 30, completion: 10, gate: 'g4' },

    // Gate 5: Operational Handover Approval
    { task: '1. Operational Qualification (OQ) & Endurance Run Verification', startDay: 2, endDay: 15, completion: 35, gate: 'g5' },
    { task: '2. Operator Training, SOPs & Preventive Maintenance Setup', startDay: 10, endDay: 23, completion: 20, gate: 'g5' },
    { task: '3. Safety, Environmental & Statutory Compliance Clearance', startDay: 18, endDay: 29, completion: 10, gate: 'g5' },
    { task: '4. Operational Handover & Project Closeout Gate 5 Sign-off', startDay: 22, endDay: 30, completion: 0, gate: 'g5' }
  ];

  ganttData = this.projects.flatMap((project, projIdx) =>
    this.gateDeliverableTemplates.map(tpl => {
      const shift = projIdx % 3;
      const startDay = Math.min(27, tpl.startDay + shift);
      const endDay = Math.min(30, Math.max(startDay + 2, tpl.endDay + (projIdx % 2)));
      const completion = tpl.completion === 100
        ? 100
        : Math.max(0, Math.min(95, tpl.completion - (projIdx % 4) * 5));
      return {
        task: tpl.task,
        start: Date.UTC(2026, 4, startDay),
        end: Date.UTC(2026, 4, endDay),
        completion,
        gate: tpl.gate,
        project
      };
    })
  );

  filteredGanttData: any[] = [];

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  ngOnInit() {
    this.applyGanttFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollBounds(), 100);
  }

  applyGanttFilter() {
    this.filteredGanttData = this.ganttData.filter(d => {
      const matchProj = !this.selectedProject || d.project === this.selectedProject;
      const matchStage = d.gate === this.selectedStageFilter;
      return matchProj && matchStage;
    });
  }

  // --- SCROLLING LOGIC ---

  onTableScroll() {
    this.checkScrollBounds();
  }

  checkScrollBounds() {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;

    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth - 1;
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right') {
    if (!this.tableContainer) return;
    const el = this.tableContainer.nativeElement;
    const scrollAmount = 350;

    if (direction === 'left') {
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // --- GANTT CALENDAR HELPERS ---

  isDayInRange(item: any, day: number): boolean {
    const startDay = new Date(item.start).getUTCDate();
    const endDay = new Date(item.end).getUTCDate();
    return day >= startDay && day <= endDay;
  }

  isDayStart(item: any, day: number): boolean {
    return new Date(item.start).getUTCDate() === day;
  }

  isDayEnd(item: any, day: number): boolean {
    return new Date(item.end).getUTCDate() === day;
  }

  getDarkBarColor(completion: number): string {
    if (completion >= 75) return '#28a745'; // Green
    if (completion > 0) return '#f4a300'; // Orange
    return '#adb5bd'; // Gray for 0%
  }

  // --- TOOLTIP HELPERS ---

  showTooltip(event: MouseEvent, item: any) {
    this.tooltipData = item;
    this.tooltipVisible = true;
    this.updateTooltipPosition(event);
  }

  moveTooltip(event: MouseEvent) {
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  private updateTooltipPosition(event: MouseEvent) {
    this.tooltipX = event.clientX + 15;
    this.tooltipY = event.clientY + 15;
  }
}
