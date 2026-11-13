import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';
import { DocumentsPopComponent } from '../../../../common/shared/documents-pop/documents-pop.component';
import { INDUSTRIAL_STAGES_MASTER, INDUSTRIAL_STAGES_WBS_MAP } from '../../../stages/industrial-stages.data';

// Adjust path based on your project structure
// import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

export interface GanttBar {
  name: string;
  planStart: string;
  planEnd: string;
  planEffort: string;
}

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
  expanded?: boolean;
  bars?: GanttBar[];
  historyCount?: number;
  documentsCount?: number;
  updated?: string;
  updatedDate?: string;
  updatedBy?: string;
  // WBS modules omitted as per request
}

@Component({
  selector: 'app-project-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './project-stages.component.html',
  styleUrl: './project-stages.component.scss',
})
export class ProjectStagesComponent implements OnInit, OnDestroy {

  // Project Header Properties
  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Stages';

  // --- Migrated Properties ---
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  activeView: 'grid' | 'gantt' = 'grid';
  ganttScale: 'monthly' | 'weekly' | 'daily' = 'monthly';

  stageOptions: string[] = INDUSTRIAL_STAGES_MASTER.map(s => s.stageName);

  private readonly gateTitleMap: Record<string, string> = {
    'Gate 1': 'Business Case Approval',
    'Gate 2': 'Concept Selection & Design Freeze',
    'Gate 3': 'Procurement & Build Readiness',
    'Gate 4': 'Commissioning & Performance Acceptance',
    'Gate 5': 'Operational Handover Approval'
  };

  private readonly stageSchedulePresets: Record<string, {
    planStart: string; planEnd: string; actualStart: string; actualEnd: string; eta: string;
    buffer: string; percentCompletion: number; gateStatus: 'Approved' | 'Pending' | 'Rejected';
  }> = {
    S1:  { planStart: '2026-01-05', planEnd: '2026-02-05', actualStart: '2026-01-05', actualEnd: '2026-02-05', eta: '2026-02-05', buffer: '2 days', percentCompletion: 100, gateStatus: 'Approved' },
    S2:  { planStart: '2026-02-06', planEnd: '2026-03-15', actualStart: '2026-02-06', actualEnd: '2026-03-15', eta: '2026-03-15', buffer: '3 days', percentCompletion: 100, gateStatus: 'Approved' },
    S3:  { planStart: '2026-03-16', planEnd: '2026-05-05', actualStart: '2026-03-16', actualEnd: '2026-05-05', eta: '2026-05-05', buffer: '4 days', percentCompletion: 100, gateStatus: 'Approved' },
    S4:  { planStart: '2026-05-06', planEnd: '2026-07-10', actualStart: '2026-05-06', actualEnd: '', eta: '2026-07-10', buffer: '5 days', percentCompletion: 75, gateStatus: 'Pending' },
    S5:  { planStart: '2026-07-11', planEnd: '2026-09-05', actualStart: '2026-07-11', actualEnd: '', eta: '2026-09-05', buffer: '5 days', percentCompletion: 45, gateStatus: 'Pending' },
    S6:  { planStart: '2026-09-06', planEnd: '2026-11-15', actualStart: '', actualEnd: '', eta: '2026-11-15', buffer: '6 days', percentCompletion: 20, gateStatus: 'Pending' },
    S7:  { planStart: '2026-11-16', planEnd: '2027-01-20', actualStart: '', actualEnd: '', eta: '2027-01-20', buffer: '5 days', percentCompletion: 0, gateStatus: 'Pending' },
    S8:  { planStart: '2027-01-21', planEnd: '2027-03-05', actualStart: '', actualEnd: '', eta: '2027-03-05', buffer: '4 days', percentCompletion: 0, gateStatus: 'Pending' },
    S9:  { planStart: '2027-03-06', planEnd: '2027-05-10', actualStart: '', actualEnd: '', eta: '2027-05-10', buffer: '5 days', percentCompletion: 0, gateStatus: 'Pending' },
    S10: { planStart: '2027-05-11', planEnd: '2027-06-25', actualStart: '', actualEnd: '', eta: '2027-06-25', buffer: '6 days', percentCompletion: 0, gateStatus: 'Pending' },
    S11: { planStart: '2027-06-26', planEnd: '2027-07-31', actualStart: '', actualEnd: '', eta: '2027-07-31', buffer: '4 days', percentCompletion: 0, gateStatus: 'Pending' },
    S12: { planStart: '2027-08-01', planEnd: '2027-08-31', actualStart: '', actualEnd: '', eta: '2027-08-31', buffer: '3 days', percentCompletion: 0, gateStatus: 'Pending' }
  };

