import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddRequisitionComponent } from './add-requisition/add-requisition.component';
import { MaterialTimelineComponent } from './material-timeline/material-timeline.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { HistoryPopComponent } from '../../../../common/shared/history-pop/history-pop.component';

export interface ProjectMaterial {
  stage: string;
  module: string;
  task: string;
  itemName: string;
  quantity: number;
  unitRate: number;
  materialCost: number;
  remarks: string;
  targetDate: string;
  requestedBy: string;
  requestDate: string;
  available: boolean;
  reserved: boolean;
  requestedQuantity: number;
  issuedQuantity: number;
  issued: boolean;
  issueDate: string;
  historyCount?: number;
  updatedDate?: string;
  updatedBy?: string;
}

@Component({
  selector: 'app-project-materials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './project-materials.component.html',
  styleUrl: './project-materials.component.scss'
})
export class ProjectMaterialsComponent implements OnInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  displayedRows: ProjectMaterial[] = [];

  isTemplate: boolean = false;
  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isTemplate = params['isTemplate'] === 'true' || params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' || params['fromTemplate'] === true;
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.loadData();
    const sampleDates = ['2026-02-15', '2026-02-12', '2026-02-10', '2026-02-05', '2026-01-30', '2026-01-28', '2026-01-25', '2026-01-20'];
    this.displayedRows.forEach((row, idx) => {
      if (!row.updatedDate) {
        row.updatedDate = sampleDates[idx % sampleDates.length];
      }
      if (!row.updatedBy) {
        row.updatedBy = row.requestedBy || 'Dr. Sarah Jenkins';
      }
    });
  }

  loadData(): void {
    this.displayedRows = [
      {
        stage: 'Feasibility',
        module: 'API Assessment',
        task: 'API Evaluation',
        itemName: 'Active Pharmaceutical Ingredient',
        quantity: 50,
        unitRate: 12000,
        materialCost: 600000,
        remarks: 'Supplier qualification required',
        targetDate: '15-Jun-2026',
        requestedBy: 'Rajesh Kumar',
        requestDate: '01-Jun-2026',
        available: true,
        reserved: true,
        requestedQuantity: 50,
        issuedQuantity: 50,
        issued: true,
        issueDate: '05-Jun-2026'
      },
      {
        stage: 'Design',
        module: 'Formulation Development',
        task: 'Excipient Selection',
        itemName: 'Pharmaceutical Excipients',
        quantity: 200,
        unitRate: 450,
        materialCost: 90000,
        remarks: 'Optimize compatibility',
        targetDate: '20-Jun-2026',
        requestedBy: 'Anita Desai',
        requestDate: '05-Jun-2026',
        available: true,
        reserved: false,
        requestedQuantity: 200,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Development',
        module: 'Preformulation',
        task: 'Compatibility Study',
        itemName: 'API–Excipient Samples',
        quantity: 25,
        unitRate: 3200,
        materialCost: 80000,
        remarks: 'Check stability profile',
        targetDate: '25-Jun-2026',
        requestedBy: 'Vikram Singh',
        requestDate: '08-Jun-2026',
        available: false,
        reserved: false,
        requestedQuantity: 25,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Formulation',
        module: 'Tablet Development',
        task: 'Trial Batches',
        itemName: 'Tablet Blend',
        quantity: 100,
        unitRate: 850,
        materialCost: 85000,
        remarks: 'Prototype batch required',
        targetDate: '05-Jul-2026',
        requestedBy: 'Neha Sharma',
        requestDate: '18-Jun-2026',
        available: true,
        reserved: true,
        requestedQuantity: 100,
        issuedQuantity: 100,
        issued: true,
        issueDate: '24-Jun-2026'
      },
      {
        stage: 'Testing',
        module: 'Analytical Development',
        task: 'Assay Testing',
        itemName: 'Analytical Standards',
        remarks: 'Method verification needed',
        quantity: 10,
        unitRate: 15000,
        materialCost: 150000,
        targetDate: '15-Jul-2026',
        requestedBy: 'Amit Patel',
        requestDate: '25-Jun-2026',
        available: false,
        reserved: false,
        requestedQuantity: 10,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Optimization',
        module: 'Process Development',
        task: 'Granulation',
        itemName: 'Granulation Materials',
        quantity: 150,
        unitRate: 650,
        materialCost: 97500,
        remarks: 'Optimize process parameters',
        targetDate: '22-Jul-2026',
        requestedBy: 'Priya Reddy',
        requestDate: '02-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 150,
        issuedQuantity: 75,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Manufacturing',
        module: 'Compression',
        task: 'Tablet Compression',
        itemName: 'Compression Tooling',
        quantity: 12,
        unitRate: 18500,
        materialCost: 222000,
        remarks: 'Inspect before use',
        targetDate: '30-Jul-2026',
        requestedBy: 'Suresh Naidu',
        requestDate: '10-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 12,
        issuedQuantity: 6,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Coating',
        module: 'Film Coating',
        task: 'Coating Trial',
        itemName: 'Coating Materials',
        quantity: 80,
        unitRate: 1250,
        materialCost: 100000,
        remarks: 'Target weight gain required',
        targetDate: '08-Aug-2026',
        requestedBy: 'Rohit Mehta',
        requestDate: '15-Jul-2026',
        available: true,
        reserved: false,
        requestedQuantity: 80,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Quality Control',
        module: 'Finished Product Testing',
        task: 'Dissolution Testing',
        itemName: 'Dissolution Media',
        quantity: 50,
        unitRate: 2400,
        materialCost: 120000,
        remarks: 'Specification confirmation',
        targetDate: '18-Aug-2026',
        requestedBy: 'Kiran Rao',
        requestDate: '22-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 50,
        issuedQuantity: 50,
        issued: true,
        issueDate: '28-Jul-2026'
      },
      {
        stage: 'Validation',
        module: 'Process Validation',
        task: 'Validation Batch',
        itemName: 'Validation Samples',
        quantity: 300,
        unitRate: 950,
        materialCost: 285000,
        remarks: 'Three-batch assessment',
        targetDate: '25-Aug-2026',
        requestedBy: 'Deepa Nair',
        requestDate: '01-Aug-2026',
        available: false,
        reserved: false,
        requestedQuantity: 300,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Bioequivalence',
        module: 'BE Study',
        task: 'Sample Preparation',
        itemName: 'Bioequivalence Samples',
        quantity: 40,
        unitRate: 8500,
        materialCost: 340000,
        remarks: 'Study protocol approved',
        targetDate: '05-Sep-2026',
        requestedBy: 'Harish Babu',
        requestDate: '10-Aug-2026',
        available: true,
        reserved: true,
        requestedQuantity: 40,
        issuedQuantity: 20,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Stability',
        module: 'Stability Study',
        task: 'Stability Testing',
        itemName: 'Stability Samples',
        quantity: 60,
        unitRate: 3600,
        materialCost: 216000,
        remarks: 'Long-term and accelerated',
        targetDate: '15-Sep-2026',
        requestedBy: 'Arun Joseph',
        requestDate: '15-Aug-2026',
        available: true,
        reserved: false,
        requestedQuantity: 60,
        issuedQuantity: 60,
        issued: true,
        issueDate: '20-Aug-2026'
      },
      {
        stage: 'Regulatory',
        module: 'ANDA/Regulatory Submission',
        task: 'Dossier Compilation',
        itemName: 'Regulatory Documentation',
        quantity: 15,
        unitRate: 4200,
        materialCost: 63000,
        remarks: 'Final review required',
        targetDate: '30-Sep-2026',
        requestedBy: 'Lakshmi Devi',
        requestDate: '25-Aug-2026',
        available: false,
        reserved: false,
        requestedQuantity: 15,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      }
    ];

    this.displayedRows.forEach((row, idx) => {
      if (!row.historyCount) {
        row.historyCount = (idx % 10) + 1;
      }
    });
  }





  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics']);
  }

  openTimelineModal(item: ProjectMaterial): void {
    this.dialog.open(MaterialTimelineComponent, {
      width: '720px',
      maxWidth: '95vw',
      data: item
    });
  }

  addMaterial(): void {
    const dialogRef = this.dialog.open(AddRequisitionComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((res: ProjectMaterial | undefined) => {
      if (res) {
        this.displayedRows.unshift(res);
      }
    });
  }

  editMaterial(row: ProjectMaterial): void {
    const dialogRef = this.dialog.open(AddRequisitionComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: row
    });

    dialogRef.afterClosed().subscribe((res: ProjectMaterial | undefined) => {
      if (res) {
        Object.assign(row, res);
      }
    });
  }

  deleteMaterial(row: ProjectMaterial): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this Material Requisition?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.displayedRows = this.displayedRows.filter(r => r !== row);
      }
    });
  }

  scrollLeft(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  openHistory(item?: any): void {
    const itemName = (typeof item === 'object' && item !== null) ? (item.itemName || '') : (typeof item === 'string' ? item : '');
    this.router.navigate(['/projects/dashboard/materials/history'], {
      queryParams: {
        itemName: itemName,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
