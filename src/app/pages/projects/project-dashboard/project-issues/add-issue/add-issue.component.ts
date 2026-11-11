import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-issue.component.html',
  styleUrl: './add-issue.component.scss'
})
export class AddIssueComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddIssueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      task: [''],
      subject: ['', Validators.required],
      issueDescription: [''],
      targetDate: [''],
      dueDate: [''],
      status: ['Pending', Validators.required],
      remarks: [''],
      image: [null],
      document: [null]
    });

    if (this.data) {
      this.form.patchValue({
        task: this.data.task || this.data.taskName || '',
        subject: this.data.subject || '',
        issueDescription: this.data.issueDescription || '',
        targetDate: this.data.targetDate || this.data.dueDate || '',
        dueDate: this.data.dueDate || this.data.targetDate || '',
        status: this.data.status || 'Pending',
        remarks: this.data.remarks || '',
        image: this.data.image || null,
        document: this.data.document || null
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.form.valid) {
      const val = this.form.value;
      if (!val.dueDate && val.targetDate) {
        val.dueDate = val.targetDate;
      }
      this.dialogRef.close(val);
    }
  }

  onFileSelected(event: any, type: 'image' | 'document'): void {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [type]: file.name });
    }
  }
}
