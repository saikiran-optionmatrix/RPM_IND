import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NpvLineItemData } from '../project-npv-calculator.component';

@Component({
  selector: 'app-add-line-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-line-item.component.html',
  styleUrl: './add-line-item.component.scss',
})
export class AddLineItemComponent implements OnInit {
  itemForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLineItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.itemForm = this.fb.group({
      subject: ['', Validators.required],
      remarks: [''],
      year0: [null],
      year1: [null],
      year2: [null],
      year3: [null],
      total: [null],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit' || (this.data && !!this.data.subject);

    if (this.data) {
      this.itemForm.patchValue({
        subject: this.data.subject ?? '',
        remarks: this.data.remarks ?? '',
        year0: this.data.year0 ?? null,
        year1: this.data.year1 ?? null,
        year2: this.data.year2 ?? null,
        year3: this.data.year3 ?? null,
        total: this.data.total ?? null,
      });
    }

    // Auto-calculate total when year amounts change
    this.itemForm.valueChanges.subscribe(val => {
      const y0 = Number(val.year0) || 0;
      const y1 = Number(val.year1) || 0;
      const y2 = Number(val.year2) || 0;
      const y3 = Number(val.year3) || 0;
      const hasValue = (val.year0 !== null && val.year0 !== '' && val.year0 !== undefined) ||
                       (val.year1 !== null && val.year1 !== '' && val.year1 !== undefined) ||
                       (val.year2 !== null && val.year2 !== '' && val.year2 !== undefined) ||
                       (val.year3 !== null && val.year3 !== '' && val.year3 !== undefined);
      if (hasValue) {
        const sum = y0 + y1 + y2 + y3;
        this.itemForm.get('total')?.setValue(sum, { emitEvent: false });
      }
    });
  }

  get f() {
    return this.itemForm.controls;
  }

  save(): void {
    this.isSubmitting = true;

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const val = this.itemForm.value;
    const result: NpvLineItemData = {
      subject: val.subject,
      remarks: val.remarks || '',
      year0: val.year0 !== null && val.year0 !== '' ? Number(val.year0) : null,
      year1: val.year1 !== null && val.year1 !== '' ? Number(val.year1) : null,
      year2: val.year2 !== null && val.year2 !== '' ? Number(val.year2) : null,
      year3: val.year3 !== null && val.year3 !== '' ? Number(val.year3) : null,
      total: val.total !== null && val.total !== '' ? Number(val.total) : null,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
