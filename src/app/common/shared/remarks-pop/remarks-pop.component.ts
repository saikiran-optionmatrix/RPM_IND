import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface RemarksPopData {
  title?: string;
  placeholder?: string;
  notes?: string;
}

@Component({
  selector: 'app-remarks-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './remarks-pop.component.html',
  styleUrl: './remarks-pop.component.scss',
})
export class RemarksPopComponent implements OnInit {
  title: string = 'Remarks';
  placeholder: string = 'Enter remarks...';
  notes: string = '';

  constructor(
    private dialogRef: MatDialogRef<RemarksPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemarksPopData
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
