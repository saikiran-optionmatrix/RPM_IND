import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface GateActivityHistoryItem {
  id: number;
  status: boolean;
  activityName: string;
  tasks: string;
  requirements: string;
  delayReason: string;
  responsibility: string;
  department: string;
  planDuration: string;
  planEffort: string;
  actualDuration: string;
  actualEffort: string;
  priority: 'High' | 'Medium' | 'Low';
  remarks: string;
  // Timeline pop-up details
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  description?: string;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-gates-activity-history',
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
  templateUrl: './gates-activity-history.component.html',
  styleUrl: './gates-activity-history.component.scss',
})
export class GatesActivityHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  activityName: string = '';
  jobCode: string = '';
  department: string = '';
  responsibility: string = '';
  delayReason: string = '';
  priority: string = '';
  tasks: string = '';
  requirements: string = '';
  planDuration: string = '';
  planEffort: string = '';
  actualDuration: string = '';
  actualEffort: string = '';
  remarks: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: GateActivityHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: GateActivityHistoryItem | null = null;

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
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['activityName']) this.activityName = params['activityName'];
      if (params['jobCode']) this.jobCode = params['jobCode'];
      if (params['department']) this.department = params['department'];
      if (params['responsibility']) this.responsibility = params['responsibility'];
      if (params['delayReason']) this.delayReason = params['delayReason'];
      if (params['priority']) this.priority = params['priority'];
      if (params['tasks']) this.tasks = params['tasks'];
      if (params['requirements']) this.requirements = params['requirements'];
      if (params['planDuration']) this.planDuration = params['planDuration'];
      if (params['planEffort']) this.planEffort = params['planEffort'];
      if (params['actualDuration']) this.actualDuration = params['actualDuration'];
      if (params['actualEffort']) this.actualEffort = params['actualEffort'];
      if (params['remarks']) this.remarks = params['remarks'];

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const actName = this.activityName || 'Formal Freedom-to-Operate (FTO) Opinion';
    const dept = this.department || 'Regulatory Affairs';
    const resp = this.responsibility || 'Alex Rivera';
    const dReason = this.delayReason || 'Raw Material Shortage';
    const prio = (this.priority as 'High' | 'Medium' | 'Low') || 'High';
    const tCount = this.tasks || '4/13';
    const rCount = this.requirements || '5/9';
    const pDur = this.planDuration || '18 days';
    const pEff = this.planEffort || '45 hrs';
    const aDur = this.actualDuration || '14 days';
    const aEff = this.actualEffort || '38 hrs';
    const rem = this.remarks || 'Supplier raw material delivery bottleneck resolved with backup vendor';

    this.historyRecords = [
      {
        id: 1,
        status: true,
        activityName: actName,
        tasks: tCount,
        requirements: rCount,
        delayReason: dReason,
        responsibility: resp,
        department: dept,
        planDuration: pDur,
        planEffort: pEff,
        actualDuration: aDur,
        actualEffort: aEff,
        priority: prio,
        remarks: rem,
        planStart: '2026-01-05',
        planEnd: '2026-01-23',
        actualStart: '2026-01-05',
        actualEnd: '',
        eta: '2026-01-23',
        description: 'Schedule revised and extended due date to resolve vendor raw material dispatch bottleneck.',
        updatedDate: '2026-01-20',
        updatedBy: resp
      },
      {
        id: 2,
        status: true,
        activityName: actName,
        tasks: '3/13',
        requirements: '4/9',
        delayReason: 'Regulatory Approval Pending',
        responsibility: resp,
        department: dept,
        planDuration: '15 days',
        planEffort: '40 hrs',
        actualDuration: '10 days',
        actualEffort: '28 hrs',
        priority: 'High',
        remarks: 'Clarifications and supplementary data submitted to regulatory body',
        planStart: '2026-01-05',
        planEnd: '2026-01-20',
        actualStart: '2026-01-05',
        actualEnd: '',
        eta: '2026-01-20',
        description: 'Extended review window for statutory regulatory approval clearance.',
        updatedDate: '2026-01-15',
        updatedBy: 'Dr. Priya Nair'
      },
      {
        id: 3,
        status: true,
        activityName: actName,
        tasks: '2/13',
        requirements: '3/9',
        delayReason: 'Vendor Dispatch Delay',
        responsibility: 'David Miller',
        department: 'Supply Chain',
        planDuration: '12 days',
        planEffort: '35 hrs',
        actualDuration: '7 days',
        actualEffort: '20 hrs',
        priority: 'Medium',
        remarks: 'Expedited courier arrangements confirmed with primary manufacturer',
        planStart: '2026-01-05',
        planEnd: '2026-01-17',
        actualStart: '2026-01-05',
        actualEnd: '',
        eta: '2026-01-17',
        description: 'Vendor dispatch timeline recalibrated following production scheduling updates.',
        updatedDate: '2026-01-10',
        updatedBy: 'David Miller'
      },
      {
        id: 4,
        status: true,
        activityName: actName,
        tasks: '1/13',
        requirements: '2/9',
        delayReason: '—',
        responsibility: 'David Miller',
        department: 'Supply Chain',
        planDuration: '10 days',
        planEffort: '30 hrs',
        actualDuration: '5 days',
        actualEffort: '15 hrs',
        priority: 'Medium',
        remarks: 'Initial gate activity baseline targets established',
        planStart: '2026-01-05',
        planEnd: '2026-01-15',
        actualStart: '2026-01-05',
        actualEnd: '2026-01-14',
        eta: '2026-01-15',
        description: 'Initial baseline creation and target dates approved during kickoff review.',
        updatedDate: '2026-01-05',
        updatedBy: 'Alex Rivera'
      }
    ];
  }

  get paginatedRecords(): GateActivityHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: GateActivityHistoryItem): void {
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
    this.router.navigate(['/projects/dashboard/gates/activities'], {
      queryParams: {
        gateCode: this.gateCode,
        gateName: this.gateName,
        projectName: this.projectName,
        code: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
