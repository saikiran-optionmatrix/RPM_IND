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
    const targetSubject = this.subject || 'Target patient population prevalence discrepancy in EU5 markets';
    const targetDesc = this.description || 'Epidemiological registries indicate lower prevalence of targeted comorbidity in secondary EU markets.';
    const targetCreated = this.dateCreated || '2026-06-01';
    const targetDue = this.dueDate || '2026-06-15';
    const targetResolvedDate = this.dateResolved || (this.resolved ? '2026-06-14' : null);
    const targetResolved = this.resolved;
    const targetAssigned = this.assignedTo || 'Dr. Sarah Jenkins';

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
        remarks: 'Cross-referencing with IQVIA MIDAS disease prevalence database and updated medical consensus guidelines.',
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
        remarks: 'Preliminary volumetric and gravimetric energy density comparison report completed.',
        revision: 'Rev 2',
        updatedBy: 'Vikram Sharma (Formulation Lead)',
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
        remarks: 'Prevalence gap identified during epidemiology review; assigned to Medical Affairs lead.',
        revision: 'Rev 1',
        updatedBy: 'Dr. Sarah Jenkins',
        changeDate: '01-Jun-2026'
      }
    ];

    // Project issues records
    const projectIssues: IssueHistoryItem[] = [
      {
        id: 4,
        subject: 'Late-stage clinical trial readout of competing SGLT2 fixed-dose combination',
        description: 'Phase III clinical data from competitor molecule demonstrates improved cardiovascular outcome end-points',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-25',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Vikram Sharma',
        status: 'Pending',
        remarks: 'Medical affairs evaluating differentiation in target product profile and label claims.',
        revision: 'Rev 1',
        updatedBy: 'Vikram Sharma',
        changeDate: '05-Jun-2026'
      },
      {
        id: 5,
        subject: 'Orange Book formulation patent expiry and paragraph IV litigation risk',
        description: 'Secondary crystal form formulation patent exclusivity extends 18 months beyond primary substance patent expiration',
        dateCreated: '2026-06-10',
        dueDate: '2026-07-05',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Elena Rostova',
        status: 'Process',
        remarks: 'Legal counsel preparing Paragraph IV certification and non-infringement opinion.',
        revision: 'Rev 1',
        updatedBy: 'Elena Rostova',
        changeDate: '10-Jun-2026'
      },
      {
        id: 6,
        subject: 'Gross-to-net rebate margin compression in primary commercial channel',
        description: 'Formulary tier placement demands additional mandatory rebate allowance impacting projected operating margin',
        dateCreated: '2026-06-15',
        dueDate: '2026-07-12',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Rajesh Kumar',
        status: 'Hold',
        remarks: 'Commercial finance modeling volume tiers and tiered co-pay card assistance program.',
        revision: 'Rev 1',
        updatedBy: 'Rajesh Kumar',
        changeDate: '15-Jun-2026'
      },
      {
        id: 7,
        subject: 'Pilot-scale fluid bed granulator tooling and qualification capex variance',
        description: 'Custom top-spray fluid bed processing chamber quote exceeds preliminary formulation capital allocation by 6%',
        dateCreated: '2026-06-20',
        dueDate: '2026-07-20',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Anita Desai',
        status: 'Allocated',
        remarks: 'Procurement renegotiating with vendor for combined granulation and fluid-bed drying skid.',
        revision: 'Rev 1',
        updatedBy: 'Anita Desai',
        changeDate: '20-Jun-2026'
      },
      {
        id: 8,
        subject: 'API synthetic impurity profile exceeding ICH Q3A qualification threshold',
        description: 'New API synthetic route yields unknown degradation impurity at 0.18% exceeding 0.15% identification threshold',
        dateCreated: '2026-06-25',
        dueDate: '2026-07-28',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Michael Chang',
        status: 'Pending',
        remarks: 'ARD conducting LC-MS/MS structural elucidation and evaluating recrystallization purification steps.',
        revision: 'Rev 1',
        updatedBy: 'Michael Chang',
        changeDate: '25-Jun-2026'
      },
      {
        id: 9,
        subject: 'In-vitro dissolution similarity failure in discriminating pH 4.5 media',
        description: 'Apparatus 2 paddle dissolution profiles diverge at 15-minute point with f2 similarity score of 42',
        dateCreated: '2026-07-01',
        dueDate: '2026-08-08',
        dateResolved: null,
        resolved: false,
        assignedTo: 'Priya Reddy',
        status: 'Process',
        remarks: 'Adjusting microcrystalline cellulose grade and roller compaction milling screen size.',
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
        code: this.projectCode || '2026/RD/001',
        name: this.projectName || 'Dapagliflozin Film-Coated Tablets'
      },
      queryParamsHandling: 'merge'
    });
  }
}
