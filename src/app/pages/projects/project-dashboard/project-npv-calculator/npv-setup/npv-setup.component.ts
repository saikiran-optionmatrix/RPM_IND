import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NpvSetupData } from '../project-npv-calculator.component';

@Component({
  selector: 'app-npv-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './npv-setup.component.html',
  styleUrl: './npv-setup.component.scss',
})
export class NpvSetupComponent implements OnInit {
  setupForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NpvSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NpvSetupData
  ) {
    this.setupForm = this.fb.group({
      subject: [this.data?.subject || '', Validators.required],
      years: [this.data?.years || '4', Validators.required],
      periodForDcf: [this.data?.periodForDcf || 'Year 0 to Year 3', Validators.required],
      discountRate: [this.data?.discountRate ?? 12, [Validators.required, Validators.min(0)]],
      exchangeRate: [this.data?.exchangeRate ?? 95.25, [Validators.required, Validators.min(0)]],
      rateDate: [this.data?.rateDate || '04-09-2026', Validators.required],
    });
  }

  ngOnInit(): void {}

  get f() {
    return this.setupForm.controls;
  }

  save(): void {
    this.isSubmitting = true;
    if (this.setupForm.invalid) {
      this.setupForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.setupForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
