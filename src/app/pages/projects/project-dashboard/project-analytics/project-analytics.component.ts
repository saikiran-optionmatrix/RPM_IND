import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as HighchartsNamespace from 'highcharts';
import exportingModule from 'highcharts/modules/exporting';

const Highcharts: any = (HighchartsNamespace as any).default || HighchartsNamespace;

// Safely initialize Highcharts modules
try {
  const exp = (exportingModule as any)?.default || exportingModule;
  if (typeof exp === 'function' && Highcharts) {
    exp(Highcharts);
  }
} catch (e) {
  console.warn('Could not initialize Highcharts exporting module', e);
}

interface Task {
  name: string;
  assignee: string;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  slipDays: string;
}

interface GanttTaskItem {
  id: number;
  label: string;
  fullName: string;
  duration: string;
  isOverdue: boolean;
  leftPercent: number;
  widthPercent: number;
}

@Component({
  selector: 'app-project-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-analytics.component.html',
  styleUrl: './project-analytics.component.scss',
})
export class ProjectAnalyticsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sprintBufferRef') sprintBufferRef?: ElementRef;
  @ViewChild('stageBufferRef') stageBufferRef?: ElementRef;
  @ViewChild('costPlanRef') costPlanRef?: ElementRef;
  @ViewChild('projectHoursRef') projectHoursRef?: ElementRef;

  private charts: any[] = [];

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  // --- Task Data ---
  overdueTasks: Task[] = [
    { name: 'API–Excipient Compatibility Study', assignee: 'Dr. Priya R.', status: 'CRITICAL', slipDays: '+6d' },
    { name: 'Dissolution Method Optimization', assignee: 'Rahul K.', status: 'CRITICAL', slipDays: '+5d' },
    { name: 'Prototype Batch Testing', assignee: 'Meena S.', status: 'HIGH', slipDays: '+4d' },
    { name: 'Analytical Method Validation', assignee: 'Anil P.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Formulation Stability Assessment', assignee: 'Kavya R.', status: 'HIGH', slipDays: '+3d' },
    { name: 'Excipient Compatibility Documentation', assignee: 'Suresh N.', status: 'MEDIUM', slipDays: '+2d' },
  ];

  // --- Gantt Timeline Data ---
  ganttMonths: string[] = ['Jun', 'Jul', 'Aug', 'Sep'];

  ganttTasks: GanttTaskItem[] = [
    {
      id: 1,
      label: '1. Reference Product Characteri...',
      fullName: '1. Reference Product Characterization — 12d',
      duration: '12d',
      isOverdue: false,
      leftPercent: 1.5,
      widthPercent: 12
    },
    {
      id: 2,
      label: '2. API–Excipient Compatibility ...',
      fullName: '2. API–Excipient Compatibility Study — 18d',
      duration: '18d',
      isOverdue: false,
      leftPercent: 9.5,
      widthPercent: 18
    },
    {
      id: 3,
      label: '3. Formulation Prototype Devel...',
      fullName: '3. Formulation Prototype Development — 24d',
      duration: '24d',
      isOverdue: false,
      leftPercent: 24.5,
      widthPercent: 24
    },
    {
      id: 4,
      label: '4. Dissolution & Performance T...',
      fullName: '4. Dissolution & Performance Testing — 14d',
      duration: '14d',
      isOverdue: true,
      leftPercent: 44.5,
      widthPercent: 14
    },
    {
      id: 5,
      label: '5. Formulation Optimization — ...',
      fullName: '5. Formulation Optimization — 20d',
      duration: '20d',
      isOverdue: true,
      leftPercent: 55.0,
      widthPercent: 20
    },
    {
      id: 6,
      label: '6. Stability Study Initiation — 30d',
      fullName: '6. Stability Study Initiation — 30d',
      duration: '30d',
      isOverdue: true,
      leftPercent: 71.0,
      widthPercent: 29
    }
  ];

  // Tooltip tracking
  hoveredGanttTask: GanttTaskItem | null = null;
  tooltipPos = { x: 0, y: 0 };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    const pName = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name');
    const pCode = this.route.snapshot.queryParamMap.get('projectCode') || this.route.snapshot.queryParamMap.get('code');
    if (pName) {
      this.projectName = pName;
    }
    if (pCode) {
      this.projectCode = pCode;
    }
    this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.renderCharts();
    }, 60);
  }

  ngOnDestroy(): void {
    this.charts.forEach(c => {
      if (c && typeof c.destroy === 'function') {
        c.destroy();
      }
    });
    this.charts = [];
  }

  goBack(): void {
    this.router.navigateByUrl('/projects');
  }

  onGanttBarHover(event: MouseEvent, task: GanttTaskItem): void {
    this.hoveredGanttTask = task;
    this.tooltipPos = {
      x: event.clientX + 12,
      y: event.clientY + 12
    };
  }

  onGanttBarMove(event: MouseEvent): void {
    if (this.hoveredGanttTask) {
      this.tooltipPos = {
        x: event.clientX + 12,
        y: event.clientY + 12
      };
    }
  }

  onGanttBarLeave(): void {
    this.hoveredGanttTask = null;
  }

  private renderCharts(): void {
    if (this.sprintBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.sprintBufferRef.nativeElement, this.getSprintBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering sprintBuffer chart', e);
      }
    }
    if (this.stageBufferRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.stageBufferRef.nativeElement, this.getStageBufferChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering stageBuffer chart', e);
      }
    }
    if (this.costPlanRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.costPlanRef.nativeElement, this.getCostPlanChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering costPlan chart', e);
      }
    }
    if (this.projectHoursRef?.nativeElement) {
      try {
        const c = Highcharts.chart(this.projectHoursRef.nativeElement, this.getProjectHoursChartOptions());
        if (c) this.charts.push(c);
      } catch (e) {
        console.error('Error rendering projectHours chart', e);
      }
    }
  }

  private getSprintBufferChartOptions(): any {
    return {
      chart: {
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
        title: {
          text: '% completion',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 8,
        tickInterval: 2,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Buffer Time Used',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function (this: any) {
          let s = `<div style="font-size: 11px; padding: 2px;"><b>${this.x}</b>`;
          this.points?.forEach((point: any) => {
            s += `<br/><span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b>`;
          });
          s += '</div>';
          return s;
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer',
          color: '#a7f3d0',
          borderRadius: 2,
          pointWidth: 36,
          dataLabels: {
            enabled: true,
            inside: false,
            style: {
              color: '#94a3b8',
              fontSize: '10px',
              fontWeight: 'normal',
              textOutline: 'none'
            }
          },
          data: [
            { y: 0.8, color: '#a7f3d0' },
            { y: 2.5, color: '#fca5a5' },
            { y: 2.2, color: '#a7f3d0' },
            { y: 4.8, color: '#fca5a5' },
            { y: 4.0, color: '#a7f3d0' },
            { y: 6.5, color: '#fca5a5' }
          ]
        },
        {
          type: 'line',
          name: 'Cumulative Completion',
          color: '#2563eb',
          dashStyle: 'Dash',
          lineWidth: 2,
          marker: {
            enabled: true,
            radius: 3,
            fillColor: '#2563eb'
          },
          data: [0.8, 1.8, 2.8, 3.8, 4.8, 6.0]
        }
      ]
    };
  }

  private getStageBufferChartOptions(): any {
    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 4,
        tickInterval: 1,
        gridLineColor: '#f1f5f9',
        title: {
          text: 'Values',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        },
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer Variance',
          color: '#059669',
          borderRadius: 2,
          pointWidth: 40,
          data: [3, 1, 3, 0, 0]
        }
      ]
    };
  }

  private getCostPlanChartOptions(): any {
    return {
      chart: {
        type: 'column',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      xAxis: {
        categories: ['S1', 'S2', 'S3', 'S4', 'S5'],
        labels: {
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        min: 0,
        max: 40,
        tickInterval: 20,
        gridLineColor: '#f1f5f9',
        title: { text: undefined },
        labels: {
          format: '{value}L',
          style: {
            color: '#64748b',
            fontSize: '11px'
          }
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>₹{point.y}L</b>'
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      plotOptions: {
        column: {
          borderRadius: 2,
          pointPadding: 0.1,
          groupPadding: 0.2
        }
      },
      series: [
        {
          type: 'column',
          name: 'Actual Cost',
          color: '#a855f7',
          data: [11, 18, 22, 18, 24]
        },
        {
          type: 'column',
          name: 'Budgeted Cost',
          color: '#3b82f6',
          data: [10, 20, 26, 22, 28]
        }
      ]
    };
  }

  private getProjectHoursChartOptions(): any {
    return {
      chart: {
        type: 'pie',
        height: 280,
        backgroundColor: 'transparent',
        spacing: [15, 15, 10, 10]
      },
      title: { text: undefined },
      credits: { enabled: false },
      exporting: { enabled: true },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b> ({point.y}h)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: true,
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.percentage:.1f}%',
            connectorColor: '#cbd5e1',
            style: {
              color: '#334155',
              fontSize: '11px',
              fontWeight: '500',
              textOutline: 'none'
            }
          }
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#475569',
          fontSize: '11px',
          fontWeight: '500'
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Effort allocation',
          data: [
            {
              name: 'Production Staff',
              y: 76.9,
              color: '#3b82f6'
            },
            {
              name: 'Quality Assurance',
              y: 15.7,
              color: '#10b981'
            },
            {
              name: 'Maintenance & Setup',
              y: 7.4,
              color: '#f59e0b'
            }
          ]
        }
      ]
    };
  }
}