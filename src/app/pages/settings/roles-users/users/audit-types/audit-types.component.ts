import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface AuditOption {
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-audit-types',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './audit-types.component.html',
  styleUrl: './audit-types.component.scss',
})
export class AuditTypesComponent implements OnInit {
  objectiveAudits: AuditOption[] = [
    { name: 'Assay & Potency Testing', selected: false },
    { name: 'Dissolution Profile Testing', selected: false },
    { name: 'ICH Q3A/B Impurities & Degradation', selected: false },
    { name: 'Container Closure Integrity (CCIT)', selected: false },
    { name: 'Sterility & Bioburden Testing', selected: false },
  ];

  subjectiveAudits: AuditOption[] = [
    { name: 'cGMP Compliance Audit', selected: false },
    { name: 'Data Integrity (21 CFR Part 11)', selected: false },
    { name: 'Cleanroom Environmental Audit', selected: false },
    { name: 'Supplier & Raw Material Audit', selected: false },
    { name: 'Batch Release & QA Audit', selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<AuditTypesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {}

  save(): void {
    const selectedObj = this.objectiveAudits.filter((a) => a.selected).length;
    const selectedSub = this.subjectiveAudits.filter((a) => a.selected).length;
    const totalSelected = selectedObj + selectedSub;
    this.dialogRef.close({
      totalSelected: totalSelected || 10,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
