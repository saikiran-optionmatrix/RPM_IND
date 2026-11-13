import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface WbsActivityHistoryRecord {
  id?: number | string;
  slNo: string;
  activity: string;
  activityCode: string;
  tasks: string;
  requirements: string;
  predecessor: string;
  duration: string;
  effort: string;
  cost: string;
  applicability: string;
  description: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-stages-wbs-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './stages-wbs-history.component.html',
  styleUrl: './stages-wbs-history.component.scss',
})
export class StagesWbsHistoryComponent implements OnInit {
  slNo: string = '';
  activityName: string = '';
  activityCode: string = '';
  tasks: string = '';
  requirements: string = '';
  predecessor: string = '';
  duration: string = '';
  effort: string = '';
  cost: string = '';
  applicability: string = '';
  description: string = '';

  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: WbsActivityHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['slNo']) this.slNo = params['slNo'];
      if (params['task']) this.activityName = params['task'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['tasks']) this.tasks = params['tasks'];
      if (params['requirements']) this.requirements = params['requirements'];
      if (params['predecessor']) this.predecessor = params['predecessor'];
      if (params['duration']) this.duration = params['duration'];
      if (params['effort']) this.effort = params['effort'];
      if (params['cost']) this.cost = params['cost'];
      if (params['applicability']) this.applicability = params['applicability'];
      if (params['description']) this.description = params['description'];

      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curSlNo = this.slNo || '1.11';
    const curActivity = this.activityName || 'Plant throughput & bottleneck assessment';
    const curCode = this.activityCode || 'IND-111';
    const curTasks = this.tasks || '8';
    const curReqs = this.requirements || '7';
    const curPred = this.predecessor || '—';
    const curDuration = this.duration || '15';
    const curEffort = this.effort || '160';
    const rawCost = this.cost || '8000';
    const curCost = rawCost.startsWith('$') ? rawCost : `$${Number(rawCost).toLocaleString()}`;
    const curApplicability = this.applicability || 'All Programs';
    const curDescription = this.description || 'Assess current shop-floor throughput, bottleneck equipment cycle times, and expansion feasibility.';

    // Historical revisions for the selected activity
    const selectedRevisions: WbsActivityHistoryRecord[] = [
      {
        id: 1,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: curTasks,
        requirements: curReqs,
        predecessor: curPred,
        duration: curDuration,
        effort: curEffort,
        cost: curCost,
        applicability: curApplicability,
        description: curDescription,
        revision: 'Rev 3 (Current)',
        changedDate: '2026-02-15'
      },
      {
        id: 2,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '6',
        requirements: '5',
        predecessor: '—',
        duration: '12',
        effort: '120',
        cost: '$6,500',
        applicability: curApplicability,
        description: 'Adjusted scope to incorporate ISO 9001 and plant safety audit clarifications.',
        revision: 'Rev 2',
        changedDate: '2026-01-20'
      },
      {
        id: 3,
        slNo: curSlNo,
        activity: curActivity,
        activityCode: curCode,
        tasks: '4',
        requirements: '4',
        predecessor: '—',
        duration: '10',
        effort: '96',
        cost: '$5,200',
        applicability: curApplicability,
        description: 'Initial engineering activity draft and workflow baseline.',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    const otherActivities: WbsActivityHistoryRecord[] = [
      {
        id: 4,
        slNo: '1.12',
        activity: 'Existing asset & industrial equipment benchmarking',
        activityCode: 'ACT-112',
        tasks: '4',
        requirements: '6',
        predecessor: '1.11 (SS)',
        duration: '15',
        effort: '140',
        cost: '$6,500',
        applicability: 'All Programs',
        description: 'Benchmark installed CNC, pump, compressor and packaging lines for throughput gaps.',
        revision: 'Rev 2'
      },
      {
        id: 5,
        slNo: '1.22',
        activity: 'Preliminary CapEx, OpEx & ROI modeling',
        activityCode: 'ACT-122',
        tasks: '5',
        requirements: '5',
        predecessor: '1.21 (SS)',
        duration: '10',
        effort: '70',
        cost: '$2,500',
        applicability: 'All Programs',
        description: 'Estimate capital equipment expenditure, installation costs and payback horizon.',
        revision: 'Rev 1'
      },
      {
        id: 6,
        slNo: '2.11',
        activity: 'User Requirements Specification (URS) definition',
        activityCode: 'ACT-211',
        tasks: '7',
        requirements: '8',
        predecessor: '—',
        duration: '20',
        effort: '200',
        cost: '$12,000',
        applicability: 'All Programs',
        description: 'Define cycle-time, OEE, utility, and safety requirements for target equipment.',
        revision: 'Rev 1'
      },
      {
        id: 7,
        slNo: '4.11',
        activity: '3D CAD assembly & structural stress analysis',
        activityCode: 'ACT-411',
        tasks: '9',
        requirements: '7',
        predecessor: '3.2.3 (FS)',
        duration: '40',
        effort: '650',
        cost: '$75,000',
        applicability: 'All Programs',
        description: 'Complete structural FEA, tolerance stack-up and detailed mechanical CAD models.',
        revision: 'Rev 2'
      },
      {
        id: 8,
        slNo: '7.2.2',
        activity: 'Factory Acceptance Test (FAT) & Gate 3 approval',
        activityCode: 'ACT-722',
        tasks: '6',
        requirements: '8',
        predecessor: '7.2.1 (FS)',
        duration: '60',
        effort: '1200',
        cost: '$190,000',
        applicability: 'All Programs',
        description: 'Execute OEM shop-floor FAT trials prior to shipment and site installation.',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherActivities.filter(
      a => a.activity.toLowerCase() !== curActivity.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRecords(): WbsActivityHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/stages/wbs'], {
      queryParams: {
        stageCode: this.stageCode || 'S1',
        stageName: this.stageName || 'Business Need & Opportunity Assessment',
        gateCode: this.gateCode || 'Gate 1'
      }
    });
  }
}
