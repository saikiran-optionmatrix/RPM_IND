import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-resource',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-resource.component.html',
  styleUrl: './add-resource.component.scss'
})
export class AddResourceComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddResourceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      resourceName: ['', [Validators.required]],
      fromDate: [''],
      toDate: [''],
      fromTime: [''],
      toTime: ['']
    });
  }

  ngOnInit(): void {
    this.isEditMode = !!(this.data?.isEditMode || this.data?.mode === 'edit');

    if (this.data) {
      this.form.patchValue({
        resourceName: this.data.resourceName ?? this.data.resource ?? '',
        fromDate: this.formatDateForInput(this.data.fromDate),
        toDate: this.formatDateForInput(this.data.toDate),
        fromTime: this.formatTimeForInput(this.data.fromTime),
        toTime: this.formatTimeForInput(this.data.toTime)
      });
    }
  }

  private formatDateForInput(dateStr?: string): string {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return dateStr;
  }

  private formatTimeForInput(timeStr?: string): string {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1], 10);
      const mins = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${mins}`;
    }
    return timeStr;
  }

  private formatTimeForDisplay(timeStr?: string): string {
    if (!timeStr) return '';
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      let hours = parseInt(match[1], 10);
      const mins = match[2];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours.toString().padStart(2, '0')}:${mins} ${ampm}`;
    }
    return timeStr;
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const val = this.form.value;
    const result = {
      ...this.data,
      ...val,
      resource: val.resourceName,
      fromTime: this.formatTimeForDisplay(val.fromTime),
      toTime: this.formatTimeForDisplay(val.toTime)
    };

    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }
}
