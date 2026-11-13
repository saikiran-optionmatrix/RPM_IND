import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HistoryPopComponent, HistoryRecord } from '../../../../../common/shared/history-pop/history-pop.component';
import { ConfirmationDialogComponent } from '../../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { SchedulingAddtaskComponent } from './scheduling-addtask/scheduling-addtask.component';

export interface TaskMessage {
  sender: string;
  date: string;
  text: string;
}

export interface ScheduleTask {
  id: number;
  projectCode: string;
  projectName?: string;
  deliverable: string;
  activity: string;
  task: string;
  hours: number;
  description: string;
  approved: boolean;
  declined: boolean;
  pending: boolean;
  messages: number;
  lastUpdated: string;
  updatedBy: string;
  history: number;
  resourceName?: string;
  date?: string;
  messagesList?: TaskMessage[];
  isEditing?: boolean;
  _backup?: Partial<ScheduleTask>;
}

@Component({
  selector: 'app-project-scheduling-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './project-scheduling-tasks.component.html',
  styleUrl: './project-scheduling-tasks.component.scss',
})
export class ProjectSchedulingTasksComponent implements OnInit {
  @ViewChild('messageDialog') messageDialog!: TemplateRef<any>;

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  selectedResource: string = '';
  selectedDate: string = '';

  // Filter state
  showFilter: boolean = false;
  keyword: string = '';
  statusFilter: string = 'all';

  // Pagination state
  pageIndex: number = 0;
  pageSize: number = 10;

  // Active dialog state
  selectedTaskForMessage: ScheduleTask | null = null;
  currentTaskMessages: TaskMessage[] = [];
  newMessageText: string = '';
  messageDialogRef?: MatDialogRef<any>;

  resourceList: string[] = [
    'Ananya Rao',
    'Rajesh Kumar',
    'Anita Desai',
    'Priya Reddy',
    'Suresh Naidu',
    'Amit Patel',
    'Arun Joseph',
    'Deepa Nair',
    'Lakshmi Devi'
  ];

