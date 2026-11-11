import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-division',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-division.component.html',
  styleUrl: './add-division.component.scss',
})
export class AddDivisionComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDivisionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      divisionName: ['', [Validators.required]],
      divisionCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        divisionName: this.data.divisionName ?? this.data.name ?? '',
        divisionCode: this.data.divisionCode ?? this.data.code ?? '',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  upsertDivision(): void {
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
