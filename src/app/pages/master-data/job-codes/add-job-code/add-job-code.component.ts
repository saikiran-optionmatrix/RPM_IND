import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-job-code',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-job-code.component.html',
  styleUrl: './add-job-code.component.scss',
})
export class AddJobCodeComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddJobCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      JobCode: ['', [Validators.required]],
      Narration: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      HourlyRate: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        JobCode: this.data.JobCode ?? this.data.code ?? '',
        Narration: this.data.Narration ?? this.data.narration ?? '',
        Description: this.data.Description ?? this.data.description ?? '',
        HourlyRate: this.data.HourlyRate ?? this.data.hourlyRate ?? null,
      });
    }
  }

  upsertJobCode(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.myGroup.value,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
