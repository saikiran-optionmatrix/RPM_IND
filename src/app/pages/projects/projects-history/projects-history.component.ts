import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ProjectHistoryItem {
  projectCode: string;
  projectOwner: string;
  projectLead: string;
  molecule: string;
  productName: string;
  division: string;
  location: string;
  dosageForm: string;
  strength: string;
  targetMarket: string;
  estimatedCostForDevelopment: string;
  marketSizeInUsd: string;
  levelOfCompetition: string;
  competitorName: string;
  marketAccessStrategy: string;
  projectedMarketShare: string;
  projectedNpv: string;
  commercialAttractiveness: string;
  priorityOfProject: string;
  timelineForCompletionOfProject: string;
  projectInitiatedOn: string;
  productStatus: string;
  preEbActivitiesCompletedOn: string;
  tentativeBatchSize: string;
  tentativeEbBatchPlan: string;
  projectCompletedDate: string;
  expectedMaCost: string;
  drugAuthorityName: string;
  remarks: string;
  lastUpdated: string;
  updatedBy: string;
}

@Component({
  selector: 'app-projects-history',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './projects-history.component.html',
  styleUrl: './projects-history.component.scss',
})
export class ProjectsHistoryComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  projectName: string = 'Projects';
  projectCode: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ProjectHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        this.projectName = params['name'];
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const code = this.projectCode || '2026/IND/001';
    const name = (this.projectName && this.projectName !== 'Projects') ? this.projectName : 'Industrial Equipment Line Expansion';

    this.historyRecords = [
      {
        projectCode: code,
        projectOwner: 'Plant Engineering Strategy',
        projectLead: 'Ananya Rao',
        molecule: 'Automated Assembly & Material Transfer Line',
        productName: name,
        division: 'Industrial Machinery - MA',
        location: 'Ahmedabad - Mfg Plant',
        dosageForm: 'Modular conveyor & servo-actuated assembly line',
        strength: '120 units/hr; 415V 3-phase',
        targetMarket: 'India / ASEAN',
        estimatedCostForDevelopment: '$1,450,000',
        marketSizeInUsd: '~125M',
        levelOfCompetition: 'High',
        competitorName: 'Siemens, Bosch Rexroth, Rockwell Automation',
        marketAccessStrategy: 'Turnkey Plant Expansion',
        projectedMarketShare: '8.5%',
        projectedNpv: '$6.4M',
        commercialAttractiveness: 'Attractive',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '12 Months',
        projectInitiatedOn: '2026-01-15',
        productStatus: 'Initiated',
        preEbActivitiesCompletedOn: '-',
        tentativeBatchSize: '120 units/hr',
        tentativeEbBatchPlan: 'Planned',
        projectCompletedDate: '2027-10-31',
        expectedMaCost: '$180,000',
        drugAuthorityName: 'ISO 9001 / BIS Safety',
        remarks: 'Initial program baseline established and CapEx charter approved',
        lastUpdated: '15-Jan-2026',
        updatedBy: 'Ananya Rao'
      },
      {
        projectCode: code,
        projectOwner: 'Plant Engineering Strategy',
        projectLead: 'Rajesh Kumar',
        molecule: 'Automated Assembly & Material Transfer Line',
        productName: name,
        division: 'Equipment Engineering - CT',
        location: 'Hyderabad - Engg Centre',
        dosageForm: 'Modular conveyor & servo-actuated assembly line',
        strength: '120 units/hr; 415V 3-phase',
        targetMarket: 'India / ASEAN',
        estimatedCostForDevelopment: '$1,520,000',
        marketSizeInUsd: '~130M',
        levelOfCompetition: 'High',
        competitorName: 'Siemens, Bosch Rexroth, ABB Robotics',
        marketAccessStrategy: 'Turnkey Plant Expansion',
        projectedMarketShare: '9.0%',
        projectedNpv: '$6.8M',
        commercialAttractiveness: 'Very attractive',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '14 Months',
        projectInitiatedOn: '2026-01-15',
        productStatus: 'Detailed Engineering',
        preEbActivitiesCompletedOn: '2026-06-15',
        tentativeBatchSize: '125 units/hr',
        tentativeEbBatchPlan: 'In Progress',
        projectCompletedDate: '2027-11-30',
        expectedMaCost: '$195,000',
        drugAuthorityName: 'ISO 13849 / CE Directive',
        remarks: '3D CAD layout and PLC safety interlocks frozen; long-lead servo POs issued',
        lastUpdated: '15-Jun-2026',
        updatedBy: 'Rajesh Kumar'
      },
      {
        projectCode: code,
        projectOwner: 'Plant Engineering Strategy',
        projectLead: 'Amit Patel',
        molecule: 'Automated Assembly & Material Transfer Line',
        productName: name,
        division: 'Industrial Machinery - MA',
        location: 'Ahmedabad - Mfg Plant',
        dosageForm: 'Modular conveyor & servo-actuated assembly line',
        strength: '130 units/hr; 415V 3-phase',
        targetMarket: 'India / ASEAN / Europe',
        estimatedCostForDevelopment: '$1,580,000',
        marketSizeInUsd: '~140M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Bosch Rexroth, Fanuc, Siemens',
        marketAccessStrategy: 'Direct Plant Rollout',
        projectedMarketShare: '9.5%',
        projectedNpv: '$7.2M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '16 Months',
        projectInitiatedOn: '2026-01-15',
        productStatus: 'FAT Completed / Site Prep',
        preEbActivitiesCompletedOn: '2026-09-20',
        tentativeBatchSize: '130 units/hr',
        tentativeEbBatchPlan: 'Completed',
        projectCompletedDate: '2027-12-31',
        expectedMaCost: '$210,000',
        drugAuthorityName: 'ISO 9001 / TUV / BIS',
        remarks: 'Factory Acceptance Test passed; foundation and utility hook-ups underway',
        lastUpdated: '20-Sep-2026',
        updatedBy: 'Amit Patel'
      }
    ];
  }

  get paginatedRecords(): ProjectHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
