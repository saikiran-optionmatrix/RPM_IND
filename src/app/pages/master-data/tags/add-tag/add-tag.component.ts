import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-tag',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.scss',
})
export class AddTagComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTagComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      TagName: ['', [Validators.required]],
      Description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        TagName: this.data.TagName ?? this.data.name ?? '',
        Description: this.data.Description ?? this.data.description ?? '',
      });
    }
  }

  upsertTag(): void {
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
