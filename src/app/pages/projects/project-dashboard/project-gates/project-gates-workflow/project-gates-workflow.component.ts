import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface GateWorkflowSignee {
  name: string;
  signed: boolean;
  dateSigned?: string;
}

export interface GateWorkflowData {
  gateCode: string;
  gateName: string;
  workflow?: string;
  signees?: GateWorkflowSignee[];
}

@Component({
  selector: 'app-project-gates-workflow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './project-gates-workflow.component.html',
  styleUrl: './project-gates-workflow.component.scss',
})
export class ProjectGatesWorkflowComponent implements OnInit {
  dialogTitle = 'Gate Workflow';
  signees: GateWorkflowSignee[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectGatesWorkflowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GateWorkflowData
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.dialogTitle = `${this.data.gateCode || 'Gate'} - ${this.data.gateName || ''} Workflow`;
      if (this.data.signees && this.data.signees.length > 0) {
        this.signees = JSON.parse(JSON.stringify(this.data.signees));
      } else {
        this.initializeSigneesFromFraction(this.data.workflow || '3/5');
      }
    } else {
      this.initializeSigneesFromFraction('3/5');
    }
  }

  initializeSigneesFromFraction(fraction: string): void {
    const parts = fraction.split('/');
    const signedCount = parseInt(parts[0], 10) || 3;

    const defaultNames = [
      'Dr. Satya Prasad',
      'Pavan Kalyan',
      'Gaurav Sharma',
      'Ayush Patel',
      'Santosh Kumar'
    ];

    const baseDates = [
      '14-Feb-2026',
      '15-Feb-2026',
      '15-Feb-2026',
      '18-Feb-2026',
      '20-Feb-2026'
    ];

    this.signees = defaultNames.map((name, index) => {
      const isSigned = index < signedCount;
      return {
        name,
        signed: isSigned,
        dateSigned: isSigned ? (baseDates[index] || '15-Feb-2026') : ''
      };
    });
  }

  toggleSigned(item: GateWorkflowSignee): void {
    if (item.signed) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      item.dateSigned = `${day}-${month}-${year}`;
    } else {
      item.dateSigned = '';
    }
  }

  get fractionSummary(): string {
    const signedCount = this.signees.filter(s => s.signed).length;
    return `${signedCount}/${this.signees.length}`;
  }

  download(): void {
    const headers = ['Name', 'Signed', 'Date signed'];
    const rows = this.signees.map(s => [
      `"${s.name}"`,
      `"${s.signed ? 'Yes' : 'No'}"`,
      `"${s.dateSigned || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const code = (this.data?.gateCode || 'Gate').replace(/\s+/g, '_');
    link.setAttribute('download', `${code}_Workflow_Signoff.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  close(): void {
    this.dialogRef.close({
      workflow: this.fractionSummary,
      signees: this.signees
    });
  }
}
