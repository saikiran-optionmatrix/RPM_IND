import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { AddIssueComponent } from './add-issue/add-issue.component';
import { IssueTimelineComponent } from './issue-timeline/issue-timeline.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';

export type Status = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface Card {
  id: number;
  subject: string;
  LawFirm: string;
  createdBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  expedite: boolean;
  notes: { text: string; author: string; date: string }[];
  expanded: boolean;
  status: Status;
}

export interface IssueItem {
  id: number;
  task?: string;
  taskName?: string;
  subject: string;
  issueDescription: string;
  createdDate: string | null;
  dueDate?: string | null;
  targetDate?: string | null;
  resolvedDate: string | null;
  resolved: boolean;
  remarks: string;
  status: string;
  image?: string | null;
  document?: string | null;
  assignedTo?: string;
  responsibility?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string | null;
  updatedBy?: string | null;
}

@Component({
  selector: 'app-project-issues',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule
  ],
  templateUrl: './project-issues.component.html',
  styleUrl: './project-issues.component.scss'
})
export class ProjectIssuesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  filterToggle: boolean = false;
  totalSize = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  myGroup!: FormGroup;

  isKanbanView: boolean = false;

  projectName: string = 'Dapagliflozin Film-Coated Tablets';
  projectCode: string = '2026/RD/001';
  dynamicBreadcrumb: string = 'Issues';

  // Sample data for Project Issues
  originalTableList: IssueItem[] = [
    {
      id: 1,
      task: 'Epidemiological and disease prevalence assessment',
      subject: 'Target patient population prevalence discrepancy in EU5 markets',
      issueDescription: 'Epidemiological registries indicate lower prevalence of targeted comorbidity in secondary EU markets.',
      createdDate: '2026-06-01',
      dueDate: '2026-06-15',
      targetDate: '2026-06-15',
      resolvedDate: null,
      resolved: false,
      remarks: 'Cross-referencing with IQVIA MIDAS disease prevalence database and updated medical consensus guidelines.',
      status: 'Process',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Dr. Sarah Jenkins',
      responsibility: 'Dr. Sarah Jenkins'
    },
    {
      id: 2,
      task: 'Standard-of-care, unmet medical needs and competitive landscape analysis',
      subject: 'Late-stage clinical trial readout of competing SGLT2 fixed-dose combination',
      issueDescription: 'Phase III clinical data from competitor molecule demonstrates improved cardiovascular outcome end-points.',
      createdDate: '2026-06-05',
      dueDate: '2026-06-25',
      targetDate: '2026-06-25',
      resolvedDate: null,
      resolved: false,
      remarks: 'Medical affairs evaluating differentiation in target product profile and label claims.',
      status: 'Pending',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Vikram Sharma',
      responsibility: 'Vikram Sharma'
    },
    {
      id: 3,
      task: 'Target geographic markets, regulatory pathways and exclusivity horizon',
      subject: 'Orange Book formulation patent expiry and paragraph IV litigation risk',
      issueDescription: 'Secondary crystal form formulation patent exclusivity extends 18 months beyond primary substance patent expiration.',
      createdDate: '2026-06-10',
      dueDate: '2026-07-05',
      targetDate: '2026-07-05',
      resolvedDate: null,
      resolved: false,
      remarks: 'Legal counsel preparing Paragraph IV certification and non-infringement opinion.',
      status: 'Process',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Elena Rostova',
      responsibility: 'Elena Rostova'
    },
    {
      id: 4,
      task: 'Market size, peak-sales potential and volume projections',
      subject: 'Gross-to-net rebate margin compression in primary commercial channel',
      issueDescription: 'Formulary tier placement demands additional mandatory rebate allowance impacting projected operating margin.',
      createdDate: '2026-06-15',
      dueDate: '2026-07-12',
      targetDate: '2026-07-12',
      resolvedDate: null,
      resolved: false,
      remarks: 'Commercial finance modeling volume tiers and tiered co-pay card assistance program.',
      status: 'Hold',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Rajesh Kumar',
      responsibility: 'Rajesh Kumar'
    },
    {
      id: 5,
      task: 'Preliminary development budget, target product cost and capital outlay',
      subject: 'Pilot-scale fluid bed granulator tooling and qualification capex variance',
      issueDescription: 'Custom top-spray fluid bed processing chamber quote exceeds preliminary formulation capital allocation by 6%.',
      createdDate: '2026-06-20',
      dueDate: '2026-07-20',
      targetDate: '2026-07-20',
      resolvedDate: null,
      resolved: false,
      remarks: 'Procurement renegotiating with vendor for combined granulation and fluid-bed drying skid.',
      status: 'Allocated',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Anita Desai',
      responsibility: 'Anita Desai'
    },
    {
      id: 6,
      task: 'Portfolio fit, strategic alignment and risk screening',
      subject: 'API synthetic impurity profile exceeding ICH Q3A qualification threshold',
      issueDescription: 'New API synthetic route yields unknown degradation impurity at 0.18% exceeding 0.15% identification threshold.',
      createdDate: '2026-06-25',
      dueDate: '2026-07-28',
      targetDate: '2026-07-28',
      resolvedDate: null,
      resolved: false,
      remarks: 'ARD conducting LC-MS/MS structural elucidation and evaluating recrystallization purification steps.',
      status: 'Pending',
      image: 'assets/sample-image.jpg',
      document: 'assets/sample-1.pdf',
      assignedTo: 'Michael Chang',
      responsibility: 'Michael Chang'
    }
  ];

  tableList: IssueItem[] = [];
  filteredIssues: IssueItem[] = [];

  lists: Status[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];

  cards: Record<Status, Card[]> = {
    Pending: [],
    Allocated: [],
    Progress: [],
    Hold: [],
    Cancelled: [],
    Completed: []
  };

  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 5, 3];

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.myGroup = new FormGroup({
      Keyword: new FormControl(''),
      Status: new FormControl('')
    });

    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    const sampleTaskNames = [
      'Epidemiological and competitor drug benchmarking',
      'Patient needs, posology, and route of administration research',
      'Target regulatory markets (FDA/EMA/PMDA) and filing pathway shortlist',
      'Volume and price-band projection',
      'API/excipient BOM roll-up and capital outlay estimate',
      'Therapeutic portfolio profitability and payback analysis',
      'Novel formulation platform and stability risk screening',
      'Scientific review board gate authorization',
      'Target Product Profile (TPP) & CQA specification',
      'Formulation & Critical Process Parameter cascade'
    ];
    this.originalTableList.forEach((item, idx) => {
      if (!item.task) {
        item.task = sampleTaskNames[idx % sampleTaskNames.length];
      }
      if (!item.historyCount) {
        item.historyCount = (idx % 10) + 1;
      }
      if (!item.documentsCount) {
        item.documentsCount = this.getDocumentsCount(idx);
      }
      if (!item.updatedDate) {
        item.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!item.updatedBy) {
        item.updatedBy = item.assignedTo || item.responsibility || 'Dr. Sarah Jenkins';
      }
    });

    this.go();
  }

  private getKanbanStatus(gridStatus: string): Status {
    if (gridStatus === 'Process') return 'Progress';
    if (gridStatus === 'Closed') return 'Completed';
    if (gridStatus === 'Hold') return 'Hold';
    if (gridStatus === 'Allocated') return 'Allocated';
    if (gridStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  private getGridStatus(kanbanStatus: Status): string {
    if (kanbanStatus === 'Progress') return 'Process';
    if (kanbanStatus === 'Completed') return 'Closed';
    if (kanbanStatus === 'Hold') return 'Hold';
    if (kanbanStatus === 'Allocated') return 'Allocated';
    if (kanbanStatus === 'Cancelled') return 'Cancelled';
    return 'Pending';
  }

  initializeKanbanData(): void {
    const grouped: Record<Status, Card[]> = {
      Pending: [],
      Allocated: [],
      Progress: [],
      Hold: [],
      Cancelled: [],
      Completed: []
    };

    this.filteredIssues.forEach(item => {
      const kStatus = this.getKanbanStatus(item.status);
      grouped[kStatus].push({
        id: item.id,
        subject: item.subject,
        LawFirm: item.remarks || '',
        createdBy: 'Quality Lead',
        assignedTo: item.responsibility || item.assignedTo || 'Engineer',
        createdDate: item.createdDate || '',
        dueDate: (item.targetDate || item.dueDate) || '',
        expedite: false,
        notes: [],
        expanded: false,
        status: kStatus
      });
    });

    this.cards = grouped;
  }

  openTimelineModal(item: any): void {
    this.dialog.open(IssueTimelineComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: item
    });
  }

  toggleResolved(item: IssueItem): void {
    if (item.resolved) {
      item.resolvedDate = new Date().toISOString().split('T')[0];
      item.status = 'Closed';
    } else {
      item.resolvedDate = null;
      item.status = 'Process';
    }
    this.initializeKanbanData();
  }

  addIssues(applicant: IssueItem | null): void {
    const isEdit = !!applicant;
    const dialogRef = this.dialog.open(AddIssueComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: applicant ? { ...applicant } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (isEdit && applicant) {
          const index = this.originalTableList.findIndex(item => item.id === applicant.id);
          if (index !== -1) {
            this.originalTableList[index] = {
              ...this.originalTableList[index],
              ...result,
              dueDate: result.targetDate || result.dueDate || this.originalTableList[index].dueDate
            };
          }
        } else {
          const newId = this.originalTableList.length ? Math.max(...this.originalTableList.map(t => t.id)) + 1 : 1;
          this.originalTableList.unshift({
            id: newId,
            ...result,
            status: result.status || 'Pending',
            image: result.image || 'assets/sample-image.jpg',
            document: result.document || 'assets/sample-1.pdf',
            assignedTo: result.assignedTo || result.responsibility || 'Rajesh Kumar',
            responsibility: result.responsibility || result.assignedTo || 'Rajesh Kumar',
            createdDate: new Date().toISOString().split('T')[0],
            resolvedDate: result.status === 'Closed' ? new Date().toISOString().split('T')[0] : null,
            resolved: result.status === 'Closed',
            historyCount: (this.originalTableList.length % 10) + 1
          });
        }
        this.go();
      }
    });
  }

  deleteConfirmation(item: IssueItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        ProjectId: item.id,
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this issue?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.originalTableList = this.originalTableList.filter(t => t.id !== item.id);
        this.go();
      }
    });
  }





  clearFilter(): void {
    this.myGroup.reset();
    this.currentPage = 0;
    this.go();
  }

  fnHandlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.go();
  }

  go(): void {
    const filterVals = this.myGroup.value;
    const keyword = (filterVals.Keyword || '').toLowerCase().trim();
    const status = (filterVals.Status || '').trim();

    this.filteredIssues = this.originalTableList.filter(item => {
      if (keyword) {
        const matchesTask = (item.task || item.taskName || '').toLowerCase().includes(keyword);
        const matchesSubject = (item.subject || '').toLowerCase().includes(keyword);
        const matchesDesc = (item.issueDescription || '').toLowerCase().includes(keyword);
        const matchesRemarks = (item.remarks || '').toLowerCase().includes(keyword);
        const matchesAssigned = (item.assignedTo || item.responsibility || '').toLowerCase().includes(keyword);
        if (!matchesTask && !matchesSubject && !matchesDesc && !matchesRemarks && !matchesAssigned) {
          return false;
        }
      }
      if (status && item.status !== status) {
        return false;
      }
      return true;
    });

    this.totalSize = this.filteredIssues.length;
    this.tableList = this.filteredIssues.slice(
      this.currentPage * this.pageSize,
      (this.currentPage + 1) * this.pageSize
    );

    this.initializeKanbanData();
  }

  drop(event: CdkDragDrop<Card[]>, targetList: Status): void {
    const previousList = event.previousContainer.id as Status;
    const currentList = event.container.id as Status;

    if (previousList !== currentList) {
      transferArrayItem(
        this.cards[previousList],
        this.cards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.cards[currentList][event.currentIndex];
      movedCard.status = currentList;

      const issue = this.originalTableList.find(item => item.id === movedCard.id);
      if (issue) {
        issue.status = this.getGridStatus(currentList);
        issue.resolved = issue.status === 'Closed';
        if (issue.resolved && !issue.resolvedDate) {
          issue.resolvedDate = new Date().toISOString().split('T')[0];
        } else if (!issue.resolved) {
          issue.resolvedDate = null;
        }
      }

      const displayedIssue = this.tableList.find(item => item.id === movedCard.id);
      if (displayedIssue) {
        displayedIssue.status = this.getGridStatus(currentList);
        displayedIssue.resolved = displayedIssue.status === 'Closed';
      }
    } else {
      moveItemInArray(this.cards[targetList], event.previousIndex, event.currentIndex);
    }

    this.cards = { ...this.cards };
  }

  toggleCard(card: Card): void {
    card.expanded = !card.expanded;
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Process': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922',
      'Closed': '#639922'
    };
    return colors[status] ?? '#888780';
  }

  getCardClass(status: string): string {
    const classes: Record<string, string> = {
      'Pending': 'pending-card',
      'Allocated': 'allocated-card',
      'Progress': 'progress-card',
      'Hold': 'hold-card',
      'Cancelled': 'cancelled-card',
      'Completed': 'completed-card'
    };
    return classes[status] ?? 'default-card';
  }

  trackByCard(index: number, item: Card): number {
    return item.id;
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/RD/001", name: this.projectName || "Dapagliflozin Film-Coated Tablets" }
    });
  }

  openHistory(item?: any): void {
    const subject = (typeof item === 'object' && item !== null) ? (item.subject || '') : (typeof item === 'string' ? item : '');
    const description = (typeof item === 'object' && item !== null) ? (item.issueDescription || '') : '';
    const dateCreated = (typeof item === 'object' && item !== null) ? (item.createdDate || '') : '';
    const dueDate = (typeof item === 'object' && item !== null) ? (item.dueDate || item.targetDate || '') : '';
    const dateResolved = (typeof item === 'object' && item !== null) ? (item.resolvedDate || '') : '';
    const resolved = (typeof item === 'object' && item !== null) ? !!item.resolved : false;
    const assignedTo = (typeof item === 'object' && item !== null) ? (item.assignedTo || item.responsibility || '') : '';

    this.router.navigate(['/projects/dashboard/issues/history'], {
      queryParams: {
        subject: subject,
        description: description,
        dateCreated: dateCreated,
        dueDate: dueDate,
        dateResolved: dateResolved,
        resolved: resolved,
        assignedTo: assignedTo,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }
}
