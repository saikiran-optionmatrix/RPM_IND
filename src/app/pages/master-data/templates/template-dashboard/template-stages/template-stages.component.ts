import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { INDUSTRIAL_STAGES_MASTER, INDUSTRIAL_STAGES_WBS_MAP } from '../../../../stages/industrial-stages.data';

export interface StageItem {
  stageCode: string;
  name: string;
  planEffort: string;
  planDuration: string;
  actualEffort?: string;
  actualDuration?: string;
  percentCompletion?: number;
  done?: boolean;
  description: string;
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
  eta: string;
  buffer: string;
  gateName: string;
  gateStatus: 'Approved' | 'Pending' | 'Rejected';
  gateCode: string;
  status: boolean;
  setupCount: number;
}

@Component({
  selector: 'app-template-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
  ],
  templateUrl: './template-stages.component.html',
  styleUrl: './template-stages.component.scss',
})
export class TemplateStagesComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Industrial Equipment Line Expansion Program';

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  private readonly gateNames: Record<string, string> = {
    'Gate 1': 'Business Case Approval',
    'Gate 2': 'Concept Selection & Design Freeze',
    'Gate 3': 'Procurement & Build Readiness',
    'Gate 4': 'Commissioning & Performance Acceptance',
    'Gate 5': 'Operational Handover Approval',
  };

  private readonly scheduleDates: Record<string, { ps: string; pe: string; buf: string }> = {
    S1:  { ps: '2026-01-05', pe: '2026-02-20', buf: '2 days' },
    S2:  { ps: '2026-02-21', pe: '2026-03-12', buf: '2 days' },
    S3:  { ps: '2026-03-13', pe: '2026-04-28', buf: '3 days' },
    S4:  { ps: '2026-04-29', pe: '2026-07-15', buf: '5 days' },
    S5:  { ps: '2026-07-16', pe: '2026-08-30', buf: '3 days' },
    S6:  { ps: '2026-09-01', pe: '2026-10-30', buf: '4 days' },
    S7:  { ps: '2026-11-01', pe: '2026-12-20', buf: '4 days' },
    S8:  { ps: '2026-12-21', pe: '2027-02-05', buf: '3 days' },
    S9:  { ps: '2027-02-06', pe: '2027-03-15', buf: '2 days' },
    S10: { ps: '2027-03-16', pe: '2027-05-10', buf: '4 days' },
    S11: { ps: '2027-05-11', pe: '2027-07-15', buf: '10 days' },
    S12: { ps: '2027-07-16', pe: '2027-08-31', buf: '3 days' },
  };

  stages: StageItem[] = INDUSTRIAL_STAGES_MASTER.map((s) => {
    const sched = this.scheduleDates[s.stageCode] ?? { ps: '2026-01-05', pe: '2026-02-15', buf: '2 days' };
    const gateCode = s.gateCode && s.gateCode !== '-' ? s.gateCode : '-';
    const gateName = gateCode !== '-' ? (this.gateNames[gateCode] ?? gateCode) : '-';
    const effortStr = `${s.planEffort.toLocaleString()} hrs`;
    const durStr = `${s.planDuration} days`;
    const wbsCount = INDUSTRIAL_STAGES_WBS_MAP[s.stageCode]?.sidebarMenus?.length ?? s.tasks;
    return {
      stageCode: s.stageCode,
      name: s.stageName,
      planEffort: effortStr,
      planDuration: durStr,
      actualEffort: effortStr,
      actualDuration: durStr,
      percentCompletion: 0,
      done: false,
      description: s.description,
      planStart: sched.ps,
      planEnd: sched.pe,
      actualStart: sched.ps,
      actualEnd: sched.pe,
      eta: sched.pe,
      buffer: sched.buf,
      gateName,
      gateStatus: 'Approved' as const,
      gateCode,
      status: true,
      setupCount: wbsCount,
    };
  });

  // Stage table pagination
  pagedStagesList: StageItem[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 10;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    const sub = this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
    });
    this.subs.add(sub);

    this.updatePagedStages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  // Scrolling logic
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

  // Pagination
  updatePagedStages() {
    const start = this.currentPage * this.pageSize;
    this.pagedStagesList = this.stages.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedStages();
  }

  get pagedStages(): StageItem[] {
    return this.pagedStagesList;
  }

  toggleStatus(item: StageItem): void {
    item.status = !item.status;
  }

  getSliderColor(percent: number): string {
    if (percent === 100) return '#008000';
    if (!percent || percent === 0) return '#ff0000';
    if (percent <= 30) return '#ff0000';
    if (percent <= 80) return '#ffb300';
    return '#008000';
  }

  onDoneChange(s: StageItem, checked: boolean): void {
    s.done = checked;
    s.percentCompletion = checked ? 100 : 0;
  }

  openTimelineModal(item: any) {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    this.setBodyScrollLock(true);
  }

  closeTimelineModal() {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    this.setBodyScrollLock(false);
  }

  openSetup(item: StageItem) {
    this.router.navigate(['stages/wbs'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: item.stageCode,
        stageName: item.name,
        projectName: this.projectName,
      },
      queryParamsHandling: 'merge',
    });
  }

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }
}
