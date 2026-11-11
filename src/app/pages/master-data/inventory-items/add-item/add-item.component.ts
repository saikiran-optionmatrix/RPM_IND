import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss',
})
export class AddItemComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      ItemName: ['', [Validators.required]],
      ItemCode: ['', [Validators.required]],
      Category: ['', [Validators.required]],
      SubCategory: ['', [Validators.required]],
      Quantity: [0, [Validators.required, Validators.min(0)]],
      UnitRate: [0, [Validators.required, Validators.min(0)]],
      Description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        ItemName: this.data.name ?? this.data.ItemName ?? '',
        ItemCode: this.data.code ?? this.data.ItemCode ?? '',
        Category: this.data.category ?? this.data.Category ?? '',
        SubCategory: this.data.subCategory ?? this.data.SubCategory ?? '',
        Quantity: this.data.quantity ?? this.data.Quantity ?? 0,
        UnitRate: this.data.unitRate ?? this.data.UnitRate ?? 0,
        Description: this.data.description ?? this.data.Description ?? '',
      });
    }
  }

  upsertItem(): void {
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
