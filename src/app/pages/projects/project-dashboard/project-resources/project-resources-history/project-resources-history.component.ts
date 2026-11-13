import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface ResourceHistoryItem {
  id?: number;
  timeline?: string;
  resource: string;
  stage: string;
  deliverable: string;
  activity: string;
  planDuration: string;
  actualDuration: string;
  fromDate?: string;
  toDate?: string;
  fromTime?: string;
  toTime?: string;
  status?: string;
  remarks?: string;
  revision?: string;
  updatedBy?: string;
  changeDate?: string;
}

@Component({
  selector: 'app-project-resources-history',
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
  templateUrl: './project-resources-history.component.html',
  styleUrl: './project-resources-history.component.scss'
})
export class ProjectResourcesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  resourceName: string = '';
  stage: string = '';
  deliverable: string = '';
  activity: string = '';
  planDuration: string = '';
  actualDuration: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: ResourceHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: ResourceHistoryItem | null = null;

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
      if (params['resource']) {
        this.resourceName = params['resource'];
      } else if (params['resourceName']) {
        this.resourceName = params['resourceName'];
      }
      if (params['stage']) {
        this.stage = params['stage'];
      }
      if (params['deliverable']) {
        this.deliverable = params['deliverable'];
      }
      if (params['activity']) {
        this.activity = params['activity'];
      }
      if (params['planDuration']) {
        this.planDuration = params['planDuration'];
      }
      if (params['actualDuration']) {
        this.actualDuration = params['actualDuration'];
      }

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const res = this.resourceName || 'CNC Machining Center A';
    const stg = this.stage || 'S1 - Feasibility';
    const deliv = this.deliverable || 'Plant Capacity Audit';
    const act = this.activity || 'Bottleneck Cycle Evaluation';
    const pDur = this.planDuration || '5 days';
    const aDur = this.actualDuration || '5 days';

    // Build specific revisions for the selected resource
    const selectedResourceRevisions: ResourceHistoryItem[] = [
      {
        id: 1,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: pDur,
        actualDuration: aDur,
        fromDate: '2026-06-01',
        toDate: '2026-06-05',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Completed',
        remarks: 'Machining center cycle-time trial finalized and spindle telemetry verified against URS criteria.',
        revision: 'Rev 3 (Current)',
        updatedBy: 'Anita Desai (Lead Mechanical Engineer)',
        changeDate: '05-Jun-2026'
      },
      {
        id: 2,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: pDur,
        actualDuration: '3 days',
        fromDate: '2026-06-01',
        toDate: '2026-06-04',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'In Progress',
        remarks: 'Mid-run toolpath calibration completed; extended window to verify duplicate fixtures.',
        revision: 'Rev 2',
        updatedBy: 'Rajesh Kumar (Program Manager)',
        changeDate: '03-Jun-2026'
      },
      {
        id: 3,
        resource: res,
        stage: stg,
        deliverable: deliv,
        activity: act,
        planDuration: '4 days',
        actualDuration: 'N/A',
        fromDate: '2026-06-01',
        toDate: '2026-06-04',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Scheduled',
        remarks: 'Initial equipment bay allocation approved and booked for feasibility benchmarking.',
        revision: 'Rev 1',
        updatedBy: 'Ananya Rao (Resource Coordinator)',
        changeDate: '28-May-2026'
      }
    ];

    // Additional historical records for other project resources
    const otherResourceRecords: ResourceHistoryItem[] = [
      {
        id: 4,
        resource: 'Anita Desai',
        stage: 'S4 - Detailed Engg',
        deliverable: 'CAD & Structural Package',
        activity: '3D CAD Assembly & Stress FEA',
        planDuration: '14 days',
        actualDuration: '12 days',
        fromDate: '2026-06-08',
        toDate: '2026-06-21',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Completed',
        remarks: 'Structural FEA and tolerance stack-up completed ahead of schedule with 2.4x safety factor.',
        revision: 'Rev 2',
        updatedBy: 'Anita Desai',
        changeDate: '20-Jun-2026'
      },
      {
        id: 5,
        resource: 'CMM Metrology Bay B',
        stage: 'S7 - Validation',
        deliverable: 'Metrology & Calibration',
        activity: 'CMM Dimensional Tolerance Scan',
        planDuration: '10 days',
        actualDuration: '8 days',
        fromDate: '2026-06-22',
        toDate: '2026-07-02',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Active',
        remarks: 'CMM probe calibration complete; GD&T flatness within +/- 0.015 mm limit.',
        revision: 'Rev 1',
        updatedBy: 'Priya Reddy',
        changeDate: '22-Jun-2026'
      },
      {
        id: 6,
        resource: 'Amit Patel',
        stage: 'S4 - Detailed Engg',
        deliverable: 'Automation & PLC',
        activity: 'SCADA Telemetry & Interlock Spec',
        planDuration: '10 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-03',
        toDate: '2026-07-13',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'PLC rack I/O mapping complete; awaiting electrical cabinet wiring schematic sign-off.',
        revision: 'Rev 1',
        updatedBy: 'Amit Patel',
        changeDate: '30-Jun-2026'
      },
      {
        id: 7,
        resource: 'Robotic Weld Cell C',
        stage: 'S6 - Equipment Build',
        deliverable: 'Prototype Tooling',
        activity: 'Fixture Welding & Frame Assembly',
        planDuration: '12 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-14',
        toDate: '2026-07-25',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'Weld jig alignment and robot teach-pendant path simulation scheduled prior to build.',
        revision: 'Rev 1',
        updatedBy: 'Suresh Naidu',
        changeDate: '01-Jul-2026'
      },
      {
        id: 8,
        resource: 'Deepa Nair',
        stage: 'S7 - Validation',
        deliverable: 'Factory Acceptance Test',
        activity: 'FAT Witness Protocol Execution',
        planDuration: '15 days',
        actualDuration: 'N/A',
        fromDate: '2026-07-27',
        toDate: '2026-08-10',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'FAT acceptance protocol and safety interlock test script QA review in progress.',
        revision: 'Rev 1',
        updatedBy: 'Deepa Nair',
        changeDate: '02-Jul-2026'
      },
      {
        id: 9,
        resource: 'Arun Joseph',
        stage: 'S9 - Installation',
        deliverable: 'Mechanical Rigging',
        activity: 'Laser Alignment & Utility Tie-In',
        planDuration: '30 days',
        actualDuration: 'N/A',
        fromDate: '2026-08-11',
        toDate: '2026-09-10',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Active',
        remarks: 'Floor anchor bolt pockets cured and 480V power feeder trench inspected.',
        revision: 'Rev 1',
        updatedBy: 'Arun Joseph',
        changeDate: '05-Jul-2026'
      },
      {
        id: 10,
        resource: 'Lakshmi Devi',
        stage: 'S10 - Commissioning',
        deliverable: 'SAT & OQ Handover',
        activity: 'Full-Load OEE Endurance Trial',
        planDuration: '15 days',
        actualDuration: 'N/A',
        fromDate: '2026-09-11',
        toDate: '2026-09-25',
        fromTime: '09:00 AM',
        toTime: '05:00 PM',
        status: 'Pending',
        remarks: 'SAT data historian tags and shift operator training roster prepared.',
        revision: 'Rev 1',
        updatedBy: 'Lakshmi Devi',
        changeDate: '10-Jul-2026'
      }
    ];

    // If a specific resource was clicked, show its revisions first followed by others,
    // avoiding duplicate items
    const filteredOther = otherResourceRecords.filter(
      r => r.resource.toLowerCase() !== res.toLowerCase()
    );

    this.historyRecords = [...selectedResourceRevisions, ...filteredOther];
  }

  get paginatedRecords(): ResourceHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: ResourceHistoryItem): void {
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
    this.router.navigate(['/projects/dashboard/resources'], {
      queryParams: {
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
