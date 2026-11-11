import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ScheduleTaskHistoryItem {
  id?: number | string;
  projectCode: string;
  deliverable: string;
  activity: string;
  task: string;
  hours: number;
  description: string;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  revision?: string;
  lastUpdated?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-scheduling-tasks-history',
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
  templateUrl: './project-scheduling-tasks-history.component.html',
  styleUrl: './project-scheduling-tasks-history.component.scss',
})
export class ProjectSchedulingTasksHistoryComponent implements OnInit {
  projectCode: string = '';
  projectName: string = '';
  deliverable: string = '';
  activity: string = '';
  taskName: string = '';
  hours: number = 0;
  description: string = '';
  approved: boolean = false;
  declined: boolean = false;
  pending: boolean = false;
  historyCount: number = 3;
  lastUpdated: string = '';
  updatedBy: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyList: ScheduleTaskHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['deliverable']) this.deliverable = params['deliverable'];
      if (params['activity']) this.activity = params['activity'];
      if (params['taskName'] || params['task']) {
        this.taskName = params['taskName'] || params['task'];
      }
      if (params['hours'] !== undefined) {
        this.hours = Number(params['hours']) || 0;
      }
      if (params['description']) this.description = params['description'];
      if (params['approved'] !== undefined) {
        this.approved = params['approved'] === 'true' || params['approved'] === true;
      }
      if (params['declined'] !== undefined) {
        this.declined = params['declined'] === 'true' || params['declined'] === true;
      }
      if (params['pending'] !== undefined) {
        this.pending = params['pending'] === 'true' || params['pending'] === true;
      }
      if (params['historyCount']) {
        this.historyCount = Number(params['historyCount']) || 3;
      }
      if (params['lastUpdated']) this.lastUpdated = params['lastUpdated'];
      if (params['updatedBy']) this.updatedBy = params['updatedBy'];

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curCode = this.projectCode || '2026/GEN/001';
    const curDeliv = this.deliverable || 'Formulation';
    const curAct = this.activity || 'API Characterization';
    const curTask = this.taskName || 'Solubility Profiling';
    const curHours = this.hours || 4.0;
    const curDesc = this.description || 'pH-dependent solubility and dissolution rate determination in standard buffers.';
    const curApproved = this.approved;
    const curDeclined = this.declined;
    const curPending = this.pending;

    const count = Math.max(this.historyCount || 3, 3);
    const records: ScheduleTaskHistoryItem[] = [];

    // Latest / Current Revision
    records.push({
      id: count,
      projectCode: curCode,
      deliverable: curDeliv,
      activity: curAct,
      task: curTask,
      hours: curHours,
      description: curDesc,
      approved: curApproved,
      declined: curDeclined,
      pending: curPending,
      revision: `Rev ${count} (Current)`,
      lastUpdated: this.lastUpdated || '03-Jun-2026',
      updatedBy: this.updatedBy || 'Priya Sharma'
    });

    // Revision 2 (Intermediate edit / review)
    records.push({
      id: count - 1,
      projectCode: curCode,
      deliverable: curDeliv,
      activity: curAct,
      task: curTask,
      hours: Math.max(1, +(curHours - 0.5).toFixed(1)),
      description: `${curDesc} Awaiting preliminary data review and approval.`,
      approved: false,
      declined: false,
      pending: true,
      revision: `Rev ${count - 1}`,
      lastUpdated: '02-Jun-2026',
      updatedBy: this.updatedBy || 'Priya Sharma'
    });

    // Revision 1 (Initial creation / draft allocation)
    records.push({
      id: 1,
      projectCode: curCode,
      deliverable: curDeliv,
      activity: curAct,
      task: curTask,
      hours: Math.max(0.5, +(curHours - 1.5).toFixed(1)),
      description: 'Initial schedule task draft created and allocated for review.',
      approved: false,
      declined: false,
      pending: true,
      revision: 'Rev 1',
      lastUpdated: '01-Jun-2026',
      updatedBy: 'System / Lead'
    });

    // If history count is greater, add more historical steps
    if (count > 3) {
      for (let i = count - 2; i > 1; i--) {
        records.splice(1, 0, {
          id: i,
          projectCode: curCode,
          deliverable: curDeliv,
          activity: curAct,
          task: curTask,
          hours: Math.max(1, +(curHours - (count - i) * 0.5).toFixed(1)),
          description: `${curDesc} Interim review revision ${i}.`,
          approved: false,
          declined: false,
          pending: true,
          revision: `Rev ${i}`,
          lastUpdated: '02-Jun-2026',
          updatedBy: this.updatedBy || 'Priya Sharma'
        });
      }
    }

    this.historyList = records;
  }

  get paginatedHistory(): ScheduleTaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyList.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/schedule-tasks-history')) {
      this.router.navigate(['/projects/dashboard/schedule-tasks'], {
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['/projects/dashboard/schedule/tasks'], {
        queryParamsHandling: 'merge'
      });
    }
  }
}
