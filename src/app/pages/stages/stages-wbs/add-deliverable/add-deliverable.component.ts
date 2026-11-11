import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-deliverable',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-deliverable.component.html',
  styleUrl: './add-deliverable.component.scss'
})
export class AddDeliverableComponent implements OnInit {
  deliverableForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddDeliverableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deliverableForm = this.fb.group({
      stage: [this.data?.sequence || '1.2', [Validators.required]],
      deliverableName: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.deliverableForm.patchValue({
        stage: this.data.sequence || '1.2',
        deliverableName: this.data.deliverableName ?? this.data.name ?? '',
        description: this.data.description ?? ''
      });
    }
  }

  save(): void {
    this.isSubmitting = true;

    if (this.deliverableForm.invalid) {
      return;
    }

    const result = {
      ...this.data,
      ...this.deliverableForm.value
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
