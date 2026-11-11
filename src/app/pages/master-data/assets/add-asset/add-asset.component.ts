import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-asset',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-asset.component.html',
  styleUrl: './add-asset.component.scss',
})
export class AddAssetComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAssetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      AssetName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]*$/)]],
      AssetCode: ['', [Validators.required]],
      AssetCategory: ['', [Validators.required]],
      // AssetSubCategory: ['', [Validators.required]],
      // AvailableQuantity: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      // UnitRate: [null, [Validators.required, Validators.pattern(/^[0-9]*\.?[0-9]*$/)]]
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        AssetName: this.data.AssetName ?? '',
        AssetCode: this.data.AssetCode ?? '',
        AssetCategory: this.data.AssetCategory ?? '',
        // AssetSubCategory: this.data.AssetSubCategory ?? '',
        // AvailableQuantity: this.data.AvailableQuantity ?? null,
        // UnitRate: this.data.UnitRate ?? null
      });
    }
  }

  // Getter used by the template as f.AssetName.errors, f.AssetCode.errors, etc.
  get f() {
    return this.myGroup.controls;
  }

  upsertAsset(): void {
    this.isSubmitting = true;

    if (this.myGroup.invalid) {
      return;
    }

    const result = {
      ...this.data,
      ...this.myGroup.value,
    };

    // TODO: call your actual create/update service here

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
