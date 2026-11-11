import { Component, Inject, Optional, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface HistoryRecord {
  columnName: string;
  previousValue: string;
  updatedValue: string;
  updatedDate: string;
  updatedBy: string;
}

export interface HistoryDialogData {
  label?: string;
  projectName?: string;
  stageName?: string;
  gateName?: string;
  activityName?: string;
  materialName?: string;
  resourceName?: string;
  issueName?: string;
  subject?: string;
  Todo?: string;
  todo?: string;
  name?: string;
  title?: string;
  records?: HistoryRecord[];
}

@Component({
  selector: 'app-history-pop',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './history-pop.component.html',
  styleUrl: './history-pop.component.scss',
})
export class HistoryPopComponent implements OnInit {
  dialogTitle: string = 'Record History';
  label: string = 'Project Name';
  recordName: string = '';

  historyRecords: HistoryRecord[] = [];

  constructor(
    public dialogRef: MatDialogRef<HistoryPopComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: HistoryDialogData | string | null
  ) { }

  ngOnInit(): void {
    if (typeof this.data === 'string') {
      this.recordName = this.data;
      const lower = this.data.toLowerCase();
      this.label = lower.startsWith('gate') ? 'Gate Name' : (lower.includes('stage') ? 'Stage Name' : (lower.includes('material') ? 'Material Name' : (lower.includes('resource') ? 'Resource Name' : 'Subject')));
    } else if (this.data && typeof this.data === 'object') {
      if (this.data.issueName) {
        this.recordName = this.data.issueName;
        this.label = this.data.label || 'Subject';
      } else if (this.data.resourceName) {
        this.recordName = this.data.resourceName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Resource Name';
      } else if (this.data.subject) {
        this.recordName = this.data.subject;
        this.label = this.data.label || 'Subject';
      } else if (this.data.materialName) {
        this.recordName = this.data.materialName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Material Name';
      } else if (this.data.activityName) {
        this.recordName = this.data.activityName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Activity Name';
      } else if (this.data.gateName) {
        this.recordName = this.data.gateName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Gate Name';
      } else if (this.data.stageName) {
        this.recordName = this.data.stageName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Stage Name';
      } else if (this.data.projectName) {
        this.recordName = this.data.projectName;
        this.label = this.data.label && this.data.label.toLowerCase().includes('name') ? this.data.label : 'Project Name';
      } else if (this.data.Todo || this.data.todo) {
        this.recordName = this.data.Todo || this.data.todo || '';
        this.label = this.data.label || 'Subject';
      } else if (this.data.name) {
        this.recordName = this.data.name;
        this.label = this.data.label || 'Name';
      } else if (this.data.label) {
        this.recordName = this.data.label;
        const lower = this.data.label.toLowerCase();
        this.label = lower.startsWith('gate') ? 'Gate Name' : (lower.includes('stage') ? 'Stage Name' : (lower.includes('material') ? 'Material Name' : 'Subject'));
      }

      if (this.data.title) {
        this.dialogTitle = this.data.title;
      }
    }

    if (this.data && typeof this.data === 'object' && this.data.records && this.data.records.length > 0) {
      this.historyRecords = this.data.records;
    } else {
      this.initDefaultRecords();
    }
  }

  initDefaultRecords(): void {
    this.historyRecords = [
      {
        columnName: 'Project Name',
        previousValue: 'Abiraterone Tablet Form',
        updatedValue: 'Abiraterone Acetate Film Coated',
        updatedDate: '15-Feb-2026 10:30 AM',
        updatedBy: 'Admin'
      },
      {
        columnName: 'Manager',
        previousValue: 'Dr. Suresh Kumar',
        updatedValue: 'Anki Reddy',
        updatedDate: '18-Feb-2026 02:15 PM',
        updatedBy: 'Admin'
      },
      {
        columnName: 'Due Date',
        previousValue: '30-Nov-2026',
        updatedValue: '31-Dec-2026',
        updatedDate: '01-Mar-2026 11:45 AM',
        updatedBy: 'Anki Reddy'
      },
      {
        columnName: 'Budget',
        previousValue: '$450,000',
        updatedValue: '$500,000',
        updatedDate: '05-Mar-2026 04:20 PM',
        updatedBy: 'Finance Team'
      },
      {
        columnName: 'Status',
        previousValue: 'Pending',
        updatedValue: 'Active',
        updatedDate: '10-Mar-2026 09:00 AM',
        updatedBy: 'Anki Reddy'
      }
    ];
  }

  close(): void {
    this.dialogRef.close();
  }
}
