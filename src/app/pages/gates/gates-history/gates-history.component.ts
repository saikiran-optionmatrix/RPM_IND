import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateHistoryRecord {
  id?: number | string;
  status: boolean;
  gateCode: string;
  name: string;
  division: string;
  description: string;
  stageCode: string;
  workflow: string;
  count: number;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-gates-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './gates-history.component.html',
  styleUrl: './gates-history.component.scss',
})
export class GatesHistoryComponent implements OnInit {
  gateCode: string = '';
  gateName: string = '';
  stageCode: string = '';
  division: string = '';
  description: string = '';
  workflow: string = '';
  count: number = 0;
  status: boolean = true;
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: GateHistoryRecord[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['division']) this.division = params['division'];
      if (params['description']) this.description = params['description'];
      if (params['workflow']) this.workflow = params['workflow'];
      if (params['count']) this.count = Number(params['count']) || 0;
      if (params['status'] !== undefined) this.status = params['status'] === 'true' || params['status'] === true;
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curCode = this.gateCode || 'Gate 1';
    const curName = this.gateName || 'Opportunity and portfolio approval';
    const curStage = this.stageCode || 'S1';
    const curDiv = this.division || 'Oral Solids - OS';
    const curDesc = this.description || 'Formal gate review to evaluate therapeutic and market opportunity assessment, target product profile, freedom-to-operate clearance, business case and preliminary risk screening.';
    const curWorkflow = this.workflow || '3/5';
    const curCount = this.count || 7;
    const curStatus = this.status !== undefined ? this.status : true;
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-02-15 14:30',
      '2026-01-20 11:15',
      '2025-12-10 09:45',
      '2025-11-05 16:20',
      '2025-10-12 10:10'
    ];

    const users = [
      'Dr. Robert Vance',
      'Sarah Jenkins',
      'Michael Chang',
      'Emily Watson',
      'David Miller'
    ];

    const descVariations = [
      curDesc,
      `${curDesc} - Revised Checklist & Workflow Scope`,
      `${curDesc} - Initial Specification Baseline`,
      `${curDesc} - Concept Review Draft`
    ];

    const workflowVariations = [
      curWorkflow,
      '2/5',
      '3/5',
      '1/5',
      '4/5'
    ];

    const countVariations = [
      curCount,
      Math.max(1, curCount - 1),
      Math.max(1, curCount - 2),
      Math.max(1, curCount + 1)
    ];

    const selectedRevisions: GateHistoryRecord[] = [];

    for (let i = 0; i < count; i++) {
      selectedRevisions.push({
        id: i + 1,
        status: i === 0 ? curStatus : true,
        gateCode: curCode,
        name: curName,
        division: curDiv,
        description: i === 0 ? curDesc : descVariations[i % descVariations.length],
        stageCode: curStage,
        workflow: i === 0 ? curWorkflow : workflowVariations[i % workflowVariations.length],
        count: i === 0 ? curCount : countVariations[i % countVariations.length],
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    // Catalog gates for rich history reference
    const catalogGates: GateHistoryRecord[] = [
      {
        id: 101,
        status: true,
        gateCode: 'Gate 1',
        name: 'Opportunity and portfolio approval',
        division: 'Oral Solids - OS',
        description: 'Formal gate review to evaluate therapeutic and market opportunity assessment, target product profile, freedom-to-operate clearance, business case and preliminary risk screening, approving the opportunity into formal program definition.',
        stageCode: 'S1',
        workflow: '3/5',
        count: 7,
        changedDate: '2026-02-15 14:30',
        changedBy: 'Dr. Sarah Jenkins'
      },
      {
        id: 102,
        status: true,
        gateCode: 'Gate 2',
        name: 'Product definition and project charter approval',
        division: 'Oral Solids - OS, Injectables - IJ',
        description: 'Formal decision gate to review finalized target product profile, reference listed drug characterization, regulatory submission pathway, IP strategy, cross-functional program charter, and funding commitment before starting formulation development.',
        stageCode: 'S2',
        workflow: '2/5',
        count: 6,
        changedDate: '2026-01-18 10:20',
        changedBy: 'Dr. Robert Vance'
      },
      {
        id: 103,
        status: false,
        gateCode: 'Gate 3',
        name: 'Formulation concept and sourcing strategy approval',
        division: 'Oral Solids - OS, Biotech - BT',
        description: 'Formal decision gate to evaluate pre-formulation findings, prototype formulation selection, API and critical excipient sourcing readiness, primary packaging selection, and project schedule before committing capital to full formulation and process development.',
        stageCode: 'S3',
        workflow: '4/5',
        count: 6,
        changedDate: '2025-12-14 16:00',
        changedBy: 'Michael Chang'
      },
      {
        id: 104,
        status: false,
        gateCode: 'Gate 4',
        name: 'Formulation and process development approval',
        division: 'Oral Solids - OS',
        description: 'Formal decision gate to review formulation optimization, DoE stability data, manufacturing process train readiness, analytical method qualification, and supplier qualification before proceeding with development batch manufacturing.',
        stageCode: 'S4',
        workflow: '3/5',
        count: 6,
        changedDate: '2025-11-20 11:35',
        changedBy: 'Emily Watson'
      },
      {
        id: 105,
        status: false,
        gateCode: 'Gate 5',
        name: 'Facility and manufacturing readiness approval',
        division: 'Oral Solids - OS, Injectables - IJ, Biotech - BT',
        description: 'Formal decision gate to verify equipment and facility qualification, utility readiness, cleaning validation, operator training, and supply chain readiness before initiating registration and process validation batch manufacturing.',
        stageCode: 'S7',
        workflow: '5/5',
        count: 5,
        changedDate: '2025-10-08 15:40',
        changedBy: 'David Miller'
      },
      {
        id: 106,
        status: false,
        gateCode: 'Gate 6',
        name: 'Validation and regulatory submission readiness',
        division: 'Oral Solids - OS, Injectables - IJ',
        description: 'Formal decision gate to evaluate registration and process validation batch outcomes, stability data, dossier readiness, and bioequivalence / clinical study reports before authorizing filing with regulatory agencies.',
        stageCode: 'S9',
        workflow: '2/5',
        count: 5,
        changedDate: '2025-09-15 13:10',
        changedBy: 'Vikram Sharma'
      },
      {
        id: 107,
        status: false,
        gateCode: 'Gate 7',
        name: 'Commercial launch authorization',
        division: 'Oral Solids - OS',
        description: 'Final formal gate to review market authorization approvals, manufacturing site inspection clearances, commercial supply chain readiness, distribution channel stocking, and pharmacovigilance setup before authorizing commercial distribution and sale.',
        stageCode: 'S11',
        workflow: '4/5',
        count: 5,
        changedDate: '2025-08-01 09:00',
        changedBy: 'Anita Desai'
      }
    ];

    const filteredCatalog = catalogGates.filter(
      g => g.gateCode.toLowerCase() !== curCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): GateHistoryRecord[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/gates']);
  }
}
