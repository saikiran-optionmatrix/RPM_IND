import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface LocationRow {
  sNo: number;
  location: string;
  department: string;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss',
})
export class LocationComponent {
  locations: LocationRow[] = [
    { sNo: 1, location: 'Hyderabad', department: 'Manufacturing' },
    { sNo: 2, location: 'Pune', department: 'Production' },
    { sNo: 3, location: 'Mumbai', department: 'Quality Assurance' },
    { sNo: 4, location: 'Delhi', department: 'R & D' },
    { sNo: 5, location: 'Bangalore', department: 'Testing' },
  ];

  constructor(
    private dialogRef: MatDialogRef<LocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data?.locations && Array.isArray(this.data.locations)) {
      this.locations = this.data.locations;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
