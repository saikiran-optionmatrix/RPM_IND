import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface RequirementHistoryItem {
  id?: number | string;
  active: boolean;
  done: boolean;
  requirementName: string;
  department: string;
  role: string;
  dueDate: string;
  completedDate: string;
  remarks: string;
  revision?: string;
  changedDate?: string;
}

@Component({
  selector: 'app-project-wbs-requirements-history',
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
  templateUrl: './project-wbs-requirements-history.component.html',
  styleUrl: './project-wbs-requirements-history.component.scss',
})
export class ProjectWbsRequirementsHistoryComponent implements OnInit {
  requirementName: string = '';
  active: boolean = true;
  done: boolean = false;
  department: string = '';
  role: string = '';
  dueDate: string = '';
  completedDate: string = '';
  remarks: string = '';

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

  requirementsHistory: RequirementHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['requirementName']) this.requirementName = params['requirementName'];
      if (params['active'] !== undefined) {
        this.active = params['active'] === 'true' || params['active'] === true;
      }
      if (params['done'] !== undefined) {
        this.done = params['done'] === 'true' || params['done'] === true;
      }
      if (params['department']) this.department = params['department'];
      if (params['role']) this.role = params['role'];
      if (params['dueDate']) this.dueDate = params['dueDate'];
      if (params['completedDate']) this.completedDate = params['completedDate'];
      if (params['remarks']) this.remarks = params['remarks'];

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
    const curReqName = this.requirementName || 'Mechanical Load, Dimensional Tolerance, and Vibration Limits Specification';
    const curDept = this.department || 'Mechanical Design';
    const curRole = this.role || 'Lead Mechanical Engineer';
    const curDueDate = this.dueDate || '2026-05-15';
    const curCompletedDate = this.completedDate || (this.done ? '2026-05-14' : '');
    const curActive = this.active;
    const curDone = this.done;
    const curRemarks = this.remarks || 'ISO 10816 vibration and GD&T tolerance stack-up verified';

    // Revision history for the clicked requirement
    const selectedRevisions: RequirementHistoryItem[] = [
      {
        id: 1,
        active: curActive,
        done: curDone,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: curDueDate,
        completedDate: curCompletedDate,
        remarks: curRemarks || 'Final requirement verified and approved for industrial equipment validation',
        revision: 'Rev 3 (Current)',
        changedDate: '2026-01-19'
      },
      {
        id: 2,
        active: true,
        done: false,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: '2026-01-15',
        completedDate: '',
        remarks: 'Intermediate revision: adjusted test parameters according to URS specs',
        revision: 'Rev 2',
        changedDate: '2026-01-12'
      },
      {
        id: 3,
        active: true,
        done: false,
        requirementName: curReqName,
        department: curDept,
        role: curRole,
        dueDate: '2026-01-10',
        completedDate: '',
        remarks: 'Initial requirement baseline drafted and assigned',
        revision: 'Rev 1',
        changedDate: '2026-01-05'
      }
    ];

    // Other activity requirements history
    const otherRequirements: RequirementHistoryItem[] = [
      {
        id: 4,
        active: true,
        done: true,
        requirementName: 'Design FMEA Risk Assessment and Critical Component Control Strategy',
        department: 'Quality Assurance',
        role: 'Engineering Manager',
        dueDate: '2026-01-25',
        completedDate: '2026-01-24',
        remarks: 'ISO 9001 & machinery directive aligned FMEA matrix approved',
        revision: 'Rev 2'
      },
      {
        id: 5,
        active: true,
        done: true,
        requirementName: 'PLC / SCADA Control Logic and Safety Interlock Compliance (ISO 13849)',
        department: 'Automation & Controls',
        role: 'Controls Lead',
        dueDate: '2026-02-10',
        completedDate: '2026-02-09',
        remarks: 'PLd / SIL2 emergency-stop and light-curtain interlock logic validated',
        revision: 'Rev 2'
      },
      {
        id: 6,
        active: true,
        done: true,
        requirementName: 'OEM Benchmark Equipment Throughput and OEE Target Verification',
        department: 'Engineering & R&D',
        role: 'Principal Manufacturing Engineer',
        dueDate: '2026-02-18',
        completedDate: '2026-02-17',
        remarks: 'Target OEE >= 85% and takt-time benchmark established',
        revision: 'Rev 1'
      },
      {
        id: 7,
        active: true,
        done: true,
        requirementName: 'Raw Steel, Casting, and Certified Component Material Traceability',
        department: 'Procurement & Supply Chain',
        role: 'Procurement Lead',
        dueDate: '2026-02-25',
        completedDate: '2026-02-24',
        remarks: 'EN 10204 3.1 mill test certificates and OEM quality agreements verified',
        revision: 'Rev 1'
      },
      {
        id: 8,
        active: true,
        done: false,
        requirementName: 'Utility Header, Electrical Load, and Plant Foundation Readiness',
        department: 'Manufacturing & Operations',
        role: 'Facilities Lead',
        dueDate: '2026-03-05',
        completedDate: '',
        remarks: '480V 3-phase feeder and chilled water pressure tests underway',
        revision: 'Rev 1'
      },
      {
        id: 9,
        active: true,
        done: true,
        requirementName: 'EHS Machine Guarding, Noise Attenuation, and LOTO Compliance',
        department: 'EHS & Compliance',
        role: 'EHS Officer',
        dueDate: '2026-03-15',
        completedDate: '2026-03-14',
        remarks: 'OSHA / CE acoustic enclosure and Lockout/Tagout isolation verified',
        revision: 'Rev 1'
      }
    ];

    const filteredOther = otherRequirements.filter(
      r => r.requirementName.toLowerCase() !== curReqName.toLowerCase()
    );

    this.requirementsHistory = [...selectedRevisions, ...filteredOther];
  }

  get paginatedRequirements(): RequirementHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.requirementsHistory.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  goBack(): void {
    const currentUrl = this.router.url || '';
    if (currentUrl.includes('/stages/wbs')) {
      this.router.navigate(['/projects/dashboard/stages/wbs/requirements'], { queryParamsHandling: 'merge' });
    } else if (currentUrl.includes('/wbs')) {
      this.router.navigate(['/projects/dashboard/wbs/requirements'], { queryParamsHandling: 'merge' });
    } else {
      this.location.back();
    }
  }
}
