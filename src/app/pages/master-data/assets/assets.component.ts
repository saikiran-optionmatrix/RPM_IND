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
import { AddAssetComponent } from './add-asset/add-asset.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-assets',

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

  templateUrl: './assets.component.html',

  styleUrl: './assets.component.scss',
})
export class AssetsComponent {
  constructor(private dialog: MatDialog) {}

  readonly assets: Asset[] = [
    {
      name: 'Tablet Compression Machine',
      code: 'AST-1001',
      status: 'Active',
    },

    {
      name: 'Dissolution Testing Apparatus',
      code: 'AST-1002',
      status: 'Active',
    },

    {
      name: 'HPLC System',
      code: 'AST-1003',
      status: 'Active',
    },

    {
      name: 'Tablet Hardness Tester',
      code: 'AST-1004',
      status: 'Active',
    },

    {
      name: 'Friability Tester',
      code: 'AST-1005',
      status: 'Active',
    },

    {
      name: 'Stability Chamber',
      code: 'AST-1006',
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
    this.dialog.open(AddAssetComponent, {
      width: '900px',
      minWidth: '650px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddAssetComponent, {
      width: '800px',
        minWidth: '650px',
      data: {
        mode: 'edit',
        AssetName: asset.name,
        AssetCode: asset.code,
      },
    });
  }

  onDelete(asset: Asset): void {
    this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'edit',
        AssetName: asset.name,
        AssetCode: asset.code,
      },
    });
  }

  // onStatusChange(asset: Asset): void {
  //   console.log('Change status:', asset);
  // }

  onStatusChange(asset: Asset): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        asset.status = asset.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
