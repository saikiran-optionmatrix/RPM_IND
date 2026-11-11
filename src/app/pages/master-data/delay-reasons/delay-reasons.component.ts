import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddDelayReasonComponent } from './add-delay-reason/add-delay-reason.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface DelayReason {
  id?: number;
  reason: string;
  context: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-delay-reasons',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './delay-reasons.component.html',
  styleUrl: './delay-reasons.component.scss',
})
export class DelayReasonsComponent {
  constructor(private dialog: MatDialog) {}

  readonly delayReasons: DelayReason[] = [
    {
      id: 1,
      reason: 'Raw Material Shortage',
      context: 'Activity',
      status: 'Active',
    },
    {
      id: 2,
      reason: 'Equipment Breakdown / Maintenance',
      context: 'Task',
      status: 'Active',
    },
    {
      id: 3,
      reason: 'Quality Control Hold / Out of Specification',
      context: 'Issue',
      status: 'Active',
    },
    {
      id: 4,
      reason: 'Regulatory Approval Pending',
      context: 'Gate',
      status: 'Active',
    },
    {
      id: 5,
      reason: 'Documentation Clearance Delay',
      context: 'Requirement',
      status: 'Active',
    },
    {
      id: 6,
      reason: 'Vendor Dispatch Delay',
      context: 'Activity',
      status: 'Inactive',
    },
    {
      id: 7,
      reason: 'Resource Unavailability',
      context: 'Task',
      status: 'Active',
    },
    {
      id: 8,
      reason: 'Packaging Material Rejection',
      context: 'Issue',
      status: 'Inactive',
    },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredDelayReasons(): DelayReason[] {
    return this.delayReasons.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.reason.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.context && item.context.toLowerCase().includes(this.searchKeyword.toLowerCase()));

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedDelayReasons(): DelayReason[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredDelayReasons.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.pageIndex = 0;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddDelayReasonComponent, {
      width: '600px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.reason) {
        this.delayReasons.unshift({
          id: Date.now(),
          reason: result.reason.trim(),
          context: result.context ? result.context.trim() : '',
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: DelayReason): void {
    const dialogRef = this.dialog.open(AddDelayReasonComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        reason: item.reason,
        context: item.context,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.reason) {
        item.reason = result.reason.trim();
        if (result.context !== undefined) {
          item.context = result.context.trim();
        }
      }
    });
  }

  onDelete(item: DelayReason): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'delete',
        reason: item.reason,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        const index = this.delayReasons.indexOf(item);
        if (index > -1) {
          this.delayReasons.splice(index, 1);
        }
      }
    });
  }

  onStatusChange(item: DelayReason): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
