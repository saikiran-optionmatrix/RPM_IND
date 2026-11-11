import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.scss',
})
export class AddCityComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      CityName: ['', [Validators.required]],
      CityCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        CityName: this.data.CityName ?? this.data.name ?? '',
        CityCode: this.data.CityCode ?? this.data.code ?? '',
      });
    }
  }

  upsertCity(): void {
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
