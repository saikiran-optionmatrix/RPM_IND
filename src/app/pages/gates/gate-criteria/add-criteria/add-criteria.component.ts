import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-criteria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckbox
],
  templateUrl: './add-criteria.component.html',
  styleUrl: './add-criteria.component.scss'
})
export class AddCriteriaComponent implements OnInit {
  criteriaForm: FormGroup;
  isEditMode = false;
  isDragging = false;
  uploadedFileName: string | null = null;

  priorityOptions: string[] = ['High', 'Medium', 'Low'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCriteriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.criteriaForm = this.fb.group({
      subject: ['', [Validators.required]],
      description: [''],
      priority: ['High', [Validators.required]],
      mandatory: [false]
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.criteriaForm.patchValue({
        subject: this.data.subject ?? this.data.question ?? '',
        description: this.data.description ?? '',
        priority: this.data.priority ?? 'High',
        mandatory: this.data.mandatory ?? false
      });
      if (this.data.uploadedFileName) {
        this.uploadedFileName = this.data.uploadedFileName;
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedFileName = input.files[0].name;
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadedFileName = event.dataTransfer.files[0].name;
    }
  }

  removeFile(): void {
    this.uploadedFileName = null;
  }

  save(): void {
    if (this.criteriaForm.invalid) {
      return;
    }

    const formVal = this.criteriaForm.value;
    const result = {
      ...this.data,
      ...formVal,
      question: formVal.subject,
      uploadedFileName: this.uploadedFileName
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
