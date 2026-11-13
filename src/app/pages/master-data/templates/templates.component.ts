import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EditTemplateComponent } from './edit-template/edit-template.component';
import { DeleteConfirmationComponent } from '../../../common/shared/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { RouterLink } from '@angular/router';

interface TemplateItem {
  name: string;
  description: string;
  division: string;
  projectType: string;
  stages: number;
  gates: number;
  deliverables: number;
  activities: number;
  sprint: number;
  buffer: number;
  planEffort?: string;
  planDuration?: string;
  period?: string;
  resources: number;
  budget: string;
  updatedDate: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-templates',
  imports: [
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss',
})
export class TemplatesComponent {
  constructor(private dialog: MatDialog) { }

  readonly items: TemplateItem[] = [
    {
      name: 'Industrial Equipment Line Expansion Program',
      description: 'End-to-end industrial equipment program covering capacity audit, 3D CAD/FEA engineering design, OEM procurement, fabrication, installation, commissioning, performance qualification and operational handover through stage-gate delivery',
      division: 'Industrial Machinery - MA',
      projectType: 'Industrial Equipment Development',
      stages: 12,
      gates: 5,
      deliverables: 38,
      activities: 142,
      sprint: 16,
      buffer: 45,
      planEffort: '30,000 hrs',
      planDuration: '540 days',
      period: 'days',
      resources: 24,
      budget: '14,500,000',
      updatedDate: '02-Sep-2026',
      status: 'Active',
    },
    {
      name: 'Automated Production Line Upgrade Program',
      description: 'Automated production-line upgrade covering line layout, CNC and robotics procurement, PLC/SCADA controls integration, safety validation, operator trials and operational readiness approval',
      division: 'Equipment Engineering - CT',
      projectType: 'Industrial Equipment & Plant Engineering',
      stages: 12,
      gates: 5,
      deliverables: 36,
      activities: 135,
      sprint: 14,
      buffer: 40,
      planEffort: '24,800 hrs',
      planDuration: '480 days',
      period: 'days',
      resources: 20,
      budget: '11,200,000',
      updatedDate: '28-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Industrial Control System Development',
      description: 'Industrial control-system development covering EtherCAT PLC architecture, sensor and servo actuator integration, UL 508A control-panel fabrication, FAT testing and site commissioning',
      division: 'Process Equipment - GT',
      projectType: 'Industrial Equipment & Plant Engineering',
      stages: 12,
      gates: 5,
      deliverables: 32,
      activities: 118,
      sprint: 12,
      buffer: 35,
      planEffort: '18,400 hrs',
      planDuration: '390 days',
      period: 'days',
      resources: 18,
      budget: '8,750,000',
      updatedDate: '25-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Industrial Compressor Platform Development',
      description: 'Industrial compressor platform development covering mechanical design, variable speed drive integration, ISO 8573-1 air purity optimization, acoustic endurance testing and production validation',
      division: 'Production Systems - VX',
      projectType: 'Industrial Equipment Development',
      stages: 12,
      gates: 5,
      deliverables: 28,
      activities: 96,
      sprint: 10,
      buffer: 30,
      planEffort: '14,200 hrs',
      planDuration: '320 days',
      period: 'days',
      resources: 14,
      budget: '5,600,000',
      updatedDate: '20-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Commercial Production Line Transfer & Ramp-Up',
      description: 'Transfer of validated equipment design and assembly processes to plant operations, including foundation utility prep, IQ/OQ/PQ line qualification, operator certification and CMMS handover',
      division: 'Industrial Machinery - MA',
      projectType: 'Industrial Equipment Development',
      stages: 12,
      gates: 5,
      deliverables: 34,
      activities: 124,
      sprint: 15,
      buffer: 40,
      planEffort: '26,500 hrs',
      planDuration: '450 days',
      period: 'days',
      resources: 22,
      budget: '12,800,000',
      updatedDate: '18-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Equipment Upgrade & Post-Commissioning Change',
      description: 'Targeted retrofit modification, precision subassembly replacement, process capability (Cpk) revalidation, EHS safety review and updated as-built technical documentation',
      division: 'Production Systems - VX',
      projectType: 'Industrial Equipment Development',
      stages: 12,
      gates: 5,
      deliverables: 24,
      activities: 82,
      sprint: 8,
      buffer: 20,
      planEffort: '9,600 hrs',
      planDuration: '210 days',
      period: 'days',
      resources: 10,
      budget: '3,450,000',
      updatedDate: '12-Aug-2026',
      status: 'Active',
    }
  ];

  showFilter = false;
  keyword = '';
  status = '';
  searchKeyword = '';
  searchStatus = '';
  pageIndex = 0;
  pageSize = 10;

  get filteredItems(): TemplateItem[] {
    return this.items.filter((item) => {
      const keywordMatches =
        !this.searchKeyword ||
        item.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        (item.division && item.division.toLowerCase().includes(this.searchKeyword.toLowerCase())) ||
        item.projectType.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || item.status === this.searchStatus;

      return keywordMatches && statusMatches;
    });
  }

  get paginatedItems(): TemplateItem[] {
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
    console.log('Add template clicked');
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onEdit(item: TemplateItem): void {
    const dialogRef = this.dialog.open(EditTemplateComponent, {
      width: '600px',
      minWidth: '600px',
      maxHeight: '100vh',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        Object.assign(item, result);
      }
    });
  }

  onDelete(item: TemplateItem): void {
    this.dialog.open(DeleteConfirmationComponent, { width: '350px', data: item });
  }

  onStatusChange(item: TemplateItem): void {
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