  tasks: ScheduleTask[] = [
    {
      id: 1,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Feasibility',
      activity: 'Plant Throughput & Bottleneck Study',
      task: 'Cycle-time benchmarking',
      hours: 4.5,
      description: 'Shop-floor assembly takt-time benchmarking across primary workstations.',
      approved: true,
      declined: false,
      pending: false,
      messages: 3,
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 4,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26',
      messagesList: [
        { sender: 'Anita Desai', date: '02-Jun-2026 10:15', text: 'Please benchmark against Line 2 baseline takt time.' },
        { sender: 'Rajesh Kumar', date: '02-Jun-2026 11:30', text: 'Testing completed with Line 2 baseline. Data aligned.' },
        { sender: 'Anita Desai', date: '02-Jun-2026 14:00', text: 'Approved for URS documentation.' }
      ]
    },
    {
      id: 2,
      projectCode: '2026/IND/002',
      projectName: 'Automated Material Handling System',
      deliverable: 'Concept Engg',
      activity: '3D CAD Line Layout & Flow',
      task: 'Gantry reachability envelope check',
      hours: 3.5,
      description: 'Evaluation of palletizer conveyor geometry and robotic reach clearances.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '02-Jun-2026',
      updatedBy: 'Rajesh Kumar',
      history: 2,
      resourceName: 'Rajesh Kumar',
      date: '06-02-26',
      messagesList: [
        { sender: 'Rajesh Kumar', date: '02-Jun-2026 16:45', text: 'Sweep clearance > 180 mm verified along bay columns.' }
      ]
    },
    {
      id: 3,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Detailed Engg',
      activity: 'Structural FEA & GD&T Stack-Up',
      task: 'Finite element deflection check',
      hours: 4.0,
      description: 'Gantry structural deflection and modal resonance frequency evaluation.',
      approved: true,
      declined: false,
      pending: false,
      messages: 2,
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Anita Desai',
      history: 3,
      resourceName: 'Anita Desai',
      date: '06-03-26',
      messagesList: [
        { sender: 'Anita Desai', date: '03-Jun-2026 11:00', text: 'FEA deflection stays within 0.04 mm under full load.' },
        { sender: 'Engineering Lead', date: '03-Jun-2026 13:20', text: 'Looks good, proceed to detailed BOM release.' }
      ]
    },
    {
      id: 4,
      projectCode: '2026/IND/003',
      projectName: 'Robotics Assembly Cell Installation',
      deliverable: 'Detailed Engg',
      activity: 'Electrical Panel & SCADA Schematics',
      task: 'Safety PLC interlock logic',
      hours: 4.0,
      description: 'Dual-channel E-stop and light curtain zone wiring per ISO 13849 PLd.',
      approved: false,
      declined: false,
      pending: true,
      messages: 0,
      lastUpdated: '03-Jun-2026',
      updatedBy: 'Priya Reddy',
      history: 1,
      resourceName: 'Priya Reddy',
      date: '06-03-26',
      messagesList: []
    },
    {
      id: 5,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Design Freeze',
      activity: 'Design FMEA & HAZOP Review',
      task: 'RPN failure mode mitigation',
      hours: 5.0,
      description: 'Cross-functional closure of high-risk mechanical & pneumatic failure modes.',
      approved: true,
      declined: false,
      pending: false,
      messages: 4,
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Deepa Nair',
      history: 5,
      resourceName: 'Deepa Nair',
      date: '06-04-26',
      messagesList: [
        { sender: 'Deepa Nair', date: '04-Jun-2026 09:30', text: 'Reviewed top 12 spindle/servo failure modes.' },
        { sender: 'Deepa Nair', date: '04-Jun-2026 12:00', text: 'Added dual encoder redundancy on primary drive.' },
        { sender: 'QA Lead', date: '04-Jun-2026 14:15', text: 'Residual RPN reduced below threshold of 80.' },
        { sender: 'Deepa Nair', date: '04-Jun-2026 16:30', text: 'FMEA dossier submitted for Gate 2 sign-off.' }
      ]
    },
    {
      id: 6,
      projectCode: '2026/IND/004',
      projectName: 'Heavy Press Machine Overhaul',
      deliverable: 'Fabrication',
      activity: 'Prototype Tooling & Endurance Trial',
      task: 'Dry-run endurance cycling',
      hours: 3.0,
      description: 'Die cushion hydraulic pressure stabilization and slide parallelism cycling.',
      approved: false,
      declined: true,
      pending: false,
      messages: 2,
      lastUpdated: '04-Jun-2026',
      updatedBy: 'Suresh Naidu',
      history: 2,
      resourceName: 'Suresh Naidu',
      date: '06-04-26',
      messagesList: [
        { sender: 'Reviewer', date: '04-Jun-2026 15:00', text: 'Declined due to missing oil temperature stabilization log.' },
        { sender: 'Suresh Naidu', date: '04-Jun-2026 16:00', text: 'Noted. Extended 4-hour thermal run scheduled.' }
      ]
    },
    {
      id: 7,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Fabrication',
      activity: 'Factory Acceptance Test (FAT)',
      task: 'Witness FAT checklist approval',
      hours: 4.5,
      description: 'OEM FAT protocol dry-cycle, safety interlock trip, and noise verification.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '05-Jun-2026',
      updatedBy: 'Amit Patel',
      history: 3,
      resourceName: 'Amit Patel',
      date: '06-05-26',
      messagesList: [
        { sender: 'Amit Patel', date: '05-Jun-2026 17:00', text: 'Measured noise level is 75.8 dBA (< 78 dBA limit).' }
      ]
    },
    {
      id: 8,
      projectCode: '2026/IND/005',
      projectName: 'Smart Factory SCADA & PLC Upgrade',
      deliverable: 'Installation',
      activity: 'Mechanical Rigging & Laser Alignment',
      task: '480V feeder & telemetry tie-in',
      hours: 3.5,
      description: 'Control cabinet power termination and OPC-UA edge gateway provisioning.',
      approved: false,
      declined: false,
      pending: true,
      messages: 3,
      lastUpdated: '05-Jun-2026',
      updatedBy: 'Arun Joseph',
      history: 2,
      resourceName: 'Arun Joseph',
      date: '06-05-26',
      messagesList: [
        { sender: 'Arun Joseph', date: '05-Jun-2026 11:20', text: 'Fiber optic ring drops tested across Bays A–D.' },
        { sender: 'Controls Lead', date: '05-Jun-2026 13:40', text: 'Verify failover packet loss stays under 0.1%.' },
        { sender: 'Arun Joseph', date: '05-Jun-2026 16:00', text: 'Zero packet loss confirmed in ring redundancy test.' }
      ]
    },
    {
      id: 9,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Commissioning',
      activity: 'Site Acceptance Test (SAT) Execution',
      task: 'Cpk >= 1.33 capability run-off',
      hours: 4.0,
      description: '50-part continuous machining run CMM capability analysis on Plant A line.',
      approved: true,
      declined: false,
      pending: false,
      messages: 0,
      lastUpdated: '08-Jun-2026',
      updatedBy: 'Ananya Rao',
      history: 2,
      resourceName: 'Ananya Rao',
      date: '06-08-26',
      messagesList: []
    },
    {
      id: 10,
      projectCode: '2026/IND/006',
      projectName: 'CNC Machining Line Capacity Expansion',
      deliverable: 'Commissioning',
      activity: 'Site Acceptance Test (SAT) Execution',
      task: 'Optical laser bed leveling',
      hours: 4.0,
      description: 'Precision bed leveling and spindle perpendicularity calibration check.',
      approved: true,
      declined: false,
      pending: false,
      messages: 1,
      lastUpdated: '08-Jun-2026',
      updatedBy: 'Amit Patel',
      history: 1,
      resourceName: 'Amit Patel',
      date: '06-08-26',
      messagesList: [
        { sender: 'Amit Patel', date: '08-Jun-2026 15:30', text: 'Axis squareness measured at 0.008 mm/300 mm.' }
      ]
    },
    {
      id: 11,
      projectCode: '2026/IND/001',
      projectName: 'Industrial Equipment Line Expansion',
      deliverable: 'Handover',
      activity: 'CMMS Spares & Plant Handover',
      task: 'LOTO SOP & PM tree setup',
      hours: 4.5,
      description: 'Creating CMMS asset hierarchy, preventive maintenance routines, and spares min/max.',
      approved: true,
      declined: false,
      pending: false,
      messages: 2,
      lastUpdated: '22-Jun-2026',
      updatedBy: 'Lakshmi Devi',
      history: 3,
      resourceName: 'Lakshmi Devi',
      date: '06-22-26',
      messagesList: [
        { sender: 'Lakshmi Devi', date: '22-Jun-2026 10:00', text: 'Draft PM schedule uploaded to plant CMMS.' },
        { sender: 'Maintenance Mgr', date: '22-Jun-2026 14:30', text: 'Approved with critical spares kit.' }
      ]
    },
    {
      id: 12,
      projectCode: '2026/IND/002',
      projectName: 'Automated Material Handling System',
      deliverable: 'Handover',
      activity: 'CMMS Spares & Plant Handover',
      task: 'As-built TTD package sign-off',
      hours: 3.5,
      description: 'Final archival of as-built EPLAN drawings and PLC golden backups.',
      approved: false,
      declined: false,
      pending: true,
      messages: 1,
      lastUpdated: '22-Jun-2026',
      updatedBy: 'Ananya Rao',
      history: 2,
      resourceName: 'Ananya Rao',
      date: '06-22-26',
      messagesList: [
        { sender: 'Ananya Rao', date: '22-Jun-2026 16:15', text: 'Waiting for Plant Director Gate 5 sign-off.' }
      ]
    }
  ];

