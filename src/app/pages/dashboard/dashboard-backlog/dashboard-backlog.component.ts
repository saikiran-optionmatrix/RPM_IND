import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

export interface ActivityBacklog {
  activityName: string;
  backlogCount: number;
}

export interface StageBacklogSummary {
  stage: string;
  stageCode?: string;
  stageName?: string;
  act: number;
  task: number;
  iss: number;
  todo: number;
  req: number;
}

@Component({
  selector: 'app-dashboard-backlog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-backlog.component.html',
  styleUrl: './dashboard-backlog.component.scss',
})
export class DashboardBacklogComponent implements OnInit, AfterViewInit, OnDestroy {
  public selectedActivity: string = 'All';
  public selectedYear: number | string = 'All';
  public selectedMonth: number = new Date().getMonth() + 1; // Current month (1-12)
  public selectedDivision: string = 'All';
  public selectedLocation: string = 'All';

  public readonly divisionsList: string[] = [
    'All',
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
  ];

  public readonly locationsList: string[] = [
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

  public readonly activitiesFilterList = [
    'All',
    'Activities',
    'Tasks',
    'Issues',
    'Todo',
    'Requirements',
  ];

  public readonly availableYears: (number | string)[] = ['All', 2026, 2025, 2024];

  public readonly monthsList = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  // 12 Months Labels
  public readonly monthsShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // 1 to 31 Days Labels
  public readonly daysList = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

  // Yearly data (12 months)
  private readonly yearlyBacklogData: Record<number, number[]> = {
    2026: [12, 15, 18, 22, 20, 25, 23, 28, 19, 24, 16, 14],
    2025: [14, 16, 19, 21, 24, 26, 25, 22, 20, 18, 15, 13],
    2024: [10, 12, 14, 18, 20, 22, 21, 19, 17, 16, 14, 11],
  };

  // Month-wise data (1 to 31 days)
  private readonly monthlyDayBacklogs: Record<number, number[]> = {
    1: [10, 11, 12, 14, 13, 12, 11, 12, 13, 15, 14, 12, 11, 13, 14, 13, 12, 11, 12, 13, 14, 13, 12, 11, 10, 11, 12, 13, 14, 13, 12],
    2: [11, 12, 13, 15, 16, 14, 13, 14, 15, 16, 15, 14, 13, 14, 16, 15, 14, 13, 14, 15, 16, 15, 14, 13, 12, 13, 14, 15, 13, 12, 11],
    3: [12, 14, 15, 17, 16, 18, 19, 17, 18, 19, 20, 18, 17, 19, 20, 18, 17, 16, 18, 19, 18, 17, 16, 17, 18, 19, 18, 17, 16, 17, 18],
    4: [15, 16, 18, 20, 22, 21, 20, 21, 23, 24, 22, 21, 20, 22, 23, 21, 20, 19, 21, 22, 21, 20, 19, 20, 21, 22, 21, 20, 19, 20, 18],
    5: [16, 17, 18, 19, 21, 20, 19, 20, 21, 22, 20, 19, 18, 20, 21, 20, 19, 18, 19, 20, 21, 20, 19, 18, 17, 18, 19, 20, 19, 18, 17],
    6: [18, 20, 22, 24, 25, 26, 24, 25, 27, 28, 26, 25, 24, 26, 27, 25, 24, 23, 25, 26, 25, 24, 23, 24, 25, 26, 25, 24, 23, 24, 22],
    7: [19, 20, 21, 23, 24, 23, 22, 23, 25, 26, 24, 23, 22, 24, 25, 23, 22, 21, 23, 24, 23, 22, 21, 22, 23, 24, 23, 22, 21, 22, 23],
    8: [20, 22, 24, 26, 27, 28, 29, 27, 28, 30, 28, 27, 26, 28, 29, 27, 26, 25, 27, 28, 27, 26, 25, 26, 27, 28, 27, 26, 25, 26, 28],
    9: [14, 15, 13, 16, 18, 17, 19, 21, 20, 22, 19, 18, 20, 23, 22, 21, 24, 22, 20, 19, 18, 17, 19, 21, 20, 18, 19, 19, 17, 16, 15],
    10: [17, 19, 20, 22, 23, 24, 25, 23, 24, 26, 25, 24, 23, 25, 26, 24, 23, 22, 24, 25, 24, 23, 22, 23, 24, 25, 24, 23, 22, 23, 24],
    11: [13, 14, 15, 16, 17, 18, 17, 16, 17, 18, 17, 16, 15, 17, 18, 16, 15, 14, 16, 17, 16, 15, 14, 15, 16, 17, 16, 15, 14, 15, 14],
    12: [11, 12, 13, 14, 15, 14, 13, 14, 15, 16, 15, 14, 13, 15, 16, 14, 13, 12, 14, 15, 14, 13, 12, 13, 14, 15, 14, 13, 12, 13, 14],
  };

  // Pie 1: Backlog Distribution by Activities (5 Stages + Others)
  readonly activitiesBacklogData = [
    { name: 'S1: Business Case', y: 21, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 17, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 30, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 24, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 20, color: '#f59e0b' },
    { name: 'Others', y: 55, color: '#94a3b8' },
  ];

  // Pie 2: Backlog Distribution by Tasks (5 Stages + Others)
  readonly tasksBacklogData = [
    { name: 'S1: Business Case', y: 19, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 16, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 26, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 21, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 23, color: '#f59e0b' },
    { name: 'Others', y: 52, color: '#94a3b8' },
  ];

  // Pie 3: Backlog Distribution by Issues (5 Stages + Others)
  readonly issuesBacklogData = [
    { name: 'S1: Business Case', y: 14, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 15, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 23, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 31, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 25, color: '#f59e0b' },
    { name: 'Others', y: 58, color: '#94a3b8' },
  ];

  // Pie 4: Backlog Distribution by To-Do (5 Stages + Others)
  readonly todoBacklogData = [
    { name: 'S1: Business Case', y: 23, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 27, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 21, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 17, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 25, color: '#f59e0b' },
    { name: 'Others', y: 51, color: '#94a3b8' },
  ];

  // Pie 5: Backlog Distribution by Requirements (5 Stages + Others)
  readonly requirementsBacklogData = [
    { name: 'S1: Business Case', y: 25, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 29, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 19, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 20, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 16, color: '#f59e0b' },
    { name: 'Others', y: 64, color: '#94a3b8' },
  ];

  // Table Card: Stage-wise Backlog Summary for S1 to S12
  readonly stageBacklogList: StageBacklogSummary[] = [
    { stage: 'S1 - Business Case', stageCode: 'S1', stageName: 'Business Case', act: 21, task: 19, iss: 14, todo: 23, req: 25 },
    { stage: 'S2 - Initiation', stageCode: 'S2', stageName: 'Initiation', act: 17, task: 16, iss: 15, todo: 27, req: 29 },
    { stage: 'S3 - Development Procurement', stageCode: 'S3', stageName: 'Development Procurement', act: 30, task: 26, iss: 23, todo: 21, req: 19 },
    { stage: 'S4 - POC Formulation', stageCode: 'S4', stageName: 'POC Formulation', act: 24, task: 21, iss: 31, todo: 17, req: 20 },
    { stage: 'S5 - EB Procurement', stageCode: 'S5', stageName: 'EB Procurement', act: 20, task: 23, iss: 25, todo: 25, req: 16 },
    { stage: 'S6 - Pilot Bio Formulation', stageCode: 'S6', stageName: 'Pilot Bio Formulation', act: 18, task: 22, iss: 19, todo: 20, req: 15 },
    { stage: 'S7 - API Validation', stageCode: 'S7', stageName: 'API Validation', act: 25, task: 24, iss: 28, todo: 18, req: 22 },
    { stage: 'S8 - FP Validation', stageCode: 'S8', stageName: 'FP Validation', act: 16, task: 18, iss: 20, todo: 15, req: 14 },
    { stage: 'S9 - TTD Submission', stageCode: 'S9', stageName: 'TTD Submission', act: 22, task: 20, iss: 17, todo: 19, req: 18 },
    { stage: 'S10 - Exhibit Batches', stageCode: 'S10', stageName: 'Exhibit Batches', act: 28, task: 25, iss: 22, todo: 24, req: 21 },
    { stage: 'S11 - Pivotal BE', stageCode: 'S11', stageName: 'Pivotal BE', act: 19, task: 17, iss: 18, todo: 16, req: 17 },
    { stage: 'S12 - Dossier Filing', stageCode: 'S12', stageName: 'Dossier Filing', act: 15, task: 14, iss: 12, todo: 13, req: 11 },
  ];

  public getStageTotal(item: StageBacklogSummary): number {
    return item.act + item.task + item.iss + item.todo + item.req;
  }

  public get grandTotalBacklogs(): number {
    return this.stageBacklogList.reduce((acc, curr) => acc + this.getStageTotal(curr), 0);
  }

  // Table Card 6: Activities which have maximum backlog
  readonly topActivitiesWithMaxBacklog: ActivityBacklog[] = [
    { activityName: 'Analytical Method Validation (API)', backlogCount: 48 },
    { activityName: 'Finished Product Stability Testing', backlogCount: 42 },
    { activityName: 'Exhibit Batch Manufacturing', backlogCount: 38 },
    { activityName: 'Bioequivalence Patient Recruitment', backlogCount: 35 },
    { activityName: 'Raw Material Release & Quarantine', backlogCount: 31 },
    { activityName: 'Packaging Material Integrity Test', backlogCount: 28 },
    { activityName: 'Tech Transfer Dossier Compilation', backlogCount: 25 },
    { activityName: 'Equipment Qualification & Re-validation', backlogCount: 22 },
    { activityName: 'Micro-biological Assay Clearance', backlogCount: 19 },
    // { activityName: 'Impurity Profiling & Characterization', backlogCount: 17 },
    // { activityName: 'Container Closure Integrity (CCI)', backlogCount: 15 },
    // { activityName: 'Regulatory Query Response Drafting', backlogCount: 13 },
  ];

  private charts: Highcharts.Chart[] = [];

  private resizeHandler = () => {
    this.charts.forEach((chart) => {
      if (chart) {
        chart.reflow();
      }
    });
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.destroyCharts();
  }

  public onActivityChange(activity: string): void {
    this.selectedActivity = activity;
  }

  public onApplyFilters(): void {
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  public onYearChange(year: number | string): void {
    this.selectedYear = year;
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  public onMonthChange(month: number): void {
    this.selectedMonth = month;
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  public get selectedMonthName(): string {
    const found = this.monthsList.find((m) => m.value === this.selectedMonth);
    return found ? found.name : 'Selected Month';
  }

  private initAllCharts(): void {
    this.destroyCharts();

    // 1. Two top curve graphs
    this.createYearlySplineChart('yearlyBacklogCurveContainer');
    this.createMonthlySplineChart('monthlyBacklogCurveContainer');

    // 2. Five pie charts below
    this.createPieChart('activitiesBacklogChartContainer', 'Activities', this.activitiesBacklogData);
    this.createPieChart('tasksBacklogChartContainer', 'Tasks', this.tasksBacklogData);
    this.createPieChart('issuesBacklogChartContainer', 'Issues', this.issuesBacklogData);
    this.createPieChart('todoBacklogChartContainer', 'To-Do', this.todoBacklogData);
    this.createPieChart('requirementsBacklogChartContainer', 'Requirements', this.requirementsBacklogData);

    // 3. Stacked Bar Chart below all (12 Stages x 5 Backlog Categories)
    this.createStageStackedBarChart('stageBacklogStackedBarContainer');
  }

  private destroyCharts(): void {
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = [];
  }

  /**
   * Top Curve Graph 1: Year-wise (12 Months)
   */
  private createYearlySplineChart(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const isAll = this.selectedYear === 'All';
    const displayYear = isAll ? 'All Years' : `${this.selectedYear}`;
    const backlogValues =
      (!isAll && typeof this.selectedYear === 'number'
        ? this.yearlyBacklogData[this.selectedYear]
        : null) || this.yearlyBacklogData[2026];

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'spline',
        backgroundColor: '#ffffff',
        spacingTop: 10,
        spacingBottom: 10,
        spacingLeft: 5,
        spacingRight: 10,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: this.monthsShort,
        crosshair: {
          width: 1,
          color: '#cbd5e1',
          dashStyle: 'Dash',
        },
        labels: {
          style: {
            color: '#475569',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
      },
      yAxis: {
        title: {
          text: 'No of Backlogs',
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        min: 0,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<div style="font-size:11px;font-weight:700;color:#1e293b;">{point.key} (' + displayYear + ')</div>',
        pointFormat:
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;">' +
          '<span style="color:{series.color};font-weight:600;">● {series.name}:</span> ' +
          '<b>{point.y}</b> backlogs' +
          '</div>',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 6,
        shadow: false,
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 4,
            },
          },
          marker: {
            enabled: true,
            radius: 4,
            lineWidth: 2,
            lineColor: '#ffffff',
            symbol: 'circle',
            fillColor: '#ef4444',
          },
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '11px',
          color: '#475569',
          fontWeight: '600',
        },
      },
      series: [
        {
          name: `Backlogs (${displayYear})`,
          type: 'spline',
          color: '#ef4444',
          data: backlogValues,
        },
      ],
    } as any);

    this.charts.push(chart);
  }

  /**
   * Top Curve Graph 2: Month-wise (1 to 31 Days)
   */
  private createMonthlySplineChart(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const displayYear = this.selectedYear === 'All' ? '' : `, ${this.selectedYear}`;
    const dayValues = this.monthlyDayBacklogs[this.selectedMonth] || this.monthlyDayBacklogs[9];

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'spline',
        backgroundColor: '#ffffff',
        spacingTop: 10,
        spacingBottom: 10,
        spacingLeft: 5,
        spacingRight: 10,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: this.daysList,
        title: {
          text: `Days of ${this.selectedMonthName} (1 to 31)`,
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        crosshair: {
          width: 1,
          color: '#cbd5e1',
          dashStyle: 'Dash',
        },
        labels: {
          step: 2,
          style: {
            color: '#475569',
            fontSize: '10px',
            fontWeight: '500',
          },
        },
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
      },
      yAxis: {
        title: {
          text: 'No of Backlogs',
          style: {
            color: '#64748b',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        min: 0,
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
          '<div style="font-size:11px;font-weight:700;color:#1e293b;">' +
          this.selectedMonthName + ' Day {point.key}' + displayYear +
          '</div>',
        pointFormat:
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;">' +
          '<span style="color:{series.color};font-weight:600;">● {series.name}:</span> ' +
          '<b>{point.y}</b> backlogs' +
          '</div>',
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: 6,
        shadow: false,
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 4,
            },
          },
          marker: {
            enabled: true,
            radius: 3.5,
            lineWidth: 2,
            lineColor: '#ffffff',
            symbol: 'circle',
            fillColor: '#3b82f6',
          },
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemStyle: {
          fontSize: '11px',
          color: '#475569',
          fontWeight: '600',
        },
      },
      series: [
        {
          name: `Daily Backlogs (${this.selectedMonthName})`,
          type: 'spline',
          color: '#3b82f6',
          data: dayValues,
        },
      ],
    } as any);

