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

export interface StageDelayReason {
  stageNumber: number;
  stageCode: string;
  stageName: string;
  topReason: string;
}

@Component({
  selector: 'app-dashboard-delay-reasons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-delay-reasons.component.html',
  styleUrl: './dashboard-delay-reasons.component.scss',
})
export class DashboardDelayReasonsComponent implements OnInit, AfterViewInit, OnDestroy {
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
    setTimeout(() => {
      this.initAllCharts();
    }, 0);
  }

  private charts: Highcharts.Chart[] = [];

  // Top Delay Reason for each of the 12 Stages (2,3)
  readonly topDelayReasonsByStage: StageDelayReason[] = [
    { stageNumber: 1, stageCode: 'S1', stageName: 'Business Case', topReason: 'Market Feasibility Analysis Delay' },
    { stageNumber: 2, stageCode: 'S2', stageName: 'Initiation', topReason: 'Charter Finalization Delay' },
    { stageNumber: 3, stageCode: 'S3', stageName: 'Development Procurement', topReason: 'API & Raw Material Shortage' },
    { stageNumber: 4, stageCode: 'S4', stageName: 'POC Formulation', topReason: 'Excipient Compatibility Anomaly' },
    { stageNumber: 5, stageCode: 'S5', stageName: 'EB Procurement', topReason: 'Packaging Material Rejection' },
    { stageNumber: 6, stageCode: 'S6', stageName: 'Pilot Bio Formulation', topReason: 'Pilot Batch Dissolution Variation' },
    { stageNumber: 7, stageCode: 'S7', stageName: 'API Validation', topReason: 'Analytical Method Validation Pending' },
    { stageNumber: 8, stageCode: 'S8', stageName: 'FP Validation', topReason: 'Finished Product Assay Failure' },
    { stageNumber: 9, stageCode: 'S9', stageName: 'TTD Submission', topReason: 'Tech Transfer Dossier Review Pending' },
    { stageNumber: 10, stageCode: 'S10', stageName: 'Exhibit Batches', topReason: 'Equipment Breakdown & Maintenance' },
    { stageNumber: 11, stageCode: 'S11', stageName: 'Pivotal BE', topReason: 'CRO Patient Recruitment Delay' },
    { stageNumber: 12, stageCode: 'S12', stageName: 'Dossier Filing', topReason: 'Regulatory Response Clearance Delay' },
  ];

  // 1,1: Activities Delay Distribution Data (5 Stages + Others)
  readonly activitiesData = [
    { name: 'S1: Business Case', y: 20, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 16, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 28, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 22, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 18, color: '#f59e0b' },
    { name: 'Others', y: 54, color: '#94a3b8' },
  ];

  // 1,2: Tasks Delay Distribution Data (5 Stages + Others)
  readonly tasksData = [
    { name: 'S1: Business Case', y: 18, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 15, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 25, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 20, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 22, color: '#f59e0b' },
    { name: 'Others', y: 48, color: '#94a3b8' },
  ];

  // 1,3: Issues Delay Distribution Data (5 Stages + Others)
  readonly issuesData = [
    { name: 'S1: Business Case', y: 12, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 14, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 22, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 30, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 24, color: '#f59e0b' },
    { name: 'Others', y: 56, color: '#94a3b8' },
  ];

  // 2,1: To-Do Delay Distribution Data (5 Stages + Others)
  readonly todoData = [
    { name: 'S1: Business Case', y: 22, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 26, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 20, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 16, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 24, color: '#f59e0b' },
    { name: 'Others', y: 50, color: '#94a3b8' },
  ];

  // 2,2: Requirements Delay Distribution Data (5 Stages + Others)
  readonly requirementsData = [
    { name: 'S1: Business Case', y: 24, color: '#3b82f6' },
    { name: 'S2: Initiation', y: 28, color: '#06b6d4' },
    { name: 'S3: Development Procurement', y: 18, color: '#10b981' },
    { name: 'S4: POC Formulation', y: 19, color: '#84cc16' },
    { name: 'S5: EB Procurement', y: 15, color: '#f59e0b' },
    { name: 'Others', y: 62, color: '#94a3b8' },
  ];

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
    this.charts.forEach((chart) => {
      if (chart) {
        chart.destroy();
      }
    });
    this.charts = [];
  }

  private initAllCharts(): void {
    this.createPieChart('activitiesDelayChartContainer', 'Activities', this.activitiesData);
    this.createPieChart('tasksDelayChartContainer', 'Tasks', this.tasksData);
    this.createPieChart('issuesDelayChartContainer', 'Issues', this.issuesData);
    this.createPieChart('todoDelayChartContainer', 'To-Do', this.todoData);
    this.createPieChart('requirementsDelayChartContainer', 'Requirements', this.requirementsData);
  }

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
          return `<b>${this.key}</b><br/>Delay Count: <b>${this.y}</b> (${this.percentage.toFixed(1)}%)`;
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
}

