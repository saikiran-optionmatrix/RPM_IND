import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-lookup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './add-lookup.component.html',
  styleUrl: './add-lookup.component.scss',
})
export class AddLookupComponent implements OnInit {
  lookupForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  codeMasterOptions: string[] = ['Side View', 'Face View', 'Demerit'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.lookupForm = this.fb.group({
      codeMaster: ['Side View', [Validators.required]],
      lookupName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.lookup) {
      this.lookupForm.patchValue({
        codeMaster: this.data.lookup.lookup ?? 'Side View',
        lookupName: this.data.lookup.code ?? '',
      });
    }
  }

  get f() {
    return this.lookupForm.controls;
  }

  saveLookup(): void {
    this.isSubmitting = true;

    if (this.lookupForm.invalid) {
      return;
    }

    const result = {
      ...this.data?.lookup,
      lookup: this.lookupForm.value.codeMaster,
      code: this.lookupForm.value.lookupName,
      status: this.data?.lookup?.status ?? 'Active',
      category: this.data?.lookup?.category ?? 'IT Equipment',
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
