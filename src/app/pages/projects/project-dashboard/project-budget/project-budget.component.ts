import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  selector: 'app-project-budget',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-budget.component.html',
  styleUrl: './project-budget.component.scss'
})
export class ProjectBudgetComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Industrial Equipment Line Expansion';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/IND/001';

  allRows: BudgetItem[] = [
    { stage: 'S1 - Business Need & Assessment', module: 'Plant Capacity Audit', task: 'Throughput & Bottleneck Study', allocation: 'AR', standardHours: 160, actualHours: 145, budgetINR: 20000, usageINR: 18000, completion: 100 },
    { stage: 'S2 - Scope & Feasibility', module: 'URS & Functional Spec', task: 'URS & Equipment Envelope Definition', allocation: 'RK', standardHours: 200, actualHours: 188, budgetINR: 35000, usageINR: 32500, completion: 100 },
    { stage: 'S2 - Scope & Feasibility', module: 'Safety & CE Compliance', task: 'Machine Safety & ISO Standards Audit', allocation: 'AP', standardHours: 160, actualHours: 150, budgetINR: 30000, usageINR: 28000, completion: 100 },
    { stage: 'S3 - Concept Engineering', module: 'Line Layout Alternatives', task: 'Plant Flow & Automation Architecture', allocation: 'PR', standardHours: 350, actualHours: 320, budgetINR: 55000, usageINR: 50000, completion: 95 },
    { stage: 'S3 - Concept Engineering', module: 'Utility & OEE Modeling', task: 'Power, Air, Cooling & Cycle Modeling', allocation: 'SN', standardHours: 350, actualHours: 290, budgetINR: 40000, usageINR: 36000, completion: 85 },
    { stage: 'S4 - Detailed Engineering', module: 'Mechanical & CAD Package', task: '3D CAD Assembly & Structural FEA', allocation: 'AD', standardHours: 650, actualHours: 480, budgetINR: 75000, usageINR: 58000, completion: 72 },
    { stage: 'S4 - Detailed Engineering', module: 'PLC & Control Schematics', task: 'Electrical Panel Wiring & SCADA Spec', allocation: 'PR', standardHours: 650, actualHours: 410, budgetINR: 65000, usageINR: 42000, completion: 65 },
    { stage: 'S5 - Design Freeze', module: 'Design Risk & HAZOP', task: 'Design FMEA & Safety Interlock Review', allocation: 'RK', standardHours: 300, actualHours: 180, budgetINR: 45000, usageINR: 29000, completion: 50 },
    { stage: 'S6 - Process & Equipment', module: 'Long-Lead Equipment PO', task: 'CNC & Robotic Cell Procurement', allocation: 'SN', standardHours: 450, actualHours: 190, budgetINR: 180000, usageINR: 95000, completion: 35 },
    { stage: 'S7 - Prototype Validation', module: 'FAT & Endurance Trials', task: 'Prototype Tooling & FAT Execution', allocation: 'AR', standardHours: 600, actualHours: 120, budgetINR: 120000, usageINR: 45000, completion: 20 },
    { stage: 'S10 - Commissioning & SAT', module: 'Site Acceptance Testing', task: 'IQ, Interlocks & Full-Load SAT Run', allocation: 'AP', standardHours: 800, actualHours: 80, budgetINR: 140000, usageINR: 25000, completion: 10 }
  ];

  displayedRows: BudgetItem[] = [];
  stages: string[] = [];
  modules: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
    });
    this.stages = [...new Set(this.allRows.map(r => r.stage))];
    this.modules = [...new Set(this.allRows.map(r => r.module))];
    this.displayedRows = [...this.allRows];
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
    this.displayedRows = this.allRows.filter(r =>
      (!stage || stage === 'Any' || r.stage === stage) &&
      (!module || module === 'Any' || r.module === module)
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
    this.router.navigate(['/projects/dashboard/analytics']);
  }
}
