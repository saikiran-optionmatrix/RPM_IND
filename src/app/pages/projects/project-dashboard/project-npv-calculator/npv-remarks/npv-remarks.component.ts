import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NpvRemarksData } from '../project-npv-calculator.component';

@Component({
  selector: 'app-npv-remarks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './npv-remarks.component.html',
  styleUrl: './npv-remarks.component.scss',
})
export class NpvRemarksComponent implements OnInit {
  title: string = 'Remarks';
  placeholder: string = 'Enter remarks...';
  notes: string = '';

  constructor(
    private dialogRef: MatDialogRef<NpvRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NpvRemarksData
  ) {
    if (this.data) {
      if (this.data.title) this.title = this.data.title;
      if (this.data.placeholder) this.placeholder = this.data.placeholder;
      if (this.data.notes) this.notes = this.data.notes;
    }
  }

  ngOnInit(): void {}

  save(): void {
    this.dialogRef.close(this.notes);
  }

  close(): void {
    this.dialogRef.close();
  }
}
