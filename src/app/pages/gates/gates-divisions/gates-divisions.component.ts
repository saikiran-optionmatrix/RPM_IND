import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

export interface DivisionOption {
  name: string;
  code: string;
  selected: boolean;
}

@Component({
  selector: 'app-gates-divisions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatCheckboxModule, MatIconModule],
  templateUrl: './gates-divisions.component.html',
  styleUrl: './gates-divisions.component.scss',
})
export class GatesDivisionsComponent implements OnInit {
  gateName: string = '';

  divisionsList: DivisionOption[] = [
    { name: 'Equipment Engineering - CT', code: 'CT', selected: false },
    { name: 'Industrial Machinery - MA', code: 'MA', selected: false },
    { name: 'Process Equipment - GT', code: 'GT', selected: false },
    { name: 'Production Systems - VX', code: 'VX', selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<GatesDivisionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.gateName = this.data.gate?.name || this.data.gate?.gateCode || '';
      const selected =
        this.data.selectedDivisions ||
        (this.data.gate?.divisions ?? (this.data.gate?.division ? [this.data.gate.division] : []));

      if (Array.isArray(selected)) {
        this.divisionsList.forEach((div) => {
          div.selected = selected.some(
            (s) =>
              s &&
              (s.toLowerCase().includes(div.code.toLowerCase()) ||
                s.toLowerCase() === div.name.toLowerCase()),
          );
        });
      }
    }
  }

  isAllSelected(): boolean {
    return this.divisionsList.length > 0 && this.divisionsList.every((d) => d.selected);
  }

  toggleAll(checked: boolean): void {
    this.divisionsList.forEach((d) => (d.selected = checked));
  }

  save(): void {
    const selectedNames = this.divisionsList.filter((d) => d.selected).map((d) => d.name);
    this.dialogRef.close(selectedNames);
  }

  close(): void {
    this.dialogRef.close();
  }
}
