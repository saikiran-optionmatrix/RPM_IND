import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

export interface BudgetItem {
  stage: string;
  module: string;
  task: string;
  allocation: string;
  standardHours: number;
  actualHours: number;
  budgetINR: number;
  usageINR: number;
  completion: number;
}

@Component({
  selector: 'app-template-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './template-budget.component.html',
  styleUrl: './template-budget.component.scss',
})
export class TemplateBudgetComponent implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || 'TPL/IND/001';

  allRows: BudgetItem[] = [
    { stage: 'S1 - Business Need & Assessment', module: 'Plant Capacity Audit', task: 'Throughput & Bottleneck Study', allocation: 'AR', standardHours: 120, actualHours: 115, budgetINR: 25000, usageINR: 23500, completion: 100 },
    { stage: 'S2 - Scope & Feasibility', module: 'URS & Functional Spec', task: 'URS & Equipment Envelope Definition', allocation: 'RK', standardHours: 180, actualHours: 170, budgetINR: 45000, usageINR: 42000, completion: 100 },
    { stage: 'S2 - Scope & Feasibility', module: 'Safety & CE Compliance', task: 'Machine Safety & ISO Standards Audit', allocation: 'AD', standardHours: 140, actualHours: 130, budgetINR: 35000, usageINR: 31500, completion: 100 },
    { stage: 'S3 - Concept Engineering', module: 'CAD & Controls Concept', task: '3D Line Layout & Drive Topology', allocation: 'PR', standardHours: 320, actualHours: 290, budgetINR: 110000, usageINR: 98000, completion: 85 },
    { stage: 'S3 - Concept Engineering', module: 'Vendor Pre-Qualification', task: 'Tier-1 OEM & Component RFQ Review', allocation: 'SN', standardHours: 160, actualHours: 140, budgetINR: 60000, usageINR: 52000, completion: 80 },
    { stage: 'S4 - Detailed Engineering', module: 'Mechanical & Electrical CAD', task: 'Full CAD Assembly, FEA & EPLAN Drawings', allocation: 'AP', standardHours: 480, actualHours: 360, budgetINR: 180000, usageINR: 132000, completion: 65 },
    { stage: 'S4 - Detailed Engineering', module: 'PLC / SCADA Programming', task: 'Motion Bus, HMI & Interlock Logic', allocation: 'DN', standardHours: 400, actualHours: 250, budgetINR: 145000, usageINR: 92000, completion: 55 },
    { stage: 'S5 - Design Freeze', module: 'DFMA & BOM Freeze', task: 'Master BOM & Tolerance Stack-Up Signoff', allocation: 'AJ', standardHours: 220, actualHours: 110, budgetINR: 75000, usageINR: 38000, completion: 45 },
    { stage: 'S6 - Process & Equipment Design', module: 'Fixtures & End-Effectors', task: 'SMED Clamping & EOAT Fabrication Spec', allocation: 'LD', standardHours: 380, actualHours: 130, budgetINR: 195000, usageINR: 64000, completion: 30 },
    { stage: 'S7 - Prototype & Validation', module: 'First-Article & FAT', task: 'Control Cabinet Build & OEM FAT Witness', allocation: 'VS', standardHours: 520, actualHours: 95, budgetINR: 260000, usageINR: 48000, completion: 20 },
    { stage: 'S10 - Commissioning & SAT', module: 'IQ/OQ & Cpk Qualification', task: 'Site Commissioning, SAT & 3-Shift OEE', allocation: 'SS', standardHours: 640, actualHours: 40, budgetINR: 320000, usageINR: 18500, completion: 10 },
  ];

  displayedRows: BudgetItem[] = [];
  stages: string[] = [];
  modules: string[] = [];

  private subs = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.subs.add(sub);

    this.stages = [...new Set(this.allRows.map((r) => r.stage))];
    this.modules = [...new Set(this.allRows.map((r) => r.module))];
    this.displayedRows = [...this.allRows];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  applyFilters(stage: string, module: string): void {
    this.displayedRows = this.allRows.filter(
      (r) =>
        (!stage || stage === 'Any' || r.stage === stage) &&
        (!module || module === 'Any' || r.module === module),
    );
  }

  fmt(n: number): string {
    return '$' + new Intl.NumberFormat('en-US').format(n);
  }

  getCompColor(val: number): string {
    if (val >= 50) return '#4caf50'; // Green
    if (val >= 35) return '#ff9800'; // Orange
    return '#f44336'; // Red
  }

  goBack(): void {
   this.router.navigate(['/master-data/templates']);
  }
}
