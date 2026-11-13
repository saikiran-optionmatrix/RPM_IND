import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface TaskHistoryItem {
  id?: number | string;
  done: boolean;
  taskName: string;
  taskCode: string;
  jobCode: string;
  dueDate: string;
  completedDate: string;
  responsibility: string;
  department: string;
  revision?: string;
  remarks?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-project-wbs-tasks-history',
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
  templateUrl: './project-wbs-tasks-history.component.html',
  styleUrl: './project-wbs-tasks-history.component.scss',
})
export class ProjectWbsTasksHistoryComponent implements OnInit {
  taskName: string = '';
  taskCode: string = '';
  jobCode: string = '';
  dueDate: string = '';
  completedDate: string = '';
  done: boolean = false;
  responsibility: string = '';
  department: string = '';

  activityName: string = '';
  jobCodeParam: string = '';
  stageName: string = '';
  stageCode: string = '';
  gateName: string = '';
  gateCode: string = '';
  projectName: string = '';
  projectCode: string = '';
  historyCount: number = 3;

  pageIndex: number = 0;
  pageSize: number = 10;

  tasksHistory: TaskHistoryItem[] = [];

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
      if (params['dueDate']) this.dueDate = params['dueDate'];
      if (params['completedDate']) this.completedDate = params['completedDate'];
      if (params['done'] !== undefined) {
        this.done = params['done'] === 'true' || params['done'] === true;
      }
      if (params['responsibility']) this.responsibility = params['responsibility'];
      if (params['department']) this.department = params['department'];

      if (params['activityName']) this.activityName = params['activityName'];
      if (params['jobCodeParam']) this.jobCodeParam = params['jobCodeParam'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['gateName']) this.gateName = params['gateName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      if (params['projectName']) this.projectName = params['projectName'];
      if (params['projectCode']) this.projectCode = params['projectCode'];
      if (params['historyCount']) this.historyCount = Number(params['historyCount']) || 3;

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const curTaskName = this.taskName || 'Verify Structural Load, Vibration, and Thermal Envelope Specifications';
    const curTaskCode = this.taskCode || 'IND-101';
    const curJobCode = this.jobCode || 'ENG01';
    const curDueDate = this.dueDate || '2026-05-15';
    const curCompletedDate = this.completedDate || (this.done ? '2026-05-14' : '');
    const curDone = this.done;
    const curResp = this.responsibility || 'Ananya Rao';
    const curDept = this.department || 'Mechanical Design';

    // Revision history for the clicked task
    const selectedRevisions: TaskHistoryItem[] = [
      {
        id: 1,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: curDueDate,
        completedDate: curCompletedDate,
        done: curDone,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 3 (Current)',
        remarks: 'Task verified and signed off by Lead Mechanical Engineer.',
        changedDate: '2026-05-14'
      },
      {
        id: 2,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: '2026-05-10',
        completedDate: '',
        done: false,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 2',
        remarks: 'Updated FEA boundary conditions; awaiting OEM spindle stiffness input.',
        changedDate: '2026-05-06'
      },
      {
        id: 3,
        taskName: curTaskName,
        taskCode: curTaskCode,
        jobCode: curJobCode,
        dueDate: '2026-05-01',
        completedDate: '',
        done: false,
        responsibility: curResp,
        department: curDept,
        revision: 'Rev 1',
        remarks: 'Initial engineering task created and assigned to WBS schedule.',
        changedDate: '2026-04-24'
      }
    ];

    // Other task records
    const otherTasks: TaskHistoryItem[] = [
      {
        id: 4,
        taskName: 'Validate Line Cycle-Time, Takt Balance, and OEE Baseline Criteria',
        taskCode: 'IND-102',
        jobCode: 'MFG03',
        dueDate: '2026-05-20',
        completedDate: '2026-05-19',
        done: true,
        responsibility: 'Rajesh Kumar',
        department: 'Manufacturing & Operations',
        revision: 'Rev 2',
        remarks: 'Bottleneck station cycle time reduced to 14.2 seconds.'
      },
      {
        id: 5,
        taskName: 'Benchmark Existing Plant Equipment and Utility Capacity Gaps',
        taskCode: 'IND-103',
        jobCode: 'ENG02',
        dueDate: '2026-06-01',
        completedDate: '2026-05-30',
        done: true,
        responsibility: 'Anita Desai',
        department: 'Engineering & R&D',
        revision: 'Rev 1',
        remarks: 'Chilled water and compressed air header capacity audit completed.'
      },
      {
        id: 6,
        taskName: 'Develop PLC / SCADA Sequence Control and Fault Diagnostics Logic',
        taskCode: 'IND-104',
        jobCode: 'ELEC01',
        dueDate: '2026-06-05',
        completedDate: '',
        done: false,
        responsibility: 'Priya Reddy',
        department: 'Automation & Controls',
        revision: 'Rev 1',
        remarks: 'OPC-UA telemetry tags mapped to plant SCADA historian.'
      },
      {
        id: 7,
        taskName: 'Execute Subassembly Material Compatibility and Wear Testing',
        taskCode: 'IND-105',
        jobCode: 'MECH01',
        dueDate: '2026-06-10',
        completedDate: '',
        done: false,
        responsibility: 'Suresh Naidu',
        department: 'Quality Control & Inspection',
        revision: 'Rev 1',
        remarks: 'Hardened spindle bearing and seal endurance checks underway.'
      },
      {
        id: 8,
        taskName: 'Prepare Factory Acceptance Test (FAT) Protocol and Checklists',
        taskCode: 'IND-106',
        jobCode: 'CQV01',
        dueDate: '2026-06-15',
        completedDate: '',
        done: false,
        responsibility: 'Amit Patel',
        department: 'Commissioning & Qualification',
        revision: 'Rev 1',
        remarks: 'FAT test matrix drafted for QA and Plant Operations sign-off.'
      },
      {
        id: 9,
        taskName: 'Complete Instrument Calibration and Metrology Traceability Plan',
        taskCode: 'IND-107',
        jobCode: 'CAL01',
        dueDate: '2026-06-20',
        completedDate: '',
        done: false,
        responsibility: 'Priya Reddy',
        department: 'Quality Control & Inspection',
        revision: 'Rev 1',
        remarks: 'NIST/NABL calibration certificates scheduled for all transducers.'
      },
      {
        id: 10,
        taskName: 'Conduct OEM Vendor Audit and Critical Spare-Parts SLA Review',
        taskCode: 'IND-108',
        jobCode: 'QA01',
        dueDate: '2026-06-25',
        completedDate: '',
        done: false,
        responsibility: 'Rajesh Kumar',
        department: 'Procurement & Supply Chain',
        revision: 'Rev 1',
        remarks: 'Supplier ISO 9001 audit and 24-hour SLA terms under review.'
      }
    ];

    const filteredOther = otherTasks.filter(
      t => t.taskName.toLowerCase() !== curTaskName.toLowerCase()
    );

    this.tasksHistory = [...selectedRevisions, ...filteredOther];
  }

  get paginatedTasks(): TaskHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.tasksHistory.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/tasks'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }
}
