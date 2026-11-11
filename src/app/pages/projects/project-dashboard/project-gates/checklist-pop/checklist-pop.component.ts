import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
  mandatory?: boolean;
  priority?: string;
  owner?: string;
  description?: string;
}

export interface ChecklistDialogData {
  gateCode: string;
  gateName: string;
  checklistItems: ChecklistItem[];
  isReadonly?: boolean;
}

@Component({
  selector: 'app-checklist-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  templateUrl: './checklist-pop.component.html',
  styleUrl: './checklist-pop.component.scss',
})
export class ChecklistPopComponent implements OnInit {
  gateCode: string = '';
  gateName: string = '';
  isReadonly: boolean = false;
  checklistItems: ChecklistItem[] = [];
  newChecklistText: string = '';

  constructor(
    public dialogRef: MatDialogRef<ChecklistPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChecklistDialogData
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.gateCode = this.data.gateCode || '';
      this.gateName = this.data.gateName || '';
      this.isReadonly = !!this.data.isReadonly;
      this.checklistItems = (this.data.checklistItems || []).map(item => ({ ...item }));
    }
  }

  addChecklistItem(): void {
    const text = this.newChecklistText.trim();
    if (!text || this.isReadonly) return;

    this.checklistItems.push({
      id: Date.now(),
      text,
      done: false,
      mandatory: true,
      priority: 'High'
    });
    this.newChecklistText = '';
  }

  toggleChecklistItem(item: ChecklistItem): void {
    if (this.isReadonly) return;
    item.done = !item.done;
  }

  deleteChecklistItem(index: number): void {
    if (this.isReadonly) return;
    this.checklistItems.splice(index, 1);
  }

  onSave(): void {
    this.dialogRef.close({ checklistItems: this.checklistItems });
  }

  onClose(): void {
    this.dialogRef.close({ checklistItems: this.checklistItems });
  }
}
