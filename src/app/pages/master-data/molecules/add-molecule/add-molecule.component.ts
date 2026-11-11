import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-molecule',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './add-molecule.component.html',
  styleUrl: './add-molecule.component.scss',
})
export class AddMoleculeComponent implements OnInit {
  myGroup: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMoleculeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myGroup = this.fb.group({
      MoleculeName: ['', [Validators.required]],
      Description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data) {
      this.myGroup.patchValue({
        MoleculeName: this.data.MoleculeName ?? this.data.name ?? '',
        Description: this.data.Description ?? this.data.description ?? '',
      });
    }
  }

  get f() {
    return this.myGroup.controls;
  }

  upsertMolecule(): void {
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
