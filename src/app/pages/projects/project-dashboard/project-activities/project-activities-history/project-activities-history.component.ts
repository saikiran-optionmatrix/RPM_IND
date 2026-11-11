import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HoursTimesheetComponent } from '../../project-hours/hours-timesheet/hours-timesheet.component';

export interface ProjectActivityHistoryItem {
  id: number;
  activityName: string;
  delayReason: string;
  stage: string;
  deliverable: string;
  responsibility: string;
  startDate: string;
  duration: string;
  effort: string;
  status: string;
  priority: string;
  complexity: string;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-activities-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  templateUrl: './project-activities-history.component.html',
  styleUrl: './project-activities-history.component.scss',
})
export class ProjectActivitiesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  activityName: string = '';
  delayReason: string = '';
  stage: string = '';
  deliverable: string = '';
  responsibility: string = '';
  startDate: string = '';
  duration: string = '';
  effort: string = '';
  status: string = '';
  priority: string = '';
  complexity: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ProjectActivityHistoryItem[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['activityName']) this.activityName = params['activityName'];
      if (params['delayReason']) this.delayReason = params['delayReason'];
      if (params['stage']) this.stage = params['stage'];
      if (params['deliverable']) this.deliverable = params['deliverable'];
      if (params['responsibility']) this.responsibility = params['responsibility'];
      if (params['startDate']) this.startDate = params['startDate'];
      if (params['duration']) this.duration = params['duration'];
      if (params['effort']) this.effort = params['effort'];
      if (params['status']) this.status = params['status'];
      if (params['priority']) this.priority = params['priority'];
      if (params['complexity']) this.complexity = params['complexity'];

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const actName = this.activityName || 'Analytical costing, External CRO costing';
    const dReason = this.delayReason || 'Raw Material Shortage';
    const stg = this.stage || 'Stage 1';
    const deliv = this.deliverable || 'Project Costing Sheet';
    const resp = this.responsibility || 'Dr. Sarah Connor';
    const sDate = this.startDate || '2026-01-16';
    const dur = this.duration || '18 days';
    const eff = this.effort || '48 hrs';
    const stat = this.status || 'In Process';
    const prio = this.priority || 'High';
    const cmplx = this.complexity || 'High';

    this.historyRecords = [
      {
        id: 1,
        activityName: actName,
        delayReason: dReason,
        stage: stg,
        deliverable: deliv,
        responsibility: resp,
        startDate: sDate,
        duration: dur,
        effort: eff,
        status: stat,
        priority: prio,
        complexity: cmplx,
        updatedDate: '2026-02-02',
        updatedBy: resp
      },
      {
        id: 2,
        activityName: actName,
        delayReason: 'Regulatory Approval Pending',
        stage: stg,
        deliverable: deliv,
        responsibility: resp,
        startDate: sDate,
        duration: '14 days',
        effort: '40 hrs',
        status: 'In Process',
        priority: 'High',
        complexity: 'High',
        updatedDate: '2026-01-25',
        updatedBy: 'Alex Rivera'
      },
      {
        id: 3,
        activityName: actName,
        delayReason: 'Vendor Dispatch Delay',
        stage: stg,
        deliverable: deliv,
        responsibility: 'James Miller',
        startDate: sDate,
        duration: '10 days',
        effort: '32 hrs',
        status: 'Allocated',
        priority: 'Medium',
        complexity: 'Medium',
        updatedDate: '2026-01-20',
        updatedBy: 'James Miller'
      },
      {
        id: 4,
        activityName: actName,
        delayReason: '—',
        stage: stg,
        deliverable: deliv,
        responsibility: 'James Miller',
        startDate: sDate,
        duration: '5 days',
        effort: '24 hrs',
        status: 'Pending',
        priority: 'Medium',
        complexity: 'Medium',
        updatedDate: '2026-01-16',
        updatedBy: resp
      }
    ];
  }

  getInitials(name?: string): string {
    if (!name) return '—';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  openTimesheet(): void {
    this.dialog.open(HoursTimesheetComponent, {
      width: '950px',
      maxWidth: '95vw',
      data: null
    });
  }

  get paginatedRecords(): ProjectActivityHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/activities'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
