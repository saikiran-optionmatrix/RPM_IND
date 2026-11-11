import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ResourceScheduleItem } from '../project-resources.component';

@Component({
  selector: 'app-resource-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './resource-timeline.component.html',
  styleUrl: './resource-timeline.component.scss'
})
export class ResourceTimelineComponent {
  constructor(
    public dialogRef: MatDialogRef<ResourceTimelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceScheduleItem | null
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
