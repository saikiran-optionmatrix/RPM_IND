import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddFacilityComponent } from './add-facility/add-facility.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-facilities',
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
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.scss',
})
export class FacilitiesComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
      name: 'API & Raw Material Store',
      code: 'FAC-1001',
      status: 'Active',
    },

    {
      name: 'Formulation Development Lab',
      code: 'FAC-1002',
      status: 'Active',
    },

    {
      name: 'Analytical Testing Lab',
      code: 'FAC-1003',
      status: 'Active',
    },

    {
      name: 'Tablet Manufacturing Area',
      code: 'FAC-1004',
      status: 'Active',
    },

    {
      name: 'Stability Testing Room',
      code: 'FAC-1005',
      status: 'Active',
    },

    {
      name: 'Quality Control Lab',
      code: 'FAC-1006',
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
    this.dialog.open(AddFacilityComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddFacilityComponent, {
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
