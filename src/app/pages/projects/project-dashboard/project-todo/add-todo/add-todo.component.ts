import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectTodoItem } from '../project-todo.component';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.scss'
})
export class AddTodoComponent implements OnInit {

  isEditMode: boolean = false;
  todoData: ProjectTodoItem = {
    task: '',
    subject: '',
    description: '',
    assignedTo: '',
    dateCreated: '',
    dueDate: '',
    role: '',
    group: '',
    site: '',
    department: '',
    done: false
  };

  constructor(
    public dialogRef: MatDialogRef<AddTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectTodoItem | null
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.todoData = { ...this.data };
    } else {
      const today = new Date().toISOString().split('T')[0];
      this.todoData.dateCreated = today;
      this.todoData.dueDate = today;
    }
  }

  save(): void {
    if (!this.todoData.subject || !this.todoData.subject.trim()) {
      alert('Please enter a Subject.');
      return;
    }
    this.dialogRef.close(this.todoData);
  }

  close(): void {
    this.dialogRef.close();
  }
}
