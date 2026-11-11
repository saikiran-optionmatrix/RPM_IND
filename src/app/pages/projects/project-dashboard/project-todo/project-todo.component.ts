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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';

export interface ProjectTodoItem {
  id?: number;
  done?: boolean;
  task?: string;
  taskName?: string;
  subject: string;
  description: string;
  assignedTo?: string;
  dateCreated?: string;
  dueDate: string;
  role: string;
  group: string;
  site: string;
  department: string;
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
  actualHours?: number;
  section?: string;
  taskCode?: string;
  effort?: number;
  status?: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

export interface CalendarCardItem {
  id?: number;
  user: string;
  dayPlacement: number;
  taskName: string;
  taskCode: string;
  projectName: string;
  department: string;
  site: string;
  dueDate: string;
  done: boolean;
  status: string;
  color: string;
  pInitials: string;
  originalTodo: ProjectTodoItem;
}

@Component({
  selector: 'app-project-todo',
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
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './project-todo.component.html',
  styleUrl: './project-todo.component.scss'
})
export class ProjectTodoComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  todos: ProjectTodoItem[] = [];
  filteredTodos: ProjectTodoItem[] = [];
  paginatedTodos: ProjectTodoItem[] = [];

  // View state: Grid vs Calendar
  activeView: 'grid' | 'calendar' = 'grid';
  showWeekend: boolean = false;
  excludeCompleted: boolean = false;
  displayDays: number[] = [1, 2, 3, 4, 5];
  calendarCards: CalendarCardItem[] = [];

  // Toggleable Filter Card state
  filterToggle: boolean = false;
  searchKeyword: string = '';
  selectedRole: string | null = null;
  selectedGroup: string | null = null;
  selectedSite: string | null = null;
  selectedDepartment: string | null = null;

  // Dropdown options
  roleOptions: string[] = [];
  groupOptions: string[] = [];
  siteOptions: string[] = [];
  departmentOptions: string[] = [];

  // Pagination
  pageIndex: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  // Timeline Modal Popup state
  showTimelineModal: boolean = false;
  selectedTimelineTask: ProjectTodoItem | null = null;

