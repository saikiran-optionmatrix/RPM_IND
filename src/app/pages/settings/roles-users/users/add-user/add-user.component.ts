import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;

  readonly roles = [
    'Group Leader',
    'Shop Head',
    'General Manager',
    'Test',
    'Senior Manager',
  ];

  readonly departments = [
    'Engineering',
    'Quality',
    'R&D',
    'EHS',
    'Supply Chain',
    'Operations',
    'IT & Systems',
  ];

  readonly managers = [
    'Satya',
    'Pavan Kalyan',
    'Gaurav',
    'Ayush',
    'Santosh',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required]],
      shortForm: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
      department: ['', [Validators.required]],
      workHours: [8, [Validators.required]],
      manager: ['', [Validators.required]],
      managerialRole: [false],
      status: ['Active'],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.data?.mode === 'edit';

    if (this.data?.user) {
      this.userForm.patchValue({
        userName: this.data.user.userName ?? '',
        shortForm: this.data.user.shortForm ?? '',
        email: this.data.user.email ?? '',
        phone: this.data.user.phone ?? '',
        role: this.data.user.role ?? '',
        department: this.data.user.department ?? '',
        workHours: this.data.user.workHours ?? 8,
        manager: this.data.user.manager ?? '',
        managerialRole: this.data.user.managerialRole ?? false,
        status: this.data.user.status ?? 'Active',
      });
    }
  }

  get f() {
    return this.userForm.controls;
  }

  saveUser(): void {
    this.isSubmitting = true;

    if (this.userForm.invalid) {
      return;
    }

    const result = {
      ...this.data?.user,
      ...this.userForm.value,
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
