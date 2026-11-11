import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface JobCodeItem {
  code: string;
  title: string;
  selected: boolean;
}

@Component({
  selector: 'app-job-code',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './job-code.component.html',
  styleUrl: './job-code.component.scss',
})
export class JobCodeComponent implements OnInit {
  leftColumn: JobCodeItem[] = [
    { code: 'AA', title: 'Admin Assistant', selected: true },
    { code: 'BSM', title: 'Business Services Manager', selected: true },
    { code: 'CCAD1', title: 'Construction CAD 1', selected: true },
    { code: 'CLCNT', title: 'Client Contact', selected: true },
    { code: 'CLINT', title: 'Client Interaction', selected: true },
    { code: 'EA', title: 'Executive Assistant', selected: true },
    { code: 'FM', title: 'Finance Manager', selected: true },
    { code: 'FS', title: 'Field Supervisor', selected: true },
    { code: 'ITT', title: 'IT Technician', selected: true },
    { code: 'PM', title: 'Project Manager', selected: true },
  ];

  rightColumn: JobCodeItem[] = [
    { code: 'QA', title: 'Quotes Administrator', selected: true },
    { code: 'QTPRP', title: 'Quote Preparation', selected: true },
    { code: 'SB&SR', title: 'Setting Budget & Scope Review', selected: true },
    { code: 'CC', title: 'Construction Coordinator', selected: true },
    { code: 'CCAD2', title: 'Construction CAD 2', selected: true },
    { code: 'CCAD3', title: 'Construction CAD 3', selected: true },
    { code: 'CFA', title: 'Construction Field Assistant', selected: true },
    { code: 'CPC1', title: 'Construction Party Chief 1', selected: true },
    { code: 'CPC2', title: 'Construction Party Chief 2', selected: true },
    { code: 'CPC3', title: 'Construction Party Chief 3', selected: true },
  ];

  constructor(
    private dialogRef: MatDialogRef<JobCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {}

  toggleAllLeft(checked: boolean): void {
    this.leftColumn.forEach((i) => (i.selected = checked));
  }

  isAllLeftSelected(): boolean {
    return this.leftColumn.length > 0 && this.leftColumn.every((i) => i.selected);
  }

  toggleAllRight(checked: boolean): void {
    this.rightColumn.forEach((i) => (i.selected = checked));
  }

  isAllRightSelected(): boolean {
    return this.rightColumn.length > 0 && this.rightColumn.every((i) => i.selected);
  }

  save(): void {
    const selectedLeft = this.leftColumn.filter((i) => i.selected);
    const selectedRight = this.rightColumn.filter((i) => i.selected);
    const totalSelected = selectedLeft.length + selectedRight.length;
    const totalCount = this.leftColumn.length + this.rightColumn.length;
    this.dialogRef.close({
      selectedCount: totalSelected,
      totalCount: totalCount,
      summary: `${totalSelected}/${totalCount}`,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
