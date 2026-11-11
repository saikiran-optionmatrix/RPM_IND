import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

  projects = ['Generic Tablet Development', 'Generic API Process Development'];

  mainStages = [
    { key: 'g0', label: 'Idea Screening (Gate 0)' },
    { key: 'g1', label: 'Molecule Selection (Gate 1)' },
    { key: 'g2', label: 'Feasibility & FTO (Gate 2)' },
    { key: 'g3', label: 'Formulation Dev (Gate 3)' },
    { key: 'g4', label: 'Exhibit & BE (Gate 4)' },
    { key: 'g5', label: 'Dossier Filing (Gate 5)' },
    { key: 'g6', label: 'Query & Approval (Gate 6)' },
    { key: 'g7', label: 'Launch & Review (Gate 7)' }
  ];

  selectedProject = 'Generic Tablet Development';
  selectedStageFilter = 'g1';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = [
    'All',
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
  ];

  readonly locationsList: string[] = [
    'All',
    'Hyderabad',
    'Mumbai',
    'Bengaluru',
    'Ahmedabad',
    'Pune',
    'Chennai',
    'Delhi',
    'Baddi',
  ];

  calendarDays: number[] = Array.from({ length: 30 }, (_, i) => i + 1);

  ganttData = [
    // Gate 0: Idea Screening
    { task: '1. Literature & Patent Landscape Assessment', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 6), completion: 100, gate: 'g0', project: 'Generic Tablet Development' },
    { task: '2. Market Demand & Target Product Profile (TPP)', start: Date.UTC(2026, 4, 4), end: Date.UTC(2026, 4, 10), completion: 100, gate: 'g0', project: 'Generic Tablet Development' },
    { task: '3. Preliminary Regulatory Pathway Clearance', start: Date.UTC(2026, 4, 8), end: Date.UTC(2026, 4, 15), completion: 100, gate: 'g0', project: 'Generic Tablet Development' },
    { task: '4. Commercial Opportunity & NPV Modeling', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 19), completion: 100, gate: 'g0', project: 'Generic Tablet Development' },
    { task: '5. Gate 0 Screening Sign-off & Charter Lock', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g0', project: 'Generic Tablet Development' },

    // Gate 1: Molecule Selection
    { task: '1. Reference Listed Drug (RLD) Sourcing & Characterization', start: Date.UTC(2026, 4, 1), end: Date.UTC(2026, 4, 8), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },
    { task: '2. API Source Evaluation & DMF Verification', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 14), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },
    { task: '3. Polymorphic Form Screening & Solubility Studies', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 18), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },
    { task: '4. Drug-Excipient Compatibility & Pre-formulation', start: Date.UTC(2026, 4, 12), end: Date.UTC(2026, 4, 22), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },
    { task: '5. Preliminary Cost of Goods (COGs) Modeling', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 25), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },
    { task: '6. Feasibility Go/No-Go Gate 1 Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 28), completion: 100, gate: 'g1', project: 'Generic Tablet Development' },

    // Gate 2: Feasibility & FTO
    { task: '1. Granulation & Wet Milling Process Optimization', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 11), completion: 90, gate: 'g2', project: 'Generic Tablet Development' },
    { task: '2. Tableting Compression Hardness & Friability Profiling', start: Date.UTC(2026, 4, 8), end: Date.UTC(2026, 4, 18), completion: 80, gate: 'g2', project: 'Generic Tablet Development' },
    { task: '3. Film Coating Parameter Lock & DoE Formulation Trials', start: Date.UTC(2026, 4, 13), end: Date.UTC(2026, 4, 23), completion: 65, gate: 'g2', project: 'Generic Tablet Development' },
    { task: '4. In-Vitro Dissolution Comparability vs Innovator RLD', start: Date.UTC(2026, 4, 17), end: Date.UTC(2026, 4, 27), completion: 50, gate: 'g2', project: 'Generic Tablet Development' },
    { task: '5. Formulation Robustness Lock & Gate 2 Documentation', start: Date.UTC(2026, 4, 22), end: Date.UTC(2026, 4, 30), completion: 30, gate: 'g2', project: 'Generic Tablet Development' },

    // Gate 3: Formulation Dev
    { task: '1. Analytical Method Validation (Assay & RS)', start: Date.UTC(2026, 4, 3), end: Date.UTC(2026, 4, 14), completion: 75, gate: 'g3', project: 'Generic Tablet Development' },
    { task: '2. Discriminatory Dissolution Method Development', start: Date.UTC(2026, 4, 9), end: Date.UTC(2026, 4, 20), completion: 60, gate: 'g3', project: 'Generic Tablet Development' },
    { task: '3. Forced Degradation & Stress Testing Studies', start: Date.UTC(2026, 4, 14), end: Date.UTC(2026, 4, 25), completion: 45, gate: 'g3', project: 'Generic Tablet Development' },
    { task: '4. Accelerated Stability Setup (40°C / 75% RH)', start: Date.UTC(2026, 4, 19), end: Date.UTC(2026, 4, 29), completion: 30, gate: 'g3', project: 'Generic Tablet Development' },
    { task: '5. Intermediate Stability Pull & Gate 3 Review', start: Date.UTC(2026, 4, 24), end: Date.UTC(2026, 4, 30), completion: 15, gate: 'g3', project: 'Generic Tablet Development' },

    // Gate 4: Exhibit & BE
    { task: '1. Pilot Plant Technology Transfer & Line Clearance', start: Date.UTC(2026, 4, 4), end: Date.UTC(2026, 4, 14), completion: 40, gate: 'g4', project: 'Generic Tablet Development' },
    { task: '2. Exhibit Batch 1 Execution (100,000 Units)', start: Date.UTC(2026, 4, 11), end: Date.UTC(2026, 4, 21), completion: 25, gate: 'g4', project: 'Generic Tablet Development' },
    { task: '3. Exhibit Batch 2 & 3 Manufacturing & In-Process QC', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 27), completion: 15, gate: 'g4', project: 'Generic Tablet Development' },
    { task: '4. Bioequivalence Clinical Study Protocol & IRB Approval', start: Date.UTC(2026, 4, 20), end: Date.UTC(2026, 4, 30), completion: 10, gate: 'g4', project: 'Generic Tablet Development' },

    // Gate 5: Dossier Filing
    { task: '1. eCTD Module 2 Quality Overall Summary (QOS) Compilation', start: Date.UTC(2026, 4, 2), end: Date.UTC(2026, 4, 15), completion: 35, gate: 'g5', project: 'Generic Tablet Development' },
    { task: '2. Module 3 Drug Substance & Product CMC Data Collation', start: Date.UTC(2026, 4, 10), end: Date.UTC(2026, 4, 23), completion: 20, gate: 'g5', project: 'Generic Tablet Development' },
    { task: '3. Pre-Submission Regulatory Quality & Compliance Audit', start: Date.UTC(2026, 4, 18), end: Date.UTC(2026, 4, 29), completion: 10, gate: 'g5', project: 'Generic Tablet Development' },

    // Gate 6: Query & Approval
    { task: '1. Commercial Facility Scale-Up Validation Protocol', start: Date.UTC(2026, 4, 5), end: Date.UTC(2026, 4, 18), completion: 20, gate: 'g6', project: 'Generic Tablet Development' },
    { task: '2. Process Performance Qualification (PPQ) Readiness', start: Date.UTC(2026, 4, 14), end: Date.UTC(2026, 4, 26), completion: 10, gate: 'g6', project: 'Generic Tablet Development' },
    { task: '3. Cleaning Validation & Environmental Monitoring', start: Date.UTC(2026, 4, 21), end: Date.UTC(2026, 4, 30), completion: 0, gate: 'g6', project: 'Generic Tablet Development' },

    // Gate 7: Launch & Review
    { task: '1. Packaging Artwork, Serialisation & GS1 Compliance', start: Date.UTC(2026, 4, 6), end: Date.UTC(2026, 4, 19), completion: 10, gate: 'g7', project: 'Generic Tablet Development' },
    { task: '2. Commercial Launch Inventory Build & 3PL Logistics', start: Date.UTC(2026, 4, 16), end: Date.UTC(2026, 4, 28), completion: 0, gate: 'g7', project: 'Generic Tablet Development' },
    { task: '3. Post-Launch Pharmacovigilance & Commercial Review', start: Date.UTC(2026, 4, 22), end: Date.UTC(2026, 4, 30), completion: 0, gate: 'g7', project: 'Generic Tablet Development' }
  ];

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
