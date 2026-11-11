import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

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
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT'
  ];

  stageOptions: { code: string; name: string }[] = [
    { code: 'S1', name: 'Opportunity and Portfolio Assessment (S1)' },
    { code: 'S2', name: 'Product Definition and Project Charter (S2)' },
    { code: 'S3', name: 'Formulation and Product Concept Development (S3)' },
    { code: 'S4', name: 'API, Excipient and Supplier Sourcing (S4)' },
    { code: 'S5', name: 'Formulation and Process Development (S5)' },
    { code: 'S6', name: 'Development Batches and Verification (S6)' },
    { code: 'S7', name: 'Facility, Equipment and Process Readiness (S7)' },
    { code: 'S8', name: 'Analytical Validation and Technology Transfer (S8)' },
    { code: 'S9', name: 'Registration and Process Validation Batches (S9)' },
    { code: 'S10', name: 'Regulatory Submission and Approval (S10)' },
    { code: 'S11', name: 'Commercial Launch and Lifecycle Management (S11)' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddGateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.gateForm = this.fb.group({
      gateName: ['', [Validators.required]],
      division: [['Oral Solids - OS'], [Validators.required]],
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
        divisionVal = ['Oral Solids - OS'];
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
