import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddTagComponent } from './add-tag/add-tag.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-tags',
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
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent {
  constructor(private dialog: MatDialog) {}
  readonly items: MasterItem[] = [
    {
      name: 'API Assessment',
      description: 'API evaluation and supplier qualification',
      status: 'Active',
    },
    {
      name: 'Formulation',
      description: 'Formulation development and optimization',
      status: 'Active',
    },
    {
      name: 'Analytical Testing',
      description: 'Assay, dissolution and testing activities',
      status: 'Active',
    },
    {
      name: 'Stability',
      description: 'Stability study and sample monitoring',
      status: 'Active',
    },
    {
      name: 'Validation',
      description: 'Process and method validation',
      status: 'Active',
    },
    {
      name: 'Regulatory',
      description: 'Regulatory documentation and submission',
      status: 'Active',
    },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): MasterItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): MasterItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredItems.slice(startIndex, startIndex + this.pageSize);
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
    this.dialog.open(AddTagComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    this.dialog.open(AddTagComponent, {
      width: '800px',
      data: { mode: 'edit', ...item },
    });
  }

  onDelete(item: MasterItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: MasterItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        item.status = item.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
