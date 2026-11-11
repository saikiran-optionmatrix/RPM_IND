import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-template',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatIconModule],
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss',
})
export class EditTemplateComponent implements OnInit {
  readonly projectTypes = [
    'Generic Formulation R&D',
    '505(b)(2) Value-Added Generic',
    'Biosimilar Development',
    'NCE Formulation Development',
    'Complex Injectable & Liposomal',
    'Life Cycle Management / Line Extension'
  ];

  readonly divisionsList = [
    'Oral Solids - OS',
    'Injectables - IJ',
    'Complex Injectables - CI',
    'Biotech - BT',
    'Inhalation & Respiratory - IR'
  ];

  readonly bufferStatuses = ['On Track', 'At Risk', 'Delayed'];

  templateForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.templateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      division: ['', Validators.required],
      projectType: ['', Validators.required],
      stages: [null, [Validators.required, Validators.min(0)]],
      gates: [null, [Validators.required, Validators.min(0)]],
      deliverables: [null, [Validators.required, Validators.min(0)]],
      activities: [null, [Validators.required, Validators.min(0)]],
      sprint: [null, [Validators.required, Validators.min(0)]],
      buffer: [null, [Validators.required, Validators.min(0)]],
      bufferStatus: ['', Validators.required],
      resources: [null, [Validators.required, Validators.min(0)]],
      budget: [null, [Validators.required, Validators.min(0)]],
      active: [true],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.templateForm.patchValue({
        ...this.data,
        division: this.data.division ?? '',
        budget: this.parseBudget(this.data.budget),
        bufferStatus: this.data.bufferStatus ?? 'On Track',
        active: this.data.status === 'Inactive' ? false : true,
      });
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.templateForm.invalid) {
      return;
    }

    this.dialogRef.close({
      ...this.data,
      ...this.templateForm.value,
      status: this.templateForm.value.active ? 'Active' : 'Inactive',
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private parseBudget(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsedValue = Number(String(value).replace(/[$,]/g, ''));
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }
}
