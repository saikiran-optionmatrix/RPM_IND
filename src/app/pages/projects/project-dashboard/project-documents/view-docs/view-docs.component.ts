import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface StaticDocItem {
  id: number;
  title: string;
}

@Component({
  selector: 'app-view-docs',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './view-docs.component.html',
  styleUrl: './view-docs.component.scss',
})
export class ViewDocsComponent {
  // Static documents list as requested
  documents: StaticDocItem[] = [
    { id: 1, title: 'User Requirements Specification (URS) & Scope Protocol.pdf' },
    { id: 2, title: '3D CAD Assembly & GD&T Tolerance Specifications.pdf' },
    { id: 3, title: 'Design FMEA & Machine Safety HAZOP Risk Dossier.pdf' },
    { id: 4, title: 'FAT / SAT Commissioning & Performance Test Report.pdf' },
    { id: 5, title: 'Instrument Calibration & Material Traceability Certificate.pdf' }
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewDocsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  viewFile(doc?: StaticDocItem): void {
    window.open('/sample.pdf', '_blank');
  }
}
