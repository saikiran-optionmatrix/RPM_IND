import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-delay-reason',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-delay-reason.component.html',
  styleUrl: './add-delay-reason.component.scss',
})
export class AddDelayReasonComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDelayReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      reason: ['', [Validators.required]],
      context: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        reason: this.data.reason ?? '',
        context: this.data.context ?? '',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  upsertDelayReason(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    const result = {
      ...this.data,
      ...this.myGroup.value,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
