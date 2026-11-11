import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

import { MatIconModule } from '@angular/material/icon';

// Bulletproof Angular 17+ / TypeScript Strict Mode Wrapper
const ExportingModule: any = HC_exporting;
const ExportDataModule: any = HC_exportData;

if (typeof ExportingModule === 'function') {
  ExportingModule(Highcharts);
} else if (ExportingModule && typeof ExportingModule.default === 'function') {
  ExportingModule.default(Highcharts);
}

if (typeof ExportDataModule === 'function') {
  ExportDataModule(Highcharts);
} else if (ExportDataModule && typeof ExportDataModule.default === 'function') {
  ExportDataModule.default(Highcharts);
}

@Component({
  selector: 'app-dashboard-variance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-variance.component.html',
  styleUrls: ['./dashboard-variance.component.scss']
})
export class DashboardVarianceComponent implements OnInit, AfterViewInit {
  projects = [
    'Generic Tablet Development',
    'Generic API Process Development',
    'Complex Injectable Development',
    'Generic API Development',
    'Generic Injectable Formulation'
  ];
  varianceStages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];

  selectedBudgetProject = 'All Projects';
  selectedVarianceStage = 'S1';

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

  onApplyFilters(): void {
    this.onBudgetProjectChange();
  }

  budgetGanttData: any[] = [
    // S1 - Business Case
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'API & Raw Material Assessment', allocated: 45000, spent: 42000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'Preformulation & Compatibility', allocated: 55000, spent: 51000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'Feasibility & Business Case', allocated: 40000, spent: 38000, completion: 95, project: 'Generic Tablet Development' },

    // S2 - Product Initiation
    { stage: 'S2 - Product Initiation', stageCode: 'S2', module: 'Project Kick-off & Charter', allocated: 35000, spent: 32000, completion: 91, project: 'Generic Tablet Development' },
    { stage: 'S2 - Product Initiation', stageCode: 'S2', module: 'Stakeholder Alignment', allocated: 25000, spent: 23000, completion: 92, project: 'Generic Tablet Development' },
    { stage: 'S2 - Product Initiation', stageCode: 'S2', module: 'Resource Allocation & Budgeting', allocated: 30000, spent: 28000, completion: 93, project: 'Generic Tablet Development' },

    // S3 - Development Procurement
    { stage: 'S3 - Development Procurement', stageCode: 'S3', module: 'API Sourcing & Vendor Audit', allocated: 65000, spent: 61000, completion: 94, project: 'Generic Tablet Development' },
    { stage: 'S3 - Development Procurement', stageCode: 'S3', module: 'Excipient & Packaging PO', allocated: 45000, spent: 41000, completion: 91, project: 'Generic Tablet Development' },
    { stage: 'S3 - Development Procurement', stageCode: 'S3', module: 'Reference Standard Receipt', allocated: 20000, spent: 18500, completion: 93, project: 'Generic Tablet Development' },

    // S4 - POC Formulation
    { stage: 'S4 - POC Formulation', stageCode: 'S4', module: 'Formula Design & Excipient Selection', allocated: 75000, spent: 71000, completion: 95, project: 'Generic Tablet Development' },
    { stage: 'S4 - POC Formulation', stageCode: 'S4', module: 'Prototype Trial Batches', allocated: 60000, spent: 58000, completion: 97, project: 'Generic Tablet Development' },
    { stage: 'S4 - POC Formulation', stageCode: 'S4', module: 'Formula Lock & Dissolution Studies', allocated: 65000, spent: 62000, completion: 95, project: 'Generic Tablet Development' },

    // S5 - EB Procurement
    { stage: 'S5 - EB Procurement', stageCode: 'S5', module: 'Exhibit Batch API Procurement', allocated: 85000, spent: 79000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S5 - EB Procurement', stageCode: 'S5', module: 'Commercial Packaging Components', allocated: 40000, spent: 36000, completion: 90, project: 'Generic Tablet Development' },

    // S6 - Pilot Bio Formulation
    { stage: 'S6 - Pilot Bio Formulation', stageCode: 'S6', module: 'Pilot Bio Batch Execution', allocated: 95000, spent: 88000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S6 - Pilot Bio Formulation', stageCode: 'S6', module: 'In-vitro Permeability Study', allocated: 50000, spent: 46000, completion: 92, project: 'Generic Tablet Development' },

    // S7 - API Validation
    { stage: 'S7 - API Validation', stageCode: 'S7', module: 'API Analytical Method Validation', allocated: 70000, spent: 65000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S7 - API Validation', stageCode: 'S7', module: 'Forced Degradation Studies', allocated: 45000, spent: 41000, completion: 91, project: 'Generic Tablet Development' },

    // S8 - FP Validation
    { stage: 'S8 - FP Validation', stageCode: 'S8', module: 'FP Method Validation & STP', allocated: 80000, spent: 74000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S8 - FP Validation', stageCode: 'S8', module: 'Dissolution Discriminatory Method', allocated: 55000, spent: 50000, completion: 91, project: 'Generic Tablet Development' },

    // S9 - TTD Submission
    { stage: 'S9 - TTD Submission', stageCode: 'S9', module: 'Technical Transfer Dossier', allocated: 60000, spent: 55000, completion: 92, project: 'Generic Tablet Development' },
    { stage: 'S9 - TTD Submission', stageCode: 'S9', module: 'Manufacturing Plant Review', allocated: 35000, spent: 32000, completion: 91, project: 'Generic Tablet Development' },

    // S10 - Exhibit Batches
    { stage: 'S10 - Exhibit Batches', stageCode: 'S10', module: 'Exhibit Batch 1 Execution', allocated: 110000, spent: 102000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S10 - Exhibit Batches', stageCode: 'S10', module: 'Exhibit Batch 2 Execution', allocated: 105000, spent: 98000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S10 - Exhibit Batches', stageCode: 'S10', module: '3-Month Accelerated Stability', allocated: 75000, spent: 69000, completion: 92, project: 'Generic Tablet Development' },

    // S11 - Pivotal BE
    { stage: 'S11 - Pivotal BE', stageCode: 'S11', module: 'Clinical Protocol & Bioanalytical Run', allocated: 150000, spent: 142000, completion: 95, project: 'Generic Tablet Development' },
    { stage: 'S11 - Pivotal BE', stageCode: 'S11', module: 'Pharmacokinetic Data Analysis', allocated: 65000, spent: 60000, completion: 92, project: 'Generic Tablet Development' },

    // S12 - Dossier Filing
    { stage: 'S12 - Dossier Filing', stageCode: 'S12', module: 'Module 3 Quality Dossier', allocated: 90000, spent: 84000, completion: 93, project: 'Generic Tablet Development' },
    { stage: 'S12 - Dossier Filing', stageCode: 'S12', module: 'Regulatory Authority Submission', allocated: 55000, spent: 50000, completion: 91, project: 'Generic Tablet Development' },

    // Generic API Process Development data
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'API & Raw Material Assessment', allocated: 42000, spent: 39000, completion: 93, project: 'Generic API Process Development' },
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'Preformulation & Compatibility', allocated: 50000, spent: 46000, completion: 92, project: 'Generic API Process Development' },
    { stage: 'S1 - Business Case', stageCode: 'S1', module: 'Feasibility & Business Case', allocated: 38000, spent: 34000, completion: 89, project: 'Generic API Process Development' },
    { stage: 'S2 - Product Initiation', stageCode: 'S2', module: 'Project Kick-off & Charter', allocated: 32000, spent: 29000, completion: 91, project: 'Generic API Process Development' },
    { stage: 'S2 - Product Initiation', stageCode: 'S2', module: 'Resource Allocation & Budgeting', allocated: 28000, spent: 26000, completion: 93, project: 'Generic API Process Development' },
    { stage: 'S3 - Development Procurement', stageCode: 'S3', module: 'API Sourcing & Vendor Audit', allocated: 58000, spent: 53000, completion: 91, project: 'Generic API Process Development' },
    { stage: 'S4 - POC Formulation', stageCode: 'S4', module: 'Formula Design & Excipient Selection', allocated: 68000, spent: 63000, completion: 93, project: 'Generic API Process Development' },
    { stage: 'S4 - POC Formulation', stageCode: 'S4', module: 'Prototype Trial Batches', allocated: 55000, spent: 50000, completion: 91, project: 'Generic API Process Development' },
    { stage: 'S5 - EB Procurement', stageCode: 'S5', module: 'Exhibit Batch API Procurement', allocated: 75000, spent: 70000, completion: 93, project: 'Generic API Process Development' },
    { stage: 'S6 - Pilot Bio Formulation', stageCode: 'S6', module: 'Pilot Bio Batch Execution', allocated: 88000, spent: 81000, completion: 92, project: 'Generic API Process Development' },
    { stage: 'S7 - API Validation', stageCode: 'S7', module: 'API Analytical Method Validation', allocated: 65000, spent: 60000, completion: 92, project: 'Generic API Process Development' },
    { stage: 'S8 - FP Validation', stageCode: 'S8', module: 'FP Method Validation & STP', allocated: 72000, spent: 66000, completion: 92, project: 'Generic API Process Development' },
    { stage: 'S9 - TTD Submission', stageCode: 'S9', module: 'Technical Transfer Dossier', allocated: 55000, spent: 50000, completion: 91, project: 'Generic API Process Development' },
    { stage: 'S10 - Exhibit Batches', stageCode: 'S10', module: 'Exhibit Batch 1 Execution', allocated: 98000, spent: 89000, completion: 91, project: 'Generic API Process Development' },
    { stage: 'S11 - Pivotal BE', stageCode: 'S11', module: 'Clinical Protocol & Bioanalytical Run', allocated: 135000, spent: 125000, completion: 93, project: 'Generic API Process Development' },
    { stage: 'S12 - Dossier Filing', stageCode: 'S12', module: 'Module 3 Quality Dossier', allocated: 82000, spent: 75000, completion: 91, project: 'Generic API Process Development' }
  ];

  filteredBudgetGanttData: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.applyBudgetFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderVariancePieChart(), 0);
  }

  applyBudgetFilter() {
    if (this.selectedBudgetProject === 'All Projects') {
      const map = new Map<string, any>();
      this.budgetGanttData.forEach(d => {
        const key = `${d.stageCode}|${d.module}`;
        if (!map.has(key)) {
          map.set(key, {
            stage: d.stage,
            stageCode: d.stageCode,
            module: d.module,
            allocated: 0,
            spent: 0
          });
        }
        const item = map.get(key);
        item.allocated += d.allocated;
        item.spent += d.spent;
      });

      this.filteredBudgetGanttData = Array.from(map.values()).map(item => ({
        ...item,
        completion: Math.round((item.spent / (item.allocated || 1)) * 100)
      }));
    } else {
      this.filteredBudgetGanttData = this.budgetGanttData
        .filter(d => d.project === this.selectedBudgetProject)
        .map(d => ({
          ...d,
          completion: Math.round((d.spent / (d.allocated || 1)) * 100)
        }));
    }
  }

  onBudgetProjectChange() {
    this.applyBudgetFilter();
    this.renderVariancePieChart();
  }

  setVarianceStage(stage: string) {
    this.selectedVarianceStage = stage;
    this.renderVariancePieChart();
    this.scrollToStage(stage);
  }

  scrollToStage(stage: string): void {
    setTimeout(() => {
      const el = document.getElementById(`stage-row-${stage}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }

  get groupedBudgetTableData(): Array<{ stage: string; stageCode: string; modules: any[] }> {
    const groups: Array<{ stage: string; stageCode: string; modules: any[] }> = [];
    const map = new Map<string, { stage: string; stageCode: string; modules: any[] }>();

    this.filteredBudgetGanttData.forEach(item => {
      const key = item.stage;
      if (!map.has(key)) {
        const group = { stage: item.stage, stageCode: item.stageCode, modules: [] };
        map.set(key, group);
        groups.push(group);
      }
      map.get(key)!.modules.push(item);
    });

    return groups;
  }

  renderVariancePieChart() {
    const containerId = 'variancePieChartContainer';
    if (!document.getElementById(containerId)) return;

    const stageItems = this.filteredBudgetGanttData.filter(d =>
      d.stageCode?.toUpperCase() === this.selectedVarianceStage?.toUpperCase()
    );
    const colors = ['#2b6cb0', '#2ecc71', '#f39c12', '#9b59b6', '#e74c3c'];

    const pieData = stageItems.map((item, idx) => ({
      name: item.module,
      y: item.allocated,
      spent: item.spent,
      variance: item.allocated - item.spent,
      completion: item.completion,
      color: colors[idx % colors.length]
    }));

    Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        height: 460,
        backgroundColor: '#ffffff'
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
              'separator',
              'downloadCSV',
              'downloadXLS',
              'viewData'
            ]
          }
        }
      },
      title: {
        text: `${this.selectedVarianceStage} - Budget Summary`,
        align: 'left',
        style: { fontSize: '16px', fontWeight: 'bold', color: '#333333' }
      },
      subtitle: {
        text: `Budget distribution across deliverables (${this.selectedBudgetProject})`,
        align: 'left',
        style: { color: '#666666' }
      },
      credits: { enabled: false },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          const p = this.point as any;
          return `<b>${this.key}</b><br/>
                  Allocated: <b>$${Highcharts.numberFormat(this.y, 0)}</b> (${this.percentage.toFixed(1)}%)<br/>
                  Actual Spent: <b>$${Highcharts.numberFormat(p.spent, 0)}</b> (${p.completion}% used)<br/>
                  Variance: <b>$${Highcharts.numberFormat(p.variance, 0)}</b>`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            distance: -35,
            useHTML: true,
            formatter: function (this: any) {
              return `<div style="text-align:center;color:white;font-weight:bold;font-size:12px;">${this.percentage.toFixed(0)}%</div>`;
            }
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 6,
        itemMarginBottom: 6,
        useHTML: true,
        itemStyle: { color: '#333333' },
        labelFormatter: function (this: any) {
          const name = this.name.length > 20 ? this.name.substring(0, 18) + '...' : this.name;
          return `<span style="width:160px;display:inline-block;" title="${this.name}">${name}</span>
                  <span style="font-weight:bold">$${Highcharts.numberFormat(this.y, 0)}</span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Allocated Budget',
        innerSize: '0%',
        data: pieData
      }]
    } as any);
  }
}
