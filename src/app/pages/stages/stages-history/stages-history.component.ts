import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface StageHistoryRecord {
  id?: number | string;
  stageName: string;
  division: string;
  stageCode: string;
  sequence: string;
  gateCode: string;
  planEffort: number;
  planDuration: number;
  materialBudget: string;
  description: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-stages-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-history.component.html',
  styleUrl: './stages-history.component.scss',
})
export class StagesHistoryComponent implements OnInit {
  stageName: string = '';
  division: string = '';
  stageCode: string = '';
  sequence: string = '';
  gateCode: string = '';
  planEffort: number = 0;
  planDuration: number = 0;
  materialBudget: string = '';
  stageDescription: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: StageHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['division']) this.division = params['division'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['sequence']) this.sequence = params['sequence'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['planEffort'] !== undefined) this.planEffort = Number(params['planEffort']) || 0;
      if (params['planDuration'] !== undefined) this.planDuration = Number(params['planDuration']) || 0;
      if (params['materialBudget']) this.materialBudget = params['materialBudget'];
      if (params['stageDescription']) this.stageDescription = params['stageDescription'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryData();
    });
  }

  initHistoryData(): void {
    const curStageName = this.stageName || 'Business Case';
    const curDivision = this.division || 'Oral Solids - OS';
    const curStageCode = this.stageCode || 'S1';
    const curSeq = this.sequence || '1';
    const curGate = this.gateCode || 'Gate 1';
    const curPlanEffort = this.planEffort || 80;
    const curPlanDuration = this.planDuration || 10;
    const curMaterialBudget = this.materialBudget || '$15,000';
    const curDescription = this.stageDescription || 'Business Case Preparation by PMO Team for respective molecule and country';

    // Historical revisions for the selected stage (matching image fields)
    const selectedRevisions: StageHistoryRecord[] = [
      {
        id: 1,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: curPlanEffort,
        planDuration: curPlanDuration,
        materialBudget: curMaterialBudget,
        description: curDescription,
        revision: 'Rev 3 (Current)',
        changedDate: '2026-02-15'
      },
      {
        id: 2,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: 90,
        planDuration: 12,
        materialBudget: '$18,000',
        description: 'Intermediate stage draft with adjusted duration and material budget allocation.',
        revision: 'Rev 2',
        changedDate: '2026-01-20'
      },
      {
        id: 3,
        stageName: curStageName,
        division: curDivision,
        stageCode: curStageCode,
        sequence: curSeq,
        gateCode: curGate,
        planEffort: 100,
        planDuration: 15,
        materialBudget: '$20,000',
        description: 'Initial stage baseline created for molecule feasibility study.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other stages history catalog (fields from the image)
    const otherStages: StageHistoryRecord[] = [
      {
        id: 4,
        stageName: 'Product / Project In Initiation',
        division: 'Oral Solids - OS, Injectables - IJ',
        stageCode: 'S2',
        sequence: '2.0',
        gateCode: '-',
        planEffort: 60,
        planDuration: 10,
        materialBudget: '$25,000',
        description: 'Product / Project In Initiation - Kick-off & Charter Finalization',
        revision: 'Rev 2'
      },
      {
        id: 5,
        stageName: 'Procurement of API, RM & Packaging materials - For Developmental studies.',
        division: 'Oral Solids - OS',
        stageCode: 'S3',
        sequence: '3.0',
        gateCode: '-',
        planEffort: 120,
        planDuration: 60,
        materialBudget: '$80,000',
        description: 'Procurement of API, RM & Packaging materials - For Developmental studies.',
        revision: 'Rev 1'
      },
      {
        id: 6,
        stageName: 'Formulation Development Phase 1: POC completion',
        division: 'Oral Solids - OS, Complex Injectables - CI',
        stageCode: 'S4',
        sequence: '4.0',
        gateCode: 'Gate 2',
        planEffort: 160,
        planDuration: 190,
        materialBudget: '$120,000',
        description: 'Formulation Development Phase 1: POC completion',
        revision: 'Rev 1'
      },
      {
        id: 7,
        stageName: 'Procurement of API, Raw materials & Packaging materials - For Ebs',
        division: 'Oral Solids - OS',
        stageCode: 'S5',
        sequence: '5.0',
        gateCode: '-',
        planEffort: 100,
        planDuration: 60,
        materialBudget: '$95,000',
        description: 'Procurement of API, Raw materials & Packaging materials - For Ebs',
        revision: 'Rev 1'
      },
      {
        id: 8,
        stageName: 'Formulation Development Phase 2: Pilot Bio',
        division: 'Oral Solids - OS, Biotech - BT',
        stageCode: 'S6',
        sequence: '6.0',
        gateCode: 'Gate 3',
        planEffort: 180,
        planDuration: 60,
        materialBudget: '$110,000',
        description: 'Formulation Development Phase 2: Pilot Bio',
        revision: 'Rev 1'
      },
      {
        id: 9,
        stageName: 'API Method Validation / verification',
        division: 'Oral Solids - OS',
        stageCode: 'S7',
        sequence: '7.0',
        gateCode: '-',
        planEffort: 90,
        planDuration: 30,
        materialBudget: '$45,000',
        description: 'API Method Validation / verification',
        revision: 'Rev 1'
      },
      {
        id: 10,
        stageName: 'FP method validation, FP specifications & STP',
        division: 'Oral Solids - OS, Injectables - IJ, Biotech - BT',
        stageCode: 'S8',
        sequence: '8.0',
        gateCode: '-',
        planEffort: 140,
        planDuration: 60,
        materialBudget: '$60,000',
        description: 'FP method validation, FP specifications & STP',
        revision: 'Rev 1'
      },
      {
        id: 11,
        stageName: 'TTD Submission',
        division: 'Oral Solids - OS',
        stageCode: 'S9',
        sequence: '9.0',
        gateCode: '-',
        planEffort: 100,
        planDuration: 10,
        materialBudget: '$30,000',
        description: 'TTD Submission',
        revision: 'Rev 1'
      },
      {
        id: 12,
        stageName: 'Exhibit / Submission Batches execution',
        division: 'Oral Solids - OS, Complex Injectables - CI',
        stageCode: 'S10',
        sequence: '10.0',
        gateCode: 'Gate 4',
        planEffort: 200,
        planDuration: 190,
        materialBudget: '$180,000',
        description: 'Exhibit / Submission Batches execution',
        revision: 'Rev 1'
      },
      {
        id: 13,
        stageName: 'Pivotal BE studies',
        division: 'Oral Solids - OS',
        stageCode: 'S11',
        sequence: '11.0',
        gateCode: '-',
        planEffort: 150,
        planDuration: 92,
        materialBudget: '$140,000',
        description: 'Pivotal BE studies',
        revision: 'Rev 1'
      },
      {
        id: 14,
        stageName: 'Dossier preparation and filing',
        division: 'Oral Solids - OS, Biotech - BT',
        stageCode: 'S12',
        sequence: '12.0',
        gateCode: 'Gate 5',
        planEffort: 160,
        planDuration: 100,
        materialBudget: '$50,000',
        description: 'Dossier preparation and filing',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherStages.filter(
      s => s.stageCode.toLowerCase() !== curStageCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRecords(): StageHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/stages']);
  }
}
