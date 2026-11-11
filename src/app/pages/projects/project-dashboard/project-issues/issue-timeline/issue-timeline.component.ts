import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-issue-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './issue-timeline.component.html',
  styleUrl: './issue-timeline.component.scss'
})
export class IssueTimelineComponent {
  constructor(
    public dialogRef: MatDialogRef<IssueTimelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getColor(status: string): string {
    const colors: Record<string, string> = {
      'Pending': '#e24b4a',
      'Allocated': '#ef9f27',
      'Progress': '#378add',
      'Process': '#378add',
      'Hold': '#f0995b',
      'Cancelled': '#888780',
      'Completed': '#639922',
      'Closed': '#639922'
    };
    return colors[status] ?? '#888780';
  }
}
