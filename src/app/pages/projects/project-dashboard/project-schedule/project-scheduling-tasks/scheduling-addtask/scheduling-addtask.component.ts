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
    { code: '2026/IND/001', name: 'Industrial Equipment Line Expansion' },
    { code: '2026/IND/002', name: 'Automated Material Handling System' },
    { code: '2026/IND/003', name: 'Robotics Assembly Cell Installation' },
    { code: '2026/IND/004', name: 'Heavy Press Machine Overhaul' },
    { code: '2026/IND/005', name: 'Smart Factory SCADA & PLC Upgrade' },
    { code: '2026/IND/006', name: 'CNC Machining Line Capacity Expansion' },
  ];

  deliverableList: string[] = [
    'Feasibility',
    'Concept Engg',
    'Detailed Engg',
    'Design Freeze',
    'Fabrication',
    'Installation',
    'Commissioning',
    'Handover'
  ];

  activityList: string[] = [
    'Plant Throughput & Bottleneck Study',
    'User Requirements Specification (URS)',
    '3D CAD Line Layout & Flow',
    'Automation & PLC Architecture Design',
    'Structural FEA & GD&T Stack-Up',
    'Electrical Panel & SCADA Schematics',
    'Design FMEA & HAZOP Review',
    'OEM Supplier Qualification',
    'Prototype Tooling & Endurance Trial',
    'Factory Acceptance Test (FAT)',
    'Foundation & Utility Readiness',
    'Mechanical Rigging & Laser Alignment',
    'Site Acceptance Test (SAT) Execution',
    'CMMS Spares & Plant Handover'
  ];

  taskList: string[] = [
    'Cycle-time benchmarking',
    'Throughput & footprint envelope',
    'Spindle & servo drive sizing',
    'Finite element deflection check',
    'Tolerance stack-up sign-off',
    'Safety PLC interlock logic',
    'RPN failure mode mitigation',
    'OEM vendor bid evaluation',
    'Dry-run endurance cycling',
    'Witness FAT checklist approval',
    '480V feeder & compressed air drop',
    'Optical laser bed leveling',
    'Cpk >= 1.33 capability run-off',
    'LOTO SOP & PM tree setup'
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
