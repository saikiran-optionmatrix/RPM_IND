import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-section.component.html',
  styleUrl: './add-section.component.scss',
})
export class AddSectionComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  departments: string[] = [
    'Research & Development',
    'Quality Control',
    'Quality Assurance',
    'Production',
    'Regulatory Affairs',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data?.departments && Array.isArray(this.data.departments) && this.data.departments.length > 0) {
      this.departments = this.data.departments;
    }

    this.myGroup = this.fb.group({
      SectionName: ['', [Validators.required]],
      SectionCode: ['', [Validators.required]],
      Department: ['', [Validators.required]],
      Remarks: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.isEditMode) {
      this.myGroup.patchValue({
        SectionName: this.data.SectionName ?? this.data.name ?? '',
        SectionCode: this.data.SectionCode ?? this.data.code ?? '',
        Department: this.data.Department ?? this.data.department ?? '',
        Remarks: this.data.Remarks ?? this.data.remarks ?? '',
      });
    }
  }

  upsertSection(): void {
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
