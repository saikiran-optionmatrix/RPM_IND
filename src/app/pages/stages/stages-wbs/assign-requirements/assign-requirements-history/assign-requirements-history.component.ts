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
    const curReqName = this.requirementName || 'API Solubility, Solid-State Form, and Stability Requirements';
    const count = this.historyCount || 3;

    const baseDates = [
      '2024-05-18 14:30',
      '2024-05-02 11:15',
      '2024-04-19 09:45',
      '2024-04-05 16:20',
      '2024-03-22 10:10',
      '2024-03-10 13:00'
    ];

    const users = [
      'Dr. Robert Vance',
      'Sarah Jenkins',
      'Michael Chang',
      'Emily Watson',
      'David Miller'
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
        requirementName: 'Critical Quality Attribute Risk Assessment and Control Strategy Requirements',
        revision: 'Rev 2',
        changedDate: '2026-05-19 16:40',
        changedBy: 'Dr. Sarah Jenkins'
      },
      {
        id: 102,
        requirementName: 'Critical Quality Attribute Risk Assessment Baseline Specification - Initial Study',
        revision: 'Rev 1',
        changedDate: '2026-05-01 10:30',
        changedBy: 'Dr. Sarah Jenkins'
      },
      {
        id: 103,
        requirementName: 'Dosage Form Dissolution Profile and Drug Release Acceptance Criteria',
        revision: 'Rev 3',
        changedDate: '2026-05-15 09:20',
        changedBy: 'Michael Chang'
      },
      {
        id: 104,
        requirementName: 'Reference Product Selection and Characterization Requirements',
        revision: 'Rev 2',
        changedDate: '2026-05-10 11:45',
        changedBy: 'Vikram Sharma'
      },
      {
        id: 105,
        requirementName: 'Pharmaceutical Excipient Grade, Compendial Compliance, and CoA Requirements',
        revision: 'Rev 1',
        changedDate: '2026-05-05 14:15',
        changedBy: 'Emily Watson'
      },
      {
        id: 106,
        requirementName: 'Primary and Secondary Packaging Material Compatibility and Barrier Requirements',
        revision: 'Rev 2',
        changedDate: '2026-05-12 13:00',
        changedBy: 'David Miller'
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
          stageName: this.stageName || 'Business Case',
          gateCode: this.gateCode || 'Gate 1'
        }
      });
    } else {
      this.location.back();
    }
  }
}