    this.charts.push(chart);
  }

  /**
   * Pie Chart Factory (Matches DashboardDelayReasonsComponent)
   */
  private createPieChart(
    containerId: string,
    seriesName: string,
    data: { name: string; y: number; color: string }[]
  ): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'pie',
        backgroundColor: '#ffffff',
        spacingTop: 5,
        spacingBottom: 5,
        spacingLeft: 2,
        spacingRight: 2,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        useHTML: true,
        formatter: function (this: any) {
          return `<b>${this.key}</b><br/>Backlog Count: <b>${this.y}</b> (${this.percentage.toFixed(1)}%)`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: -22,
            format: '{point.percentage:.0f}%',
            style: {
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#ffffff',
              textOutline: '1px contrast',
            },
          },
          showInLegend: true,
          innerSize: '0%',
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        maxHeight: 140,
        itemDistance: 10,
        symbolPadding: 5,
        navigation: {
          enabled: false,
        },
        itemStyle: {
          fontSize: '10px',
          color: '#475569',
          fontWeight: '500',
        },
      },
      series: [
        {
          name: seriesName,
          type: 'pie',
          colorByPoint: true,
          data: data,
        },
      ],
    } as any);

    this.charts.push(chart);
  }

  /**
   * Stacked Bar/Column Chart: 12 Stages on X-Axis with 5 Backlog Categories
   * (Activities, Tasks, Issues, To-Do, Requirements)
   */
  private createStageStackedBarChart(containerId: string): void {
    const el = document.getElementById(containerId);
    if (!el) return;

    const categories = this.stageBacklogList.map((s) => s.stage);

    const chart = Highcharts.chart(containerId, {
      chart: {
        type: 'column',
        backgroundColor: '#ffffff',
        spacingTop: 15,
        spacingBottom: 15,
        spacingLeft: 10,
        spacingRight: 15,
      },
      title: { text: null },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: categories,
        crosshair: {
          width: 1,
          color: '#cbd5e1',
          dashStyle: 'Dash',
        },
        labels: {
          rotation: -25,
          style: {
            color: '#334155',
            fontSize: '11px',
            fontWeight: '600',
          },
        },
        lineColor: '#cbd5e1',
        tickColor: '#cbd5e1',
      },
      yAxis: {
        min: 0,
        title: {
          text: 'No of Backlogs',
          style: {
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
        gridLineColor: '#f1f5f9',
        gridLineDashStyle: 'Dash',
        stackLabels: {
          enabled: true,
          style: {
            fontWeight: 'bold',
            color: '#1e293b',
            fontSize: '11px',
            textOutline: 'none',
          },
        },
      },
      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<div style="font-size:12px;font-weight:700;color:#1e293b;padding-bottom:4px;border-bottom:1px solid #e2e8f0;margin-bottom:4px;">{point.key}</div>',
        pointFormat:
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;padding:2px 0;">' +
          '<span style="color:{series.color};font-weight:600;">● {series.name}:</span> ' +
          '<b style="color:#0f172a;">{point.y}</b>' +
          '</div>',
        footerFormat:
          '<div style="border-top:1px solid #e2e8f0;margin-top:4px;padding-top:4px;font-size:11px;font-weight:700;display:flex;justify-content:space-between;color:#0f172a;">' +
          '<span>Total Backlogs:</span><b>{point.total}</b></div>',
        backgroundColor: '#ffffff',
        borderColor: '#cbd5e1',
        borderRadius: 8,
        shadow: false,
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal',
        itemDistance: 20,
        itemStyle: {
          fontSize: '12px',
          color: '#334155',
          fontWeight: '600',
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          borderRadius: 2,
          borderWidth: 0,
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Activities',
          type: 'column',
          color: '#3b82f6',
          data: this.stageBacklogList.map((s) => s.act),
        },
        {
          name: 'Tasks',
          type: 'column',
          color: '#06b6d4',
          data: this.stageBacklogList.map((s) => s.task),
        },
        {
          name: 'Issues',
          type: 'column',
          color: '#f59e0b',
          data: this.stageBacklogList.map((s) => s.iss),
        },
        {
          name: 'To-Do',
          type: 'column',
          color: '#8b5cf6',
          data: this.stageBacklogList.map((s) => s.todo),
        },
        {
          name: 'Requirements',
          type: 'column',
          color: '#10b981',
          data: this.stageBacklogList.map((s) => s.req),
        },
      ],
    } as any);

    this.charts.push(chart);
  }
}
