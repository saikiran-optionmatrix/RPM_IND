import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as HighchartsNamespace from 'highcharts';
import HighchartsGantt from 'highcharts/modules/gantt';

const Highcharts: any = (HighchartsNamespace as any).default || HighchartsNamespace;

// Safely initialize Highcharts Gantt module
try {
  const gantt = (HighchartsGantt as any)?.default || HighchartsGantt;
  if (typeof gantt === 'function' && Highcharts) {
    gantt(Highcharts);
  }
} catch (e) {
  console.warn('Could not initialize Highcharts Gantt module', e);
}

@Component({
  selector: 'app-project-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './project-overview.component.html',
  styleUrl: './project-overview.component.scss'
})
export class ProjectOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ganttChartRef') ganttChartRef?: ElementRef;

  private chart: any;

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  // Gate Badges
  gates = [
    { label: 'G1', status: 'passed' },
    { label: 'G2', status: 'pending' },
    { label: 'G3', status: 'pending' },
    { label: 'G4', status: 'pending' },
    { label: 'G5', status: 'pending' }
  ];

  // Highcharts Gantt Configuration
  ganttChartOptions: any = {
    chart: {
      backgroundColor: 'transparent',
      spacingTop: 10,
      spacingBottom: 15,
      spacingLeft: 10,
      spacingRight: 15,
      style: { fontFamily: "'Inter', Roboto, 'Helvetica Neue', sans-serif" }
    },
    title: { text: undefined },
    credits: { enabled: false },
    xAxis: [
      {
        opposite: true,
        currentDateIndicator: false,
        min: Date.UTC(2026, 0, 1),
        max: Date.UTC(2027, 6, 31),
        tickPositions: [
          Date.UTC(2026, 0, 1),
          Date.UTC(2027, 0, 1),
          Date.UTC(2027, 7, 1)
        ],
        labels: {
          format: '{value:%Y}',
          align: 'center',
          style: {
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600'
          }
        },
        gridLineWidth: 1,
        gridLineColor: '#e2e8f0',
        lineColor: '#e2e8f0'
      },
      {
        opposite: false,
        currentDateIndicator: false,
        min: Date.UTC(2026, 0, 1),
        max: Date.UTC(2027, 6, 31),
        tickPositions: [
          Date.UTC(2026, 0, 1),  Date.UTC(2026, 1, 1),  Date.UTC(2026, 2, 1),
          Date.UTC(2026, 3, 1),  Date.UTC(2026, 4, 1),  Date.UTC(2026, 5, 1),
          Date.UTC(2026, 6, 1),  Date.UTC(2026, 7, 1),  Date.UTC(2026, 8, 1),
          Date.UTC(2026, 9, 1),  Date.UTC(2026, 10, 1), Date.UTC(2026, 11, 1),
          Date.UTC(2027, 0, 1),  Date.UTC(2027, 1, 1),  Date.UTC(2027, 2, 1),
          Date.UTC(2027, 3, 1),  Date.UTC(2027, 4, 1),  Date.UTC(2027, 5, 1),
          Date.UTC(2027, 6, 1)
        ],
        labels: {
          format: '{value:%b %Y}',
          style: {
            color: '#64748b',
            fontSize: '10px',
            fontWeight: '500'
          }
        },
        gridLineWidth: 1,
        gridLineColor: '#e2e8f0',
        lineColor: '#e2e8f0'
      }
    ],
    yAxis: {
      type: 'category',
      grid: {
        enabled: true,
        borderColor: '#e2e8f0'
      },
      gridLineWidth: 1,
      gridLineColor: '#e2e8f0',
      lineColor: '#e2e8f0',
      labels: {
        style: {
          color: '#64748b',
          fontSize: '12px',
          fontWeight: '500',
          letterSpacing: '0.5px'
        }
      },
      categories: ['STAGE 1', 'STAGE 2', 'STAGE 3', 'STAGE 4', 'STAGE 5']
    },
    tooltip: {
      useHTML: true,
      backgroundColor: '#ffffff',
      borderColor: '#cbd5e1',
      borderRadius: 6,
      borderWidth: 1,
      shadow: {
        color: 'rgba(0, 0, 0, 0.08)',
        offsetX: 0,
        offsetY: 4,
        width: 12
      },
      formatter: function (this: any) {
        const point = this.point;
        if (point.milestone) {
          const gateName = point.custom?.gateName || `Gate Review`;
          const gateStatus = point.custom?.gateStatus || 'Scheduled';
          const gateDate = point.custom?.gateDate || Highcharts.dateFormat('%b %d, %Y', point.start);
          const gateDesc = point.custom?.gateDesc || 'Milestone gate evaluation & project stage clearance.';

          return `
            <div style="padding: 10px 14px; font-family: Roboto, sans-serif; min-width: 220px; font-size: 12px; color: #1e293b;">
              <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="color: ${point.color || '#2563eb'}; font-size: 15px;">◆</span> ${gateName}
              </div>
              <div style="font-size: 12px; color: #334155; margin-bottom: 3px;">
                <b>Review Date:</b> ${gateDate}
              </div>
              <div style="font-size: 12px; color: #334155; margin-bottom: 4px;">
                <b>Gate Status:</b>
                <span style="font-weight: 600; padding: 2px 6px; border-radius: 4px; background-color: #eff6ff; color: #1d4ed8;">${gateStatus}</span>
              </div>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; border-top: 1px solid #f1f5f9; padding-top: 5px; line-height: 1.4;">
                ${gateDesc}
              </div>
            </div>
          `;
        } else {
          const stageNames = ['Stage 1: Feasibility', 'Stage 2: Design', 'Stage 3: Prototyping', 'Stage 4: Testing', 'Stage 5: Launch'];
          const stageName = stageNames[point.y] || `Stage ${point.y + 1}`;
          const startDate = Highcharts.dateFormat('%b %d, %Y', point.start);
          const endDate = Highcharts.dateFormat('%b %d, %Y', point.end);
          const statusText = point.custom?.label ? (point.custom.label === '100%' ? 'Complete' : `In Progress (${point.custom.label})`) : 'Planned';

          return `
            <div style="padding: 10px 14px; font-family: Roboto, sans-serif; font-size: 12px; color: #1e293b; min-width: 200px;">
              <div style="font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 6px;">${stageName}</div>
              <div style="font-size: 12px; color: #334155; margin-bottom: 3px;"><b>Duration:</b> ${startDate} — ${endDate}</div>
              <div style="font-size: 12px; color: #334155;"><b>Status:</b> ${statusText}</div>
            </div>
          `;
        }
      }
    },
    plotOptions: {
      gantt: {
        borderRadius: 4,
        pointWidth: 18,
        borderWidth: 0,
        borderColor: 'transparent',
        dataLabels: {
          enabled: true,
          format: '{point.custom.label}',
          style: {
            color: '#ffffff',
            textOutline: 'none',
            fontSize: '10px',
            fontWeight: '600'
          },
          align: 'left',
          padding: 6
        },
        states: {
          hover: {
            brightness: 0.04,
            borderWidth: 0,
            borderColor: 'transparent'
          }
        }
      }
    },
    series: [{
      type: 'gantt',
      name: 'Project Phases',
      data: [
        // STAGE 1
        {
          y: 0,
          start: Date.UTC(2026, 1, 1),
          end: Date.UTC(2026, 3, 15),
          color: '#10b981',
          borderColor: 'transparent',
          borderWidth: 0,
          custom: { label: '100%' }
        },
        {
          y: 0,
          start: Date.UTC(2026, 3, 15),
          milestone: true,
          color: '#2563eb',
          marker: {
            symbol: 'diamond',
            radius: 6,
            lineWidth: 0,
            lineColor: 'transparent'
          },
          custom: {
            gateName: 'Gate 1: Concept & Feasibility Approval',
            gateStatus: 'Passed & Approved',
            gateDate: '15 Apr 2026',
            gateDesc: 'Initial feasibility review, concept sign-off, and business case clearance approved.'
          }
        },

        // STAGE 2
        {
          y: 1,
          start: Date.UTC(2026, 3, 1),
          end: Date.UTC(2026, 7, 15),
          color: '#fef08a',
          borderColor: 'transparent',
          borderWidth: 0,
          completed: {
            amount: 0.60,
            fill: '#10b981'
          },
          custom: { label: '60%' }
        },

        // STAGE 3
        {
          y: 2,
          start: Date.UTC(2026, 6, 20),
          end: Date.UTC(2026, 10, 20),
          color: '#e2e8f0',
          borderColor: 'transparent',
          borderWidth: 0,
          custom: { label: '' }
        },
        {
          y: 2,
          start: Date.UTC(2026, 10, 20),
          milestone: true,
          color: '#94a3b8',
          marker: {
            symbol: 'diamond',
            radius: 6,
            lineWidth: 0,
            lineColor: 'transparent'
          },
          custom: {
            gateName: 'Gate 3: Prototype & Safety Clearance',
            gateStatus: 'Scheduled / Pending',
            gateDate: '20 Nov 2026',
            gateDesc: 'Physical prototype testing, EHS safety compliance, and tooling validation.'
          }
        },

        // STAGE 4
        {
          y: 3,
          start: Date.UTC(2026, 9, 15),
          end: Date.UTC(2027, 2, 25),
          color: '#e2e8f0',
          borderColor: 'transparent',
          borderWidth: 0,
          custom: { label: '' }
        },
        {
          y: 3,
          start: Date.UTC(2027, 2, 25),
          milestone: true,
          color: '#94a3b8',
          marker: {
            symbol: 'diamond',
            radius: 6,
            lineWidth: 0,
            lineColor: 'transparent'
          },
          custom: {
            gateName: 'Gate 4: Pre-Production Pilot Audit',
            gateStatus: 'Scheduled / Pending',
            gateDate: '25 Mar 2027',
            gateDesc: 'Pilot line assembly run evaluation, quality yield audit, and ramp-up readiness.'
          }
        },

        // STAGE 5
        {
          y: 4,
          start: Date.UTC(2027, 2, 1),
          end: Date.UTC(2027, 6, 15),
          color: '#e2e8f0',
          borderColor: 'transparent',
          borderWidth: 0,
          custom: { label: '' }
        },
        {
          y: 4,
          start: Date.UTC(2027, 6, 15),
          milestone: true,
          color: '#94a3b8',
          marker: {
            symbol: 'diamond',
            radius: 6,
            lineWidth: 0,
            lineColor: 'transparent'
          },
          custom: {
            gateName: 'Gate 5: Mass Production Launch',
            gateStatus: 'Scheduled / Pending',
            gateDate: '15 Jul 2027',
            gateDesc: 'Final commercial launch clearance, line sign-off, and production handover.'
          }
        }
      ]
    }]
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
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
      this.initGanttChart();
    }, 60);
  }

  initGanttChart(): void {
    if (!this.ganttChartRef?.nativeElement) {
      return;
    }

    try {
      this.chart = Highcharts.ganttChart(this.ganttChartRef.nativeElement, this.ganttChartOptions);
    } catch (e) {
      console.error('Error initializing Highcharts Gantt chart', e);
    }
  }

  ngOnDestroy(): void {
    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy();
    }
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: {
        code: this.projectCode || '2026/GEN/001',
        name: this.projectName || 'Generic Tablet Development'
      }
    });
  }
}
