import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-save-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './save-template.component.html',
  styleUrl: './save-template.component.scss',
})
export class SaveTemplateComponent implements OnInit {


   readonly divisionsList = [
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
  ];
  templateForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SaveTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.templateForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      division: [''],
      projectName: [''],
      templateName: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      const projName = this.data.projectName || this.data.productName || this.data.subject || '';
      const templateName = this.data.name || this.data.templateName || projName;
      this.templateForm.patchValue({
        projectName: projName,
        templateName: templateName,
        name: templateName,
        description: this.data.description || '',
        division: this.data.division || ''
      });
    }
  }

  get f() {
    return this.templateForm.controls;
  }

  save(): void {
    this.isSubmitting = true;

    if (this.templateForm.invalid) {
      this.templateForm.markAllAsTouched();
      return;
    }

    const val = this.templateForm.getRawValue();
    const result = {
      ...this.data,
      ...val,
      templateName: val.name || val.templateName,
      name: val.name || val.templateName
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}

