import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddItemComponent } from './add-item/add-item.component';

interface Asset {
  name: string;
  code: string;
  category: string;
  subCategory: string;
  quantity: string;
  unitRate: string;
  description: string;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-inventory-items',
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
  templateUrl: './inventory-items.component.html',
  styleUrl: './inventory-items.component.scss',
})
export class InventoryItemsComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
      name: 'Active Pharmaceutical Ingredient (API)',
      code: 'API-001',
      category: 'Raw Materials',
      subCategory: 'API',
      quantity: '25 kg',
      unitRate: '₹12,500/kg',
      description: 'API for tablet formulation',
      status: 'Active',
    },

    {
      name: 'Pharmaceutical Excipients',
      code: 'EXC-001',
      category: 'Raw Materials',
      subCategory: 'Excipients',
      quantity: '100 kg',
      unitRate: '₹450/kg',
      description: 'Binders, fillers and disintegrants',
      status: 'Active',
    },

    {
      name: 'Analytical Standards',
      code: 'STD-001',
      category: 'Laboratory',
      subCategory: 'Standards',
      quantity: '10 units',
      unitRate: '₹3,500/unit',
      description: 'Standards for analytical testing',
      status: 'Active',
    },

    {
      name: 'Granulation Materials',
      code: 'GRN-001',
      category: 'Manufacturing',
      subCategory: 'Granulation',
      quantity: '50 kg',
      unitRate: '₹800/kg',
      description: 'Materials for granulation trials',
      status: 'Active',
    },

    {
      name: 'Tablet Packaging Materials',
      code: 'PKG-001',
      category: 'Packaging',
      subCategory: 'Primary',
      quantity: '5,000 units',
      unitRate: '₹12/unit',
      description: 'Blister/bottle packaging materials',
      status: 'Active',
    },

    {
      name: 'Stability Samples',
      code: 'STB-001',
      category: 'Quality',
      subCategory: 'Stability',
      quantity: '500 units',
      unitRate: '₹25/unit',
      description: 'Samples for stability studies',
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
    this.dialog.open(AddItemComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddItemComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        ItemName: asset.name,
        ItemCode: asset.code,
        Category: asset.category,
        SubCategory: asset.subCategory,
        Quantity: asset.quantity,
        UnitRate: asset.unitRate,
        Description: asset.description,
      },
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
