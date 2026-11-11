import { Component } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatSelect, MatOption } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { AddMoleculeComponent } from './add-molecule/add-molecule.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface Asset {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}
@Component({
  selector: 'app-molecules',
  imports: [
    MatCard,
    MatCardContent,
    MatIcon,
    MatPaginator,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    MatInput,
  ],
  templateUrl: './molecules.component.html',
  styleUrl: './molecules.component.scss',
})
export class MoleculesComponent {
  constructor(private dialog: MatDialog) {}
  readonly assets: Asset[] = [
    {
      name: 'Dapagliflozin Propanediol Monohydrate',
      code: 'API-1001',
      status: 'Active',
    },
    {
      name: 'Levetiracetam',
      code: 'API-1002',
      status: 'Active',
    },
    {
      name: 'Pantoprazole Sodium Sesquihydrate',
      code: 'API-1003',
      status: 'Active',
    },
    {
      name: 'Ceftriaxone Sodium Sterile',
      code: 'API-1004',
      status: 'Active',
    },
    {
      name: 'Budesonide Micronized',
      code: 'API-1005',
      status: 'Active',
    },
    {
      name: 'Metformin Hydrochloride',
      code: 'API-1006',
      status: 'Active',
    },
    {
      name: 'Rosuvastatin Calcium',
      code: 'API-1007',
      status: 'Active',
    },
    {
      name: 'Sitagliptin Phosphate Monohydrate',
      code: 'API-1008',
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
    this.dialog.open(AddMoleculeComponent, {
      width: '2000px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;

    this.pageSize = event.pageSize;
  }

  onEdit(asset: Asset): void {
    this.dialog.open(AddMoleculeComponent, {
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
