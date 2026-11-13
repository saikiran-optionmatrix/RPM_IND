import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateCriteriaHistoryRecord {
  id?: number | string;
  subject: string;
  description: string;
  guidelines?: string;
  priority: string | boolean;
  mandatory: boolean;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gate-criteria-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './gate-criteria-history.component.html',
  styleUrl: './gate-criteria-history.component.scss',
})
export class GateCriteriaHistoryComponent implements OnInit {
  subject: string = '';
  description: string = '';
  priority: string | boolean = 'High';
  mandatory: boolean = true;
  gateContext: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateCriteriaHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['subject']) this.subject = params['subject'];
      if (params['description']) this.description = params['description'];
      if (params['priority'] !== undefined) {
        this.priority = params['priority'];
      }
      if (params['mandatory'] !== undefined) {
        this.mandatory = params['mandatory'] === 'true' || params['mandatory'] === true;
      }
      if (params['context']) this.gateContext = params['context'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  isPriority(val: any): boolean {
    return val === 'High' || val === true || val === 'true';
  }

  initHistoryRecords(): void {
    const curSubject = this.subject || 'Plant Capacity & Operational Need Assessment';
    const curDesc = this.description || 'Plant throughput gaps, OEE bottlenecks, takt-time targets, and capacity demand forecast verified by Manufacturing Operations.';
    const curPriority = this.priority !== undefined ? this.priority : 'High';
    const curMandatory = this.mandatory !== undefined ? this.mandatory : true;
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-02-15 14:30',
      '2026-01-20 11:15',
      '2025-12-10 09:45',
      '2025-11-05 16:20',
      '2025-10-12 10:10'
    ];

    const users = [
      'Ananya Rao',
      'Rajesh Kumar',
      'Anita Desai',
      'Priya Reddy',
      'Suresh Naidu'
    ];

    const descVariations = [
      curDesc,
      `${curDesc} - Revised Guidelines & Compliance Scope`,
      `${curDesc} - Preliminary Specification Scope`,
      `${curDesc} - Baseline Assessment Outline`
    ];

    const selectedRevisions: GateCriteriaHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        subject: curSubject,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        guidelines: 'Guidelines.pdf',
        priority: i === 0 ? curPriority : (i % 2 === 0 ? 'High' : 'Medium'),
        mandatory: i === 0 ? curMandatory : (i % 2 === 0 ? true : false),
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gate criteria for complete reference
    const catalogCriteria: GateCriteriaHistoryRecord[] = [
      {
        id: 101,
        subject: 'User Requirements Specification (URS) Baseline Sign-off',
        description: 'Equipment envelope, rated throughput, cycle time, utility loads, and dimensional tolerances documented in baseline URS.',
        guidelines: 'URS_Specification.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2026-01-18 10:20',
        changedBy: 'Ananya Rao'
      },
      {
        id: 102,
        subject: 'Preliminary Business Case & CapEx ROI Model',
        description: 'Capital outlay budget, equipment depreciation, operating cost savings, and payback threshold validated by finance.',
        guidelines: 'CapEx_ROI_Model.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2026-01-10 14:15',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 103,
        subject: 'Patents & Freedom-to-Operate (FTO) Clearance',
        description: 'Formal IP landscape search and freedom-to-operate legal opinion documented for tooling, fixtures, and proprietary controls.',
        guidelines: 'FTO_Clearance.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2025-12-14 16:00',
        changedBy: 'Anita Desai'
      },
      {
        id: 104,
        subject: 'OEM & Tier-1 Vendor Qualification Feasibility',
        description: 'At least two qualified OEM equipment and drive/controller vendors shortlisted with lead-time and service SLA verification.',
        guidelines: 'Vendor_Qualification.pdf',
        priority: 'Medium',
        mandatory: false,
        changedDate: '2025-11-20 11:35',
        changedBy: 'Priya Reddy'
      },
      {
        id: 105,
        subject: 'Safety, CE / ISO 13849 & Statutory Compliance Roadmap',
        description: 'Applicable machinery directives (CE, UL 508A, BIS, ISO 12100) and environmental permit obligations mapped across plant sites.',
        guidelines: 'Safety_Compliance_Roadmap.pdf',
        priority: 'High',
        mandatory: true,
        changedDate: '2025-11-08 09:50',
        changedBy: 'Suresh Naidu'
      },
      {
        id: 106,
        subject: 'Portfolio Steering Committee Gate 1 Authorization',
        description: 'Executive capital committee charter sign-off approving progression into detailed engineering and vendor RFQs.',
        guidelines: 'Gate_Release_Signoff.pdf',
        priority: 'Medium',
        mandatory: false,
        changedDate: '2025-10-25 15:40',
        changedBy: 'Amit Patel'
      }
    ];

    const filteredCatalog = catalogCriteria.filter(
      c => c.subject.toLowerCase() !== curSubject.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateCriteriaHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onDownloadGuidelines(item: GateCriteriaHistoryRecord): void {
    console.log('Downloading guidelines for:', item.subject);
  }

  goBack(): void {
    if (this.gateContext) {
      this.router.navigate(['/gates', this.gateContext]);
    } else {
      this.location.back();
    }
  }
}
