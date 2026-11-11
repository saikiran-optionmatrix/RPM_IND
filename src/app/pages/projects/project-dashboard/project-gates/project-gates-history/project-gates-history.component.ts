import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateHistoryItem {
  gateCode: string;
  gateName: string;
  decision: 'Go' | 'Kill' | 'Hold' | 'Rework' | 'Redirect' | '';
  redirectToStage?: string;
  updatedDate: string;
  remarks: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualDuration?: string;
  planDuration?: string;
  actualEffort?: string;
  planEffort?: string;
}

@Component({
  selector: 'app-project-gates-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-gates-history.component.html',
  styleUrl: './project-gates-history.component.scss',
})
export class ProjectGatesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  gateName: string = 'Gate';
  gateCode: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: GateHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      if (params['gateName']) {
        this.gateName = params['gateName'];
      }
      if (params['gateCode']) {
        this.gateCode = params['gateCode'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const code = this.gateCode || 'Gate 1';
    const name = this.gateName || 'Gate 1 - Feasibility & Concept Approval';

    this.historyRecords = [
      {
        gateCode: code,
        gateName: name,
        decision: 'Go',
        redirectToStage: '',
        updatedDate: '2026-02-15',
        remarks: 'All concept criteria verified and signed off for advancement',
        planStart: '2026-01-15',
        planEnd: '2026-02-15',
        actualStart: '2026-01-15',
        actualEnd: '2026-02-14',
        eta: '2026-02-15',
        actualDuration: '30 days',
        planDuration: '31 days',
        actualEffort: '120 hrs',
        planEffort: '120 hrs'
      },
      {
        gateCode: code,
        gateName: name,
        decision: 'Rework',
        redirectToStage: '',
        updatedDate: '2026-02-10',
        remarks: 'Regulatory documentation required supplementary stability data',
        planStart: '2026-01-15',
        planEnd: '2026-02-15',
        actualStart: '2026-01-15',
        actualEnd: '',
        eta: '2026-02-18',
        actualDuration: '26 days',
        planDuration: '31 days',
        actualEffort: '105 hrs',
        planEffort: '120 hrs'
      },
      {
        gateCode: code,
        gateName: name,
        decision: 'Redirect',
        redirectToStage: 'Stage 1: Concept & Initiation',
        updatedDate: '2026-02-05',
        remarks: 'Redirected to Stage 1 for additional analytical testing protocol',
        planStart: '2026-01-15',
        planEnd: '2026-02-15',
        actualStart: '2026-01-15',
        actualEnd: '',
        eta: '2026-02-25',
        actualDuration: '21 days',
        planDuration: '31 days',
        actualEffort: '85 hrs',
        planEffort: '120 hrs'
      },
      {
        gateCode: code,
        gateName: name,
        decision: 'Kill',
        redirectToStage: '',
        updatedDate: '2026-01-28',
        remarks: 'Preliminary patent freedom-to-operate review raised flags',
        planStart: '2026-01-15',
        planEnd: '2026-02-15',
        actualStart: '2026-01-15',
        actualEnd: '2026-01-28',
        eta: '2026-01-28',
        actualDuration: '13 days',
        planDuration: '31 days',
        actualEffort: '52 hrs',
        planEffort: '120 hrs'
      }
    ];
  }

  get paginatedRecords(): GateHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: any): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    document.body.style.overflow = 'auto';
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/gates'], {
      queryParamsHandling: 'merge'
    });
  }
}