  readonly historySequence: number[] = [4, 2, 5, 3, 6, 1, 7, 2, 4, 8, 3, 5, 2, 6, 4, 8];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
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
    this.loadInitialData();
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    const sampleTaskNames = [
      'API Characterization Study',
      'Excipient Sourcing & Compatibility',
      'Analytical Method Validation',
      'Stability Protocol Setup',
      'Formulation Trial & Blending',
      'Dissolution Profile Optimization',
      'Bioequivalence Study Protocol',
      'Regulatory Dossier Preparation'
    ];
    this.todos.forEach((todo, idx) => {
      if (!todo.task) {
        todo.task = sampleTaskNames[idx % sampleTaskNames.length];
      }
      if (!todo.updatedDate) {
        todo.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!todo.updatedBy) {
        todo.updatedBy = todo.assignedTo || 'Dr. Sarah Jenkins';
      }
    });
    this.extractFilterOptions();
    this.applyFilters();
  }

  setView(view: 'grid' | 'calendar'): void {
    this.activeView = view;
    if (view === 'calendar') {
      this.generateCalendarData();
    }
  }

  toggleWeekend(): void {
    this.showWeekend = !this.showWeekend;
    this.displayDays = this.showWeekend ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5];
    this.generateCalendarData();
  }

  toggleDone(todo: ProjectTodoItem): void {
    todo.done = !todo.done;
    todo.status = todo.done ? 'Completed' : 'Pending';
    this.generateCalendarData();
  }

  generateCalendarData(): void {
    const pastelPalette = ['#a0e4ff', '#ffea9f', '#ffcdd2', '#90ee90', '#e3b2ff'];
    const daysToDistribute = this.showWeekend ? 7 : 5;

    let itemsToMap = this.filteredTodos;
    if (this.excludeCompleted) {
      itemsToMap = itemsToMap.filter(t => !t.done && (t.status || '').toLowerCase() !== 'completed');
    }

    this.calendarCards = itemsToMap.map((todo, i) => {
      const pInitials = todo.taskCode || `TD-${i + 1}`;
      const user = todo.assignedTo || todo.role || 'Unassigned';
      const isDone = !!todo.done;
      const statusLabel = isDone ? 'Completed' : (todo.status || 'Pending');

      return {
        id: todo.id,
        user: user,
        dayPlacement: (i % daysToDistribute) + 1,
        taskName: todo.subject,
        taskCode: pInitials,
        projectName: `${todo.department} · ${todo.site}`,
        department: todo.department,
        site: todo.site,
        dueDate: todo.dueDate,
        done: isDone,
        status: statusLabel,
        color: isDone ? '#c7f9cc' : pastelPalette[i % pastelPalette.length],
        pInitials: pInitials,
        originalTodo: todo
      };
    });
  }

  loadInitialData(): void {
    this.todos = [
      {
        id: 1,
        done: true,
        subject: 'Review Reference Product Specifications',
        description: 'Analyze innovator product physical and chemical characteristics and finalize critical quality attributes.',
        assignedTo: 'Ana Vega',
        dateCreated: '2026-05-28',
        dueDate: '2026-06-05',
        role: 'Formulation Scientist',
        group: 'Product Development',
        site: 'R&D Center – Mumbai',
        department: 'Formulation R&D',
        status: 'Completed',
        planStart: '2026-06-01',
        planEnd: '2026-06-05',
        actualStart: '2026-06-01',
        actualEnd: '2026-06-05',
        eta: '2026-06-05',
        actualHours: 30,
        section: 'Section A',
        taskCode: 'TODO-001',
        effort: 32
      },
      {
        id: 2,
        done: true,
        subject: 'Complete API Characterization',
        description: 'Evaluate polymorphism, particle size distribution, solubility profile, and hygroscopicity.',
        assignedTo: 'Ravi Shah',
        dateCreated: '2026-05-30',
        dueDate: '2026-06-12',
        role: 'Pre-Formulation Lead',
        group: 'API Development',
        site: 'R&D Center – Hyderabad',
        department: 'Pre-Formulation',
        status: 'Completed',
        planStart: '2026-06-05',
        planEnd: '2026-06-12',
        actualStart: '2026-06-05',
        actualEnd: '2026-06-12',
        eta: '2026-06-12',
        actualHours: 40,
        section: 'Section B',
        taskCode: 'TODO-002',
        effort: 40
      },
      {
        id: 3,
        done: false,
        subject: 'Conduct API–Excipient Compatibility Study',
        description: 'Perform isothermal stress testing (DSC, FTIR, HPLC) with proposed excipients list.',
        assignedTo: 'Mia Chen',
        dateCreated: '2026-06-02',
        dueDate: '2026-06-16',
        role: 'Analytical Scientist',
        group: 'Formulation Group',
        site: 'R&D Center – Ahmedabad',
        department: 'Formulation Development',
        status: 'In Process',
        planStart: '2026-06-08',
        planEnd: '2026-06-16',
        actualStart: '2026-06-08',
        actualEnd: '2026-06-15',
        eta: '2026-06-16',
        actualHours: 45,
        section: 'Section A',
        taskCode: 'TODO-003',
        effort: 48
      },
      {
        id: 4,
        done: false,
        subject: 'Finalize Excipient Selection',
        description: 'Select optimal binders, disintegrants, and lubricants based on compatibility matrix.',
        assignedTo: 'Ana Vega',
        dateCreated: '2026-06-05',
        dueDate: '2026-06-20',
        role: 'Formulation Scientist',
        group: 'Formulation Group',
        site: 'R&D Center – Mumbai',
        department: 'Formulation R&D',
        status: 'In Process',
        planStart: '2026-06-12',
        planEnd: '2026-06-20',
        actualStart: '2026-06-12',
        actualEnd: '2026-06-20',
        eta: '2026-06-20',
        actualHours: 28,
        section: 'Section C',
        taskCode: 'TODO-004',
        effort: 30
      },
      {
        id: 5,
        done: false,
        subject: 'Prepare Prototype Formulation Batch',
        description: 'Compound and compress initial laboratory prototype trial batches (Batch #PB-01).',
        assignedTo: 'Sara Iqbal',
        dateCreated: '2026-06-10',
        dueDate: '2026-07-02',
        role: 'Process Chemist',
        group: 'Product Development',
        site: 'Pilot Lab – Hyderabad',
        department: 'Formulation Development',
        status: 'Pending',
        planStart: '2026-06-22',
        planEnd: '2026-07-02',
        actualStart: '2026-06-22',
        actualEnd: '2026-07-03',
        eta: '2026-07-02',
        actualHours: 50,
        section: 'Section B',
        taskCode: 'TODO-005',
        effort: 55
      },
      {
        id: 6,
        done: false,
        subject: 'Review Dissolution Test Results',
        description: 'Compare multi-media in-vitro dissolution profiles against Reference Listed Drug (RLD).',
        assignedTo: 'Mei Tanaka',
        dateCreated: '2026-06-15',
        dueDate: '2026-07-08',
        role: 'QC Chemist',
        group: 'Analytical Group',
        site: 'R&D Center – Ahmedabad',
        department: 'Analytical Development',
        status: 'Pending',
        planStart: '2026-06-30',
        planEnd: '2026-07-08',
        actualStart: '2026-06-30',
        actualEnd: '2026-07-08',
        eta: '2026-07-08',
        actualHours: 35,
        section: 'Section A',
        taskCode: 'TODO-006',
        effort: 36
      },
      {
        id: 7,
        done: false,
        subject: 'Optimize Tablet Formulation',
        description: 'Fine-tune granulation parameters and lubricant concentrations for target hardness and disintegration.',
        assignedTo: 'Diego Ruiz',
        dateCreated: '2026-06-20',
        dueDate: '2026-07-16',
        role: 'Formulation Scientist',
        group: 'Formulation Group',
        site: 'R&D Center – Mumbai',
        department: 'Formulation R&D',
        status: 'Pending',
        planStart: '2026-07-06',
        planEnd: '2026-07-16',
        actualStart: '2026-07-06',
        actualEnd: '2026-07-16',
        eta: '2026-07-16',
        actualHours: 42,
        section: 'Section B',
        taskCode: 'TODO-007',
        effort: 45
      },
      {
        id: 8,
        done: false,
        subject: 'Prepare Gate 3 Formulation Review',
        description: 'Compile stability data, dissolution equivalence reports, and Gate 3 stage dossier for approval.',
        assignedTo: 'Olivia Brown',
        dateCreated: '2026-06-25',
        dueDate: '2026-07-25',
        role: 'Project Manager',
        group: 'R&D Program Management',
        site: 'R&D Center – Mumbai',
        department: 'Project Management',
        status: 'Pending',
        planStart: '2026-07-18',
        planEnd: '2026-07-25',
        actualStart: '2026-07-18',
        actualEnd: '2026-07-25',
        eta: '2026-07-25',
        actualHours: 20,
        section: 'Section A',
        taskCode: 'TODO-008',
        effort: 24
      }
    ];
  }

  extractFilterOptions(): void {
    this.roleOptions = Array.from(new Set(this.todos.map(t => t.role).filter(Boolean)));
    this.groupOptions = Array.from(new Set(this.todos.map(t => t.group).filter(Boolean)));
    this.siteOptions = Array.from(new Set(this.todos.map(t => t.site).filter(Boolean)));
    this.departmentOptions = Array.from(new Set(this.todos.map(t => t.department).filter(Boolean)));
  }

  applyFilters(): void {
    let result = [...this.todos];

    if (this.searchKeyword && this.searchKeyword.trim() !== '') {
      const kw = this.searchKeyword.toLowerCase().trim();
      result = result.filter(item =>
        (item.task || '').toLowerCase().includes(kw) ||
        item.subject.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw) ||
        item.role.toLowerCase().includes(kw) ||
        item.group.toLowerCase().includes(kw) ||
        item.site.toLowerCase().includes(kw) ||
        item.department.toLowerCase().includes(kw)
      );
    }

    if (this.selectedRole) {
      result = result.filter(item => item.role === this.selectedRole);
    }

    if (this.selectedGroup) {
      result = result.filter(item => item.group === this.selectedGroup);
    }

    if (this.selectedSite) {
      result = result.filter(item => item.site === this.selectedSite);
    }

    if (this.selectedDepartment) {
      result = result.filter(item => item.department === this.selectedDepartment);
    }

    this.filteredTodos = result;
    this.pageIndex = 0;
    this.currentPage = 1;
    this.updatePagination();
    this.generateCalendarData();
  }

  resetFilters(): void {
    this.searchKeyword = '';
    this.selectedRole = null;
    this.selectedGroup = null;
    this.selectedSite = null;
    this.selectedDepartment = null;
    this.pageIndex = 0;
    this.applyFilters();
  }

  updatePagination(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + Number(this.pageSize);
    this.paginatedTodos = this.filteredTodos.slice(start, end);
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }





  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  addTodo(): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        res.id = Date.now();
        this.todos.unshift(res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  editTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(AddTodoComponent, {
      width: '900px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: todo
    });

    dialogRef.afterClosed().subscribe((res: ProjectTodoItem | undefined) => {
      if (res) {
        Object.assign(todo, res);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  deleteTodo(todo: ProjectTodoItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this Todo?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.todos = this.todos.filter(t => t.id !== todo.id);
        this.extractFilterOptions();
        this.applyFilters();
      }
    });
  }

  openTimelineModal(todo: ProjectTodoItem): void {
    this.selectedTimelineTask = todo;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
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

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineTask = null;
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }


  openHistory(item?: any): void {
    const subject = (typeof item === 'object' && item !== null) ? (item.subject || '') : (typeof item === 'string' ? item : '');
    this.router.navigate(['/projects/dashboard/todo/history'], {
      queryParams: {
        subject: subject,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }

  openhistory(taskName?: string): void {
    this.openHistory(taskName);
  }
}
