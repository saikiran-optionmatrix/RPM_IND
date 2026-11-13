import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-proj-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule
  ],
  templateUrl: './add-proj-activity.component.html',
  styleUrl: './add-proj-activity.component.scss',
})
export class AddProjActivityComponent implements OnInit {
  activityForm: FormGroup;
  isEditMode = false;
  uploadedFileNames: string[] = [];

  deliverables: string[] = [
    'Plant Capacity & Bottleneck Audit',
    'User Requirements Specification (URS)',
    '3D CAD & Structural Engineering Package',
    'PLC / SCADA Control Schematics',
    'Design FMEA & HAZOP Risk Matrix',
    'Factory Acceptance Test (FAT) Protocol',
    'Site Acceptance Test (SAT) Package',
    'Operations & CMMS Handover Dossier'
  ];

  statuses: string[] = [
    'In Progress',
    'Pending',
    'Completed',
    'On Hold',
    'Cancelled'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProjActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.activityForm = this.fb.group({
      stage: ['S1 - Business Need & Assessment', Validators.required],
      deliverable: ['User Requirements Specification (URS)', Validators.required],
      taskSubject: ['', Validators.required],
      description: [''],
      status: ['In Progress'],
      planEffort: [''],
      planDuration: [''],
      actualEffort: [''],
      actualDuration: [''],
      actualHours: [''],
      materialBudget: [''],
      materialUsage: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!(this.data && (this.data.isEditMode || this.data.TaskName));

    if (this.data) {
      this.activityForm.patchValue({
        stage: this.data.stage ?? this.data.Stage ?? 'S1 - Business Need & Assessment',
        deliverable: this.data.deliverable ?? this.data.Deliverable ?? 'User Requirements Specification (URS)',
        taskSubject: this.data.taskSubject ?? this.data.TaskName ?? '',
        description: this.data.description ?? this.data.Description ?? '',
        status: this.data.status ?? this.data.Status ?? 'In Progress',
        planEffort: this.data.planEffort ?? this.data.Effort ?? '',
        planDuration: this.data.planDuration ?? this.data.Duration ?? '',
        actualEffort: this.data.actualEffort ?? this.data.ActualStart ?? '',
        actualDuration: this.data.actualDuration ?? this.data.ActualEnd ?? '',
        actualHours: this.data.actualHours ?? '',
        materialBudget: this.data.materialBudget ?? '',
        materialUsage: this.data.materialUsage ?? ''
      });
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFileNames = Array.from(input.files).map(f => f.name);
    }
  }

  save(): void {
    if (this.activityForm.invalid) {
      return;
    }

    const val = this.activityForm.value;
    const result = {
      ...this.data,
      ...val,
      TaskName: val.taskSubject,
      Deliverable: val.deliverable,
      Description: val.description,
      Status: val.status,
      PlanStart: val.planEffort,
      PlanEnd: val.planDuration,
      ActualStart: val.actualEffort,
      ActualEnd: val.actualDuration,
      files: this.uploadedFileNames
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
