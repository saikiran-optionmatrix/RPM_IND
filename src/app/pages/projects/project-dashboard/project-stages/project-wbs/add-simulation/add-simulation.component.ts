import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-simulation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-simulation.component.html',
  styleUrl: './add-simulation.component.scss',
})
export class AddSimulationComponent implements OnInit {
  simulationForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSimulationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.simulationForm = this.fb.group({
      moduleName: ['', Validators.required],
      plannedStartDate: ['', Validators.required],
      plannedEndDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.simulationForm.patchValue({
        moduleName: this.data.moduleName ?? '',
        plannedStartDate: this.data.plannedStartDate ?? '',
        plannedEndDate: this.data.plannedEndDate ?? '',
      });
    }
  }

  save(): void {
    this.isSubmitting = true;
    if (this.simulationForm.invalid) {
      return;
    }

    this.dialogRef.close(this.simulationForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }
}
