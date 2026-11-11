import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface WbsHistoryItem {
  id: number;
  status: boolean;
  activityName: string;
  delayReason: string;
  jobCode: string;
  department: string;
  responsibility: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  // Timeline details
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  actualDuration?: string;
  actualEffort?: string;
  description?: string;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-wbs-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-wbs-history.component.html',
  styleUrl: './project-wbs-history.component.scss',
})
export class ProjectWbsHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  stageName: string = '';
  stageCode: string = '';
  activityName: string = '';
  jobCode: string = '';
  department: string = '';
  responsibility: string = '';
  delayReason: string = '';
  priority: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: WbsHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: WbsHistoryItem | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) this.projectName = params['projectName'];
      if (params['projectCode']) this.projectCode = params['projectCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['activityName']) this.activityName = params['activityName'];
      if (params['jobCode']) this.jobCode = params['jobCode'];
      if (params['department']) this.department = params['department'];
      if (params['responsibility']) this.responsibility = params['responsibility'];
      if (params['delayReason']) this.delayReason = params['delayReason'];
      if (params['priority']) this.priority = params['priority'];

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const actName = this.activityName || 'Analytical costing, External CRO costing';
    const jCode = this.jobCode || 'ACT1';
    const dept = this.department || 'Management';
    const resp = this.responsibility || 'Olivia Brown';
    const dReason = this.delayReason || 'Raw Material Shortage';
    const prio = (this.priority as 'High' | 'Medium' | 'Low') || 'High';

    this.historyRecords = [
      {
        id: 1,
        status: true,
        activityName: actName,
        delayReason: dReason,
        jobCode: jCode,
        department: dept,
        responsibility: resp,
        dueDate: '2026-02-15',
        priority: prio,
        planStart: '2026-01-16',
        planEnd: '2026-02-15',
        actualStart: '2026-01-16',
        actualEnd: '',
        eta: '2026-02-15',
        planDuration: '30 days',
        planEffort: '50 hrs',
        actualDuration: '18 days',
        actualEffort: '38 hrs',
        description: 'Revised schedule and extended deadline to accommodate vendor raw material dispatch delay.',
        updatedDate: '2026-02-02',
        updatedBy: resp
      },
      {
        id: 2,
        status: true,
        activityName: actName,
        delayReason: 'Regulatory Approval Pending',
        jobCode: jCode,
        department: dept,
        responsibility: resp,
        dueDate: '2026-01-30',
        priority: 'High',
        planStart: '2026-01-16',
        planEnd: '2026-01-30',
        actualStart: '2026-01-16',
        actualEnd: '',
        eta: '2026-01-30',
        planDuration: '14 days',
        planEffort: '45 hrs',
        actualDuration: '10 days',
        actualEffort: '28 hrs',
        description: 'Extended due date to account for regulatory agency clarifications on analytical protocols.',
        updatedDate: '2026-01-25',
        updatedBy: 'Aarav Shah'
      },
      {
        id: 3,
        status: true,
        activityName: actName,
        delayReason: 'Vendor Dispatch Delay',
        jobCode: jCode,
        department: dept,
        responsibility: 'Diego Ruiz',
        dueDate: '2026-01-24',
        priority: 'Medium',
        planStart: '2026-01-16',
        planEnd: '2026-01-24',
        actualStart: '2026-01-16',
        actualEnd: '',
        eta: '2026-01-24',
        planDuration: '8 days',
        planEffort: '40 hrs',
        actualDuration: '5 days',
        actualEffort: '20 hrs',
        description: 'Updated vendor quote details and re-budgeted CRO outsourcing commitments.',
        updatedDate: '2026-01-20',
        updatedBy: 'Diego Ruiz'
      },
      {
        id: 4,
        status: true,
        activityName: actName,
        delayReason: '—',
        jobCode: jCode,
        department: dept,
        responsibility: 'Diego Ruiz',
        dueDate: '2026-01-20',
        priority: 'Medium',
        planStart: '2026-01-16',
        planEnd: '2026-01-20',
        actualStart: '2026-01-16',
        actualEnd: '2026-01-20',
        eta: '2026-01-20',
        planDuration: '5 days',
        planEffort: '35 hrs',
        actualDuration: '5 days',
        actualEffort: '35 hrs',
        description: 'Initial baseline schedule established for WBS activity execution.',
        updatedDate: '2026-01-16',
        updatedBy: 'Olivia Brown'
      }
    ];
  }

  get paginatedRecords(): WbsHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: WbsHistoryItem): void {
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
    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge'
    });
  }
}
