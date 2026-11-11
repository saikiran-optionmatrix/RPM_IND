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
import { AddDivisionComponent } from './add-division/add-division.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface Division {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-divisions',
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
  templateUrl: './divisions.component.html',
  styleUrl: './divisions.component.scss',
})
export class DivisionsComponent {
  constructor(private dialog: MatDialog) {}

  readonly divisions: Division[] = [
    {
      name: 'Oral Solids',
      code: 'OS',
      status: 'Active',
    },
    {
      name: 'Injectables',
      code: 'IJ',
      status: 'Active',
    },
    {
      name: 'Complex Injectables',
      code: 'CI',
      status: 'Active',
    },
    {
      name: 'Biotech',
      code: 'BT',
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

  get filteredDivisions(): Division[] {
    return this.divisions.filter((division) => {
      const keywordMatches =
        !this.searchKeyword ||
        division.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        division.code.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || division.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedDivisions(): Division[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredDivisions.slice(startIndex, startIndex + this.pageSize);
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
    const dialogRef = this.dialog.open(AddDivisionComponent, {
      width: '800px',
      minWidth: '650px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.divisions.push({
          name: result.divisionName,
          code: result.divisionCode,
          status: 'Active',
        });
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(division: Division): void {
    const dialogRef = this.dialog.open(AddDivisionComponent, {
      width: '800px',
      minWidth: '650px',
      data: {
        mode: 'edit',
        divisionName: division.name,
        divisionCode: division.code,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        division.name = result.divisionName;
        division.code = result.divisionCode;
      }
    });
  }

  onDelete(division: Division): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        mode: 'delete',
        name: division.name,
        code: division.code,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const index = this.divisions.indexOf(division);
        if (index > -1) {
          this.divisions.splice(index, 1);
        }
      }
    });
  }

  onStatusChange(division: Division): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: 'Are you sure you want to change the status?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        division.status = division.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }
}
