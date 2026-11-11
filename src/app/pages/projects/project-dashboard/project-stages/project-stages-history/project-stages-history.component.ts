import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface StageHistoryItem {
  status: boolean;
  done: boolean;
  wbs: number;
  stageCode: string;
  stageName: string;
  planEffort: string;
  planDuration: string;
  buffer: string;
  gateName: string;
  // Timeline pop data
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualDuration?: string;
  actualEffort?: string;
}

@Component({
  selector: 'app-project-stages-history',
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
  templateUrl: './project-stages-history.component.html',
  styleUrl: './project-stages-history.component.scss',
})
export class ProjectStagesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  stageName: string = 'Stage';
  stageCode: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: StageHistoryItem[] = [];

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
      if (params['stageName']) {
        this.stageName = params['stageName'];
      }
      if (params['stageCode']) {
        this.stageCode = params['stageCode'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const code = this.stageCode || 'S1';
    const name = this.stageName || 'Project Kickoff & Feasibility Study';

    this.historyRecords = [
      {
        status: true,
        done: true,
        wbs: 12,
        stageCode: code,
        stageName: name,
        planEffort: '120 hrs',
        planDuration: '45 days',
        buffer: '5 days',
        gateName: 'Gate 1',
        planStart: '2026-01-05',
        planEnd: '2026-02-19',
        actualStart: '2026-01-05',
        actualEnd: '2026-02-18',
        eta: '2026-02-19',
        actualDuration: '44 days',
        actualEffort: '118 hrs'
      },
      {
        status: true,
        done: true,
        wbs: 8,
        stageCode: code,
        stageName: name,
        planEffort: '140 hrs',
        planDuration: '50 days',
        buffer: '4 days',
        gateName: 'Gate 1',
        planStart: '2026-01-05',
        planEnd: '2026-02-24',
        actualStart: '2026-01-05',
        actualEnd: '2026-02-22',
        eta: '2026-02-24',
        actualDuration: '48 days',
        actualEffort: '135 hrs'
      },
      {
        status: true,
        done: false,
        wbs: 15,
        stageCode: code,
        stageName: name,
        planEffort: '160 hrs',
        planDuration: '60 days',
        buffer: '6 days',
        gateName: 'Gate 2',
        planStart: '2026-02-25',
        planEnd: '2026-04-26',
        actualStart: '2026-02-26',
        actualEnd: '',
        eta: '2026-04-26',
        actualDuration: '35 days',
        actualEffort: '95 hrs'
      },
      {
        status: true,
        done: false,
        wbs: 20,
        stageCode: code,
        stageName: name,
        planEffort: '180 hrs',
        planDuration: '75 days',
        buffer: '5 days',
        gateName: 'Gate 2',
        planStart: '2026-02-25',
        planEnd: '2026-05-11',
        actualStart: '2026-02-26',
        actualEnd: '',
        eta: '2026-05-11',
        actualDuration: '40 days',
        actualEffort: '110 hrs'
      }
    ];
  }

  get paginatedRecords(): StageHistoryItem[] {
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
    this.router.navigate(['/projects/dashboard/stages'], {
      queryParamsHandling: 'merge'
    });
  }
}
