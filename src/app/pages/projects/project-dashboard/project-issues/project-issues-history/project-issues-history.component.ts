import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface IssueHistoryItem {
  id?: number;
  subject: string;
  description: string;
  dateCreated: string | null;
  dueDate: string | null;
  dateResolved: string | null;
  resolved: boolean;
  assignedTo: string;
  status?: string;
  remarks?: string;
  revision?: string;
  updatedBy?: string;
  changeDate?: string;
}

@Component({
  selector: 'app-project-issues-history',
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
  templateUrl: './project-issues-history.component.html',
  styleUrl: './project-issues-history.component.scss'
})
export class ProjectIssuesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  subject: string = '';
  description: string = '';
  dateCreated: string = '';
  dueDate: string = '';
  dateResolved: string = '';
  resolved: boolean = false;
  assignedTo: string = '';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: IssueHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: IssueHistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['subject']) {
        this.subject = params['subject'];
      }
      if (params['description']) {
        this.description = params['description'];
      }
      if (params['dateCreated']) {
        this.dateCreated = params['dateCreated'];
      }
      if (params['dueDate']) {
        this.dueDate = params['dueDate'];
      }
      if (params['dateResolved']) {
        this.dateResolved = params['dateResolved'];
      }
      if (params['resolved'] !== undefined) {
        this.resolved = params['resolved'] === 'true' || params['resolved'] === true;
      }
      if (params['assignedTo']) {
        this.assignedTo = params['assignedTo'];
      }

      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const targetSubject = this.subject || 'Assembly line conveyor takt-time mismatch in Plant A Bay 2';
    const targetDesc = this.description || 'Existing upstream feeder conveyor delivers 95 units/hr against target 120 units/hr new line throughput.';
    const targetCreated = this.dateCreated || '2026-06-01';
    const targetDue = this.dueDate || '2026-06-15';
    const targetResolvedDate = this.dateResolved || (this.resolved ? '2026-06-14' : null);
    const targetResolved = this.resolved;
    const targetAssigned = this.assignedTo || 'Ananya Rao';

    // Detailed historical revisions for the selected issue
    const selectedRevisions: IssueHistoryItem[] = [
      {
        id: 1,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: targetDue,
        dateResolved: targetResolvedDate,
        resolved: targetResolved,
        assignedTo: targetAssigned,
        status: targetResolved ? 'Closed' : 'Process',
        remarks: 'Evaluating variable frequency drive (VFD) upgrade and dual-lane buffer accumulator.',
        revision: 'Rev 3 (Current)',
        updatedBy: targetAssigned,
        changeDate: '10-Jun-2026'
      },
      {
        id: 2,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: '2026-06-10',
        dateResolved: null,
        resolved: false,
        assignedTo: targetAssigned,
        status: 'Progress',
        remarks: 'Completed cycle-time simulation across Stations 1–6 to balance transfer speed.',
        revision: 'Rev 2',
        updatedBy: 'Anita Desai (Lead Mechanical Engineer)',
        changeDate: '06-Jun-2026'
      },
      {
        id: 3,
        subject: targetSubject,
        description: targetDesc,
        dateCreated: targetCreated,
        dueDate: '2026-06-08',
        dateResolved: null,
        resolved: false,
        assignedTo: targetAssigned,
        status: 'Allocated',
        remarks: 'Throughput bottleneck identified during Bay 2 capacity audit; assigned to Engineering Lead.',
        revision: 'Rev 1',
        updatedBy: 'Ananya Rao',
        changeDate: '01-Jun-2026'
      }
    ];

    // Project issues records
    const projectIssues: IssueHistoryItem[] = [
      {
        id: 4,
        subject: 'Gantry structural resonance above 2400 RPM spindle speed',
        description: 'Finite element modal simulation indicates natural harmonic excitation near 40 Hz under heavy roughing.',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-25',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Anita Desai',
        status: 'Pending',
        remarks: 'Mechanical Design adding gusset stiffening plates and polymer-concrete base damping.',
        revision: 'Rev 1',
        updatedBy: 'Anita Desai',
        changeDate: '05-Jun-2026'
      },
      {
        id: 5,
        subject: 'Safety light-curtain stopping distance margin on press cell',
        description: 'Measured brake stopping time requires light curtain mounting offset increase by 140 mm to maintain PLd compliance.',
        dateCreated: '2026-06-10',
        dueDate: '2026-07-05',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Priya Reddy',
        status: 'Process',
        remarks: 'EHS and Controls team updating perimeter stanchion layout and dual safety relay spec.',
        revision: 'Rev 1',
        updatedBy: 'Priya Reddy',
        changeDate: '10-Jun-2026'
      },
      {
        id: 6,
        subject: '5-axis planetary gearbox OEM lead-time variance (4 weeks)',
        description: 'Primary European gearhead supplier notified 28-day extended forging queue affecting Gate 3 build schedule.',
        dateCreated: '2026-06-15',
        dueDate: '2026-07-12',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Rajesh Kumar',
        status: 'Hold',
        remarks: 'Procurement qualifying backup Japanese servo-drive vendor and splitting PO milestones.',
        revision: 'Rev 1',
        updatedBy: 'Rajesh Kumar',
        changeDate: '15-Jun-2026'
      },
      {
        id: 7,
        subject: 'Substation 480V feeder & chilled water manifold pressure drop',
        description: 'Peak hydraulic & spindle cooling load exceeds existing Bay 2 cooling loop capacity by 12 GPM.',
        dateCreated: '2026-06-20',
        dueDate: '2026-07-20',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Suresh Naidu',
        status: 'Allocated',
        remarks: 'Facilities engineering adding dedicated plate heat exchanger skid beside Bay 2.',
        revision: 'Rev 1',
        updatedBy: 'Suresh Naidu',
        changeDate: '20-Jun-2026'
      },
      {
        id: 8,
        subject: 'CMM probe thermal drift beyond +/- 0.015 mm acceptance band',
        description: 'Shop-floor ambient temperature swing during afternoon shifts causes dimensional measurement bias.',
        dateCreated: '2026-06-25',
        dueDate: '2026-07-28',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Amit Patel',
        status: 'Pending',
        remarks: 'Installing enclosed HVAC metrology booth and real-time thermal compensation sensor.',
        revision: 'Rev 1',
        updatedBy: 'Amit Patel',
        changeDate: '25-Jun-2026'
      },
      {
        id: 9,
        subject: 'OPC-UA SCADA historian tag polling jitter during shift changeover',
        description: 'Edge gateway buffer overflow occurs when polling > 1,200 high-frequency PLC spindle tags at 10 ms.',
        dateCreated: '2026-07-01',
        dueDate: '2026-08-08',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Priya Reddy',
        status: 'Process',
        remarks: 'Partitioning fast vibration tags onto dedicated secondary industrial switch VLAN.',
        revision: 'Rev 1',
        updatedBy: 'Priya Reddy',
        changeDate: '01-Jul-2026'
      }
    ];

    // Filter other issues so we don't duplicate the selected one
    const otherFiltered = projectIssues.filter(
      item => item.subject.toLowerCase() !== targetSubject.toLowerCase()
    );

    this.historyRecords = [...selectedRevisions, ...otherFiltered];
  }

  get paginatedRecords(): IssueHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: IssueHistoryItem): void {
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
    this.router.navigate(['/projects/dashboard/issues'], {
      queryParams: {
        code: this.projectCode || '2026/IND/001',
        name: this.projectName || 'Industrial Equipment Line Expansion'
      },
      queryParamsHandling: 'merge'
    });
  }
}
