import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface PermissionOption {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-special-permissions',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule, MatCheckboxModule],
  templateUrl: './special-permissions.component.html',
  styleUrl: './special-permissions.component.scss',
})
export class SpecialPermissionsComponent implements OnInit {
  permissions: PermissionOption[] = [
    { id: 1, name: 'Override resource allocation', selected: true },
    { id: 2, name: 'Override assignment for to-do', selected: true },
    { id: 3, name: 'Override assignment for issues', selected: false },
    { id: 4, name: 'Override assignment for requirements', selected: false },
    { id: 5, name: 'Timesheet Approval', selected: false },
    // { id: 6, name: 'Grant Stage Bypass', selected: false },
    // { id: 7, name: 'Modify Master Data', selected: false },
    // { id: 8, name: 'Access Security Audit Logs', selected: false },
  ];

  constructor(
    private dialogRef: MatDialogRef<SpecialPermissionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    if (this.data?.user?.specialPermissions) {
      const parts = this.data.user.specialPermissions.split('/');
      const selectedCount = parseInt(parts[0], 10) || 2;
      this.permissions.forEach((p, idx) => {
        p.selected = idx < selectedCount;
      });
    }
  }

  save(): void {
    const selectedCount = this.permissions.filter((p) => p.selected).length;
    const totalCount = this.permissions.length;
    this.dialogRef.close({
      summary: `${selectedCount}/${totalCount}`,
      selectedItems: this.permissions.filter((p) => p.selected),
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
