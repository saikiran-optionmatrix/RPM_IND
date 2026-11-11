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
    const code = this.projectCode || '2026/RD/001';
    const name = (this.projectName && this.projectName !== 'Projects') ? this.projectName : 'Abiraterone Acetate Film Coated';

    this.historyRecords = [
      {
        projectCode: code,
        projectOwner: 'Anki Reddy',
        projectLead: 'Anki Reddy',
        molecule: 'Abiraterone',
        productName: name,
        division: 'Formulation R&D',
        location: 'Hyderabad R&D Centre',
        dosageForm: 'Tablets',
        strength: '250 mg & 500 mg',
        targetMarket: 'Europe',
        estimatedCostForDevelopment: '$500,000',
        marketSizeInUsd: '~654M',
        levelOfCompetition: 'Commodity',
        competitorName: '25 + ( Janssen (Zytiga, originator) + Mylan, KRKA, Accord)',
        marketAccessStrategy: 'Direct filing / ANDA',
        projectedMarketShare: '15%',
        projectedNpv: '$2.5M',
        commercialAttractiveness: 'Attractive',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '18 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Initiated',
        preEbActivitiesCompletedOn: '-',
        tentativeBatchSize: '50,000 Units',
        tentativeEbBatchPlan: 'Planned',
        projectCompletedDate: '2026-12-31',
        expectedMaCost: '$100,000',
        drugAuthorityName: 'EMA',
        remarks: 'Initial project baseline established and approved',
        lastUpdated: '15-Jan-2025',
        updatedBy: 'Anki Reddy'
      },
      {
        projectCode: code,
        projectOwner: 'Anki Reddy',
        projectLead: 'Suresh Kumar',
        molecule: 'Abiraterone',
        productName: name,
        division: 'Formulation R&D',
        location: 'Hyderabad R&D Centre',
        dosageForm: 'Tablets',
        strength: '250 mg & 500 mg',
        targetMarket: 'Europe / UK',
        estimatedCostForDevelopment: '$520,000',
        marketSizeInUsd: '~680M',
        levelOfCompetition: 'High',
        competitorName: 'Janssen, Mylan, Sandoz, Teva',
        marketAccessStrategy: 'DCP Procedure / Direct',
        projectedMarketShare: '16.5%',
        projectedNpv: '$2.8M',
        commercialAttractiveness: 'Very Attractive',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '20 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Formulation Optimization',
        preEbActivitiesCompletedOn: '2025-08-15',
        tentativeBatchSize: '75,000 Units',
        tentativeEbBatchPlan: 'In Progress',
        projectCompletedDate: '2027-02-28',
        expectedMaCost: '$115,000',
        drugAuthorityName: 'MHRA / EMA',
        remarks: 'Formulation optimization completed; target batch size scaled',
        lastUpdated: '15-Aug-2025',
        updatedBy: 'Suresh Kumar'
      },
      {
        projectCode: code,
        projectOwner: 'Anki Reddy',
        projectLead: 'Suresh Kumar',
        molecule: 'Abiraterone',
        productName: name,
        division: 'Analytical & Regulatory',
        location: 'Hyderabad R&D Centre',
        dosageForm: 'Tablets',
        strength: '250 mg & 500 mg',
        targetMarket: 'Europe / UK / US',
        estimatedCostForDevelopment: '$550,000',
        marketSizeInUsd: '~710M',
        levelOfCompetition: 'Moderate',
        competitorName: 'Janssen (Zytiga), Mylan, Sun Pharma',
        marketAccessStrategy: 'Direct filing / ANDA',
        projectedMarketShare: '18%',
        projectedNpv: '$3.1M',
        commercialAttractiveness: 'Attractive',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '22 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'EB Batches Executed',
        preEbActivitiesCompletedOn: '2025-11-20',
        tentativeBatchSize: '100,000 Units',
        tentativeEbBatchPlan: 'Completed',
        projectCompletedDate: '2027-04-30',
        expectedMaCost: '$125,000',
        drugAuthorityName: 'USFDA / EMA',
        remarks: 'Exhibition batches successfully executed; stability studies initiated',
        lastUpdated: '20-Nov-2025',
        updatedBy: 'Suresh Kumar'
      },
      {
        projectCode: code,
        projectOwner: 'Anki Reddy',
        projectLead: 'Priya Sharma',
        molecule: 'Abiraterone',
        productName: name,
        division: 'Commercial & Regulatory',
        location: 'Bangalore Technical Centre',
        dosageForm: 'Tablets',
        strength: '250 mg & 500 mg',
        targetMarket: 'Global (US, EU, ROW)',
        estimatedCostForDevelopment: '$580,000',
        marketSizeInUsd: '~750M',
        levelOfCompetition: 'Commodity',
        competitorName: 'Janssen, Mylan, Cipla, Dr. Reddy',
        marketAccessStrategy: 'Partnership / Direct',
        projectedMarketShare: '20%',
        projectedNpv: '$3.4M',
        commercialAttractiveness: 'High',
        priorityOfProject: 'P1 - High',
        timelineForCompletionOfProject: '24 Months',
        projectInitiatedOn: '2025-01-15',
        productStatus: 'Dossier Ready / Submission Phase',
        preEbActivitiesCompletedOn: '2026-02-10',
        tentativeBatchSize: '100,000 Units',
        tentativeEbBatchPlan: 'Completed',
        projectCompletedDate: '2027-06-30',
        expectedMaCost: '$140,000',
        drugAuthorityName: 'USFDA / EMA / TGA',
        remarks: 'CTD Dossier compiled; final regulatory filing readiness review',
        lastUpdated: '10-Feb-2026',
        updatedBy: 'Priya Sharma'
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
