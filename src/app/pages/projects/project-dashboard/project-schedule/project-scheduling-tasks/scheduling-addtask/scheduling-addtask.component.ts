import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ProjectOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-scheduling-addtask',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './scheduling-addtask.component.html',
  styleUrl: './scheduling-addtask.component.scss',
})
export class SchedulingAddtaskComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  projectList: ProjectOption[] = [
    { code: '2026/GEN/001', name: 'Generic Tablet Development' },
    { code: '2026/RD/001', name: 'Abiraterone Acetate Film Coated' },
    { code: '2026/RD/002', name: 'Apremilast Tablets' },
    { code: '2026/RD/003', name: 'Brivaracetam Film Coated Tablets' },
    { code: '2026/RD/005', name: 'Metformin Hydrochloride Tablets' },
    { code: '2026/RD/010', name: 'Olaparib Film Coated Tablets' },
  ];

  deliverableList: string[] = [
    'Feasibility',
    'Pre-Formulation',
    'Formulation',
    'Development',
    'Analytical',
    'Testing',
    'Validation',
    'Regulatory'
  ];

  activityList: string[] = [
    'Reference Product Characterization',
    'API Solid State Testing',
    'API Characterization',
    'Excipient Screening',
    'Prototype Formulation Trials',
    'Granulation Optimization',
    'Assay Method Development',
    'Related Substances Method',
    'Dissolution Profiling',
    'Disintegration Testing',
    'Process Validation Protocol Drafting',
    'Hold-Time Study Protocol',
    'Bioequivalence Protocol Review',
    'Ethics Committee Submission Package'
  ];

  taskList: string[] = [
    'Physicochemical characterization',
    'Polymorphic Screening',
    'Solubility Profiling',
    'Compatibility Matrix',
    'Direct Compression Trials',
    'High-Shear Wet Granulation',
    'HPLC Method Optimization',
    'Degradation Products Identification',
    'Comparative Dissolution Profiles',
    'Fast-Disintegrating Evaluation',
    'Critical Process Parameters (CPP)',
    'Granule Hold-Time Evaluation',
    'Clinical Study Design Verification',
    'Informed Consent Formulation'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SchedulingAddtaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      projectCode: ['', [Validators.required]],
      deliverable: ['', [Validators.required]],
      activity: ['', [Validators.required]],
      task: ['', [Validators.required]],
      hours: [null, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.task) {
      const t = this.data.task;

      // Ensure any incoming values exist in dropdown options
      if (t.projectCode && !this.projectList.some((p) => p.code === t.projectCode)) {
        this.projectList.unshift({ code: t.projectCode, name: t.projectName || t.projectCode });
      }
      if (t.deliverable && !this.deliverableList.includes(t.deliverable)) {
        this.deliverableList.unshift(t.deliverable);
      }
      if (t.activity && !this.activityList.includes(t.activity)) {
        this.activityList.unshift(t.activity);
      }
      if (t.task && !this.taskList.includes(t.task)) {
        this.taskList.unshift(t.task);
      }

      this.myGroup.patchValue({
        projectCode: t.projectCode ?? '2026/GEN/001',
        deliverable: t.deliverable ?? '',
        activity: t.activity ?? '',
        task: t.task ?? '',
        hours: t.hours ?? null,
        description: t.description ?? '',
      });
    } else {
      this.myGroup.patchValue({
        projectCode: this.data?.projectCode ?? '2026/GEN/001',
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

    const selectedProj = this.projectList.find((p) => p.code === this.myGroup.value.projectCode);
    const result = {
      ...this.myGroup.value,
      projectName: selectedProj ? selectedProj.name : '',
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
