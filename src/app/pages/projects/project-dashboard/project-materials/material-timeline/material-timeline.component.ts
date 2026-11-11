import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectMaterial } from '../project-materials.component';

@Component({
  selector: 'app-material-timeline',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './material-timeline.component.html',
  styleUrl: './material-timeline.component.scss'
})
export class MaterialTimelineComponent {
  constructor(
    public dialogRef: MatDialogRef<MaterialTimelineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectMaterial | null
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
