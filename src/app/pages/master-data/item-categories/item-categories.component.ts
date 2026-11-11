import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MatCardModule } from '@angular/material/card';
import { AddItemCategoryComponent } from './add-item-category/add-item-category.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-item-categories',

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
  templateUrl: './item-categories.component.html',
  styleUrl: './item-categories.component.scss',
})
export class ItemCategoriesComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
      name: 'API & Raw Materials',
      code: 'CAT-001',
      status: 'Active',
    },

    {
      name: 'Excipients',
      code: 'CAT-002',
      status: 'Active',
    },

    {
      name: 'Analytical Materials',
      code: 'CAT-003',
      status: 'Active',
    },

    {
      name: 'Packaging Materials',
      code: 'CAT-004',
      status: 'Active',
    },

    {
      name: 'Finished Products',
      code: 'CAT-005',
      status: 'Active',
    },

    {
      name: 'Laboratory Consumables',
      code: 'CAT-006',
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

  get filteredAssets(): Asset[] {
    return this.assets.filter((asset) => {
      const keywordMatches =
        !this.searchKeyword ||
        asset.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        asset.code.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || asset.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedAssets(): Asset[] {
    const startIndex = this.pageIndex * this.pageSize;

    return this.filteredAssets.slice(startIndex, startIndex + this.pageSize);
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
    this.dialog.open(AddItemCategoryComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddItemCategoryComponent, {
      width: '800px',
      data: { mode: 'edit', ...asset },
    });
  }

  onDelete(asset: Asset): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: asset });
  }

  onStatusChange(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: { title: 'Change Status', content: 'Are you sure you want to change the status?' },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        asset.status = asset.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
