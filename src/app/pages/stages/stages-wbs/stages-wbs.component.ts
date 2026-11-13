import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { AddDeliverableComponent } from './add-deliverable/add-deliverable.component';
import { AddActivityComponent } from './add-activity/add-activity.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { AssignRequirementsComponent } from './assign-requirements/assign-requirements.component';
import { AssignTasksComponent } from './assign-tasks/assign-tasks.component';
import { StagesPredecessorComponent } from './stages-predecessor/stages-predecessor.component';
import { DescriptionDialogComponent } from '../../../common/shared/description-dialog/description-dialog.component';
import {
  INDUSTRIAL_STAGES_WBS_MAP,
  StageSidebarMenu,
  StageWbsConfig,
  WbsTaskItem,
} from '../industrial-stages.data';

export type WbsTask = WbsTaskItem;
export type SidebarMenu = StageSidebarMenu;
export type { StageWbsConfig };

@Component({
  selector: 'app-stages-wbs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './stages-wbs.component.html',
  styleUrls: ['./stages-wbs.component.scss']
})
export class StagesWbsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  stageCode: string = 'S1';
  stageName: string = 'Business Need & Opportunity Assessment';
  gateCode: string = '-';

  sidebarMenus: SidebarMenu[] = [];
  modulesData: WbsTask[][] = [];
  selectedMenuIndex: number = 0;

  tableData: WbsTask[] = [];
  paginatedData: WbsTask[] = [];

  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  private readonly stageWbsMap: Record<string, StageWbsConfig> = INDUSTRIAL_STAGES_WBS_MAP;

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      if (params['stageCode']) this.stageCode = params['stageCode'];
      if (params['stageName']) this.stageName = params['stageName'];
      if (params['gateCode']) this.gateCode = params['gateCode'];
      this.loadStageData();
    });
  }

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }

  private loadStageData(): void {
    const stageKey = this.stageCode?.trim() || 'S1';

    const nameMap: Record<string, string> = {
      'Business Need & Opportunity Assessment': 'S1',
      'Project Scope & Feasibility Validation': 'S2',
      'Concept Engineering & Solution Development': 'S3',
      'Detailed Engineering & Design Optimization': 'S4',
      'Concept Selection & Design Freeze': 'S5',
      'Process Engineering & Equipment Design': 'S6',
      'Prototype Fabrication & Engineering Validation': 'S7',
      'Installation Planning & Site Installation Readiness': 'S8',
      'Equipment Installation & Integration': 'S9',
      'Commissioning & Performance Testing': 'S10',
      'Operational Qualification & Production Ramp-Up': 'S11',
      'Operational Handover & Project Closeout': 'S12',
      'S0': 'S1'
    };

    const config = this.stageWbsMap[stageKey]
      || this.stageWbsMap[stageKey.toUpperCase()]
      || this.stageWbsMap[nameMap[stageKey]]
      || this.stageWbsMap[nameMap[this.stageName]]
      || this.stageWbsMap[this.stageName]
      || this.getFallbackStageConfig(this.stageName, this.stageCode);

    this.sidebarMenus = config.sidebarMenus.map(m => ({ ...m }));
    this.modulesData = config.modulesData.map((mod, modIdx) =>
      mod.map((t, taskIdx) => {
        const copy: WbsTask = { ...t };
        if (!copy.requirements) {
          copy.requirements = this.getDefaultRequirements(modIdx, taskIdx);
        } else if (typeof copy.requirements === 'string' && copy.requirements.includes('/')) {
          copy.requirements = copy.requirements.split('/')[0];
        }
        if (!copy.tasks) {
          copy.tasks = this.getDefaultTasks(modIdx, taskIdx);
        } else if (typeof copy.tasks === 'string' && copy.tasks.includes('/')) {
          copy.tasks = copy.tasks.split('/')[0];
        }
        if (!copy.historyCount) {
          copy.historyCount = this.getHistoryCount(taskIdx);
        }
        if (!copy.updatedDate) {
          const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20', '2026-01-15', '2026-01-10'];
          copy.updatedDate = sampleDates[(modIdx * 3 + taskIdx) % sampleDates.length];
        }
        if (!copy.updatedBy) {
          copy.updatedBy = copy.assignedTo || 'Ananya Rao';
        }
        return copy;
      })
    );

    this.sidebarMenus.forEach((menu, i) => {
      menu.count = this.modulesData[i]?.length || 0;
    });

    this.selectedMenuIndex = 0;
    this.sidebarMenus.forEach((m, idx) => m.isOpen = idx === 0);
    this.tableData = this.modulesData[0] || [];
    this.totalItems = this.tableData.length;
    this.pageIndex = 0;
    this.updatePaginatedData();
  }

  private getFallbackStageConfig(name: string, _code: string): StageWbsConfig {
    return {
      sidebarMenus: [
        { slNo: '1.1', name: `${name} Planning & Setup`, count: 0, isOpen: true }
      ],
      modulesData: [[]]
    };
  }

  private getDefaultRequirements(modIdx: number, taskIdx: number): string {
    const numbers = ['7', '8', '9', '1', '2', '3', '4', '5', '6', '10', '11', '12', '13'];
    return numbers[(modIdx * 3 + taskIdx * 2) % numbers.length];
  }

  private getDefaultTasks(modIdx: number, taskIdx: number): string {
    const numbers = ['8', '1', '7', '9', '5', '12', '4', '6', '3', '10', '2', '11', '13'];
    return numbers[(modIdx * 3 + taskIdx * 2 + 1) % numbers.length];
  }

  selectMenu(index: number): void {
    this.selectedMenuIndex = index;
    this.sidebarMenus.forEach((menu, i) => {
      menu.isOpen = (i === index) ? !menu.isOpen : false;
    });
    this.tableData = this.modulesData[index] || [];
    this.pageIndex = 0;
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.tableData.slice(startIndex, startIndex + this.pageSize);
  }

  openAddDeliverableDialog(): void {
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: '1.2',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        const nextSlNo = result.stage || `${this.stageCode}.${this.sidebarMenus.length + 1}`;
        this.sidebarMenus.push({
          slNo: nextSlNo,
          name: result.deliverableName,
          count: 0,
          isOpen: false
        });
        this.modulesData.push([]);
      }
    });
  }

  onDeliverableDrop(event: CdkDragDrop<SidebarMenu[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const currentSelected = this.sidebarMenus[this.selectedMenuIndex];
    moveItemInArray(this.sidebarMenus, event.previousIndex, event.currentIndex);
    moveItemInArray(this.modulesData, event.previousIndex, event.currentIndex);
    if (currentSelected) {
      this.selectedMenuIndex = this.sidebarMenus.indexOf(currentSelected);
    }
    this.tableData = this.modulesData[this.selectedMenuIndex] || [];
    this.totalItems = this.tableData.length;
    this.updatePaginatedData();
  }

  editDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddDeliverableComponent, {
      width: '600px',
      data: {
        stage: this.stageName,
        sequence: menu.slNo,
        name: menu.name,
        deliverableName: menu.name,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.deliverableName) {
        menu.name = result.deliverableName;
        if (result.stage) {
          menu.slNo = result.stage;
          if (this.modulesData[index]) {
            this.modulesData[index].forEach(task => {
              task.deliverableSlNo = result.stage;
            });
          }
        }
      }
    });
  }

  deleteDeliverable(menu: SidebarMenu, index: number, event: MouseEvent): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: menu
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sidebarMenus.splice(index, 1);
        this.modulesData.splice(index, 1);

        if (this.selectedMenuIndex >= this.sidebarMenus.length) {
          this.selectedMenuIndex = Math.max(0, this.sidebarMenus.length - 1);
        }

        if (this.sidebarMenus.length > 0) {
          this.sidebarMenus.forEach((m, i) => {
            m.isOpen = (i === this.selectedMenuIndex);
          });
          this.tableData = this.modulesData[this.selectedMenuIndex] || [];
        } else {
          this.tableData = [];
        }

        this.pageIndex = 0;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openAddActivityDialog(): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        department: 'Engineering & R&D',
        mode: 'add'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.activityName) {
        const nextId = this.tableData.length + 1;
        const parentSl = this.sidebarMenus[this.selectedMenuIndex]?.slNo || `1.${this.selectedMenuIndex + 1}`;
        const taskSlNo = parentSl.includes('.') ? `${parentSl}${nextId}` : `${parentSl}.${nextId}`;

        const newTask: WbsTask = {
          deliverableSlNo: parentSl,
          slNo: taskSlNo,
          task: result.activityName,
          activityCode: result.activityCode || `ACT-${this.selectedMenuIndex + 1}0${nextId}`,
          department: result.department || 'Engineering & R&D',
          predecessor: result.predecessor || '—',
          predecessorsData: result.predecessors || result.predecessorsData,
          applicability: result.applicability || 'All Programs',
          taskCode: `IND-${this.selectedMenuIndex + 1}0${nextId}`,
          jobCode: `ENG0${(nextId % 2) + 1}`,
          effort: result.planEffort || '0',
          duration: result.planDuration || '0',
          description: result.description || '',
          procedure: 'ISO 9001 / Standard Plant SOP',
          planned: '0.00',
          assignedTo: result.department || 'Unassigned',
          assigned: '0.00',
          actual: '0.00',
          cost: result.materialBudget || '0.00',
          worked: '0.00',
          remaining: '0.00',
          scheduled: '-',
          date: '-',
          status: 'Scheduled',
          submitted: '-',
          requirements: `${Math.floor(Math.random() * 8) + 1}`,
          tasks: `${Math.floor(Math.random() * 8) + 1}`
        };

        this.tableData.push(newTask);
        this.modulesData[this.selectedMenuIndex] = this.tableData;
        this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
        this.totalItems = this.tableData.length;
        this.updatePaginatedData();
      }
    });
  }

  openEditActivityDialog(row: WbsTask): void {
    const deliverableNames = this.sidebarMenus.map(m => m.name);
    const currentDeliverable = this.sidebarMenus[this.selectedMenuIndex]?.name || deliverableNames[0] || '';

    const dialogRef = this.dialog.open(AddActivityComponent, {
      width: '1000px',
      maxWidth: '95vw',
      autoFocus: false,
      data: {
        stage: this.stageName,
        deliverable: currentDeliverable,
        deliverables: deliverableNames,
        activityName: row.task,
        activityCode: row.activityCode || row.taskCode,
        department: row.department || 'Engineering & R&D',
        applicability: row.applicability,
        description: row.description,
        planDuration: row.duration,
        planEffort: row.effort,
        materialBudget: row.cost,
        predecessor: row.predecessor !== '—' ? row.predecessor : '',
        predecessorsData: row.predecessorsData,
        mode: 'edit'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.activityName) row.task = result.activityName;
        if (result.activityCode !== undefined) row.activityCode = result.activityCode;
        if (result.department !== undefined) row.department = result.department;
        if (result.applicability !== undefined) row.applicability = result.applicability;
        if (result.description !== undefined) row.description = result.description;
        if (result.planEffort !== undefined) row.effort = result.planEffort;
        if (result.planDuration !== undefined) row.duration = result.planDuration;
        if (result.materialBudget !== undefined) row.cost = result.materialBudget;
        if (result.predecessor !== undefined) row.predecessor = result.predecessor || '—';
        if (result.predecessors !== undefined) row.predecessorsData = result.predecessors;
        this.updatePaginatedData();
      }
    });
  }

  deleteTask(row: WbsTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.tableData.indexOf(row);
        if (index > -1) {
          this.tableData.splice(index, 1);
          this.modulesData[this.selectedMenuIndex] = this.tableData;
          this.sidebarMenus[this.selectedMenuIndex].count = this.tableData.length;
          this.totalItems = this.tableData.length;
          this.updatePaginatedData();
        }
      }
    });
  }

  openfilepop(): void {}

  scrollLeft(): void {
    this.scrollTable('left');
  }

  scrollRight(): void {
    this.scrollTable('right');
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  assignrequirement(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignRequirementsComponent, {
      width: '700px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.requirements = result.count !== undefined ? String(result.count) : row.requirements;
        if (result.requirements) {
          (row as any).requirementsData = result.requirements;
        }
        this.updatePaginatedData();
      }
    });
  }

  assigntasks(row?: WbsTask): void {
    const dialogRef = this.dialog.open(AssignTasksComponent, {
      width: '850px',
      maxWidth: '95vw',
      height: 'auto',
      data: { mode: 'add', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        row.tasks = result.count !== undefined ? String(result.count) : row.tasks;
        if (result.tasks) {
          row.tasksData = result.tasks;
        }
        this.updatePaginatedData();
      }
    });
  }

  openPredecessor(row?: WbsTask): void {
    const dialogRef = this.dialog.open(StagesPredecessorComponent, {
      width: '950px',
      maxWidth: '100vw',
      height: 'auto',
      data: { mode: 'edit', row }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && row) {
        if (result.predecessors) {
          row.predecessorsData = result.predecessors;
        }
        if (result.predecessor !== undefined) {
          row.predecessor = String(result.predecessor);
        }
        this.updatePaginatedData();
      }
    });
  }

  openHistory(row: WbsTask, index?: number): void {
    const historyCount = row.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/stages/wbs/history'], {
      queryParams: {
        slNo: row.slNo,
        task: row.task,
        activityCode: row.activityCode || row.taskCode || '',
        tasks: row.tasks || '',
        requirements: row.requirements || '',
        predecessor: row.predecessor || '',
        duration: row.duration || '',
        effort: row.effort || '',
        cost: row.cost || '',
        applicability: row.applicability || 'All Programs',
        description: row.description || '',
        stageCode: this.stageCode,
        stageName: this.stageName,
        gateCode: this.gateCode,
        deliverableSlNo: row.deliverableSlNo,
        historyCount: historyCount
      },
      queryParamsHandling: 'merge'
    });
  }

  openDescription(row: WbsTask): void {
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: row.task,
        code: row.slNo,
        type: 'Activity',
        description: row.description
      }
    });
  }

  openDeliverableDescription(menu: SidebarMenu, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.dialog.open(DescriptionDialogComponent, {
      width: '620px',
      maxWidth: '90vw',
      data: {
        title: menu.name,
        code: menu.slNo,
        type: 'Deliverable',
        description: menu.description || 'Deliverable description not available.'
      }
    });
  }
}
