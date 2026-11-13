import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { INDUSTRIAL_STAGES_MASTER } from '../industrial-stages.data';

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
    const curStageName = this.stageName || 'Business Need & Opportunity Assessment';
    const curDivision = this.division || 'Equipment Engineering - CT';
    const curStageCode = this.stageCode || 'S1';
    const curSeq = this.sequence || '1';
    const curGate = this.gateCode || 'Gate 1';
    const curPlanEffort = this.planEffort || 600;
    const curPlanDuration = this.planDuration || 60;
    const curMaterialBudget = this.materialBudget || '$25,000';
    const curDescription = this.stageDescription || 'Assess plant capacity bottlenecks, existing industrial equipment benchmarks, and preliminary CapEx business opportunity.';

    // Historical revisions for the selected stage
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
        planEffort: 540,
        planDuration: 55,
        materialBudget: '$22,000',
        description: 'Intermediate stage draft with adjusted engineering effort and CapEx budget allocation.',
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
        planEffort: 480,
        planDuration: 45,
        materialBudget: '$20,000',
        description: 'Initial stage baseline created for industrial equipment feasibility study.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    const otherStages: StageHistoryRecord[] = INDUSTRIAL_STAGES_MASTER.map((s, idx) => ({
      id: idx + 4,
      stageName: s.stageName,
      division: s.division || 'Equipment Engineering - CT',
      stageCode: s.stageCode,
      sequence: s.sequence || `${idx + 1}.0`,
      gateCode: s.gateCode,
      planEffort: s.planEffort,
      planDuration: s.planDuration,
      materialBudget: s.materialBudget || '$0',
      description: s.stageDescription,
      revision: idx === 0 ? 'Rev 2' : 'Rev 1'
    }));

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
