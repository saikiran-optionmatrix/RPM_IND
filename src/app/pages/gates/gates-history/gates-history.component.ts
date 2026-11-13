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
    const curName = this.gateName || 'Business Case Approval';
    const curStage = this.stageCode || 'S1, S2';
    const curDiv = this.division || 'Industrial Machinery - MA';
    const curDesc = this.description || 'Formal gate review to evaluate plant capacity need, benchmark OEM landscape, CapEx/ROI financials, safety & statutory compliance pathway, and executive program charter authorization.';
    const curWorkflow = this.workflow || '5/5';
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
      'Ananya Rao',
      'Rajesh Kumar',
      'Anita Desai',
      'Priya Reddy',
      'Suresh Naidu'
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
        name: 'Business Case Approval',
        division: 'Industrial Machinery - MA',
        description: 'Formal gate review to evaluate plant capacity need, benchmark OEM landscape, CapEx/ROI financials, safety & statutory compliance pathway, and executive program charter authorization.',
        stageCode: 'S1, S2',
        workflow: '5/5',
        count: 7,
        changedDate: '2026-02-15 14:30',
        changedBy: 'Ananya Rao'
      },
      {
        id: 102,
        status: true,
        gateCode: 'Gate 2',
        name: 'Concept Selection & Design Freeze',
        division: 'Equipment Engineering - CT, Industrial Machinery - MA',
        description: 'Formal decision gate to review finalized equipment architecture, 3D CAD/FEA models, PLC/SCADA control architecture, DFMA assessment, and lock engineering baseline before procurement.',
        stageCode: 'S3, S4, S5',
        workflow: '3/5',
        count: 6,
        changedDate: '2026-01-18 10:20',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 103,
        status: true,
        gateCode: 'Gate 3',
        name: 'Procurement & Build Readiness',
        division: 'Industrial Machinery - MA, Process Equipment - GT',
        description: 'Formal decision gate to verify long-lead vendor POs, prototype fabrication validation, Factory Acceptance Test (FAT) protocols, metrology capability, and site installation readiness.',
        stageCode: 'S6, S7, S8',
        workflow: '4/5',
        count: 6,
        changedDate: '2025-12-14 16:00',
        changedBy: 'Anita Desai'
      },
      {
        id: 104,
        status: true,
        gateCode: 'Gate 4',
        name: 'Commissioning & Performance Acceptance',
        division: 'Equipment Engineering - CT, Process Equipment - GT, Production Systems - VX',
        description: 'Formal decision gate to confirm mechanical installation, utility tie-ins, IQ/OQ verification, Site Acceptance Test (SAT) completion, safety interlock certification, and Cpk capability.',
        stageCode: 'S9, S10',
        workflow: '2/5',
        count: 6,
        changedDate: '2025-11-20 11:35',
        changedBy: 'Priya Reddy'
      },
      {
        id: 105,
        status: true,
        gateCode: 'Gate 5',
        name: 'Operational Handover Approval',
        division: 'Industrial Machinery - MA, Process Equipment - GT, Production Systems - VX',
        description: 'Final executive gate authorizing commercial production release upon sustained OEE qualification, as-built technical transfer dossier (TTD) sign-off, CMMS preventive maintenance setup, and operator certification.',
        stageCode: 'S11, S12',
        workflow: '5/5',
        count: 5,
        changedDate: '2025-10-08 15:40',
        changedBy: 'Suresh Naidu'
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