  filteredTasks: ScheduleTask[] = [];

  get paginatedTasks(): ScheduleTask[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredTasks.slice(startIndex, startIndex + this.pageSize);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['resource']) {
        this.selectedResource = params['resource'];
      }
      if (params['date']) {
        this.selectedDate = params['date'];
      }

      this.applyFilter();
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/schedule'], {
      queryParams: {
        view: 'allocation',
        projectName: this.projectName,
        projectCode: this.projectCode
      }
    });
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter((t) => {
      // Resource filter
      if (this.selectedResource && t.resourceName && t.resourceName.toLowerCase() !== this.selectedResource.toLowerCase()) {
        return false;
      }

      // Status filter
      if (this.statusFilter === 'approved' && !t.approved) {
        return false;
      }
      if (this.statusFilter === 'declined' && !t.declined) {
        return false;
      }
      if (this.statusFilter === 'pending' && !t.pending) {
        return false;
      }

      // Keyword filter
      if (this.keyword && this.keyword.trim()) {
        const query = this.keyword.toLowerCase().trim();
        const combined = `${t.projectCode} ${t.deliverable} ${t.activity} ${t.task} ${t.description} ${t.updatedBy}`.toLowerCase();
        if (!combined.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Reset pagination to first page when filtering
    this.pageIndex = 0;
  }

  clearFilter(): void {
    this.keyword = '';
    this.statusFilter = 'all';
    this.selectedResource = '';
    this.applyFilter();
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openEditTask(task: ScheduleTask): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'edit',
        task: task
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        task.projectCode = res.projectCode;
        if (res.projectName) {
          task.projectName = res.projectName;
        }
        task.deliverable = res.deliverable;
        task.activity = res.activity;
        task.task = res.task;
        task.hours = Number(res.hours) || 0;
        task.description = res.description;
        task.lastUpdated = this.formatDate(new Date());
        task.history = (task.history || 0) + 1;
        this.applyFilter();
      }
    });
  }

  deleteTask(task: ScheduleTask): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Scheduling Task',
        content: `Are you sure you want to delete the task "${task.task}"?`
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.applyFilter();
      }
    });
  }

  toggleStatus(task: ScheduleTask, type: 'approved' | 'declined' | 'pending', checked: boolean): void {
    if (checked) {
      task.approved = type === 'approved';
      task.declined = type === 'declined';
      task.pending = type === 'pending';
    } else {
      task[type] = false;
      // If unchecked, default to pending if none is selected
      if (!task.approved && !task.declined && !task.pending) {
        task.pending = true;
      }
    }
    task.lastUpdated = this.formatDate(new Date());
    task.history = (task.history || 0) + 1;
  }

  // Messages Dialog
  openMessages(task: ScheduleTask): void {
    this.selectedTaskForMessage = task;
    if (!task.messagesList) {
      task.messagesList = [];
    }
    this.currentTaskMessages = task.messagesList;
    this.newMessageText = '';

    if (this.messageDialog) {
      this.messageDialogRef = this.dialog.open(this.messageDialog, {
        width: '550px',
        maxWidth: '95vw',
        data: task
      });
    }
  }

  openMessagesDialog(task: ScheduleTask): void {
    this.openMessages(task);
  }

  addMessage(task?: ScheduleTask, text?: string): void {
    const targetTask = task || this.selectedTaskForMessage;
    const msgText = (text !== undefined ? text : this.newMessageText).trim();
    if (!msgText || !targetTask) {
      return;
    }

    if (!targetTask.messagesList) {
      targetTask.messagesList = [];
    }

    const newMsg: TaskMessage = {
      sender: this.selectedResource || 'Lead Reviewer',
      date: new Date().toISOString().split('T')[0],
      text: msgText
    };

    targetTask.messagesList.push(newMsg);
    targetTask.messages = targetTask.messagesList.length;
    this.currentTaskMessages = targetTask.messagesList;
    this.newMessageText = '';
  }

  // History Navigation
  openHistory(task: ScheduleTask): void {
    const currentUrl = this.router.url || '';
    const targetRoute = currentUrl.includes('/schedule-tasks')
      ? '/projects/dashboard/schedule-tasks-history'
      : '/projects/dashboard/schedule/tasks/history';

    this.router.navigate([targetRoute], {
      queryParams: {
        taskId: task.id,
        projectCode: task.projectCode,
        projectName: task.projectName || this.projectName,
        deliverable: task.deliverable,
        activity: task.activity,
        taskName: task.task,
        hours: task.hours,
        description: task.description,
        approved: task.approved,
        declined: task.declined,
        pending: task.pending,
        historyCount: task.history || 3,
        lastUpdated: task.lastUpdated,
        updatedBy: task.updatedBy,
        resource: this.selectedResource,
        date: this.selectedDate
      },
      queryParamsHandling: 'merge'
    });
  }

  private getHistoryRecords(task: ScheduleTask): HistoryRecord[] {
    const records: HistoryRecord[] = [];
    const currentStatus = task.approved ? 'Approved' : task.declined ? 'Declined' : 'Pending';

    records.push({
      columnName: 'Status',
      previousValue: task.pending ? 'New' : 'Pending',
      updatedValue: currentStatus,
      updatedDate: `${task.lastUpdated} 10:30`,
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Hours',
      previousValue: `${(task.hours > 1 ? task.hours - 1 : 2).toFixed(1)}`,
      updatedValue: `${task.hours.toFixed(1)}`,
      updatedDate: `${task.lastUpdated} 09:15`,
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Deliverable',
      previousValue: 'Initial Drafting',
      updatedValue: task.deliverable,
      updatedDate: '01-Jun-2026 14:00',
      updatedBy: task.updatedBy
    });

    records.push({
      columnName: 'Description',
      previousValue: 'Draft task allocation',
      updatedValue: task.description,
      updatedDate: '01-Jun-2026 11:20',
      updatedBy: task.updatedBy
    });

    return records;
  }

  // Add Task Modal
  openAddTask(): void {
    const dialogRef = this.dialog.open(SchedulingAddtaskComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: {
        mode: 'add',
        task: {
          projectCode: this.projectCode || '2026/IND/001',
          deliverable: '',
          activity: '',
          task: '',
          hours: null,
          description: ''
        }
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const createdTask: ScheduleTask = {
          id: Date.now(),
          projectCode: res.projectCode || this.projectCode || '2026/IND/001',
          projectName: res.projectName || this.projectName,
          deliverable: res.deliverable || '',
          activity: res.activity || '',
          task: res.task || '',
          hours: Number(res.hours) || 0,
          description: res.description || '',
          approved: false,
          declined: false,
          pending: true,
          messages: 0,
          lastUpdated: this.formatDate(new Date()),
          updatedBy: this.selectedResource || 'Current User',
          history: 1,
          resourceName: this.selectedResource || 'Current User',
          messagesList: []
        };

        this.tasks.unshift(createdTask);
        this.applyFilter();
      }
    });
  }

  formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[d.getMonth()];
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }
}
