import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-managers-pop',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  templateUrl: './managers-pop.component.html',
  styleUrl: './managers-pop.component.scss',
})
export class ManagersPopComponent {
  managers: string[] = ['Navin Malik', 'Sourabh', 'Surya Teja', 'Vamshi'];

  constructor(
    private dialogRef: MatDialogRef<ManagersPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data?.managers && Array.isArray(this.data.managers)) {
      this.managers = this.data.managers;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
