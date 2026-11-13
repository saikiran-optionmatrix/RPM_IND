import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { MonitorStateService } from '../monitor-state.service';

import { AddTodoComponent } from '../../projects/project-dashboard/project-todo/add-todo/add-todo.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';

export type TodoStatus = 'Pending' | 'Allocated' | 'Progress' | 'Hold' | 'Cancelled' | 'Completed';

export interface TodoTask {
  id: number;
  ProjectCode: string;
  Subject: string;
  delayReason?: string;
  Description: string;
  Comments: string;
  IsActive: boolean;
  CreatedDate: string;
  DueDate: string| null;
  CompletionDate: string | null;
  Responsibility: string; // Maps to "Assigned To"
  Group?: string;
  Department?: string;
  ProjectName: string;
  Status: TodoStatus;
}

export interface KanbanCard extends TodoTask {
  expanded: boolean;
  notes: { text: string; author: string; date: string }[];
}

@Component({
  selector: 'app-monitor-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    DragDropModule,
    MatCardModule
],
  templateUrl: './monitor-todo.component.html',
  styleUrls: ['./monitor-todo.component.scss']
})
export class MonitorTodoComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly monitorStateService = inject(MonitorStateService);
  private readonly cdr = inject(ChangeDetectorRef);
  private overdueSub?: Subscription;

  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('kanbanContainer') kanbanContainer!: ElementRef<HTMLDivElement>;
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // View States
  isKanbanView: boolean = false;
  isCalendarView: boolean = false;
  showFilter: boolean = false;
  showOverdueOnly: boolean = false;
  showWeekend: boolean = false;
  readonly today = new Date();
  // Modals
  showTimelineModal: boolean = false;
  selectedTimelineTask: TodoTask | null = null;

  // Pagination
  totalSize: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;

  // Data Arrays
  mockData: TodoTask[] = [];
  filteredData: TodoTask[] = [];
  paginatedData: TodoTask[] = [];

  // Calendar
  displayDays: number[] = [1, 2, 3, 4, 5];
  readonly hoursList = ["1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"];
  calendarCards: any[] = [];

  // Kanban
  readonly kanbanLists: TodoStatus[] = ['Pending', 'Allocated', 'Progress', 'Hold', 'Cancelled', 'Completed'];
  kanbanCards: Record<TodoStatus, KanbanCard[]> = {
    Pending: [], Allocated: [], Progress: [], Hold: [], Cancelled: [], Completed: []
  };

  // Filter Form
  filterForm: FormGroup = this.fb.group({
    ProjectName: [''],
    Stage: [''],
    Sprint: ['']
  });

  ngOnInit(): void {
    this.loadMockData();
    this.applyFilterData();
    this.overdueSub = this.monitorStateService.overdue$.subscribe(isOverdue => {
      this.showOverdueOnly = isOverdue;
      this.applyFilterData();
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.overdueSub?.unsubscribe();
  }

  private loadMockData(): void {
    this.mockData = [
      { id: 1, ProjectCode: '2026/IND/001', Subject: 'S1 - Plant Capacity & Line Bottleneck Study', delayReason: 'CMM Metrology Bay Slot Confirmation', Description: 'Conduct throughput audit, takt-time study, and OEM benchmark comparison for automated transfer expansion.', Comments: 'Benchmark quote comparison against legacy cell underway', IsActive: true, CreatedDate: '2026-01-10T00:00:00', DueDate: '2026-06-15T00:00:00', CompletionDate: null, Responsibility: 'Ananya Rao', Group: 'Engineering', Department: 'Engineering & R&D', ProjectName: 'Industrial Equipment Line Expansion', Status: 'Pending' },
      { id: 2, ProjectCode: '2026/IND/002', Subject: 'S2 - URS & Critical Tolerance Cascade', Description: 'Cascade user requirement specifications, ISO 230-2 positioning limits, and cycle-time targets for 5-axis cell.', Comments: 'Approved by Manufacturing Ops and Quality Directors', IsActive: true, CreatedDate: '2026-01-15T00:00:00', DueDate: '2026-03-25T00:00:00', CompletionDate: '2026-03-24T00:00:00', Responsibility: 'Priya Reddy', Group: 'Compliance', Department: 'EHS & Compliance', ProjectName: 'CNC Machining Process Optimization', Status: 'Completed' },
      { id: 3, ProjectCode: '2026/IND/003', Subject: 'S3 - PLC / SCADA & Robotic EOAT Design', delayReason: 'PLC Rack & Safety Relay Allocation Delay', Description: 'Finalize EPLAN panel schematics, safety light-curtain PLd interlocks, and vacuum end-effector payload FEA.', Comments: 'CAD clash detection and EtherCAT timing matrix submitted for review', IsActive: true, CreatedDate: '2026-02-01T00:00:00', DueDate: '2026-07-01T00:00:00', CompletionDate: null, Responsibility: 'Rajesh Kumar', Group: 'Automation', Department: 'Automation & Controls', ProjectName: 'Automated Packaging Line Development', Status: 'Progress' },
      { id: 4, ProjectCode: '2026/IND/004', Subject: 'S4 - Duplex Casting Foundry & Seal Audit', delayReason: 'OEM Foundry NDT Inspection Travel Clearance', Description: 'Execute ISO 9001 and API 610 qualification audit for high-pressure pump casing castings and mechanical seals.', Comments: 'Pending ultrasonic NDT report clearance by supplier QA', IsActive: true, CreatedDate: '2026-02-10T00:00:00', DueDate: '2026-06-30T00:00:00', CompletionDate: null, Responsibility: 'Anita Desai', Group: 'Quality', Department: 'Quality & Inspection', ProjectName: 'High-Pressure Centrifugal Pump Assembly', Status: 'Hold' },
      { id: 5, ProjectCode: '2026/IND/005', Subject: 'S8 - 480V Utility Tie-In & Foundation Pad Check', Description: 'Verify vibration-isolated concrete slab flatness, anchor bolt torque, and chilled-water manifold flow.', Comments: 'Civil pad and electrical disconnect panel signed off by plant utilities', IsActive: true, CreatedDate: '2026-03-05T00:00:00', DueDate: '2026-05-20T00:00:00', CompletionDate: '2026-05-19T00:00:00', Responsibility: 'Amit Patel', Group: 'Commissioning', Department: 'Commissioning & Qualification', ProjectName: 'Oil-Free Rotary Screw Compressor System', Status: 'Allocated' },
      { id: 6, ProjectCode: '2026/IND/006', Subject: 'S5 - SMED Quick-Change Fixture Sign-off', Description: 'Finalize zero-point clamping pallet BOM and issue fabrication PO to precision toolroom.', Comments: 'Fixture repeatability test fixture scheduled for FAT bay', IsActive: true, CreatedDate: '2026-03-12T00:00:00', DueDate: '2026-07-18T00:00:00', CompletionDate: null, Responsibility: 'Suresh Naidu', Group: 'Manufacturing', Department: 'Manufacturing & Operations', ProjectName: 'CNC Machining Line Capacity Expansion', Status: 'Progress' },
      { id: 7, ProjectCode: '2026/IND/007', Subject: 'S8 - Overhead Crane Rigging & Safety Perimeter Check', Description: 'Approve 10-ton crane rigging lift points and machine perimeter fencing gate interlock wiring.', Comments: 'EHS rigging permit approved and fencing posts anchored', IsActive: true, CreatedDate: '2026-03-18T00:00:00', DueDate: '2026-04-30T00:00:00', CompletionDate: '2026-04-28T00:00:00', Responsibility: 'Deepa Nair', Group: 'Compliance', Department: 'EHS & Compliance', ProjectName: 'Industrial Pump Assembly Line Upgrade', Status: 'Completed' },
      { id: 8, ProjectCode: '2026/IND/008', Subject: 'S1 - Material Flow AGV & Utility Substation Scoping', delayReason: 'Substation Transformer Shutdown Window Pending', Description: 'Assess peak factory air/power load expansion and automated palletizer dock routing.', Comments: 'Electrical load balancer report submitted for maintenance review', IsActive: true, CreatedDate: '2026-03-22T00:00:00', DueDate: '2026-07-25T00:00:00', CompletionDate: null, Responsibility: 'Vikram Singh', Group: 'Engineering', Department: 'Engineering & R&D', ProjectName: 'Factory Utilities & Material Handling Upgrade', Status: 'Pending' }
    ];
  }

  // --- Toggles & Filters ---

  toggleView(view: 'table' | 'kanban' | 'calendar'): void {
    this.isKanbanView = view === 'kanban';
    this.isCalendarView = view === 'calendar';
    if (this.isKanbanView) this.initializeKanbanData();
    if (this.isCalendarView) this.generateCalendarData();
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  toggleOverdueOnly(checked: boolean): void {
    this.showOverdueOnly = checked;
    this.monitorStateService.setOverdue(this.showOverdueOnly);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { overdue: this.showOverdueOnly ? 'true' : null },
      queryParamsHandling: 'merge'
    });
    this.applyFilterData();
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilterData();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.applyFilterData();
  }

  applyFilterData(): void {
    let filtered = [...this.mockData];
    const { ProjectName, Stage, Sprint } = this.filterForm.value;

    if (this.showOverdueOnly) {
      filtered = filtered.filter(item => this.isOverdue(item.DueDate || 'null'));
    }
    if (ProjectName) {
      filtered = filtered.filter(item => item.ProjectName === ProjectName);
    }
    if (Stage) {
      filtered = filtered.filter(item => (item.Subject || '').startsWith(Stage));
    }
    if (Sprint) {
      filtered = filtered.filter(item => item.Department === Sprint);
    }

    this.filteredData = filtered;
    this.totalSize = this.filteredData.length;

    const start = this.currentPage * this.pageSize;
    this.paginatedData = this.filteredData.slice(start, start + this.pageSize);

    if (this.isKanbanView) this.initializeKanbanData();
    if (this.isCalendarView) this.generateCalendarData();
  }

  handlePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilterData();
  }

  private isOverdue(dueDate: string): boolean {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }

  // --- Kanban Logic ---

  private initializeKanbanData(): void {
    const grouped: Record<TodoStatus, KanbanCard[]> = {
      Pending: [], Allocated: [], Progress: [], Hold: [], Cancelled: [], Completed: []
    };

    this.filteredData.forEach((item) => {
      grouped[item.Status].push({
        ...item,
        expanded: false,
        notes: []
      });
    });

    this.kanbanCards = grouped;
  }

  onDrop(event: CdkDragDrop<KanbanCard[]>, targetList: TodoStatus): void {
    const previousList = event.previousContainer.id as TodoStatus;
    const currentList = event.container.id as TodoStatus;

    if (previousList !== currentList) {
      transferArrayItem(
        this.kanbanCards[previousList],
        this.kanbanCards[currentList],
        event.previousIndex,
        event.currentIndex
      );

      const movedCard = this.kanbanCards[currentList][event.currentIndex];
      movedCard.Status = currentList;

      // Sync master data
      const masterItem = this.mockData.find(m => m.id === movedCard.id);
      if (masterItem) masterItem.Status = currentList;

    } else {
      moveItemInArray(this.kanbanCards[targetList], event.previousIndex, event.currentIndex);
    }
  }

  toggleCard(card: KanbanCard): void {
    card.expanded = !card.expanded;
  }

  getKanbanColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a', 'Allocated': '#ef9f27', 'Progress': '#3b82f6',
      'Hold': '#f59e0b', 'Cancelled': '#94a3b8', 'Completed': '#10b981'
    };
    return colors[status] ?? '#94a3b8';
  }

  // --- Calendar Logic ---

  private generateCalendarData(): void {
    this.calendarCards = this.filteredData.map((project, i) => {
      return {
        hour: this.hoursList[i % this.hoursList.length],
        user: project.Responsibility,
        dayPlacement: (i % (this.showWeekend ? 7 : 5)) + 1,
        taskName: project.Subject,
        projectName: project.ProjectName,
        status: project.IsActive ? 'Active' : 'Inactive',
        color: project.IsActive ? '#dbeafe' : '#fef08a',
        pInitials: project.Subject ? project.Subject.substring(0, 2).toUpperCase() : 'NA'
      };
    });
  }

  onEditTodo(item: TodoTask): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '900px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: {
        ...item,
        subject: item.Subject,
        description: item.Description,
        assignedTo: item.Responsibility,
        dateCreated: item.CreatedDate,
        dueDate: item.DueDate,
        group: item.Group,
        department: item.Department,
        done: item.Status === 'Completed'
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        item.Subject = result.subject || item.Subject;
        item.Description = result.description !== undefined ? result.description : item.Description;
        item.Responsibility = result.assignedTo || item.Responsibility;
        item.DueDate = result.dueDate || item.DueDate;
        item.Group = result.group || item.Group;
        item.Department = result.department || item.Department;
        if (result.done) {
          item.Status = 'Completed';
        }
        const orig = this.mockData.find(m => m.id === item.id);
        if (orig) {
          Object.assign(orig, item);
        }
        this.applyFilterData();
      }
    });
  }

  onDeleteTodo(item: TodoTask): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: item
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.mockData = this.mockData.filter(x => x.id !== item.id);
        this.applyFilterData();
      }
    });
  }

  // onStatusToggle(item: TodoTask): void {
  //   const dialogRef = this.dialog.open(StatusConfirmationDialogComponent, {
  //     width: 'auto',
  //     data: { title: 'Change Status', content: 'Are you sure you want to Change the Status?' }
  //   });
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (confirmed) {
  //       item.IsActive = !item.IsActive;
  //       this.applyFilterData();
  //     }
  //   });
  // }

  openProject(item: TodoTask): void {
    this.router.navigate(['/projects/dashboard/todo'], {
      queryParams: {
        code: item.ProjectCode,
        projectCode: item.ProjectCode,
        name: item.ProjectName,
        projectName: item.ProjectName
      }
    });
  }

  openTimelineModal(task: TodoTask): void {
    this.selectedTimelineTask = task;
    this.showTimelineModal = true;
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
  }
  isTaskOverdue(item: TodoTask): boolean {
    if (item.Status === 'Completed' || !item.DueDate) {
      return false;
    }
    const due = new Date(item.DueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due < today;
  }
  scrollLeft(): void {
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const container = this.isKanbanView ? this.kanbanContainer?.nativeElement : this.tableContainer?.nativeElement;
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
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
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }
}
