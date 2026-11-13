import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddJobCodeComponent } from './add-job-code/add-job-code.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';

interface MasterItem {
  name: string;
  code: string;
  narration: string;
  description: string;
  hourlyRate: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-job-codes',
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
  templateUrl: './job-codes.component.html',
  styleUrl: './job-codes.component.scss',
})
export class JobCodesComponent {
  constructor(private dialog: MatDialog) {}
  readonly items: MasterItem[] = [
    { name: 'Manufacturing & Operations Operator', code: 'MFG01', narration: 'Manufacturing & Operations Operator', description: 'Manufacturing & Operations Operator', hourlyRate: 350, status: 'Active' },
    { name: 'Manufacturing & Operations Executive', code: 'MFG02', narration: 'Manufacturing & Operations Executive', description: 'Manufacturing & Operations Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Manufacturing & Operations Supervisor', code: 'MFG03', narration: 'Manufacturing & Operations Supervisor', description: 'Manufacturing & Operations Supervisor', hourlyRate: 650, status: 'Active' },
    { name: 'Manufacturing & Operations Manager', code: 'MFG04', narration: 'Manufacturing & Operations Manager', description: 'Manufacturing & Operations Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Production Line Operator', code: 'CELL01', narration: 'Production Line Operator', description: 'Production Line Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Process Equipment Operator', code: 'FERM01', narration: 'Process Equipment Operator', description: 'Process Equipment Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Machining & Finishing Operator', code: 'PUR01', narration: 'Machining & Finishing Operator', description: 'Machining & Finishing Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Automation & Controls Operator', code: 'VEC01', narration: 'Automation & Controls Operator', description: 'Automation & Controls Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Raw Material & Process Prep Operator', code: 'MED01', narration: 'Raw Material & Process Preparation Operator', description: 'Raw Material & Process Preparation Operator', hourlyRate: 400, status: 'Active' },
    { name: 'Final Assembly & Packaging Operator', code: 'FF01', narration: 'Final Assembly & Packaging Operator', description: 'Final Assembly & Packaging Operator', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Assurance Executive', code: 'QA01', narration: 'Quality Assurance Executive', description: 'Quality Assurance Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Assurance Officer', code: 'QA02', narration: 'Quality Assurance Officer', description: 'Quality Assurance Officer', hourlyRate: 450, status: 'Active' },
    { name: 'Quality Assurance Manager', code: 'QA03', narration: 'Quality Assurance Manager', description: 'Quality Assurance Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'In-Process Quality Assurance Executive', code: 'IPQA01', narration: 'In-Process Quality Assurance Executive', description: 'In-Process Quality Assurance Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Management System Executive', code: 'QMS01', narration: 'Quality Management System Executive', description: 'Quality Management System Executive', hourlyRate: 550, status: 'Active' },
    { name: 'Quality Documentation Executive', code: 'DOC01', narration: 'Quality Documentation Executive', description: 'Quality Documentation Executive', hourlyRate: 400, status: 'Active' },
    { name: 'Process Validation Executive', code: 'VAL01', narration: 'Process Validation Executive', description: 'Process Validation Executive', hourlyRate: 650, status: 'Active' },
    { name: 'Industrial Quality Audit Executive', code: 'AUD01', narration: 'Industrial Quality Audit Executive', description: 'Industrial Quality Audit Executive', hourlyRate: 700, status: 'Active' },
    { name: 'Nonconformance & CAPA Executive', code: 'DEV01', narration: 'Nonconformance & CAPA Executive', description: 'Nonconformance & CAPA Executive', hourlyRate: 550, status: 'Active' },
    { name: 'Production & Equipment Acceptance Officer', code: 'BREL01', narration: 'Production & Equipment Acceptance Officer', description: 'Production & Equipment Acceptance Officer', hourlyRate: 600, status: 'Active' },
    { name: 'Quality Control & Inspection Analyst', code: 'QC01', narration: 'Quality Control & Inspection Analyst', description: 'Quality Control & Inspection Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Quality Control & Inspection Executive', code: 'QC02', narration: 'Quality Control & Inspection Executive', description: 'Quality Control & Inspection Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Quality Control & Inspection Manager', code: 'QC03', narration: 'Quality Control & Inspection Manager', description: 'Quality Control & Inspection Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Dimensional & Material Inspection Analyst', code: 'HPLC01', narration: 'Dimensional & Material Inspection Analyst', description: 'Dimensional & Material Inspection Analyst', hourlyRate: 550, status: 'Active' },
    { name: 'PLC & Electrical Systems Test Analyst', code: 'PCR01', narration: 'PLC & Electrical Systems Test Analyst', description: 'PLC & Electrical Systems Test Analyst', hourlyRate: 550, status: 'Active' },
    { name: 'Equipment Reliability & Endurance Analyst', code: 'STAB01', narration: 'Equipment Reliability & Endurance Test Analyst', description: 'Equipment Reliability & Endurance Test Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Incoming Material & Component Analyst', code: 'RMQC01', narration: 'Incoming Material & Component Quality Analyst', description: 'Incoming Material & Component Quality Analyst', hourlyRate: 400, status: 'Active' },
    { name: 'Finished Equipment Quality Inspector', code: 'DPQC01', narration: 'Finished Equipment Quality Inspector', description: 'Finished Equipment Quality Inspector', hourlyRate: 450, status: 'Active' },
    { name: 'Industrial Hygiene & Environmental Tech', code: 'MIC01', narration: 'Industrial Hygiene & Environmental Technician', description: 'Industrial Hygiene & Environmental Technician', hourlyRate: 500, status: 'Active' },
    { name: 'Environmental, Health & Safety Analyst', code: 'EM01', narration: 'Environmental, Health & Safety Analyst', description: 'Environmental, Health & Safety Analyst', hourlyRate: 450, status: 'Active' },
    { name: 'Industrial Water & Utility Quality Analyst', code: 'WAT01', narration: 'Industrial Water & Utility Quality Analyst', description: 'Industrial Water & Utility Quality Analyst', hourlyRate: 400, status: 'Active' },
    { name: 'Engineering Executive', code: 'ENG01', narration: 'Engineering Executive', description: 'Engineering Executive', hourlyRate: 500, status: 'Active' },
    { name: 'Engineering Manager', code: 'ENG02', narration: 'Engineering Manager', description: 'Engineering Manager', hourlyRate: 1000, status: 'Active' },
    { name: 'Mechanical Maintenance Technician', code: 'MECH01', narration: 'Mechanical Maintenance Technician', description: 'Mechanical Maintenance Technician', hourlyRate: 400, status: 'Active' },
    { name: 'Electrical Technician', code: 'ELEC01', narration: 'Electrical Technician', description: 'Electrical Technician', hourlyRate: 400, status: 'Active' },
    { name: 'Plant HVAC & Utilities Technician', code: 'HVAC01', narration: 'Plant HVAC & Utilities Technician', description: 'Plant HVAC & Utilities Technician', hourlyRate: 450, status: 'Active' },
    { name: 'Utilities Operator', code: 'UTIL01', narration: 'Utilities Operator', description: 'Utilities Operator', hourlyRate: 350, status: 'Active' },
    { name: 'Instrumentation Technician', code: 'INST01', narration: 'Instrumentation Technician', description: 'Instrumentation Technician', hourlyRate: 500, status: 'Active' },
    { name: 'Calibration Technician', code: 'CAL01', narration: 'Calibration Technician', description: 'Calibration Technician', hourlyRate: 450, status: 'Active' },
    { name: 'Commissioning and Qualification Engineer', code: 'CQV01', narration: 'Commissioning and Qualification Engineer', description: 'Commissioning and Qualification Engineer', hourlyRate: 750, status: 'Active' },
    { name: 'Warehouse Executive', code: 'WH01', narration: 'Warehouse Executive', description: 'Warehouse Executive', hourlyRate: 350, status: 'Active' },
    { name: 'Warehouse Supervisor', code: 'WH02', narration: 'Warehouse Supervisor', description: 'Warehouse Supervisor', hourlyRate: 450, status: 'Active' },
    { name: 'Warehouse Manager', code: 'WH03', narration: 'Warehouse Manager', description: 'Warehouse Manager', hourlyRate: 800, status: 'Active' },
    { name: 'Raw Material Storekeeper', code: 'RM01', narration: 'Raw Material Storekeeper', description: 'Raw Material Storekeeper', hourlyRate: 300, status: 'Active' },
    { name: 'Critical Components & Spares Storekeeper', code: 'CC01', narration: 'Critical Components & Spare Parts Storekeeper', description: 'Critical Components & Spare Parts Storekeeper', hourlyRate: 300, status: 'Active' },
    { name: 'Finished Goods Executive', code: 'FG01', narration: 'Finished Goods Executive', description: 'Finished Goods Executive', hourlyRate: 350, status: 'Active' },
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
        item.narration.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase());

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
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'add' },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: MasterItem): void {
    this.dialog.open(AddJobCodeComponent, {
      width: '800px',
      data: { mode: 'edit', ...item },
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
