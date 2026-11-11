import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AddResourceComponent } from './add-resource/add-resource.component';
import { ResourceTimelineComponent } from './resource-timeline/resource-timeline.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';

export interface ResourceItem {
  code: string;
  name: string;
  selected: boolean;
}

export interface ResourceScheduleItem {
  resource: string;
  initials: string;
  stage: string;
  module: string;
  task: string;
  fromDate: string;
  fromTime: string;
  toDate: string;
  toTime: string;
  planDuration: string;
  actualDuration: string;
  status: string;
  dayPlacement: string;
  color: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-resources',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule
  ],
  templateUrl: './project-resources.component.html',
  styleUrl: './project-resources.component.scss'
})
export class ProjectResourcesComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  activeTab: 'Scheduling' | 'Allocation' = 'Scheduling';
  isCalendarView: boolean = false;
  showWeekend: boolean = false;

  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];
  schedules: ResourceScheduleItem[] = [];
  paginatedSchedules: ResourceScheduleItem[] = [];

  // Pagination for Scheduling table
  currentPage: number = 1;
  pageSize: number = 10;
  isTemplate: boolean = false;
  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isTemplate = params['isTemplate'] === 'true' || params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' || params['fromTemplate'] === true;
      if (this.isTemplate) {
        this.activeTab = 'Allocation';
      }
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.initializeData();
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    this.schedules.forEach((s, idx) => {
      if (!s.updatedDate) {
        s.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!s.updatedBy) {
        s.updatedBy = s.resource || 'Dr. Sarah Jenkins';
      }
    });
    this.updatePagination();
  }

  initializeData(): void {
    this.availableResources = [
      { code: 'RES001', name: 'Lyophilizer A', selected: false },
      { code: 'RES002', name: 'Anita Desai', selected: false },
      { code: 'RES003', name: 'Lyophilizer B', selected: false },
      { code: 'RES004', name: 'Amit Patel', selected: false },
      { code: 'RES005', name: 'Lyophilizer C', selected: false },
      { code: 'RES006', name: 'Deepa Nair', selected: false },
      { code: 'RES007', name: 'Arun Joseph', selected: false },
      { code: 'RES008', name: 'Lakshmi Devi', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES009', name: 'Vikram Singh', selected: false },
      { code: 'RES010', name: 'Neha Sharma', selected: false },
      { code: 'RES011', name: 'Rohit Mehta', selected: false },
      { code: 'RES012', name: 'Kiran Rao', selected: false },
      { code: 'RES013', name: 'Harish Babu', selected: false }
    ];

    this.schedules = [
      {
        resource: 'Lyophilizer A', initials: 'LA', stage: 'Feasibility', module: 'API Assessment',
        task: 'API Evaluation', fromDate: '2026-06-01', fromTime: '09:00 AM', toDate: '2026-06-05',
        toTime: '05:00 PM', planDuration: '5 days', actualDuration: '5 days',
        status: 'Completed', dayPlacement: 'Monday', color: '#dcfce7'
      },
      {
        resource: 'Anita Desai', initials: 'AD', stage: 'Formulation', module: 'Formulation Development',
        task: 'Excipient Selection & Trial Batches', fromDate: '2026-06-08', fromTime: '09:00 AM', toDate: '2026-06-21',
        toTime: '05:00 PM', planDuration: '14 days', actualDuration: '12 days',
        status: 'Completed', dayPlacement: 'Tuesday', color: '#dcfce7'
      },
      {
        resource: 'Lyophilizer B', initials: 'LB', stage: 'Development', module: 'Process Development',
        task: 'Granulation & Process Optimization', fromDate: '2026-06-22', fromTime: '09:00 AM', toDate: '2026-07-02',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: '8 days',
        status: 'Active', dayPlacement: 'Wednesday', color: '#e0f2fe'
      },
      {
        resource: 'Amit Patel', initials: 'AP', stage: 'Testing', module: 'Analytical Development',
        task: 'Assay & Dissolution Testing', fromDate: '2026-07-03', fromTime: '09:00 AM', toDate: '2026-07-13',
        toTime: '05:00 PM', planDuration: '10 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Thursday', color: '#ffedd5'
      },
      {
        resource: 'Lyophilizer C', initials: 'LC', stage: 'Manufacturing', module: 'Compression & Coating',
        task: 'Tablet Manufacturing Trial', fromDate: '2026-07-14', fromTime: '09:00 AM', toDate: '2026-07-25',
        toTime: '05:00 PM', planDuration: '12 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Friday', color: '#ffedd5'
      },
      {
        resource: 'Deepa Nair', initials: 'DN', stage: 'Validation', module: 'Process Validation',
        task: 'Validation Batch', fromDate: '2026-07-27', fromTime: '09:00 AM', toDate: '2026-08-10',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Monday', color: '#ffedd5'
      },
      {
        resource: 'Arun Joseph', initials: 'AJ', stage: 'Stability', module: 'Stability Study',
        task: 'Stability Testing', fromDate: '2026-08-11', fromTime: '09:00 AM', toDate: '2026-09-10',
        toTime: '05:00 PM', planDuration: '30 days', actualDuration: 'N/A',
        status: 'Active', dayPlacement: 'Tuesday', color: '#e0f2fe'
      },
      {
        resource: 'Lakshmi Devi', initials: 'LD', stage: 'Regulatory', module: 'Regulatory Submission',
        task: 'Dossier Compilation', fromDate: '2026-09-11', fromTime: '09:00 AM', toDate: '2026-09-25',
        toTime: '05:00 PM', planDuration: '15 days', actualDuration: 'N/A',
        status: 'Pending', dayPlacement: 'Wednesday', color: '#ffedd5'
      }
    ];

    this.schedules.forEach((s, idx) => {
      if (!s.historyCount) {
        s.historyCount = (idx % 10) + 1;
      }
    });
  }

  // Timeline modal
  openTimelineModal(item: ResourceScheduleItem): void {
    this.dialog.open(ResourceTimelineComponent, {
      width: '650px',
      maxWidth: '95vw',
      data: item
    });
  }

  updatePagination(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedSchedules = this.schedules.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  setTab(tab: 'Scheduling' | 'Allocation'): void {
    if (this.isTemplate && tab === 'Scheduling') return;
    this.activeTab = tab;
  }

  setCalendarView(val: boolean): void {
    this.isCalendarView = val;
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
  }

  get displayDays(): string[] {
    return this.showWeekend
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  }

  getSchedulesForDay(day: string): ResourceScheduleItem[] {
    return this.schedules.filter(s => s.dayPlacement === day);
  }

  // Allocation Tab Methods
  toggleAvailableSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  toggleAllocatedSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  allocateResources(): void {
    const selected = this.availableResources.filter(r => r.selected);
    this.allocatedResources.push(...selected);
    this.availableResources = this.availableResources.filter(r => !r.selected);
    this.allocatedResources.forEach(r => r.selected = false);
  }

  deallocateResources(): void {
    const selected = this.allocatedResources.filter(r => r.selected);
    this.availableResources.push(...selected);
    this.allocatedResources = this.allocatedResources.filter(r => !r.selected);
    this.availableResources.forEach(r => r.selected = false);
  }

  canAllocate(): boolean {
    return this.availableResources.some(r => r.selected);
  }

  canDeallocate(): boolean {
    return this.allocatedResources.some(r => r.selected);
  }

  openAddResourceDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newRes: ResourceItem = {
          code: result.code,
          name: result.name || result.resource,
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  openAddResourceScheduleDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        this.schedules.unshift(result);
        this.updatePagination();
      }
    });
  }

  editSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: item
    });

    dialogRef.afterClosed().subscribe((result: ResourceScheduleItem | undefined) => {
      if (result) {
        Object.assign(item, result);
        this.updatePagination();
      }
    });
  }

  deleteSchedule(item: ResourceScheduleItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this record?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.schedules = this.schedules.filter(s => s !== item);
        this.updatePagination();
      }
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

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  openHistory(item?: any): void {
    const resource = (typeof item === 'object' && item !== null) ? (item.resource || '') : (typeof item === 'string' ? item : '');
    const stage = (typeof item === 'object' && item !== null) ? (item.stage || '') : '';
    const deliverable = (typeof item === 'object' && item !== null) ? (item.module || '') : '';
    const activity = (typeof item === 'object' && item !== null) ? (item.task || '') : '';
    const planDuration = (typeof item === 'object' && item !== null) ? (item.planDuration || '') : '';
    const actualDuration = (typeof item === 'object' && item !== null) ? (item.actualDuration || '') : '';

    this.router.navigate(['/projects/dashboard/resources/history'], {
      queryParams: {
        resource: resource,
        stage: stage,
        deliverable: deliverable,
        activity: activity,
        planDuration: planDuration,
        actualDuration: actualDuration,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
