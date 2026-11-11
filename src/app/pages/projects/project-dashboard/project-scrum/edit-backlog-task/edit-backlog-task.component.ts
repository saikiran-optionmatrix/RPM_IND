import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-edit-backlog-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIcon,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-backlog-task.component.html',
  styleUrls: ['./edit-backlog-task.component.scss']
})
export class EditBacklogTaskComponent implements OnInit {

  isEditMode = false;
  isSprint = false;
  task = '';
  taskCode = '';
  jobCode = '';
  planStart = '';
  planFinish = '';
  effort = 0;
  duration = 0;
  stage = 'Formulation';
  assigned = '';
  description = '';
  eta = '';
  actualStart = '';
  actualFinish = '';
  expenses = 0;
  status = '';
  approved = false;
  progress = 0;

  stages = ['Feasibility', 'Formulation', 'Development', 'Testing', 'Validation', 'Regulatory'];
  team = ['Aarav Shah', 'Priya Nair', 'Diego Ruiz', 'Mei Tanaka', 'Olivia Brown'];

  constructor(
    public dialogRef: MatDialogRef<EditBacklogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      const taskData = this.data.task ? this.data.task : this.data;
      this.isSprint = !!this.data.isSprint;
      this.task = taskData.task || '';
      this.taskCode = taskData.taskCode || '';
      this.jobCode = taskData.jobCode || '';
      this.planStart = taskData.planStart || '';
      this.planFinish = taskData.planFinish || '';
      this.effort = taskData.effort || 0;
      this.duration = taskData.duration || 0;
      this.stage = taskData.stage || 'Formulation';
      this.assigned = taskData.assigned || '';
      this.description = taskData.description || '';
      this.eta = taskData.eta || '';
      this.actualStart = taskData.actualStart || '';
      this.actualFinish = taskData.actualFinish || '';
      this.expenses = taskData.expenses || 0;
      this.status = taskData.status || '';
      this.approved = !!taskData.approved;
      this.progress = taskData.progress || 0;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      task: this.task,
      taskCode: this.taskCode,
      jobCode: this.jobCode,
      planStart: this.planStart,
      planFinish: this.planFinish,
      effort: this.effort,
      duration: this.duration,
      stage: this.stage,
      assigned: this.assigned,
      description: this.description,
      eta: this.eta,
      actualStart: this.actualStart,
      actualFinish: this.actualFinish,
      expenses: this.expenses,
      status: this.status,
      approved: this.approved,
      progress: this.progress
    });
  }
}
