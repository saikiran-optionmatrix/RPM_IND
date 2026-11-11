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
    'Oral Solid Dosage (OSD) Formulation & Commercialization';
  projectCode: string = this.route.snapshot.queryParamMap.get('code') || '2026/GEN/001';

  allRows: BudgetItem[] = [
    { stage: 'Product Selection', module: 'Feasibility', task: 'Reference Product Assessment', allocation: 'PR', standardHours: 25, actualHours: 18, budgetINR: 20000, usageINR: 18000, completion: 70 },
    { stage: 'Pre-Formulation', module: 'API Characterization', task: 'API Characterization', allocation: 'AR', standardHours: 40, actualHours: 28, budgetINR: 35000, usageINR: 32500, completion: 65 },
    { stage: 'Pre-Formulation', module: 'Compatibility', task: 'API–Excipient Compatibility', allocation: 'SK', standardHours: 35, actualHours: 22, budgetINR: 30000, usageINR: 28000, completion: 60 },
    { stage: 'Formulation Development', module: 'Formulation Design', task: 'Prototype Formulation', allocation: 'MK', standardHours: 60, actualHours: 35, budgetINR: 55000, usageINR: 50000, completion: 55 },
    { stage: 'Formulation Development', module: 'Excipient Screening', task: 'Excipient Optimization', allocation: 'RK', standardHours: 45, actualHours: 25, budgetINR: 40000, usageINR: 36000, completion: 50 },
    { stage: 'Formulation Development', module: 'Prototype Batch', task: 'Laboratory Batch Preparation', allocation: 'PS', standardHours: 50, actualHours: 30, budgetINR: 65000, usageINR: 58000, completion: 45 },
    { stage: 'Analytical Development', module: 'Analytical Testing', task: 'Assay & Related Substances', allocation: 'VN', standardHours: 50, actualHours: 22, budgetINR: 50000, usageINR: 42000, completion: 40 },
    { stage: 'Analytical Development', module: 'Dissolution', task: 'Dissolution Method Development', allocation: 'SK', standardHours: 40, actualHours: 18, budgetINR: 45000, usageINR: 39000, completion: 35 },
    { stage: 'Optimization', module: 'Formulation Optimization', task: 'Process & Formula Optimization', allocation: 'DR', standardHours: 55, actualHours: 20, budgetINR: 60000, usageINR: 45000, completion: 30 },
    { stage: 'Stability', module: 'Stability Testing', task: 'Accelerated Stability Study', allocation: 'AP', standardHours: 70, actualHours: 15, budgetINR: 80000, usageINR: 55000, completion: 20 },
    { stage: 'Scale-Up', module: 'Pilot Batch', task: 'Pilot-Scale Manufacturing', allocation: 'RK', standardHours: 80, actualHours: 10, budgetINR: 120000, usageINR: 35000, completion: 10 },
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
    return new Intl.NumberFormat('en-IN').format(n);
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
