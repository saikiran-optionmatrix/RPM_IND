import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddSectionComponent } from './add-section/add-section.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  department: string;
  remarks: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-sections',
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
  templateUrl: './sections.component.html',
  styleUrl: './sections.component.scss',
})
export class SectionsComponent {
  constructor(private dialog: MatDialog) {}

  readonly departments: string[] = [
    'Engineering & Project Development',
    'Quality Control & Inspection',
    'Quality Assurance',
    'Manufacturing & Operations',
    'Compliance & Statutory Affairs',
  ];

  readonly items: MasterItem[] = [
    {
      name: 'Process & Equipment Engineering',
      code: 'PEED',
      department: 'Engineering & Project Development',
      remarks: 'Equipment design, process engineering and production-flow optimization',
      status: 'Active',
    },
    {
      name: 'Engineering Testing & Validation',
      code: 'ETV',
      department: 'Engineering & Project Development',
      remarks: 'Inspection method development and equipment performance characterization',
      status: 'Active',
    },
    {
      name: 'Quality Control & Inspection',
      code: 'QC',
      department: 'Quality Control & Inspection',
      remarks: 'Equipment performance, dimensional inspection and acceptance testing',
      status: 'Active',
    },
    {
      name: 'Manufacturing & Operations',
      code: 'MFG',
      department: 'Manufacturing & Operations',
      remarks: 'Fabrication, assembly, integration and packaging operations',
      status: 'Active',
    },
    {
      name: 'Compliance & Statutory Affairs',
      code: 'RA',
      department: 'Compliance & Statutory Affairs',
      remarks: 'Site, safety, environmental and statutory approval documentation',
      status: 'Active',
    },
    {
      name: 'Quality Assurance',
      code: 'QA',
      department: 'Quality Assurance',
      remarks: 'Industrial quality compliance, equipment validation and acceptance approvals',
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
        item.code.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.department && item.department.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        item.remarks.toLowerCase().includes(this.searchKeyword.toLowerCase());

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
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: { mode: 'add', departments: this.departments },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        this.items.unshift({
          name: res.SectionName,
          code: res.SectionCode,
          department: res.Department || this.departments[0],
          remarks: res.Remarks || '',
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
    const dialogRef = this.dialog.open(AddSectionComponent, {
      width: '800px',
      data: {
        mode: 'edit',
        SectionName: item.name,
        SectionCode: item.code,
        Department: item.department,
        Remarks: item.remarks,
        departments: this.departments,
        ...item,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.SectionName) {
        item.name = res.SectionName;
        item.code = res.SectionCode;
        if (res.Department) {
          item.department = res.Department;
        }
        item.remarks = res.Remarks;
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
