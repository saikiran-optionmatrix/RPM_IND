import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-state',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.scss',
})
export class AddStateComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      StateName: ['', [Validators.required]],
      StateCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        StateName: this.data.StateName ?? this.data.name ?? '',
        StateCode: this.data.StateCode ?? this.data.code ?? '',
      });
    }
  }

  upsertState(): void {
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
