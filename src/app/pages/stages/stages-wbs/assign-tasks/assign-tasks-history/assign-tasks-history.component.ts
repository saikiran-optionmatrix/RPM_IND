import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface AssignTaskHistoryItem {
  id?: number | string;
  taskName: string;
  taskCode: string;
  jobCode: string;
  revision?: string;
  changedDate?: string;
  changedBy?: string;
}

@Component({
  selector: 'app-assign-tasks-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './assign-tasks-history.component.html',
  styleUrl: './assign-tasks-history.component.scss',
})
export class AssignTasksHistoryComponent implements OnInit {
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';

  activityName: string = '';
  activityCode: string = '';
  stageCode: string = '';
  stageName: string = '';
  gateCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  records: AssignTaskHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['taskName']) this.taskName = params['taskName'];
      if (params['taskCode']) this.taskCode = params['taskCode'];
      if (params['jobCode']) this.jobCode = params['jobCode'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['activityCode']) this.activityCode = params['activityCode'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'Verify Structural Load, Vibration, and Thermal Envelope Specifications';
    const curTaskCode = this.taskCode || 'IND-101';
    const curJobCode = this.jobCode || 'ENG01';
    const count = this.historyCount || 3;

    const baseDates = [
      '2026-05-18 14:30',
      '2026-05-02 11:15',
      '2026-04-19 09:45',
      '2026-04-05 16:20',
      '2026-03-22 10:10',
      '2026-03-10 13:00'
    ];

    const users = [
      'Rajesh Kumar',
      'Ananya Rao',
      'Anita Desai',
      'Priya Reddy',
      'Amit Patel'
    ];

    const taskNameVariations = [
      curTaskName,
      `${curTaskName} - Initial Engineering Draft`,
      `${curTaskName} - Preliminary Specification Scope`,
      `${curTaskName} - Feasibility Outline`,
      `${curTaskName} - Baseline Proposal`
    ];

    const jobCodeVariations = [
      curJobCode,
      curJobCode === 'ENG01' ? 'ENG02' : 'ENG01',
      curJobCode === 'QA01' ? 'ENG01' : 'QA01',
      'MECH01',
      'CQV01'
    ];

    const selectedRevisions: AssignTaskHistoryItem[] = [];

    for (let i = 0; i < count; i++) {
      const revNum = count - i;
      selectedRevisions.push({
        id: i + 1,
        taskName: i === 0 ? curTaskName : taskNameVariations[i % taskNameVariations.length],
        taskCode: curTaskCode,
        jobCode: i === 0 ? curJobCode : jobCodeVariations[i % jobCodeVariations.length],
        revision: `Rev ${revNum}`,
        changedDate: baseDates[i % baseDates.length],
        changedBy: users[i % users.length]
      });
    }

    const otherTasksCatalog: AssignTaskHistoryItem[] = [
      {
        id: 101,
        taskName: 'Verify Structural Load, Vibration, and Thermal Envelope Specifications',
        taskCode: 'IND-101',
        jobCode: 'ENG01',
        revision: 'Rev 3',
        changedDate: '2026-05-19 16:40',
        changedBy: 'Ananya Rao'
      },
      {
        id: 102,
        taskName: 'Validate Line Cycle-Time, Takt Balance, and OEE Baseline Criteria',
        taskCode: 'IND-102',
        jobCode: 'MFG03',
        revision: 'Rev 2',
        changedDate: '2026-05-01 10:30',
        changedBy: 'Rajesh Kumar'
      },
      {
        id: 103,
        taskName: 'Benchmark Existing Plant Equipment and Utility Capacity Gaps',
        taskCode: 'IND-103',
        jobCode: 'ENG02',
        revision: 'Rev 3',
        changedDate: '2026-05-15 09:20',
        changedBy: 'Anita Desai'
      },
      {
        id: 104,
        taskName: 'Develop PLC / SCADA Sequence Control and Fault Diagnostics Logic',
        taskCode: 'IND-104',
        jobCode: 'ELEC01',
        revision: 'Rev 2',
        changedDate: '2026-05-10 14:15',
        changedBy: 'Priya Reddy'
      },
      {
        id: 105,
        taskName: 'Execute Subassembly Material Compatibility and Wear Testing',
        taskCode: 'IND-105',
        jobCode: 'MECH01',
        revision: 'Rev 1',
        changedDate: '2026-04-28 11:00',
        changedBy: 'Amit Patel'
      },
      {
        id: 106,
        taskName: 'Prepare Factory Acceptance Test (FAT) Protocol and Checklists',
        taskCode: 'IND-106',
        jobCode: 'CQV01',
        revision: 'Rev 2',
        changedDate: '2026-04-22 15:30',
        changedBy: 'Suresh Naidu'
      },
      {
        id: 107,
        taskName: 'Complete Instrument Calibration and Metrology Traceability Plan',
        taskCode: 'IND-107',
        jobCode: 'CAL01',
        revision: 'Rev 1',
        changedDate: '2026-04-18 13:45',
        changedBy: 'Ananya Rao'
      },
      {
        id: 108,
        taskName: 'Conduct OEM Vendor Audit and Critical Spare-Parts SLA Review',
        taskCode: 'IND-108',
        jobCode: 'QA01',
        revision: 'Rev 1',
        changedDate: '2026-04-12 17:00',
        changedBy: 'Rajesh Kumar'
      }
    ];

    const filteredCatalog = otherTasksCatalog.filter(
      t => t.taskCode.toLowerCase() !== curTaskCode.toLowerCase()
    );

    this.records = [...selectedRevisions, ...filteredCatalog];
  }

  get paginatedRecords(): AssignTaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.records.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    if (this.stageCode || this.stageName) {
      this.router.navigate(['/stages/wbs'], {
        queryParams: {
          stageCode: this.stageCode || 'S1',
          stageName: this.stageName || 'Business Need & Opportunity Assessment',
          gateCode: this.gateCode || 'Gate 1'
        }
      });
    } else {
      this.location.back();
    }
  }
}
