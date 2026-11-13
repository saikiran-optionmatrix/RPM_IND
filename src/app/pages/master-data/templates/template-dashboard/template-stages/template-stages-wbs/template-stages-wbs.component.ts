import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { AddSimulationComponent } from '../../../../../projects/project-dashboard/project-stages/project-wbs/add-simulation/add-simulation.component';
import { INDUSTRIAL_STAGES_WBS_MAP } from '../../../../../stages/industrial-stages.data';

export interface WbsActivityItem {
  id: number;
  activityName: string;
  jobCode: string;
  department: string;
  responsibility: string;
  priority: 'High' | 'Medium' | 'Low';
  status: boolean;
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
  actualDuration?: string;
  actualEffort?: string;
  dueDate?: string;
  description?: string;
}

export interface WbsDeliverable {
  id: number;
  name: string;
  activities: WbsActivityItem[];
}

@Component({
  selector: 'app-template-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './template-stages-wbs.component.html',
  styleUrl: './template-stages-wbs.component.scss'
})
export class TemplateStagesWbsComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';
  projectCode: string =
    this.route.snapshot.queryParamMap.get('projectCode') ||
    this.route.snapshot.queryParamMap.get('code') ||
    'TPL/IND/001';
  stageCode: string = this.route.snapshot.queryParamMap.get('stageCode') || 'S1';
  stageName: string = this.route.snapshot.queryParamMap.get('stageName') || 'Business Need & Opportunity Assessment';

  // Filter properties
  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';

  // Pagination properties
  pageIndex = 0;
  pageSize = 10;

  readonly delayReasonOptions: string[] = [
    'Critical Component / Raw Material Shortage',
    'Site Permit / Statutory Compliance Approval Pending',
    'Long-Lead Equipment / Vendor Shipment Delay',
  ];

  private buildDeliverablesForStage(code: string): WbsDeliverable[] {
    const owners = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu', 'Amit Patel'];
    const wbsConfig = INDUSTRIAL_STAGES_WBS_MAP[code] || INDUSTRIAL_STAGES_WBS_MAP['S1'];
    let seq = 1;
    return (wbsConfig?.sidebarMenus ?? []).map((deliv, dIdx) => {
      const rawActs = wbsConfig?.modulesData?.[dIdx] ?? [];
      return {
        id: dIdx + 1,
        name: deliv.name,
        activities: rawActs.map((act, aIdx) => {
          const idx = seq++;
          return {
            id: (dIdx + 1) * 100 + aIdx + 1,
            activityName: act.task,
            jobCode: act.jobCode || `ACT${idx}`,
            department: act.department || 'Engineering & R&D',
            responsibility: act.assignedTo || owners[idx % owners.length],
            priority: idx % 3 === 0 ? 'Medium' : 'High',
            status: true,
            requirements: act.requirements || `${5 + (idx % 6)}/13`,
            tasks: act.tasks || `${6 + (idx % 8)}/16`,
            delayReason: idx % 3 === 1 ? this.delayReasonOptions[idx % this.delayReasonOptions.length] : undefined,
            planStart: `2026-01-${String(10 + (idx % 15)).padStart(2, '0')}`,
            planEnd: `2026-02-${String(10 + (idx % 15)).padStart(2, '0')}`,
            actualStart: `2026-01-${String(10 + (idx % 15)).padStart(2, '0')}`,
            actualEnd: idx <= 2 ? `2026-02-${String(8 + (idx % 15)).padStart(2, '0')}` : '',
            eta: `2026-02-${String(10 + (idx % 15)).padStart(2, '0')}`,
            planDuration: act.duration || '10 days',
            planEffort: act.effort || '40 hrs',
            actualDuration: act.actual || act.duration || '9 days',
            actualEffort: act.worked || act.effort || '36 hrs',
            description: act.description || `${deliv.name} — ${act.task} executed by ${act.department || 'Engineering'}.`
          };
        })
      };
    });
  }

  deliverables: WbsDeliverable[] = this.buildDeliverablesForStage(this.stageCode);

  selectedDeliverable: WbsDeliverable = this.deliverables[0];

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Activity Modal state
  showActivityModal = false;
  isEditActivityMode = false;
  activityModalData: Partial<WbsActivityItem> = {};
  activityModalIndex = -1;

  private routeSub?: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly location: Location
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['stageName']) {
        this.stageName = params['stageName'];
      }
      if (params['stageCode']) {
        this.stageCode = params['stageCode'];
      }
      this.deliverables = this.buildDeliverablesForStage(this.stageCode);
      if (this.deliverables.length > 0) {
        this.selectedDeliverable = this.deliverables[0];
      }
    });

    if (this.deliverables.length > 0) {
      this.selectedDeliverable = this.deliverables[0];
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
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
    this.location.back();
  }

  goToSchedule(): void {
    this.location.back();
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
      status: true,
      requirements: '0/13',
      tasks: '0/16',
      planStart: '',
      planEnd: '',
      planDuration: '',
      planEffort: '',
      description: ''
    };
    this.showActivityModal = true;
  }

  openEditActivity(item: WbsActivityItem, index: number): void {
    this.isEditActivityMode = true;
    this.activityModalIndex = index;
    this.activityModalData = { ...item };
    this.showActivityModal = true;
  }

  saveActivity(): void {
    if (!this.activityModalData.activityName || !this.selectedDeliverable) return;

    if (this.isEditActivityMode && this.activityModalIndex > -1) {
      this.selectedDeliverable.activities[this.activityModalIndex] = {
        ...this.selectedDeliverable.activities[this.activityModalIndex],
        ...this.activityModalData
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
        requirements: this.activityModalData.requirements || '0/13',
        tasks: this.activityModalData.tasks || '0/16',
        planStart: this.activityModalData.planStart,
        planEnd: this.activityModalData.planEnd,
        planDuration: this.activityModalData.planDuration,
        planEffort: this.activityModalData.planEffort,
        description: this.activityModalData.description
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
        projectCode: this.projectCode,
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
        projectCode: this.projectCode,
        tasks: item?.tasks
      },
      queryParamsHandling: 'merge'
    });
  }
}
