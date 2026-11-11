import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ScrumHistoryItem {
  id: number;
  activity: string;
  activityCode: string;
  jobCode: string;
  effort: number;
  duration: number;
  stage: string;
  description: string;
  // Timeline details
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  expenses?: number;
  actualDuration?: string;
  actualEffort?: string;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-scrum-hitory',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-scrum-hitory.component.html',
  styleUrl: './project-scrum-hitory.component.scss',
})
export class ProjectScrumHitoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';
  effort: number = 35;
  duration: number = 12;
  stage: string = 'Development';
  description: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ScrumHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: ScrumHistoryItem | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['taskName']) this.taskName = params['taskName'];
      if (params['taskCode']) this.taskCode = params['taskCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];
      if (params['effort']) this.effort = Number(params['effort']) || 35;
      if (params['duration']) this.duration = Number(params['duration']) || 12;
      if (params['stage']) this.stage = params['stage'];
      if (params['description']) this.description = params['description'];

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const act = this.taskName || 'API Dissolution profile & solubility assay';
    const actCode = this.taskCode || 'TSK-01';
    const jCode = this.jobCode || 'JB-101';
    const eff = this.effort || 35;
    const dur = this.duration || 12;
    const stg = this.stage || 'Development';
    const desc = this.description || 'Final method optimization and automated sampling validation across multi-media pH levels.';

    this.historyRecords = [
      {
        id: 1,
        activity: act,
        activityCode: actCode,
        jobCode: jCode,
        effort: eff,
        duration: dur,
        stage: stg,
        description: desc,
        planStart: '2026-01-10',
        planEnd: '2026-01-22',
        actualStart: '2026-01-10',
        actualEnd: '',
        eta: '2026-01-22',
        expenses: 2500,
        actualDuration: '10 days',
        actualEffort: '30 hrs',
        updatedDate: '2026-01-20',
        updatedBy: 'Alex Rivera'
      },
      {
        id: 2,
        activity: act,
        activityCode: actCode,
        jobCode: jCode,
        effort: Math.max(10, eff - 5),
        duration: Math.max(5, dur - 2),
        stage: stg,
        description: 'Adjusted buffer and sink condition parameters based on preliminary trial results.',
        planStart: '2026-01-10',
        planEnd: '2026-01-20',
        actualStart: '2026-01-10',
        actualEnd: '',
        eta: '2026-01-20',
        expenses: 2000,
        actualDuration: '8 days',
        actualEffort: '24 hrs',
        updatedDate: '2026-01-16',
        updatedBy: 'Michael Chang'
      },
      {
        id: 3,
        activity: act,
        activityCode: actCode,
        jobCode: jCode,
        effort: Math.max(8, eff - 10),
        duration: Math.max(4, dur - 4),
        stage: stg,
        description: 'Extended run duration following initial HPLC column qualification testing.',
        planStart: '2026-01-10',
        planEnd: '2026-01-18',
        actualStart: '2026-01-10',
        actualEnd: '',
        eta: '2026-01-18',
        expenses: 1600,
        actualDuration: '5 days',
        actualEffort: '18 hrs',
        updatedDate: '2026-01-12',
        updatedBy: 'Dr. Sarah Jenkins'
      },
      {
        id: 4,
        activity: act,
        activityCode: actCode,
        jobCode: jCode,
        effort: Math.max(5, eff - 15),
        duration: Math.max(3, dur - 6),
        stage: stg,
        description: 'Initial baseline backlog creation for dissolution assay workflow.',
        planStart: '2026-01-10',
        planEnd: '2026-01-16',
        actualStart: '2026-01-10',
        actualEnd: '2026-01-16',
        eta: '2026-01-16',
        expenses: 1200,
        actualDuration: '6 days',
        actualEffort: '20 hrs',
        updatedDate: '2026-01-10',
        updatedBy: 'Dr. Sarah Jenkins'
      }
    ];
  }

  getStageClasses(stage: string): string[] {
    const s = (stage || '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    return ['stage-badge', `stage-badge--${s}`];
  }

  get paginatedRecords(): ScrumHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: ScrumHistoryItem): void {
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
    this.router.navigate(['/projects/dashboard/backlog'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
