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
    const rawNames = [
      'Generic Tablet Development', 'Generic API Process Development', 'Complex Injectable Development',
      'Generic API Development', 'Generic Injectable Formulation', 'Dapagliflozin/Metformin Tablets 5/1000mg',
      'Sitagliptin/Metformin Tablets 50/500mg', 'Liraglutide Injection 6mg/ml', 'Semaglutide Injection 1.34mg/ml',
      'Dulaglutide Injection 1.5mg/0.5ml', 'Empagliflozin/Linagliptin Tablets 10/5mg', 'Sacubitril/Valsartan Tablets 97/103mg',
      'Spironolactone/Hydrochlorothiazide Tablets 25/25mg', 'Montelukast/Levocetirizine Tablets 10/5mg', 'Fluticasone Propionate Nasal Spray 50mcg',
      'Budesonide Inhalation Suspension 0.5mg/2ml', 'Brimonidine Tartrate Ophthalmic Solution 0.15%', 'Dorzolamide/Timolol Ophthalmic Solution 22.3/6.8mg/ml',
      'Bimatoprost Ophthalmic Solution 0.03%', 'Travoprost Ophthalmic Solution 0.004%', 'Pregabalin ER Tablets 82.5mg',
      'Gabapentin ER Tablets 600mg', 'Mirogabalin Tablets 5mg', 'Gliclazide MR Tablets 60mg',
      'Sitagliptin/Simvastatin Tablets 100/20mg', 'Empagliflozin Tablets 10mg', 'Apixaban Tablets 5mg',
      'Dapagliflozin Tablets 10mg', 'Sitagliptin Tablets 100mg', 'Rivaroxaban Tablets 20mg',
      'Linagliptin Tablets 5mg', 'Ticagrelor Tablets 90mg', 'Vildagliptin Tablets 50mg',
      'Febuxostat Tablets 40mg', 'Teneligliptin Tablets 20mg', 'Canagliflozin Tablets 100mg',
      'Edoxaban Tablets 60mg', 'Dabigatran Capsules 150mg', 'Saxagliptin Tablets 5mg',
      'Lenalidomide Capsules 10mg', 'Bortezomib Injection 3.5mg', 'Palbociclib Capsules 125mg',
      'Dolutegravir Tablets 50mg', 'Sofosbuvir Tablets 400mg', 'Baricitinib Tablets 4mg',
      'Atorvastatin Tablets 20mg', 'Rosuvastatin Calcium Tablets 10mg', 'Metformin ER Tablets 500mg',
      'Losartan Potassium Tablets 50mg', 'Amlodipine Besylate Tablets 5mg', 'Telmisartan Tablets 40mg',
      'Clopidogrel Tablets 75mg', 'Pantoprazole Tablets 40mg', 'Escitalopram Tablets 10mg',
      'Montelukast Tablets 10mg', 'Duloxetine Capsules 30mg', 'Pregabalin Capsules 75mg',
      'Valsartan Tablets 80mg', 'Glimepiride Tablets 2mg', 'Bisoprolol Fumarate Tablets 5mg',
      'Levetiracetam Tablets 500mg', 'Aripiprazole Tablets 10mg', 'Esomeprazole Capsules 40mg',
      'Rabeprazole Tablets 20mg', 'Olmesartan Medoxomil Tablets 20mg', 'Metoprolol Succinate ER Tablets 50mg',
      'Venlafaxine ER Capsules 75mg', 'Tamsulosin ER Capsules 0.4mg', 'Nifedipine ER Tablets 30mg',
      'Divalproex Sodium ER Tablets 500mg', 'Quetiapine ER Tablets 300mg', 'Oxybutynin ER Tablets 10mg',
      'Bupropion XL Tablets 150mg', 'Diclofenac SR Tablets 100mg', 'Trazodone ER Tablets 150mg',
      'Paliperidone ER Tablets 6mg', 'Carvedilol Phosphate ER Capsules 20mg', 'Tolterodine ER Capsules 4mg',
      'Methylphenidate ER Tablets 18mg', 'Isosorbide Mononitrate ER Tablets 60mg', 'Glipizide ER Tablets 10mg',
      'Niacin ER Tablets 500mg', 'Tramadol ER Tablets 100mg', 'Guanfacine ER Tablets 1mg',
      'Doxazosin ER Tablets 4mg', 'Gabapentin Capsules 300mg', 'Sertraline Tablets 50mg',
      'Amoxicillin Capsules 500mg', 'Azithromycin Tablets 250mg', 'Cefixime Tablets 200mg',
      'Ciprofloxacin Tablets 500mg', 'Levofloxacin Tablets 500mg', 'Doxycycline Capsules 100mg',
      'Fluconazole Capsules 150mg', 'Itraconazole Capsules 100mg', 'Ondansetron Tablets 4mg',
      'Domperidone Tablets 10mg', 'Rosuvastatin/Ezetimibe Tablets 10/10mg', 'Amlodipine/Telmisartan Tablets 5/40mg',
      'Metformin/Sitagliptin Tablets 500/50mg', 'Salmeterol/Fluticasone Inhalation 25/125mcg', 'Budesonide/Formoterol Inhalation 160/4.5mcg',
      'Tiotropium Bromide Inhalation 18mcg', 'Mometasone Nasal Spray 50mcg', 'Latanoprost Ophthalmic Solution 0.005%',
      'Sildenafil Citrate Tablets 100mg', 'Tadalafil Tablets 20mg', 'Finasteride Tablets 5mg',
      'Dutasteride Capsules 0.5mg', 'Levothyroxine Sodium Tablets 100mcg', 'Alendronate Sodium Tablets 70mg',
      'Risedronate Sodium Tablets 35mg', 'Memantine Tablets 10mg', 'Donepezil Tablets 10mg',
      'Rivastigmine Capsules 3mg', 'Lamotrigine Tablets 100mg', 'Topiramate Tablets 50mg'
    ];

    const stageSpecs = [
      { stage: 'S1', stageName: 'Business Case', onTrack: 12, due: 3, dates: ['15/10/2027', '20/11/2027', '30/12/2027'] },
      { stage: 'S2', stageName: 'Product / Project In Initiation', onTrack: 16, due: 2, dates: ['10/07/2027', '25/08/2027', '18/09/2027'] },
      { stage: 'S3', stageName: 'Development Procurement', onTrack: 8, due: 4, dates: ['15/04/2027', '22/05/2027', '30/06/2027'] },
      { stage: 'S4', stageName: 'POC Formulation', onTrack: 15, due: 5, dates: ['10/01/2027', '28/02/2027', '15/03/2027'] },
      { stage: 'S5', stageName: 'EB Procurement', onTrack: 7, due: 3, dates: ['15/10/2026', '30/11/2026', '20/12/2026'] },
      { stage: 'S6', stageName: 'Pilot Bio Formulation', onTrack: 11, due: 1, dates: ['15/08/2026', '30/09/2026', '10/10/2026'] },
      { stage: 'S7', stageName: 'API Validation', onTrack: 13, due: 4, dates: ['20/06/2026', '15/07/2026', '31/08/2026'] },
      { stage: 'S8', stageName: 'FP Validation', onTrack: 8, due: 0, dates: ['10/04/2026', '15/05/2026', '25/06/2026'] },
      { stage: 'S9', stageName: 'TTD Submission', onTrack: 10, due: 2, dates: ['18/02/2026', '28/03/2026', '15/04/2026'] },
      { stage: 'S10', stageName: 'Exhibit Batches', onTrack: 14, due: 3, dates: ['05/01/2026', '20/02/2026', '12/03/2026'] },
      { stage: 'S11', stageName: 'Pivotal BE', onTrack: 9, due: 2, dates: ['10/11/2025', '15/12/2025', '20/01/2026'] },
      { stage: 'S12', stageName: 'Dossier Filing', onTrack: 7, due: 1, dates: ['15/09/2025', '30/10/2025', '25/11/2025'] },
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
      projectCode: `2026/PRJ/${codeNum.toString().padStart(3, '0')}`,
      currentStage: stage,
      scheduleStatus: status,
      s1: '10/01/26', s2: '15/02/26', s3: '20/03/26', s4: '25/04/26',
      s5: '10/05/26', s6: '15/06/26', s7: '20/07/26', s8: '25/08/26',
      s9: '10/09/26', s10: '15/10/26', s11: '20/11/26', s12: '25/12/26',
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
    const statusLabel = status === 'on-schedule' ? 'On Schedule' : 'Due';
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
        title: { text: 'No of projects' }
      },
      tooltip: {
        shared: true,
        useHTML: true
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
                const status = seriesName === 'Project on schedule' ? 'on-schedule' : 'due';
                self.onPortfolioChartBarClick(stage, status);
              }
            }
          }
        }
      },
      series: [
        { name: 'Project on schedule', color: '#00a859', type: 'column', data: this.chartOnTrackData },
        { name: 'Projects that are due', color: '#ed1c24', type: 'column', data: this.chartDueData }
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
          return `<b>${this.key}</b>: ${this.y} Projects (${this.percentage.toFixed(1)}%)`;
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
        name: 'Projects',
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
