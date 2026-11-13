import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { INDUSTRIAL_STAGES_MASTER } from '../../stages/industrial-stages.data';

@Component({
  selector: 'app-add-gate',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-gate.component.html',
  styleUrl: './add-gate.component.scss'
})
export class AddGateComponent implements OnInit {
  gateForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  divisionOptions: string[] = [
    'Equipment Engineering - CT',
    'Industrial Machinery - MA',
    'Process Equipment - GT',
    'Production Systems - VX'
  ];

  stageOptions: { code: string; name: string }[] = INDUSTRIAL_STAGES_MASTER.map(s => ({
    code: s.stageCode,
    name: `${s.stageName} (${s.stageCode})`
  }));

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddGateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gateForm = this.fb.group({
      gateName: ['', [Validators.required]],
      division: [['Industrial Machinery - MA'], [Validators.required]],
      gateCode: [''],
      stageCode: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      let divisionVal: string[] = [];
      if (Array.isArray(this.data.divisions) && this.data.divisions.length) {
        divisionVal = [...this.data.divisions];
      } else if (Array.isArray(this.data.division)) {
        divisionVal = [...this.data.division];
      } else if (typeof this.data.division === 'string' && this.data.division.trim()) {
        divisionVal = this.data.division.split(',').map((d: string) => d.trim()).filter(Boolean);
      } else {
        divisionVal = ['Industrial Machinery - MA'];
      }

      this.gateForm.patchValue({
        gateName: this.data.gateName ?? this.data.name ?? '',
        division: divisionVal,
        gateCode: this.data.gateCode ?? '',
        stageCode: this.data.stageCode ?? '',
        description: this.data.description ?? ''
      });
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.gateForm.invalid) {
      return;
    }

    const formValue = this.gateForm.value;
    const selectedDivisions: string[] = Array.isArray(formValue.division)
      ? formValue.division
      : (formValue.division ? [formValue.division] : []);

    const result = {
      ...this.data,
      ...formValue,
      name: formValue.gateName,
      division: selectedDivisions.join(', '),
      divisions: selectedDivisions
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
