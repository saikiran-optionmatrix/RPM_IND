import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';

import { MatIconModule } from '@angular/material/icon';

import { MatTooltipModule } from '@angular/material/tooltip';

import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';

import { MatSelectModule } from '@angular/material/select';

import { MatCardModule } from '@angular/material/card';
import { AddItemSubCatComponent } from './add-item-sub-cat/add-item-sub-cat.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-item-sub-categories',

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
  templateUrl: './item-sub-categories.component.html',
  styleUrl: './item-sub-categories.component.scss',
})
export class ItemSubCategoriesComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
      name: 'API & Raw Materials',
      code: 'Active Pharmaceutical Ingredient (API)',
      status: 'Active',
    },

    {
      name: 'API & Raw Materials',
      code: 'API Samples',
      status: 'Active',
    },

    {
      name: 'Excipients',
      code: 'Binders & Fillers',
      status: 'Active',
    },

    {
      name: 'Excipients',
      code: 'Disintegrants & Lubricants',
      status: 'Active',
    },

    {
      name: 'Analytical Materials',
      code: 'Analytical Standards',
      status: 'Active',
    },

    {
      name: 'Analytical Materials',
      code: 'Reagents & Solvents',
      status: 'Active',
    },

    {
      name: 'Packaging Materials',
      code: 'Blister Packs',
      status: 'Active',
    },

    {
      name: 'Packaging Materials',
      code: 'Bottles & Labels',
      status: 'Active',
    },

    {
      name: 'Finished Products',
      code: 'Development Tablets',
      status: 'Active',
    },

    {
      name: 'Laboratory Consumables',
      code: 'Testing Consumables',
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
    this.dialog.open(AddItemSubCatComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddItemSubCatComponent, {
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
