import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-wbs-requirement',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './add-wbs-requirement.component.html',
  styleUrl: './add-wbs-requirement.component.scss',
})
export class AddWbsRequirementComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddWbsRequirementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      requirementName: ['', [Validators.required]],
      department: ['Analytical'],
      role: ['Scientist'],
      dueDate: [new Date().toISOString().substring(0, 10)],
      completedDate: [''],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        requirementName: this.data.requirementName ?? '',
        department: this.data.department ?? 'Analytical',
        role: this.data.role ?? 'Scientist',
        dueDate: this.data.dueDate ?? new Date().toISOString().substring(0, 10),
        completedDate: this.data.completedDate ?? '',
        remarks: this.data.remarks ?? '',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  upsertRequirement(): void {
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
