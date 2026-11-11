import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-sprint',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './add-sprint.component.html',
  styleUrl: './add-sprint.component.scss'
})
export class AddSprintComponent implements OnInit {
  sprintName: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddSprintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { defaultName?: string } | null
  ) {}

  ngOnInit(): void {
    if (this.data?.defaultName) {
      this.sprintName = this.data.defaultName;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const trimmed = this.sprintName.trim();
    if (!trimmed) return;
    this.dialogRef.close({ name: trimmed });
  }
}