  stages: StageItem[] = INDUSTRIAL_STAGES_MASTER.map(s => {
    const preset = this.stageSchedulePresets[s.stageCode] || {
      planStart: '2026-01-05', planEnd: '2026-03-05', actualStart: '', actualEnd: '', eta: '2026-03-05',
      buffer: '3 days', percentCompletion: 0, gateStatus: 'Pending' as const
    };
    const wbs = INDUSTRIAL_STAGES_WBS_MAP[s.stageCode];
    const bars: GanttBar[] = (wbs?.sidebarMenus || []).map(menu => ({
      name: menu.name,
      planStart: preset.planStart,
      planEnd: preset.planEnd,
      planEffort: `${Math.max(40, Math.round(s.planEffort / Math.max(1, (wbs?.sidebarMenus?.length || 1))))} hrs`
    }));
    return {
      stageCode: s.stageCode,
      name: s.stageName,
      planEffort: `${s.planEffort} hrs`,
      planDuration: `${s.planDuration} days`,
      actualEffort: preset.percentCompletion === 100 ? `${s.planEffort} hrs` : `${Math.round(s.planEffort * preset.percentCompletion / 100)} hrs`,
      actualDuration: preset.percentCompletion === 100 ? `${s.planDuration} days` : `${Math.round(s.planDuration * preset.percentCompletion / 100)} days`,
      percentCompletion: preset.percentCompletion,
      done: preset.percentCompletion === 100,
      description: s.description,
      planStart: preset.planStart,
      planEnd: preset.planEnd,
      actualStart: preset.actualStart,
      actualEnd: preset.actualEnd,
      eta: preset.eta,
      buffer: preset.buffer,
      gateName: this.gateTitleMap[s.gateCode] || '-',
      gateStatus: preset.gateStatus,
      gateCode: s.gateCode,
      status: true,
      setupCount: s.tasks,
      updatedDate: s.updatedDate || '2026-02-15',
      updated: s.updatedDate || '2026-02-15',
      updatedBy: s.updatedBy || 'Ananya Rao',
      bars
    };
  });

  // Stage table pagination
  pagedStagesList: StageItem[] = [];
  pageSizeOptions = [5, 10, 15, 20];
  pageSize = 15;
  currentPage = 0;

  // Timeline Modal Popup state
  showTimelineModal = false;
  selectedTimelineItem: any = null;

  // Add / Edit Stage Modal states
  showStageModal = false;
  stageModalStep = 1;
  isEditStageMode = false;
  stageModalData: Partial<StageItem> = {};
  stageModalIndex = -1;

