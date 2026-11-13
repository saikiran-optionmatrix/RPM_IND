import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule, Router } from '@angular/router';
import {
  INDUSTRIAL_DIVISIONS,
  INDUSTRIAL_LOCATIONS,
  INDUSTRIAL_PROJECT_NAMES,
  INDUSTRIAL_STAGE_HEADERS,
  INDUSTRIAL_STAGE_NAME_MAP,
  INDUSTRIAL_GATE_NAME_MAP,
} from '../industrial-dashboard.data';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_exportData from 'highcharts/modules/export-data';

// @ts-ignore
const ExportingModule: any = HC_exporting;
// @ts-ignore
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
  selector: 'app-dashboard-portfolio',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatInputModule, MatPaginatorModule, RouterModule
  ],
  templateUrl: './dashboard-portfolio.component.html',
  styleUrls: ['./dashboard-portfolio.component.scss']
})
export class DashboardPortfolioComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;
  pageIndex = 0;
  pageSize = 10;
  selectedGate = 'Gate 1';
  portfolioGates = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];
  readonly gateNameMap = INDUSTRIAL_GATE_NAME_MAP;
  readonly stageNameMap = INDUSTRIAL_STAGE_NAME_MAP;
  readonly stageHeaders = INDUSTRIAL_STAGE_HEADERS;

  selectedDivision: string = 'All';
  selectedLocation: string = 'All';

  readonly divisionsList: string[] = INDUSTRIAL_DIVISIONS;

  readonly locationsList: string[] = INDUSTRIAL_LOCATIONS;

  onApplyFilters(): void {
    // UI filter apply trigger
  }

  portfolioActiveFilter: { type: 'bar'; stage: string; status: 'on-schedule' | 'due'; label: string } | null = null;

  allPortfolioProjects: any[] = [];
  filteredPortfolioProjects: any[] = [];
  paginatedProjects: any[] = [];

  chartCategories: string[] = [];
  chartOnTrackData: number[] = [];
  chartDueData: number[] = [];

  gatePieDataMap: any = {
    'Gate 1': [
      { name: 'Go', y: 11, color: '#2ecc71' },
      { name: 'Evaluation', y: 6, color: '#3366cc' },
      { name: 'Rework', y: 2, color: '#f39c12' },
      { name: 'Pending', y: 1, color: '#808b96' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 2': [
      { name: 'Go', y: 9, color: '#2ecc71' },
      { name: 'Pending', y: 5, color: '#808b96' },
      { name: 'Evaluation', y: 2, color: '#3366cc' },
      { name: 'Redirect', y: 2, color: '#9b59b6' },
      { name: 'Rework', y: 1, color: '#f39c12' }
    ],
    'Gate 3': [
      { name: 'Go', y: 8, color: '#2ecc71' },
      { name: 'Evaluation', y: 3, color: '#3366cc' },
      { name: 'Redirect', y: 3, color: '#9b59b6' },
      { name: 'Pending', y: 2, color: '#808b96' },
      { name: 'Rework', y: 2, color: '#f39c12' }
    ],
    'Gate 4': [
      { name: 'Go', y: 6, color: '#2ecc71' },
      { name: 'Evaluation', y: 4, color: '#3366cc' },
      { name: 'Rework', y: 3, color: '#f39c12' },
      { name: 'Pending', y: 3, color: '#808b96' },
      { name: 'Redirect', y: 1, color: '#9b59b6' }
    ],
    'Gate 5': [
      { name: 'Go', y: 10, color: '#2ecc71' },
      { name: 'Pending', y: 2, color: '#808b96' },
      { name: 'Redirect', y: 2, color: '#9b59b6' },
      { name: 'Evaluation', y: 1, color: '#3366cc' },
      { name: 'Rework', y: 1, color: '#f39c12' }
    ]
  };

  constructor(private cdr: ChangeDetectorRef, private router: Router) { }

  navigateToStages(): void {
    this.router.navigate(['/dashboard/portfolio/stages-data-table']);
  }

  navigateToGates(): void {
    this.router.navigate(['/dashboard/portfolio/gates-data-table']);
  }

  ngOnInit() {
    this.initializePortfolioProjects();
    this.applyPortfolioFilter();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderPortfolioStatusChart();
      this.renderPortfolioSummaryChart();
    }, 0);
  }

  initializePortfolioProjects(): void {
    const rawNames = INDUSTRIAL_PROJECT_NAMES;

    const stageSpecs = [
      { stage: 'S1', stageName: 'Business Need & Opportunity Assessment', onTrack: 17, due: 3, dates: ['15/10/2027', '20/11/2027', '30/12/2027'] },
      { stage: 'S2', stageName: 'Project Scope & Feasibility Validation', onTrack: 16, due: 3, dates: ['10/07/2027', '25/08/2027', '18/09/2027'] },
      { stage: 'S3', stageName: 'Concept Engineering & Solution Development', onTrack: 14, due: 4, dates: ['15/04/2027', '22/05/2027', '30/06/2027'] },
      { stage: 'S4', stageName: 'Detailed Engineering & Design Optimization', onTrack: 13, due: 4, dates: ['10/01/2027', '28/02/2027', '15/03/2027'] },
      { stage: 'S5', stageName: 'Concept Selection & Design Freeze', onTrack: 13, due: 3, dates: ['15/10/2026', '30/11/2026', '20/12/2026'] },
      { stage: 'S6', stageName: 'Process Engineering & Equipment Design', onTrack: 13, due: 2, dates: ['15/08/2026', '30/09/2026', '10/10/2026'] },
      { stage: 'S7', stageName: 'Prototype Fabrication & Engineering Validation', onTrack: 11, due: 3, dates: ['20/06/2026', '15/07/2026', '31/08/2026'] },
      { stage: 'S8', stageName: 'Installation Planning & Site Installation Readiness', onTrack: 12, due: 1, dates: ['10/04/2026', '15/05/2026', '25/06/2026'] },
      { stage: 'S9', stageName: 'Equipment Installation & Integration', onTrack: 10, due: 2, dates: ['18/02/2026', '28/03/2026', '15/04/2026'] },
      { stage: 'S10', stageName: 'Commissioning & Performance Testing', onTrack: 9, due: 2, dates: ['05/01/2026', '20/02/2026', '12/03/2026'] },
      { stage: 'S11', stageName: 'Operational Qualification & Production Ramp-Up', onTrack: 8, due: 2, dates: ['10/11/2025', '15/12/2025', '20/01/2026'] },
      { stage: 'S12', stageName: 'Operational Handover & Project Closeout', onTrack: 8, due: 1, dates: ['15/09/2025', '30/10/2025', '25/11/2025'] },
    ];

    this.allPortfolioProjects = [];
    this.chartCategories = [];
    this.chartOnTrackData = [];
    this.chartDueData = [];

    let nameIndex = 0;
    let codeCounter = 1;

    stageSpecs.forEach(spec => {
      this.chartCategories.push(spec.stage);
      this.chartOnTrackData.push(spec.onTrack);
      this.chartDueData.push(spec.due);

      for (let i = 0; i < spec.onTrack; i++) {
        this.allPortfolioProjects.push(this.createProject(rawNames[nameIndex % rawNames.length], codeCounter++, spec.stage, 'on-schedule', spec.dates[i % spec.dates.length]));
        nameIndex++;
      }
      for (let i = 0; i < spec.due; i++) {
        this.allPortfolioProjects.push(this.createProject(rawNames[nameIndex % rawNames.length], codeCounter++, spec.stage, 'due', spec.dates[i % spec.dates.length]));
        nameIndex++;
      }
    });
  }

  createProject(name: string, codeNum: number, stage: string, status: 'on-schedule' | 'due', completion: string) {
    return {
      projectName: name,
      projectCode: `2026/IND/${codeNum.toString().padStart(3, '0')}`,
      currentStage: stage,
      scheduleStatus: status,
      s1: '10/01/26', s2: '15/06/26', s3: '20/01/27', s4: '25/08/27',
      s5: '10/03/28', s6: '15/10/28', s7: '20/05/29', s8: '25/12/29',
      s9: '10/07/30', s10: '15/02/31', s11: '20/09/31', s12: '25/04/32',
      completionDate: completion
    };
  }

  applyPortfolioFilter() {
    let list = [...this.allPortfolioProjects];
    if (this.portfolioActiveFilter) {
      list = list.filter(p => p.currentStage === this.portfolioActiveFilter!.stage && p.scheduleStatus === this.portfolioActiveFilter!.status);
    }
    this.filteredPortfolioProjects = list;
    this.pageIndex = 0;
    this.updatePagination();
  }

  resetPortfolioFilter() {
    this.portfolioActiveFilter = null;
    this.applyPortfolioFilter();
    this.cdr.detectChanges();
  }

  onPortfolioChartBarClick(stage: string, status: 'on-schedule' | 'due') {
    const statusLabel = status === 'on-schedule' ? 'On Track' : 'Delayed';
    this.portfolioActiveFilter = {
      type: 'bar',
      stage,
      status,
      label: `${stage} • ${statusLabel}`
    };
    this.applyPortfolioFilter();
    this.cdr.detectChanges();
  }

  handlePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  updatePagination() {
    const start = this.pageIndex * this.pageSize;
    this.paginatedProjects = this.filteredPortfolioProjects.slice(start, start + this.pageSize);
  }

  setGateCategory(gate: string) {
    this.selectedGate = gate;
    this.renderPortfolioSummaryChart();
    this.cdr.detectChanges();
  }

  renderPortfolioStatusChart() {
    const containerId = 'portfolioStatusChartContainer';
    if (!document.getElementById(containerId)) return;

    const self = this;

    Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
      title: { text: null }, // Title moved to HTML
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: this.chartCategories,
        labels: { style: { fontWeight: 'bold' } }
      },
      yAxis: {
        min: 0,
        title: { text: 'No. of programs' }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          const stageCode = this.x as string;
          const stageLabel = self.stageNameMap[stageCode] ? `${stageCode} - ${self.stageNameMap[stageCode]}` : stageCode;
          let html = `<b>${stageLabel}</b><br/>`;
          (this.points || []).forEach((pt: any) => {
            html += `<span style="color:${pt.color}">\u25CF</span> ${pt.series.name}: <b>${pt.y}</b><br/>`;
          });
          return html;
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          cursor: 'pointer',
          dataLabels: { enabled: true },
          point: {
            events: {
              click: function (this: any) {
                const stage = this.category as string;
                const seriesName = this.series.name;
                const status = seriesName === 'Programs on track' ? 'on-schedule' : 'due';
                self.onPortfolioChartBarClick(stage, status);
              }
            }
          }
        }
      },
      series: [
        { name: 'Programs on track', color: '#00a859', type: 'column', data: this.chartOnTrackData },
        { name: 'Programs delayed', color: '#ed1c24', type: 'column', data: this.chartDueData }
      ]
    } as any);
  }

  renderPortfolioSummaryChart() {
    const containerId = 'portfolioSummaryPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const pieData = this.gatePieDataMap[this.selectedGate] || [];

    Highcharts.chart(containerId, {
      chart: { type: 'pie', backgroundColor: '#ffffff' },
      title: { text: null }, // Title moved to HTML
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.key}</b>: ${this.y} Programs (${this.percentage.toFixed(1)}%)`;
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          innerSize: '0%',
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
        align: 'center', // Changed to bottom layout
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemMarginTop: 10,
        itemMarginBottom: 10,
        useHTML: true,
        itemStyle: { color: '#333333' },
        labelFormatter: function (this: any) {
          return `<span style="font-weight:normal; margin-right: 5px;">${this.name}</span> <span style="font-weight:bold">${this.y}</span>`;
        }
      },
      series: [{
        type: 'pie',
        name: 'Programs',
        data: pieData
      }]
    } as any);
  }



  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }
  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
