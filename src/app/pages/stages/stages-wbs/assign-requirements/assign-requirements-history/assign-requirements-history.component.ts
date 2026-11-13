import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface AssignRequirementHistoryItem {
  id?: number | string;
  requirementName: string;
  revision?: string;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-assign-requirements-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-requirements-history.component.html',
  styleUrl: './assign-requirements-history.component.scss',
})
export class AssignRequirementsHistoryComponent implements OnInit {
  requirementName: string = '';

  activityName: string = '';
  activityCode: string = '';
  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignRequirementHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['requirementName']) this.requirementName = params['requirementName'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curReqName = this.requirementName || 'Mechanical Load, Dimensional Tolerance, and Vibration Limits Specification';
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-05-18 14:30',
      '2026-05-02 11:15',
      '2026-04-19 09:45',
      '2026-04-05 16:20',
      '2026-03-22 10:10',
      '2026-03-10 13:00'
    ];

    const users = [
      'Rajesh Kumar',
      'Ananya Rao',
      'Anita Desai',
      'Priya Reddy',
      'Amit Patel'
    ];

    const reqNameVariations = [
      curReqName,
      `${curReqName} - Initial Engineering Scope`,
      `${curReqName} - Preliminary Specification Scope`,
      `${curReqName} - Feasibility Assessment Criteria`,
      `${curReqName} - Baseline Draft Guidelines`
    ];

    const selectedRevisions: AssignRequirementHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const revNum = count - i;
      selectedRevisions.push({
        id: i + 1,
        requirementName: i === 0 ? curReqName : reqNameVariations[i % reqNameVariations.length],
        revision: `Rev ${revNum}`,
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog requirements for history view
    const otherReqsCatalog: AssignRequirementHistoryItem[] = [
      {
        id: 101,
        requirementName: 'Design FMEA Risk Assessment and Critical Component Control Strategy',
        revision: 'Rev 2',
        changedDate: '2026-05-19 16:40',
        changedBy: 'Ananya Rao'
      },
      {
        id: 102,
        requirementName: 'PLC / SCADA Control Logic and Safety Interlock Compliance (ISO 13849)',
        revision: 'Rev 1',
        changedDate: '2026-05-01 10:30',
        changedBy: 'Ananya Rao'
      },
      {
        id: 103,
        requirementName: 'OEM Benchmark Equipment Throughput and OEE Target Verification',
        revision: 'Rev 3',
        changedDate: '2026-05-15 09:20',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 104,
        requirementName: 'Critical Component Grade, Material Test Certificate (MTC), and CoC Requirements',
        revision: 'Rev 2',
        changedDate: '2026-05-10 11:45',
        changedBy: 'Anita Desai'
      },
      {
        id: 105,
        requirementName: 'Machine Enclosure, Acoustic Shielding, and Guarding Integrity Requirements',
        revision: 'Rev 1',
        changedDate: '2026-05-05 14:15',
        changedBy: 'Priya Reddy'
      },
      {
        id: 106,
        requirementName: 'Site Acceptance Test (SAT) and 72-Hour Continuous Endurance Criteria',
        revision: 'Rev 2',
        changedDate: '2026-05-12 13:00',
        changedBy: 'Amit Patel'
      }
    ];

    const filteredCatalog = otherReqsCatalog.filter(
      r => r.requirementName.toLowerCase() !== curReqName.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): AssignRequirementHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    if (this.stageCode || this.stageName) {
      this.router.navigate(['/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Need & Opportunity Assessment',
          gateCode: this.gateCode || 'Gate 1'
        }
      });
    } else {
      this.location.back();
    }
  }
}
