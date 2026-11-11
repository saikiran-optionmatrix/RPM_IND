import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddSiteComponent } from './add-site/add-site.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  city: string;
  state: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-sites',
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
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
})
export class SitesComponent {
  readonly items: MasterItem[] = [
    { name: 'Manufacturing Facility', code: 'LOC-MFG', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
    { name: 'R&D Facility', code: 'LOC-RND', city: 'Hyderabad', state: 'Telangana', status: 'Active' },
    { name: 'Quality Control Facility', code: 'LOC-QC', city: 'Ahmedabad', state: 'Gujarat', status: 'Active' },
    { name: 'Stability Testing Facility', code: 'LOC-STB', city: 'Bengaluru', state: 'Karnataka', status: 'Active' },
    { name: 'Warehouse & Storage', code: 'LOC-WHS', city: 'Chennai', state: 'Tamil Nadu', status: 'Active' },
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
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.city && item.city.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        (item.state && item.state.toLowerCase().includes(this.searchKeyword.toLowerCase()));

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
  constructor(private dialog: MatDialog) {}
  onAdd(): void {
    const dialogRef = this.dialog.open(AddSiteComponent, {
      width: '800px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SiteName) {
        this.items.unshift({
          name: res.SiteName,
          code: res.SiteCode,
          city: res.City || '',
          state: res.State || '',
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    const dialogRef = this.dialog.open(AddSiteComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        SiteName: item.name,
        SiteCode: item.code,
        City: item.city,
        State: item.state,
        ...item,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SiteName) {
        item.name = res.SiteName;
        item.code = res.SiteCode;
        if (res.City !== undefined) item.city = res.City;
        if (res.State !== undefined) item.state = res.State;
      }
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
