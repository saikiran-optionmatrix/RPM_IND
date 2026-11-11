import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DescriptionDialogData {
  title: string;
  subtitle?: string;
  code?: string;
  type?: 'Stage' | 'Deliverable' | 'Activity' | string;
  description: string;
}

@Component({
  selector: 'app-description-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './description-dialog.component.html',
  styleUrls: ['./description-dialog.component.scss']
})
export class DescriptionDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DescriptionDialogComponent>);
  readonly data = inject<DescriptionDialogData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
