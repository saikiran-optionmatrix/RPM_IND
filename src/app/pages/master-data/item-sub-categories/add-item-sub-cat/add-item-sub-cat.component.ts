import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-item-sub-cat',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-item-sub-cat.component.html',
  styleUrl: './add-item-sub-cat.component.scss',
})
export class AddItemSubCatComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  readonly categories = [
    'Metals',
    'Plastics',
    'Electronics',
    'Hardware',
    'Internal Assemblies',
    'Primary Packaging',
    'Secondary Packaging',
    'Tools',
    'Safety Equipment',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddItemSubCatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      Category: ['', [Validators.required]],
      SubCategory: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        Category: this.data.Category ?? this.data.name ?? '',
        SubCategory: this.data.SubCategory ?? this.data.code ?? '',
      });
    }
  }

  upsertItemSubCategory(): void {
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