  private subs = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog
  ) { }

  readonly historySequence: number[] = [4, 2, 1, 5, 4, 6, 8, 3, 2, 5, 1, 4, 7, 3, 6, 2, 5, 8, 4, 1];
  readonly documentsSequence: number[] = [3, 2, 4, 1, 5, 2, 3, 4, 1, 2, 3, 5, 2, 4, 1];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  getDocumentsCount(index: number): number {
    return this.documentsSequence[index % this.documentsSequence.length];
  }

  ngOnInit(): void {
    this.subs.add(
      this.route.queryParams.subscribe(params => {
        if (params['projectName'] || params['name']) {
          this.projectName = params['projectName'] || params['name'];
        }
        if (params['projectCode'] || params['code']) {
          this.projectCode = params['projectCode'] || params['code'];
        }
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      })
    );

    this.stages.forEach((s, idx) => {
      s.historyCount = this.historySequence[idx % this.historySequence.length];
      s.documentsCount = this.documentsSequence[idx % this.documentsSequence.length];
      if (!s.updatedDate) {
        s.updatedDate = '2026-02-15';
      }
      if (!s.updated) {
        s.updated = s.updatedDate;
      }
      const defaultUpdaters = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Priya Reddy', 'Suresh Naidu'];
      if (!s.updatedBy) {
        s.updatedBy = defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagedStages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.setBodyScrollLock(false);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
    });
  }

  // --- Scrolling logic ---
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

  setView(view: 'grid' | 'gantt') {
    this.activeView = view;
  }

  setGanttScale(scale: 'monthly' | 'weekly' | 'daily') {
    this.ganttScale = scale;
  }

  // --- Gantt View Data Getters ---
  get ganttMonths(): { name: string; fullYear: number; monthIndex: number }[] {
    return [
      { name: 'Jan', fullYear: 2026, monthIndex: 0 },
      { name: 'Feb', fullYear: 2026, monthIndex: 1 },
      { name: 'Mar', fullYear: 2026, monthIndex: 2 },
      { name: 'Apr', fullYear: 2026, monthIndex: 3 },
      { name: 'May', fullYear: 2026, monthIndex: 4 },
      { name: 'Jun', fullYear: 2026, monthIndex: 5 },
      { name: 'Jul', fullYear: 2026, monthIndex: 6 },
      { name: 'Aug', fullYear: 2026, monthIndex: 7 },
      { name: 'Sep', fullYear: 2026, monthIndex: 8 },
      { name: 'Oct', fullYear: 2026, monthIndex: 9 },
      { name: 'Nov', fullYear: 2026, monthIndex: 10 },
      { name: 'Dec', fullYear: 2026, monthIndex: 11 }
    ];
  }

  get ganttWeeks(): { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] {
    const weeks: { label: string; monthName: string; monthIndex: number; weekInMonth: number }[] = [];
    const months = this.ganttMonths;
    months.forEach(m => {
      ['W1', 'W2', 'W3', 'W4'].forEach((wLabel, wIdx) => {
        weeks.push({ label: wLabel, monthName: m.name, monthIndex: m.monthIndex, weekInMonth: wIdx + 1 });
      });
    });
    return weeks;
  }

  get ganttDays(): Date[] {
    if (this.stages.length === 0) return [];
    let minDate: Date | null = null;
    let maxDate: Date | null = null;

    for (const s of this.stages) {
      const bars = this.getStageBars(s);
      for (const bar of bars) {
        if (!bar.planStart || !bar.planEnd) continue;
        const start = new Date(bar.planStart);
        const finish = new Date(bar.planEnd);
        if (isNaN(start.getTime()) || isNaN(finish.getTime())) continue;

        if (!minDate || start < minDate) minDate = start;
        if (!maxDate || finish > maxDate) maxDate = finish;
      }
    }

    if (!minDate || !maxDate) return [];

    const days: Date[] = [];
    let current = new Date(minDate);
    let count = 0;
    while (current <= maxDate && count < 120) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
      count++;
    }
    return days;
  }

  private getDaysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
  }

  getStageBars(s: StageItem): GanttBar[] {
    if (s.bars && s.bars.length > 0) return s.bars;
    return [{ name: s.name, planStart: s.planStart, planEnd: s.planEnd, planEffort: s.planEffort }];
  }

  getGanttBarStyle(s: { planStart?: string; planEnd?: string }, index: number = 0): any {
    if (!s || !s.planStart || !s.planEnd) return { display: 'none' };

    const start = new Date(s.planStart);
    const finish = new Date(s.planEnd);
    if (isNaN(start.getTime()) || isNaN(finish.getTime())) return { display: 'none' };

    let styleObj: any = {};

    if (this.ganttScale === 'monthly') {
      const totalMonths = 12;
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startVal = startM + (startD - 1) / startDaysTotal;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishVal = finishM + finishD / finishDaysTotal;

      const leftPercent = (startVal / totalMonths) * 100;
      const widthPercent = Math.max(0.5, ((finishVal - startVal) / totalMonths) * 100);

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    } else if (this.ganttScale === 'weekly') {
      const totalWeeks = 48; // 12 months * 4 weeks
      const startM = start.getMonth();
      const startD = start.getDate();
      const startDaysTotal = this.getDaysInMonth(start.getFullYear(), startM);
      const startWeekVal = startM * 4 + ((startD - 1) / startDaysTotal) * 4;

      const finishM = finish.getMonth();
      const finishD = finish.getDate();
      const finishDaysTotal = this.getDaysInMonth(finish.getFullYear(), finishM);
      const finishWeekVal = finishM * 4 + (finishD / finishDaysTotal) * 4;

      const leftPercent = (startWeekVal / totalWeeks) * 100;
      const widthPercent = Math.max(0.5, ((finishWeekVal - startWeekVal) / totalWeeks) * 100);

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    } else { // daily
      const days = this.ganttDays;
      const totalDays = days.length;
      if (totalDays === 0) return { display: 'none' };

      const startStripped = this.stripTime(start);
      const finishStripped = this.stripTime(finish);

      let startIndex = -1;
      for (let i = 0; i < days.length; i++) {
        if (this.stripTime(days[i]).getTime() === startStripped.getTime()) {
          startIndex = i;
          break;
        }
      }

      if (startIndex === -1) {
        if (startStripped < this.stripTime(days[0])) {
          startIndex = 0;
        } else {
          return { display: 'none' };
        }
      }

      let spanDays = Math.round((finishStripped.getTime() - startStripped.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (spanDays <= 0) spanDays = 1;
      if (startIndex + spanDays > totalDays) spanDays = totalDays - startIndex;

      const leftPercent = (startIndex / totalDays) * 100;
      const widthPercent = (spanDays / totalDays) * 100;

      styleObj = { left: `${leftPercent.toFixed(2)}%`, width: `${widthPercent.toFixed(2)}%` };
    }

    if (index > 0) {
      styleObj.top = `${6 + (index % 3) * 12}px`;
      styleObj.height = '26px';
      styleObj.zIndex = `${index + 1}`;
      styleObj.opacity = '0.94';
      styleObj.boxShadow = '-2px 2px 6px rgba(0,0,0,0.12)';
    }

    return styleObj;
  }

  getStageGanttClass(stageName: string): string {
    const name = stageName.toLowerCase();
    if (name.includes('feasibility') || name.includes('concept') || name.includes('requirement')) return 'gantt-bar-feasibility';
    if (name.includes('design') || name.includes('architecture') || name.includes('specification')) return 'gantt-bar-design';
    if (name.includes('development') || name.includes('implementation') || name.includes('core')) return 'gantt-bar-development';
    if (name.includes('testing') || name.includes('qa') || name.includes('uat') || name.includes('audit')) return 'gantt-bar-testing';
    if (name.includes('deployment') || name.includes('release') || name.includes('prototype') || name.includes('tooling')) return 'gantt-bar-deployment';
    return 'gantt-bar-default';
  }

  stripTime(d: Date): Date {
    if (!d || isNaN(d.getTime())) return new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // --- Pagination ---
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

  private setBodyScrollLock(lock: boolean) {
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    document.documentElement.style.overflow = lock ? 'hidden' : 'auto';
  }

  // --- CRUD Logic (Grid & Modals) ---
  Confirmation(item: any): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to Change the Status ?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        item.status = item.status !== undefined ? !item.status : false;
        const now = new Date().toISOString().split('T')[0];
        item.updatedDate = now;
        item.updated = now;
        item.updatedBy = 'Ananya Rao';
      }
    });
  }

  deleteStage(item: StageItem): void {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Delete Confirmation', content: 'Are you sure you want to delete this record?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.stages = this.stages.filter(s => s !== item);
        const pageCount = Math.max(1, Math.ceil(this.stages.length / this.pageSize));
        if (this.currentPage >= pageCount) this.currentPage = Math.max(0, pageCount - 1);
        this.updatePagedStages();
      }
    });
  }

  onStageNameChange(selectedName: string) {
    if (!selectedName) return;
    const index = this.stageOptions.indexOf(selectedName);
    if (index !== -1) {
      this.stageModalData.stageCode = 'Stage-' + (index + 1);
    }
  }

  openAddStage() {
    this.stageModalStep = 1;
    this.stageModalData = {
      stageCode: 'Stage-' + (this.stages.length + 1), name: '', planEffort: '', planDuration: '', percentCompletion: 0, done: false, description: '', planStart: '', planEnd: '', actualStart: '', actualEnd: '', eta: '', buffer: '', gateName: '', gateStatus: 'Pending', gateCode: '', status: true, setupCount: 0,
      updatedDate: new Date().toISOString().split('T')[0],
      updated: new Date().toISOString().split('T')[0],
      updatedBy: 'Ananya Rao'
    };
    this.isEditStageMode = false;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
  }

  openEditStage(item: StageItem, index: number) {
    const actualIndex = this.stages.findIndex(s => s === item);
    this.stageModalStep = 2; // Default to Timeline tab on edit
    this.stageModalData = { ...item };
    this.isEditStageMode = true;
    this.stageModalIndex = actualIndex >= 0 ? actualIndex : index;
    this.showStageModal = true;
    this.setBodyScrollLock(true);
  }

  closeStageModal() {
    this.showStageModal = false;
    this.setBodyScrollLock(false);
  }

  saveStage() {
    if (!this.stageModalData.name || !this.stageModalData.stageCode) return;
    const now = new Date().toISOString().split('T')[0];
    this.stageModalData.updatedDate = now;
    this.stageModalData.updated = now;
    if (!this.stageModalData.updatedBy) {
      this.stageModalData.updatedBy = 'Ananya Rao';
    }
    if (this.isEditStageMode && this.stageModalIndex > -1) {
      this.stages[this.stageModalIndex] = { ...this.stages[this.stageModalIndex], ...this.stageModalData } as StageItem;
    } else {
      this.stages.push(this.stageModalData as StageItem);
    }
    this.updatePagedStages();
    this.closeStageModal();
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
    const now = new Date().toISOString().split('T')[0];
    s.updatedDate = now;
    s.updated = now;
    s.updatedBy = 'Ananya Rao';
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
        stageName: item.name
      },
      queryParamsHandling: 'merge'
    });
  }

  openHistory(stage?: any): void {
    const stageCode = (typeof stage === 'object' && stage !== null) ? stage.stageCode : '';
    const stageName = (typeof stage === 'object' && stage !== null) ? stage.name : (typeof stage === 'string' ? stage : 'Stage');

    this.router.navigate(['stages/history'], {
      relativeTo: this.route.parent,
      queryParams: {
        stageCode: stageCode,
        stageName: stageName
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