import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-dashboard-buffer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatSelectModule, MatIconModule],
  templateUrl: './dashboard-buffer.component.html',
  styleUrls: ['./dashboard-buffer.component.scss']
})
export class DashboardBufferComponent implements AfterViewInit {
  projects = [
    'Generic Tablet Development',
    'Generic API Process Development',
    'Complex Injectable Development',
    'Generic API Development',
    'Generic Injectable Formulation'
  ];
  selectedBufferProject = 'All Projects';

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
    this.onBufferFilterChange();
  }

  bufferBarChart: Highcharts.Chart | null = null;
  bufferStageChart: Highcharts.Chart | null = null;

  bufferProjectData: { [project: string]: { [stage: string]: { bufferUsed: number; bufferTime: number } } } = {
    'Generic Tablet Development': {
      'S1': { bufferUsed: 0.8, bufferTime: -0.2 },
      'S2': { bufferUsed: 1.5, bufferTime: -0.3 },
      'S3': { bufferUsed: 2.1, bufferTime: -0.4 },
      'S4': { bufferUsed: 3.4, bufferTime: 0.2 },
      'S5': { bufferUsed: 4.8, bufferTime: 0.8 },
      'S6': { bufferUsed: 5.5, bufferTime: 0.4 },
      'S7': { bufferUsed: 6.2, bufferTime: 0.7 },
      'S8': { bufferUsed: 7.1, bufferTime: 0.5 },
      'S9': { bufferUsed: 7.8, bufferTime: -0.1 },
      'S10': { bufferUsed: 8.5, bufferTime: 1.5 },
      'S11': { bufferUsed: 9.3, bufferTime: 0.8 },
      'S12': { bufferUsed: 10.1, bufferTime: 0.6 },
    },
    'Generic API Process Development': {
      'S1': { bufferUsed: 0.5, bufferTime: -0.5 },
      'S2': { bufferUsed: 1.2, bufferTime: -0.6 },
      'S3': { bufferUsed: 1.8, bufferTime: -0.7 },
      'S4': { bufferUsed: 2.9, bufferTime: -0.3 },
      'S5': { bufferUsed: 3.6, bufferTime: -0.4 },
      'S6': { bufferUsed: 4.8, bufferTime: 0.2 },
      'S7': { bufferUsed: 6.0, bufferTime: 0.5 },
      'S8': { bufferUsed: 6.7, bufferTime: 0.3 },
      'S9': { bufferUsed: 7.2, bufferTime: -0.2 },
      'S10': { bufferUsed: 7.8, bufferTime: 0.8 },
      'S11': { bufferUsed: 8.6, bufferTime: 0.4 },
      'S12': { bufferUsed: 9.4, bufferTime: 0.7 },
    },
    'Complex Injectable Development': {
      'S1': { bufferUsed: 1.3, bufferTime: 0.3 },
      'S2': { bufferUsed: 2.2, bufferTime: 0.5 },
      'S3': { bufferUsed: 3.2, bufferTime: 0.7 },
      'S4': { bufferUsed: 4.1, bufferTime: 0.9 },
      'S5': { bufferUsed: 5.2, bufferTime: 1.2 },
      'S6': { bufferUsed: 6.3, bufferTime: 1.4 },
      'S7': { bufferUsed: 7.1, bufferTime: 1.6 },
      'S8': { bufferUsed: 8.0, bufferTime: 1.8 },
      'S9': { bufferUsed: 8.7, bufferTime: 1.5 },
      'S10': { bufferUsed: 9.2, bufferTime: 2.2 },
      'S11': { bufferUsed: 10.0, bufferTime: 1.9 },
      'S12': { bufferUsed: 11.2, bufferTime: 2.4 },
    },
    'Generic API Development': {
      'S1': { bufferUsed: 0.7, bufferTime: -0.3 },
      'S2': { bufferUsed: 1.4, bufferTime: -0.4 },
      'S3': { bufferUsed: 2.2, bufferTime: -0.3 },
      'S4': { bufferUsed: 3.1, bufferTime: -0.2 },
      'S5': { bufferUsed: 3.8, bufferTime: -0.2 },
      'S6': { bufferUsed: 4.6, bufferTime: -0.4 },
      'S7': { bufferUsed: 5.2, bufferTime: -0.3 },
      'S8': { bufferUsed: 6.4, bufferTime: 0.6 },
      'S9': { bufferUsed: 7.3, bufferTime: 0.8 },
      'S10': { bufferUsed: 8.1, bufferTime: 1.1 },
      'S11': { bufferUsed: 8.9, bufferTime: 0.9 },
      'S12': { bufferUsed: 9.8, bufferTime: 1.2 },
    },
    'Generic Injectable Formulation': {
      'S1': { bufferUsed: 0.9, bufferTime: -0.1 },
      'S2': { bufferUsed: 1.6, bufferTime: -0.3 },
      'S3': { bufferUsed: 2.0, bufferTime: -0.5 },
      'S4': { bufferUsed: 3.3, bufferTime: 0.2 },
      'S5': { bufferUsed: 4.6, bufferTime: 0.6 },
      'S6': { bufferUsed: 5.1, bufferTime: 0.1 },
      'S7': { bufferUsed: 5.8, bufferTime: 0.3 },
      'S8': { bufferUsed: 6.2, bufferTime: -0.2 },
      'S9': { bufferUsed: 6.5, bufferTime: -0.5 },
      'S10': { bufferUsed: 7.4, bufferTime: 0.4 },
      'S11': { bufferUsed: 8.3, bufferTime: 0.2 },
      'S12': { bufferUsed: 9.1, bufferTime: -0.3 },
    }
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.renderBufferBarChart();
      this.renderBufferPieChart();
    }, 0);
  }

  onBufferFilterChange() {
    this.renderBufferBarChart();
    this.renderBufferPieChart();
  }

  getBufferDataForProject(project: string): { [stage: string]: { bufferUsed: number; bufferTime: number } } {
    if (project !== 'All Projects' && this.bufferProjectData[project]) {
      return this.bufferProjectData[project];
    }
    const stages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
    const projectKeys = Object.keys(this.bufferProjectData);
    const result: { [stage: string]: { bufferUsed: number; bufferTime: number } } = {};

    stages.forEach(stage => {
      let totalUsed = 0;
      let totalTime = 0;
      projectKeys.forEach(p => {
        totalUsed += this.bufferProjectData[p][stage]?.bufferUsed || 0;
        totalTime += this.bufferProjectData[p][stage]?.bufferTime || 0;
      });
      result[stage] = {
        bufferUsed: +(totalUsed / projectKeys.length).toFixed(1),
        bufferTime: +(totalTime / projectKeys.length).toFixed(1)
      };
    });
    return result;
  }

  renderBufferBarChart() {
    const containerId = 'bufferBarChartContainer';
    if (!document.getElementById(containerId)) return;

    const stages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
    const thresholdData = [1.0, 1.8, 2.6, 3.5, 4.3, 5.1, 6.0, 6.8, 7.6, 8.5, 9.3, 10.2];
    const projectData = this.getBufferDataForProject(this.selectedBufferProject);

    const self = this;
    const columnData = stages.map((stage, idx) => {
      const used = projectData[stage]?.bufferUsed ?? 0;
      const threshold = thresholdData[idx];
      return {
        y: used,
        color: used > threshold ? '#dc3545' : '#28a745',
        status: used > threshold ? 'Over Threshold' : 'On Track',
        stage: stage
      };
    });

    this.bufferBarChart = Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
     title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#000000' }
      },
      xAxis: {
        title: { text: 'Stages', style: { color: '#000000' } },
        categories: stages,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        labels: {
          step: 1,
          style: { color: '#000000' }
        }
      },
      yAxis: {
        title: { text: 'Buffer Time Used', style: { color: '#000000' } },
        min: 0,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        labels: { style: { color: '#000000' } }
      },
      tooltip: {
        shared: false,
        useHTML: true,
        formatter: function (this: any): string {
          if (this.series.name.includes('Average Threshold')) {
            return `<div style="color: white;"><b>Average Threshold</b><br/>${this.x}<br/>Expected Buffer: <b>${this.y}</b></div>`;
          }
          return `
            <div style="font-size: 13px; color:white;">
              <b>${this.x}</b><br/>
              <span style="color: ${this.point.color}">\u25CF</span> Buffer Time Used: <b>${this.y}</b><br/>
              Status: <i>${(this.point as any).options.status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          borderRadius: 3,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: { fontWeight: 'bold', color: '#000000', textOutline: 'none' }
          },
          point: {
            events: {
              mouseOver: function () {
                const idx = (this as any).index;
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                const pt = stageChart.series[0]?.points[idx];
                if (pt) pt.setState('hover');
              },
              mouseOut: function () {
                const idx = (this as any).index;
                const stageChart = self.bufferStageChart;
                if (!stageChart) return;
                const pt = stageChart.series[0]?.points[idx];
                if (pt) pt.setState('');
              }
            }
          }
        }
      },
      series: [
        {
          type: 'column',
          name: 'Buffer Used',
          data: columnData
        },
        {
          type: 'line',
          name: 'Average Threshold (y=x)',
          data: thresholdData,
          color: '#007bff',
          dashStyle: 'Dash',
          marker: { enabled: true, radius: 4 }
        }
      ]
    } as any);
  }

  renderBufferPieChart() {
    const containerId = 'bufferPieChartContainer';
    if (!document.getElementById(containerId)) return;

    const stages = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
    const projectData = this.getBufferDataForProject(this.selectedBufferProject);

    const stageData = stages.map(stage => {
      const timeVal = projectData[stage]?.bufferTime ?? 0;
      return {
        name: stage,
        y: timeVal,
        color: timeVal > 0 ? '#dc3545' : '#00a859'
      };
    });

    const self = this;

    this.bufferStageChart = Highcharts.chart(containerId, {
      chart: { type: 'column', backgroundColor: '#ffffff' },
     title: { text: null },
      credits: { enabled: false },
      legend: {
        itemStyle: { color: '#000000' }
      },
      xAxis: {
        title: { text: 'Stages', style: { color: '#000000' } },
        categories: stages,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        gridLineWidth: 0,
        labels: {
          step: 1,
          style: { color: '#000000' }
        }
      },
      yAxis: {
        title: { text: 'Buffer Time', style: { color: '#000000' } },
        gridLineWidth: 0,
        lineWidth: 1,
        lineColor: '#1b2e5e',
        plotLines: [{ value: 0, width: 2, color: '#1b2e5e', zIndex: 4 }],
        labels: { style: { color: '#000000' } }
      },
      tooltip: {
        useHTML: true,
        formatter: function (this: any): string {
          const p = this.point as any;
          const status = p.y > 0 ? 'Over Buffer (Delay)' : (p.y < 0 ? 'Under Buffer (Saved)' : 'On Track');
          return `
            <div style="font-size: 13px; color:white;">
              <b>${this.key}</b><br/>
              Buffer Time: <b>${p.y > 0 ? '+' : ''}${p.y}</b><br/>
              Status: <i>${status}</i>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          borderRadius: 3,
          borderWidth: 1,
          borderColor: '#000000',
          dataLabels: {
            enabled: true,
            formatter: function (this: any): string {
              const val = this.y as number;
              return (val > 0 ? '+' : '') + val.toFixed(1);
            },
            style: { fontWeight: 'bold', color: '#000000', textOutline: 'none' }
          },
          point: {
            events: {
              mouseOver: function () {
                const idx = (this as any).index;
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                const pt = barChart.series[0]?.points[idx];
                if (pt) pt.setState('hover');
              },
              mouseOut: function () {
                const idx = (this as any).index;
                const barChart = self.bufferBarChart;
                if (!barChart) return;
                const pt = barChart.series[0]?.points[idx];
                if (pt) pt.setState('');
              }
            }
          }
        }
      },
      series: [{
        type: 'column',
        name: 'Buffer Time',
        data: stageData
      }]
    } as any);
  }
}
