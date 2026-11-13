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
import {
  INDUSTRIAL_DIVISIONS,
  INDUSTRIAL_LOCATIONS,
  INDUSTRIAL_PROJECT_NAMES,
} from '../industrial-dashboard.data';

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
  projects = INDUSTRIAL_PROJECT_NAMES.slice(0, 6);
  varianceStages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];

  selectedBudgetProject = 'All Programs';
  selectedVarianceStage = 'S1';

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = INDUSTRIAL_DIVISIONS;

  readonly locationsList: string[] = INDUSTRIAL_LOCATIONS;

  onApplyFilters(): void {
    this.onBudgetProjectChange();
  }

  private readonly budgetStageTemplates = [
    // S1 - Business Need & Opportunity Assessment
    { stage: 'S1 - Business Need & Opportunity Assessment', stageCode: 'S1', module: 'Business Need & Operational Requirements Assessment', allocated: 45000, spent: 42000 },
    { stage: 'S1 - Business Need & Opportunity Assessment', stageCode: 'S1', module: 'Engineering Concept & Technical Feasibility', allocated: 55000, spent: 51000 },
    { stage: 'S1 - Business Need & Opportunity Assessment', stageCode: 'S1', module: 'Project Feasibility & Business Case', allocated: 40000, spent: 38000 },

    // S2 - Project Scope & Feasibility Validation
    { stage: 'S2 - Project Scope & Feasibility Validation', stageCode: 'S2', module: 'Program Kick-off & Charter Finalization', allocated: 35000, spent: 32000 },
    { stage: 'S2 - Project Scope & Feasibility Validation', stageCode: 'S2', module: 'Plant Stakeholder & Cross-Functional Alignment', allocated: 25000, spent: 23000 },
    { stage: 'S2 - Project Scope & Feasibility Validation', stageCode: 'S2', module: 'Resource Allocation & CapEx Budgeting', allocated: 30000, spent: 28000 },

    // S3 - Concept Engineering & Solution Development
    { stage: 'S3 - Concept Engineering & Solution Development', stageCode: 'S3', module: 'Equipment Sourcing & OEM Vendor Audit', allocated: 65000, spent: 61000 },
    { stage: 'S3 - Concept Engineering & Solution Development', stageCode: 'S3', module: 'Concept Engineering & Solution Architecture', allocated: 45000, spent: 41000 },
    { stage: 'S3 - Concept Engineering & Solution Development', stageCode: 'S3', module: 'Technical Specification Pack Release', allocated: 20000, spent: 18500 },

    // S4 - Detailed Engineering & Design Optimization
    { stage: 'S4 - Detailed Engineering & Design Optimization', stageCode: 'S4', module: 'Mechanical & Structural CAD Modeling', allocated: 75000, spent: 71000 },
    { stage: 'S4 - Detailed Engineering & Design Optimization', stageCode: 'S4', module: 'Electrical, PLC & Controls Schematic Design', allocated: 60000, spent: 58000 },
    { stage: 'S4 - Detailed Engineering & Design Optimization', stageCode: 'S4', module: 'Design Optimization & DFMEA Sign-off', allocated: 65000, spent: 62000 },

    // S5 - Concept Selection & Design Freeze
    { stage: 'S5 - Concept Selection & Design Freeze', stageCode: 'S5', module: 'Design Freeze & Configuration Selection Review', allocated: 85000, spent: 79000 },
    { stage: 'S5 - Concept Selection & Design Freeze', stageCode: 'S5', module: 'Long-Lead Component & Enclosure POs', allocated: 40000, spent: 36000 },

    // S6 - Process Engineering & Equipment Design
    { stage: 'S6 - Process Engineering & Equipment Design', stageCode: 'S6', module: 'Manufacturing & Process Equipment Engineering', allocated: 95000, spent: 88000 },
    { stage: 'S6 - Process Engineering & Equipment Design', stageCode: 'S6', module: 'Tooling, Fixtures & Material Flow Design', allocated: 50000, spent: 46000 },

    // S7 - Prototype Fabrication & Engineering Validation
    { stage: 'S7 - Prototype Fabrication & Engineering Validation', stageCode: 'S7', module: 'Prototype Fabrication & Subassembly Build', allocated: 70000, spent: 65000 },
    { stage: 'S7 - Prototype Fabrication & Engineering Validation', stageCode: 'S7', module: 'Instrumentation & Calibration Validation', allocated: 45000, spent: 41000 },

    // S8 - Installation Planning & Site Installation Readiness
    { stage: 'S8 - Installation Planning & Site Installation Readiness', stageCode: 'S8', module: 'Foundation, Utilities & Site Readiness Prep', allocated: 80000, spent: 74000 },
    { stage: 'S8 - Installation Planning & Site Installation Readiness', stageCode: 'S8', module: 'Safety Guarding & Factory Acceptance Test (FAT)', allocated: 55000, spent: 50000 },

    // S9 - Equipment Installation & Integration
    { stage: 'S9 - Equipment Installation & Integration', stageCode: 'S9', module: 'Shop-Floor Rigging, Installation & Alignment', allocated: 60000, spent: 55000 },
    { stage: 'S9 - Equipment Installation & Integration', stageCode: 'S9', module: 'SCADA / MES Line Integration & Hook-up', allocated: 35000, spent: 32000 },

    // S10 - Commissioning & Performance Testing
    { stage: 'S10 - Commissioning & Performance Testing', stageCode: 'S10', module: 'Site Acceptance Testing (SAT) Execution', allocated: 110000, spent: 102000 },
    { stage: 'S10 - Commissioning & Performance Testing', stageCode: 'S10', module: 'Cycle-Time, OEE & Load Endurance Trials', allocated: 105000, spent: 98000 },
    { stage: 'S10 - Commissioning & Performance Testing', stageCode: 'S10', module: 'Thermal, Vibration & Noise Compliance Test', allocated: 75000, spent: 69000 },

    // S11 - Operational Qualification & Production Ramp-Up
    { stage: 'S11 - Operational Qualification & Production Ramp-Up', stageCode: 'S11', module: 'Operational Qualification (OQ) & Pilot Run', allocated: 150000, spent: 142000 },
    { stage: 'S11 - Operational Qualification & Production Ramp-Up', stageCode: 'S11', module: 'Operator Training & Production Ramp-Up', allocated: 65000, spent: 60000 },

    // S12 - Operational Handover & Project Closeout
    { stage: 'S12 - Operational Handover & Project Closeout', stageCode: 'S12', module: 'As-Built Documentation & Maintenance Handover', allocated: 90000, spent: 84000 },
    { stage: 'S12 - Operational Handover & Project Closeout', stageCode: 'S12', module: 'Statutory Safety Clearance & Project Closeout', allocated: 55000, spent: 50000 }
  ];

  budgetGanttData: any[] = this.projects.flatMap((project, idx) =>
    this.budgetStageTemplates.map(item => {
      const factor = 1 - idx * 0.06;
      const allocated = Math.round((item.allocated * factor) / 500) * 500;
      const spent = Math.round((item.spent * factor) / 500) * 500;
      return {
        stage: item.stage,
        stageCode: item.stageCode,
        module: item.module,
        allocated,
        spent,
        completion: Math.round((spent / (allocated || 1)) * 100),
        project
      };
    })
  );

  filteredBudgetGanttData: any[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.applyBudgetFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderVariancePieChart(), 0);
  }

  applyBudgetFilter() {
    if (this.selectedBudgetProject === 'All Programs') {
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
