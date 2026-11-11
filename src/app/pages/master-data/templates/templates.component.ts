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
  constructor(private dialog: MatDialog) {}

  readonly items: TemplateItem[] = [
    {
      name: 'Oral Solid Dosage (OSD) Formulation & Commercialization',
      description: 'Comprehensive generic oral tablet and capsule product development, pre-formulation, QbD DoE formulation optimization, bioequivalence trials, and eCTD submission',
      division: 'Oral Solids - OS',
      projectType: 'Generic Formulation R&D',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 16,
      buffer: 45,
      planEffort: '3,450 hrs',
      planDuration: '420 days',
      period: 'days',
      resources: 24,
      budget: '14,500,000',
      updatedDate: '02-Sep-2026',
      status: 'Active',
    },
    {
      name: 'Sterile Injectables & Lyophilized Vials R&D',
      description: 'Aseptic liquid filling, lyophilization cycle development, container closure integrity, sterility assurance validation, and global regulatory registration',
      division: 'Injectables - IJ',
      projectType: 'Complex Injectable & Liposomal',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 14,
      buffer: 40,
      planEffort: '3,800 hrs',
      planDuration: '480 days',
      period: 'days',
      resources: 22,
      budget: '18,200,000',
      updatedDate: '28-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Inhalation & Dry Powder Respiratory Drug Delivery',
      description: 'Metered dose inhaler (MDI) and dry powder inhaler (DPI) device engineering, aerodynamic particle size distribution (APSD), and clinical PK/PD evaluation',
      division: 'Inhalation & Respiratory - IR',
      projectType: '505(b)(2) Value-Added Generic',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 12,
      buffer: 35,
      planEffort: '2,950 hrs',
      planDuration: '390 days',
      period: 'days',
      resources: 18,
      budget: '12,750,000',
      updatedDate: '25-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Complex Injectables & Liposomal Nanomedicine',
      description: 'Nanoparticle lipid encapsulation, high-pressure homogenization, specialized in-vitro release testing, and cold-chain manufacturing scale-up',
      division: 'Complex Injectables - CI',
      projectType: 'Complex Injectable & Liposomal',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 15,
      buffer: 50,
      planEffort: '4,100 hrs',
      planDuration: '510 days',
      period: 'days',
      resources: 26,
      budget: '21,500,000',
      updatedDate: '20-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Biologics & Monoclonal Antibodies (mAb) Biosimilar',
      description: 'Cell line development, upstream bioreactor perfusion, downstream chromatography purification, biosimilar totality-of-evidence, and Phase III comparative clinical trials',
      division: 'Biotech - BT',
      projectType: 'Biosimilar Development',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 18,
      buffer: 60,
      planEffort: '5,200 hrs',
      planDuration: '640 days',
      period: 'days',
      resources: 30,
      budget: '28,000,000',
      updatedDate: '15-Aug-2026',
      status: 'Active',
    },
    {
      name: 'Topical, Transdermal & Semi-Solids Development',
      description: 'Creams, gels, ointments and transdermal therapeutic systems, in-vitro permeation testing (IVPT) on Franz diffusion cells, and scale-up manufacturing',
      division: 'Oral Solids - OS',
      projectType: 'Life Cycle Management / Line Extension',
      stages: 11,
      gates: 7,
      deliverables: 36,
      activities: 138,
      sprint: 10,
      buffer: 30,
      planEffort: '2,200 hrs',
      planDuration: '300 days',
      period: 'days',
      resources: 14,
      budget: '8,400,000',
      updatedDate: '10-Aug-2026',
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
      minWidth:'600px',
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
