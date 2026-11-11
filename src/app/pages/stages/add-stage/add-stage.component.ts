import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-stage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './add-stage.component.html',
  styleUrl: './add-stage.component.scss'
})
export class AddStageComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  divisionOptions: string[] = [
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT'
  ];
  gateOptions: string[] = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5', 'Gate 6'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myGroup = this.fb.group({
      stageName: ['', [Validators.required]],
      division: [['Oral Solids - OS'], [Validators.required]],
      stageCode: [''],
      stageSerial: [null, [Validators.required, Validators.min(1)]],
      gateCode: ['', [Validators.required]],
      planEffort: [0, [Validators.required, Validators.min(0)]],
      planDuration: [0, [Validators.required, Validators.min(0)]],
      materialBudget: [''],
      stageDescription: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      let serialValue = this.data.stageSerial ?? this.data.serial ?? null;
      if (serialValue === null && this.data.stageCode) {
        const num = parseInt(String(this.data.stageCode).replace(/\D/g, ''), 10);
        if (!isNaN(num)) {
          serialValue = num;
        }
      }

      let divisionVal: string[] = [];
      if (Array.isArray(this.data.divisions) && this.data.divisions.length) {
        divisionVal = [...this.data.divisions];
      } else if (Array.isArray(this.data.division)) {
        divisionVal = [...this.data.division];
      } else if (typeof this.data.division === 'string' && this.data.division.trim()) {
        divisionVal = this.data.division.split(',').map((d: string) => d.trim()).filter(Boolean);
      } else {
        divisionVal = ['Oral Solids - OS'];
      }

      this.myGroup.patchValue({
        stageName: this.data.stageName ?? '',
        division: divisionVal,
        stageCode: this.data.stageCode ?? (serialValue ? `S${serialValue}` : ''),
        stageSerial: serialValue,
        gateCode: this.data.gateCode ?? '',
        planEffort: this.data.planEffort ?? 0,
        planDuration: this.data.planDuration ?? 0,
        materialBudget: this.data.materialBudget ?? '',
        stageDescription: this.data.stageDescription ?? this.data.description ?? ''
      });
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    const formValue = this.myGroup.value;
    const selectedDivisions: string[] = Array.isArray(formValue.division)
      ? formValue.division
      : (formValue.division ? [formValue.division] : []);

    const result = {
      ...this.data,
      ...formValue,
      division: selectedDivisions.join(', '),
      divisions: selectedDivisions
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
