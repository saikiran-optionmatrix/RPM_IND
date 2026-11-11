import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddLookupComponent } from './add-lookup/add-lookup.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
// import { DeleteConfirmationComponent } from '../../common/shared/delete-confirmation/delete-confirmation.component';
// import { ConfirmationDialogComponent } from '../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface LookupOption {
  lookup: string;
  code: string;
  status: 'Active' | 'Inactive';
  category: string;
}

@Component({
  selector: 'app-lookup-options',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
  ],
  templateUrl: './lookup-options.component.html',
  styleUrl: './lookup-options.component.scss',
})
export class LookupOptionsComponent {
  constructor(private dialog: MatDialog) {}

  lookups: LookupOption[] = [
    { lookup: 'Side View', code: 'LH', status: 'Active', category: 'IT Equipment' },
    { lookup: 'Side View', code: 'RH', status: 'Active', category: 'Media Equipment' },
    { lookup: 'Side View', code: 'BH', status: 'Active', category: 'Infrastructure' },
    { lookup: 'Face View', code: 'FT', status: 'Active', category: 'Office Furniture' },
    { lookup: 'Face View', code: 'RR', status: 'Active', category: 'Networking Equipment' },
    { lookup: 'Face View', code: 'BH', status: 'Active', category: 'Electrical Equipment' },
    { lookup: 'Demerit', code: '1', status: 'Active', category: 'Safety Equipment' },
    { lookup: 'Demerit', code: '5', status: 'Active', category: 'Laboratory Equipment' },
    { lookup: 'Demerit', code: '10', status: 'Active', category: 'IT Equipment' },
    { lookup: 'Demerit', code: '20', status: 'Active', category: 'Media Equipment' },
    { lookup: 'Demerit', code: '50', status: 'Active', category: 'Infrastructure' },
  ];

  selectedCode = '';
  codeOptions: string[] = ['LH', 'RH', 'BH', 'FT', 'RR', '1', '5', '10', '20', '50'];

  pageIndex = 0;
  pageSize = 10;

  get filteredLookups(): LookupOption[] {
    return this.lookups.filter((item) => {
      if (!this.selectedCode) {
        return true;
      }
      return item.code.toLowerCase() === this.selectedCode.toLowerCase() ||
             item.lookup.toLowerCase() === this.selectedCode.toLowerCase();
    });
  }

  get paginatedLookups(): LookupOption[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredLookups.slice(startIndex, startIndex + this.pageSize);
  }

  onCodeFilterChange(): void {
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddLookupComponent, {
      width: '650px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result: LookupOption | undefined) => {
      if (result) {
        this.lookups.unshift(result);
      }
    });
  }

  onEdit(item: LookupOption): void {
    const dialogRef = this.dialog.open(AddLookupComponent, {
      width: '650px',
      data: {
        mode: 'edit',
        lookup: item,
      },
    });

    dialogRef.afterClosed().subscribe((result: LookupOption | undefined) => {
      if (result) {
        const index = this.lookups.indexOf(item);
        if (index > -1) {
          this.lookups[index] = { ...this.lookups[index], ...result };
        }
      }
    });
  }

  onDelete(item: LookupOption): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        title: 'Delete Lookup',
        name: `${item.lookup} - ${item.code}`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.lookups = this.lookups.filter((l) => l !== item);
      }
    });
  }

  onStatusChange(item: LookupOption): void {
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
