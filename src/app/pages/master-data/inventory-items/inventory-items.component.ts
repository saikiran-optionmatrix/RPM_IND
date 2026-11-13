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
      name: 'ASTM A36 Structural Steel Plate',
      code: 'RAW-001',
      category: 'Raw Materials',
      subCategory: 'Structural Metals',
      quantity: '2,500 kg',
      unitRate: '$4/kg',
      description: 'Structural plate for machinery base frames and weldments',
      status: 'Active',
    },
    {
      name: 'PLC Processor Rack & Safety Relays',
      code: 'AUT-001',
      category: 'Automation',
      subCategory: 'Controls Hardware',
      quantity: '12 sets',
      unitRate: '$2,800/set',
      description: 'Dual-channel PLC rack, EtherCAT couplers and safety relays',
      status: 'Active',
    },
    {
      name: 'AC Servo Motors & VFD Drives',
      code: 'DRV-001',
      category: 'Drive Systems',
      subCategory: 'Motion Control',
      quantity: '16 units',
      unitRate: '$1,450/unit',
      description: 'Closed-loop brushless servo actuators and VFD inverters',
      status: 'Active',
    },
    {
      name: 'Precision Linear Guide Rails',
      code: 'MEC-001',
      category: 'Mechanical',
      subCategory: 'Linear Motion',
      quantity: '40 meters',
      unitRate: '$220/m',
      description: 'Hardened profile guide rails and preloaded ballscrew assemblies',
      status: 'Active',
    },
    {
      name: 'IP65 Stainless Control Enclosures',
      code: 'ENC-001',
      category: 'Packaging & Guarding',
      subCategory: 'Enclosures',
      quantity: '10 units',
      unitRate: '$950/unit',
      description: 'NEMA 4 / IP65 electrical control cabinets and perimeter guarding',
      status: 'Active',
    },
    {
      name: 'CMM Calibration Reference Artifacts',
      code: 'MET-001',
      category: 'Quality & Metrology',
      subCategory: 'Calibration',
      quantity: '25 sets',
      unitRate: '$340/set',
      description: 'ISO-traceable step gauges and calibration reference spheres',
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
