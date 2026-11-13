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
  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Industrial Equipment Line Expansion - 2026/IND/001';

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
        row.updatedBy = row.requestedBy || 'Ananya Rao';
      }
    });
  }

  loadData(): void {
    this.displayedRows = [
      {
        stage: 'Feasibility',
        module: 'Plant Capacity Audit',
        task: 'Benchmarking Instrumentation',
        itemName: 'Cycle-Time Data Loggers & Tachometers',
        quantity: 12,
        unitRate: 1200,
        materialCost: 14400,
        remarks: 'NIST calibration certificate required',
        targetDate: '15-Jun-2026',
        requestedBy: 'Rajesh Kumar',
        requestDate: '01-Jun-2026',
        available: true,
        reserved: true,
        requestedQuantity: 12,
        issuedQuantity: 12,
        issued: true,
        issueDate: '05-Jun-2026'
      },
      {
        stage: 'Detailed Engg',
        module: 'Structural Frame',
        task: 'Frame Weldment Stock',
        itemName: 'ASTM A36 Structural Steel Plate',
        quantity: 200,
        unitRate: 180,
        materialCost: 36000,
        remarks: 'EN 10204 3.1 mill test report',
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
        stage: 'Detailed Engg',
        module: 'Automation & Controls',
        task: 'Control Cabinet Build',
        itemName: 'PLC Processor Rack & Safety Relays',
        quantity: 8,
        unitRate: 3200,
        materialCost: 25600,
        remarks: 'ISO 13849 PLd certified safety inputs',
        targetDate: '25-Jun-2026',
        requestedBy: 'Priya Reddy',
        requestDate: '08-Jun-2026',
        available: false,
        reserved: false,
        requestedQuantity: 8,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Fabrication',
        module: 'Precision Machining',
        task: 'Spindle & Drive Assembly',
        itemName: 'AC Servo Motors & Planetary Gearheads',
        quantity: 16,
        unitRate: 2450,
        materialCost: 39200,
        remarks: 'OEM match test complete',
        targetDate: '05-Jul-2026',
        requestedBy: 'Suresh Naidu',
        requestDate: '18-Jun-2026',
        available: true,
        reserved: true,
        requestedQuantity: 16,
        issuedQuantity: 16,
        issued: true,
        issueDate: '24-Jun-2026'
      },
      {
        stage: 'Fabrication',
        module: 'Metrology & Inspection',
        task: 'Coordinate Measuring Check',
        itemName: 'CMM Reference Masters & Probe Tips',
        remarks: 'Gage R&R qualification required',
        quantity: 10,
        unitRate: 1500,
        materialCost: 15000,
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
        stage: 'Fabrication',
        module: 'Hydraulics & Actuation',
        task: 'Manifold Assembly',
        itemName: 'Hydraulic Manifold & Proportional Valves',
        quantity: 20,
        unitRate: 950,
        materialCost: 19000,
        remarks: '3000 psi pressure tested',
        targetDate: '22-Jul-2026',
        requestedBy: 'Priya Reddy',
        requestDate: '02-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 20,
        issuedQuantity: 10,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Installation',
        module: 'Site Rigging & Anchoring',
        task: 'Foundation Anchoring',
        itemName: 'Vibration Isolation Pads & Anchor Bolts',
        quantity: 48,
        unitRate: 450,
        materialCost: 21600,
        remarks: 'Inspect grout spec before pouring',
        targetDate: '30-Jul-2026',
        requestedBy: 'Arun Joseph',
        requestDate: '10-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 48,
        issuedQuantity: 24,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Installation',
        module: 'Utility Tie-Ins',
        task: 'Electrical & Air Drop',
        itemName: '480V Armoured Feeder Cable & Busbar Kit',
        quantity: 80,
        unitRate: 250,
        materialCost: 20000,
        remarks: 'UL508A switchgear rated',
        targetDate: '08-Aug-2026',
        requestedBy: 'Ananya Rao',
        requestDate: '15-Jul-2026',
        available: true,
        reserved: false,
        requestedQuantity: 80,
        issuedQuantity: 0,
        issued: false,
        issueDate: '-'
      },
      {
        stage: 'Commissioning',
        module: 'Safety Guarding',
        task: 'Perimeter Protection',
        itemName: 'Safety Light Curtains & Mesh Enclosures',
        quantity: 14,
        unitRate: 2400,
        materialCost: 33600,
        remarks: 'CE / OSHA interlock tested',
        targetDate: '18-Aug-2026',
        requestedBy: 'Harish Babu',
        requestDate: '22-Jul-2026',
        available: true,
        reserved: true,
        requestedQuantity: 14,
        issuedQuantity: 14,
        issued: true,
        issueDate: '28-Jul-2026'
      },
      {
        stage: 'Commissioning',
        module: 'SAT Run-Off',
        task: 'Endurance Test Stock',
        itemName: 'Aluminum Billet Trial Bar Stock (6061-T6)',
        quantity: 300,
        unitRate: 95,
        materialCost: 28500,
        remarks: 'For 72-hour continuous OEE run-off',
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
        stage: 'OQ Ramp-Up',
        module: 'Critical Spares',
        task: 'Stores Inventory Stocking',
        itemName: 'Tier-1 Spindle Bearings & Mechanical Seals Kit',
        quantity: 10,
        unitRate: 3600,
        materialCost: 36000,
        remarks: 'Critical spares stocked in CMMS stores',
        targetDate: '15-Sep-2026',
        requestedBy: 'Arun Joseph',
        requestDate: '15-Aug-2026',
        available: true,
        reserved: false,
        requestedQuantity: 10,
        issuedQuantity: 10,
        issued: true,
        issueDate: '20-Aug-2026'
      },
      {
        stage: 'Handover',
        module: 'EHS & LOTO Setup',
        task: 'Plant Handover Kit',
        itemName: 'Lockout / Tagout (LOTO) Station & Placards',
        quantity: 15,
        unitRate: 420,
        materialCost: 6300,
        remarks: 'Final EHS walkthrough sign-off',
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
