import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { INDUSTRIAL_STAGE_DEPARTMENTS } from '../../../../../../stages/industrial-stages.data';

@Component({
  selector: 'app-add-wbs-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  templateUrl: './add-wbs-tasks.component.html',
  styleUrl: './add-wbs-tasks.component.scss',
})
export class AddWbsTasksComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  departments: string[] = INDUSTRIAL_STAGE_DEPARTMENTS;

  sections: string[] = [
    'Engineering & R&D',
    'Mechanical Design',
    'Automation & Controls',
    'Manufacturing & Operations',
    'Quality Control & Inspection',
    'Quality Assurance',
    'Procurement & Supply Chain',
    'EHS & Compliance',
    'Commissioning & Qualification'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddWbsTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      active: [true],
      done: [false],
      taskName: ['', [Validators.required]],
      taskCode: [''],
      reference: [''],
      jobCode: [''],
      dueDate: [new Date().toISOString().substring(0, 10)],
      completedDate: [''],
      responsibility: [''],
      department: ['Mechanical Design'],
      section: ['Mechanical Design'],
      role: ['Lead Mechanical Engineer'],
      remarks: [''],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        active: this.data.active ?? true,
        done: this.data.done ?? false,
        taskName: this.data.taskName ?? '',
        taskCode: this.data.taskCode ?? '',
        reference: this.data.reference ?? '',
        jobCode: this.data.jobCode ?? '',
        dueDate: this.data.dueDate ?? new Date().toISOString().substring(0, 10),
        completedDate: this.data.completedDate ?? '',
        responsibility: this.data.responsibility ?? '',
        department: this.data.department ?? 'Mechanical Design',
        section: this.data.section ?? 'Mechanical Design',
        role: this.data.role ?? 'Lead Mechanical Engineer',
        remarks: this.data.remarks ?? '',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  upsertTask(): void {
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
