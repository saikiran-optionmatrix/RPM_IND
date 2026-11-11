import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { DocumentsPopComponent } from '../../../../../common/shared/documents-pop/documents-pop.component';
import { AddSimulationComponent } from './add-simulation/add-simulation.component';
import { ProjectWbsRequirementsComponent } from './project-wbs-requirements/project-wbs-requirements.component';
import { ProjectWbsTasksComponent } from './project-wbs-tasks/project-wbs-tasks.component';
import { StagesPredecessorComponent } from '../../../../stages/stages-wbs/stages-predecessor/stages-predecessor.component';

export interface WbsActivityItem {
  id: number;
  activityName: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
  predecessor?: string;
  predecessorsData?: any[];
  requirements?: string;
  tasks?: string;
  delayReason?: string;
  requirementsData?: any[];
  tasksData?: any[];
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  planDuration?: string;
  planEffort?: string;
  planBudget?: string;
  actualCost?: string;
  actualDuration?: string;
  actualEffort?: string;
  dueDate?: string;
  description?: string;
  historyCount?: number;
  documentsCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface WbsDeliverable {
  id: number;
  name: string;
  activities: WbsActivityItem[];
}

@Component({
  selector: 'app-project-wbs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,

  ],
  templateUrl: './project-wbs.component.html',
  styleUrl: './project-wbs.component.scss',
})
export class ProjectWbsComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  projectName: string = 'Abiraterone Acetate Film Coated';
  projectCode: string = '2026/RD/001';
  stageCode: string = 'S2';
  stageName: string = 'Product / Project In Initiation';

  // Inner screen view state
  currentView: 'wbs' | 'requirements' | 'tasks' = 'wbs';
  selectedActivity: WbsActivityItem | null = null;

  // Filter properties matching AssetsComponent
  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';

  // Pagination properties matching AssetsComponent
  pageIndex = 0;
  pageSize = 10;

  readonly delayReasonOptions: string[] = [
    'Raw Material Shortage',
    'Regulatory Approval Pending',
    'Vendor Dispatch Delay',
  ];

  deliverables: WbsDeliverable[] = [
    {
      id: 1,
      name: 'Project costing sheet preparation & Selection of Project / Product',
      activities: [
        {
          id: 101,
          activityName: 'Analytical costing, External CRO costing',
          jobCode: 'ACT1',
          department: 'Management',
          responsibility: 'Olivia Brown',
          priority: 'High',
          status: true,
          requirements: '7/13',
          tasks: '6/16',
          delayReason: 'Raw Material Shortage',
          planStart: '2026-01-16',
          planEnd: '2026-01-20',
          actualStart: '2026-01-16',
          actualEnd: '2026-01-20',
          eta: '2026-01-20',
          planDuration: '5 days',
          planEffort: '40 hrs',
          actualDuration: '5 days',
          actualEffort: '38 hrs',
          description: 'Detailed costing for analytical methods and CRO outsourcing packages.'
        },
        {
          id: 102,
          activityName: 'RM, PM, API & RLD costing',
          jobCode: 'ACT2',
          department: 'Management',
          responsibility: 'Aarav Shah',
          priority: 'Medium',
          status: true,
          requirements: '4/13',
          tasks: '4/16',
          delayReason: 'Regulatory Approval Pending',
          planStart: '2026-01-18',
          planEnd: '2026-01-23',
          actualStart: '2026-01-18',
          actualEnd: '',
          eta: '2026-01-23',
          planDuration: '6 days',
          planEffort: '48 hrs',
          actualDuration: '4 days',
          actualEffort: '32 hrs',
          description: 'Raw materials, packaging, reference listed drug & active ingredient costing estimates.'
        },
        {
          id: 103,
          activityName: 'BE Costing',
          jobCode: 'ACT3',
          department: 'Management',
          responsibility: 'Diego Ruiz',
          priority: 'High',
          status: true,
          requirements: '9/13',
          tasks: '9/16',
          delayReason: 'Vendor Dispatch Delay',
          planStart: '2026-01-21',
          planEnd: '2026-01-25',
          actualStart: '2026-01-21',
          actualEnd: '',
          eta: '2026-01-25',
          planDuration: '5 days',
          planEffort: '35 hrs',
          actualDuration: '2 days',
          actualEffort: '16 hrs',
          description: 'Bioequivalence study budgeting and CRO quote negotiation.'
        }
      ]
    },
    {
      id: 2,
      name: 'Provincial Product Initiation Form (PPIF)',
      activities: [
        {
          id: 201,
          activityName: 'PPIF Draft & Business Case Sign-off',
          jobCode: 'ACT4',
          department: 'Management',
          responsibility: 'Olivia Brown',
          priority: 'High',
          status: true,
          requirements: '8/13',
          tasks: '6/16',
          planStart: '2026-01-20',
          planEnd: '2026-01-25',
          actualStart: '2026-01-20',
          actualEnd: '',
          eta: '2026-01-25',
          planDuration: '5 days',
          planEffort: '30 hrs',
          description: 'Formulation and regulatory alignment on product initiation parameters.'
        }
      ]
    },
    {
      id: 3,
      name: 'Literature serach & MER',
      activities: [
        {
          id: 301,
          activityName: 'Prior Art & Patent Landscape Search',
          jobCode: 'ACT5',
          department: 'Management',
          responsibility: 'Aarav Shah',
          priority: 'High',
          status: true,
          requirements: '12/13',
          tasks: '15/16',
          planStart: '2026-01-22',
          planEnd: '2026-01-26',
          planDuration: '5 days',
          planEffort: '25 hrs',
          description: 'Patent non-infringement analysis and freedom-to-operate review.'
        },
        {
          id: 302,
          activityName: 'Medical Evaluation Report (MER) Preparation',
          jobCode: 'ACT6',
          department: 'Medical Affairs',
          responsibility: 'Olivia Brown',
          priority: 'Medium',
          status: true,
          requirements: '4/13',
          tasks: '8/16',
          planStart: '2026-01-24',
          planEnd: '2026-01-28',
          planDuration: '5 days',
          planEffort: '30 hrs',
          description: 'Clinical safety and efficacy data compilation for product dossier.'
        },
        {
          id: 303,
          activityName: 'Clinical Summary and Bio-study Protocol Design',
          jobCode: 'ACT7',
          department: 'Management',
          responsibility: 'Diego Ruiz',
          priority: 'Low',
          status: true,
          requirements: '10/13',
          tasks: '3/16',
          planStart: '2026-01-26',
          planEnd: '2026-01-30',
          planDuration: '5 days',
          planEffort: '20 hrs',
          description: 'Design of pilot and pivotal BE study clinical protocols.'
        }
      ]
    },
    {
      id: 4,
      name: 'Pre Product Development Strategy (PPDS) finalization',
      activities: [
        {
          id: 401,
          activityName: 'PPDS Formulation & QbD Strategy Finalization',
          jobCode: 'ACT8',
          department: 'Formulation',
          responsibility: 'Diego Ruiz',
          priority: 'High',
          status: true,
          requirements: '9/13',
          tasks: '14/16',
          planStart: '2026-01-27',
          planEnd: '2026-02-02',
          planDuration: '6 days',
          planEffort: '45 hrs',
          description: 'Target product profile definition and risk assessment framework.'
        }
      ]
    },
    {
      id: 5,
      name: 'Test license/NOC',
      activities: [
        {
          id: 501,
          activityName: 'Form 29 / Test License Application Filing',
          jobCode: 'ACT9',
          department: 'Regulatory',
          responsibility: 'Aarav Shah',
          priority: 'High',
          status: true,
          requirements: '6/13',
          tasks: '10/16',
          planStart: '2026-01-28',
          planEnd: '2026-02-05',
          planDuration: '8 days',
          planEffort: '40 hrs',
          description: 'Filing of license for manufacturing drugs for examination/test/analysis.'
        },
        {
          id: 502,
          activityName: 'State FDA / CDSCO Query Resolution',
          jobCode: 'ACT10',
          department: 'Regulatory',
          responsibility: 'Aarav Shah',
          priority: 'Medium',
          status: true,
          requirements: '13/13',
          tasks: '7/16',
          planStart: '2026-02-06',
          planEnd: '2026-02-12',
          planDuration: '7 days',
          planEffort: '35 hrs',
          description: 'Responding to regulatory authority queries.'
        },
        {
          id: 503,
          activityName: 'NOC & Test License Receipt & Archival',
          jobCode: 'ACT11',
          department: 'Regulatory',
          responsibility: 'Olivia Brown',
          priority: 'Low',
          status: true,
          requirements: '3/13',
          tasks: '5/16',
          planStart: '2026-02-13',
          planEnd: '2026-02-16',
          planDuration: '4 days',
          planEffort: '16 hrs',
          description: 'Official test license receipt and upload to document repository.'
        }
      ]
    },
    {
      id: 6,
      name: 'RLD import license - Form 11 for Developmental',
      activities: [
        {
          id: 601,
          activityName: 'Form 11 Application Submission for RLD Import',
          jobCode: 'ACT12',
          department: 'Supply Chain',
          responsibility: 'Olivia Brown',
          priority: 'High',
          status: true,
          requirements: '11/13',
          tasks: '8/16',
          planStart: '2026-02-01',
          planEnd: '2026-02-08',
          planDuration: '8 days',
          planEffort: '32 hrs',
          description: 'Application for import of RLD samples from innovator market.'
        },
        {
          id: 602,
          activityName: 'Customs Clearance & Sample Receipt at Analytical Lab',
          jobCode: 'ACT13',
          department: 'Logistics',
          responsibility: 'Diego Ruiz',
          priority: 'Medium',
          status: true,
          requirements: '2/13',
          tasks: '4/16',
          planStart: '2026-02-09',
          planEnd: '2026-02-15',
          planDuration: '7 days',
          planEffort: '24 hrs',
          description: 'Receipt and QC check of reference standard batch.'
        }
      ]
    }
  ];

  selectedDeliverable: WbsDeliverable = this.deliverables[0];

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Activity Modal state
  showActivityModal = false;
  isEditActivityMode = false;
  activityModalData: Partial<WbsActivityItem> = {};
  activityModalIndex = -1;

  readonly historySequence: number[] = [4, 7, 2, 9, 3, 8, 1, 6, 5, 10, 3, 6, 2, 8, 4, 7, 5, 1, 9, 2];
  readonly documentsSequence: number[] = [3, 1, 5, 2, 4, 2, 6, 1, 3, 4, 2, 5, 3, 1, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

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
      if (params['code']) {
        this.projectCode = params['code'];
      }
      if (params['stageName']) {
        this.stageName = params['stageName'];
      }
      if (params['stageCode']) {
        this.stageCode = params['stageCode'];
      }
    });

    const sampleDates = [
      '2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30',
      '2026-01-28', '2026-01-25', '2026-01-22', '2026-01-20', '2026-01-18'
    ];
    const samplePredecessors = ['6', '7', '5', '4', '3', '8', '2', '6', '5', '7'];
    let count = 0;
    this.deliverables.forEach(d => {
      d.activities.forEach(a => {
        a.historyCount = this.historySequence[count % this.historySequence.length];
        a.documentsCount = this.documentsSequence[count % this.documentsSequence.length];
        if (!a.predecessor) {
          a.predecessor = samplePredecessors[count % samplePredecessors.length];
        }
        if (!a.updatedDate) {
          a.updatedDate = sampleDates[count % sampleDates.length];
        }
        if (!a.updatedBy) {
          a.updatedBy = a.responsibility || 'Dr. Sarah Jenkins';
        }
        if (!a.planBudget) {
          const sampleBudgets = ['$15,000', '$22,500', '$18,000', '$12,500', '$30,000', '$8,500', '$25,000'];
          a.planBudget = sampleBudgets[count % sampleBudgets.length];
        }
        if (!a.actualCost) {
          const sampleCosts = ['$13,800', '$21,000', '$17,200', '$12,500', '$28,400', '$7,900', '$24,100'];
          a.actualCost = sampleCosts[count % sampleCosts.length];
        }
        count++;
      });
    });

    if (this.deliverables.length > 0) {
      this.selectedDeliverable = this.deliverables[0];
    }
  }

  get filteredActivities(): WbsActivityItem[] {
    if (!this.selectedDeliverable || !this.selectedDeliverable.activities) {
      return [];
    }
    return this.selectedDeliverable.activities.filter(item => {
      const keywordMatches =
        !this.searchKeyword ||
        item.activityName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.jobCode.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.department.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.responsibility.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const itemStatusStr = item.status ? 'Active' : 'Inactive';
      const statusMatches = !this.searchStatus || itemStatusStr === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedActivities(): WbsActivityItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredActivities.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  selectDeliverable(d: WbsDeliverable): void {
    this.selectedDeliverable = d;
    this.pageIndex = 0;
  }

  deleteDeliverable(d: WbsDeliverable, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Deliverable', content: `Are you sure you want to delete "${d.name}"?` }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deliverables = this.deliverables.filter(item => item.id !== d.id);
        if (this.selectedDeliverable?.id === d.id) {
          this.selectedDeliverable = this.deliverables[0] || null;
          this.pageIndex = 0;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/stages'], {
      queryParamsHandling: 'preserve'
    });
  }

  goToSchedule(): void {
    this.router.navigate(['/projects/dashboard/schedule'], {
      queryParamsHandling: 'preserve'
    });
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

  toggleStatus(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status of this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = !item.status;
      }
    });
  }

  deleteActivity(item: WbsActivityItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Activity', content: 'Are you sure you want to delete this activity?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedDeliverable) {
        this.selectedDeliverable.activities = this.selectedDeliverable.activities.filter(a => a.id !== item.id);
      }
    });
  }

  openAddActivity(): void {
    this.isEditActivityMode = false;
    const nextNum = (this.selectedDeliverable?.activities?.length || 0) + 1;
    this.activityModalData = {
      jobCode: 'ACT' + nextNum,
      activityName: '',
      department: 'Management',
      responsibility: '',
      priority: 'Medium',
      predecessor: '—',
      status: true,
      requirements: '0/13',
      tasks: '0/16',
      planStart: '',
      planEnd: '',
      planDuration: '',
      planEffort: '',
      planBudget: '',
      actualCost: '',
      description: ''
    };
    this.showActivityModal = true;
  }

  openEditActivity(item: WbsActivityItem, index: number): void {
    this.isEditActivityMode = true;
    const realIndex = this.selectedDeliverable?.activities ? this.selectedDeliverable.activities.findIndex(a => a.id === item.id) : index;
    this.activityModalIndex = realIndex !== -1 ? realIndex : index;
    this.activityModalData = { ...item };
    this.showActivityModal = true;
  }

  saveActivity(): void {
    if (!this.activityModalData.activityName || !this.selectedDeliverable) return;

    if (this.isEditActivityMode && this.activityModalIndex > -1) {
      this.selectedDeliverable.activities[this.activityModalIndex] = {
        ...this.selectedDeliverable.activities[this.activityModalIndex],
        ...this.activityModalData,
        predecessor: this.activityModalData.predecessor || this.selectedDeliverable.activities[this.activityModalIndex].predecessor || '—',
        updatedDate: new Date().toISOString().split('T')[0],
        updatedBy: this.activityModalData.responsibility || 'Dr. Sarah Jenkins'
      } as WbsActivityItem;
    } else {
      const newAct: WbsActivityItem = {
        id: Date.now(),
        activityName: this.activityModalData.activityName || '',
        jobCode: this.activityModalData.jobCode || 'ACT' + (this.selectedDeliverable.activities.length + 1),
        department: this.activityModalData.department || 'Management',
        responsibility: this.activityModalData.responsibility || 'Unassigned',
        priority: this.activityModalData.priority || 'Medium',
        status: true,
        predecessor: this.activityModalData.predecessor || '—',
        requirements: this.activityModalData.requirements || '0/13',
        tasks: this.activityModalData.tasks || '0/16',
        planStart: this.activityModalData.planStart,
        planEnd: this.activityModalData.planEnd,
        planDuration: this.activityModalData.planDuration,
        planEffort: this.activityModalData.planEffort,
        planBudget: this.activityModalData.planBudget,
        actualCost: this.activityModalData.actualCost,
        description: this.activityModalData.description,
        updatedDate: new Date().toISOString().split('T')[0],
        updatedBy: this.activityModalData.responsibility || 'Dr. Sarah Jenkins'
      };
      this.selectedDeliverable.activities.push(newAct);
    }
    this.closeActivityModal();
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
    this.activityModalData = {};
    this.activityModalIndex = -1;
  }

  openPredecessor(item?: WbsActivityItem): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: {
        mode: 'edit',
        row: {
          ...item,
          task: item?.activityName,
          slNo: item?.jobCode
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && item) {
        if (result.predecessors) {
          item.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          item.predecessor = String(result.predecessor);
        }
      }
    });
  }

  openTimelineModal(item: WbsActivityItem): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
  }

  openAddSimulation(): void {
    const dialogRef = this.dialog.open(AddSimulationComponent, {
      width: '550px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Simulation data saved:', result);
      }
    });
  }






  openDocuments(): void {
    this.dialog.open(DocumentsPopComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh'
    });
  }

  openHistory(item?: WbsActivityItem): void {
    this.router.navigate(['history'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        responsibility: item?.responsibility,
        delayReason: item?.delayReason,
        priority: item?.priority,
        updatedDate: item?.updatedDate,
        updatedBy: item?.updatedBy,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  assignrequirement(item?: WbsActivityItem): void {
    this.router.navigate(['requirements'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        requirements: item?.requirements
      },
      queryParamsHandling: 'merge'
    });
  }

  assigntasks(item?: WbsActivityItem): void {
    this.router.navigate(['tasks'], {
      relativeTo: this.route,
      queryParams: {
        activityName: item?.activityName,
        jobCode: item?.jobCode,
        department: item?.department,
        stageName: this.stageName,
        stageCode: this.stageCode,
        projectName: this.projectName,
        tasks: item?.tasks
      },
      queryParamsHandling: 'merge'
    });
  }

  closeInnerScreen(result?: any): void {
    if (result && this.selectedActivity) {
      if (this.currentView === 'requirements' && result.count !== undefined) {
        const denom = (this.selectedActivity.requirements || '').split('/')[1] || '13';
        this.selectedActivity.requirements = `${result.count}/${denom}`;
        if (result.requirements) {
          this.selectedActivity.requirementsData = result.requirements;
        }
      } else if (this.currentView === 'tasks' && result.count !== undefined) {
        const denom = (this.selectedActivity.tasks || '').split('/')[1] || '16';
        this.selectedActivity.tasks = `${result.count}/${denom}`;
        if (result.tasks) {
          this.selectedActivity.tasksData = result.tasks;
        }
      }
    }
    this.currentView = 'wbs';
    this.selectedActivity = null;
  }
}
