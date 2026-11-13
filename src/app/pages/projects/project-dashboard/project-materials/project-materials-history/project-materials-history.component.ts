import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface MaterialHistoryItem {
  id?: number;
  stage: string;
  deliverable: string;
  activity: string;
  itemName: string;
  requestedQuantity: number;
  issuedQuantity: number;
  requestedBy: string;
  available: boolean;
  reserved: boolean;
  unitRate?: number;
  materialCost?: number;
  remarks?: string;
  targetDate?: string;
  requestDate?: string;
  issueDate?: string;
  // Timeline pop data
  planStart?: string;
  planEnd?: string;
  actualStart?: string;
  actualEnd?: string;
  eta?: string;
}

@Component({
  selector: 'app-project-materials-history',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-materials-history.component.html',
  styleUrl: './project-materials-history.component.scss',
})
export class ProjectMaterialsHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  itemName: string = 'Material';

  pageIndex: number = 0;
  pageSize: number = 10;

  historyRecords: MaterialHistoryItem[] = [];

  showTimelineModal: boolean = false;
  selectedTimelineItem: MaterialHistoryItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      }
      if (params['projectCode']) {
        this.projectCode = params['projectCode'];
      }
      if (params['itemName']) {
        this.itemName = params['itemName'];
      }
      this.initHistoryRecords();
    });
  }

  initHistoryRecords(): void {
    const item = this.itemName && this.itemName !== 'Material'
      ? this.itemName
      : 'ASTM A36 Structural Steel Plate';

    this.historyRecords = [
      {
        id: 1,
        stage: 'Detailed Engg',
        deliverable: 'Structural Frame',
        activity: 'Frame Weldment Stock',
        itemName: item,
        requestedQuantity: 50,
        issuedQuantity: 50,
        requestedBy: 'Rajesh Kumar',
        available: true,
        reserved: true,
        unitRate: 180,
        materialCost: 9000,
        remarks: 'Stock issued from warehouse inventory after EN 10204 3.1 mill certificate verification.',
        targetDate: '15-Jun-2026',
        requestDate: '01-Jun-2026',
        issueDate: '05-Jun-2026',
        planStart: '2026-06-01',
        planEnd: '2026-06-15',
        actualStart: '2026-06-01',
        actualEnd: '2026-06-05',
        eta: '2026-06-15'
      },
      {
        id: 2,
        stage: 'Detailed Engg',
        deliverable: 'Structural Frame',
        activity: 'Frame Weldment Stock',
        itemName: item,
        requestedQuantity: 50,
        issuedQuantity: 30,
        requestedBy: 'Rajesh Kumar',
        available: true,
        reserved: true,
        unitRate: 180,
        materialCost: 5400,
        remarks: 'Partial lot released pending ultrasonic weld seam inspection clearance.',
        targetDate: '10-Jun-2026',
        requestDate: '01-Jun-2026',
        issueDate: '03-Jun-2026',
        planStart: '2026-06-01',
        planEnd: '2026-06-10',
        actualStart: '2026-06-01',
        actualEnd: '2026-06-03',
        eta: '2026-06-10'
      },
      {
        id: 3,
        stage: 'Detailed Engg',
        deliverable: 'Structural Frame',
        activity: 'Frame Weldment Stock',
        itemName: item,
        requestedQuantity: 50,
        issuedQuantity: 0,
        requestedBy: 'Rajesh Kumar',
        available: true,
        reserved: true,
        unitRate: 180,
        materialCost: 9000,
        remarks: 'Requisition approved by Engineering Lead; stores reservation placed.',
        targetDate: '10-Jun-2026',
        requestDate: '01-Jun-2026',
        issueDate: '-',
        planStart: '2026-06-01',
        planEnd: '2026-06-10',
        actualStart: '2026-06-01',
        actualEnd: '',
        eta: '2026-06-10'
      },
      {
        id: 4,
        stage: 'Detailed Engg',
        deliverable: 'Structural Frame',
        activity: 'Frame Weldment Stock',
        itemName: item,
        requestedQuantity: 40,
        issuedQuantity: 0,
        requestedBy: 'Rajesh Kumar',
        available: false,
        reserved: false,
        unitRate: 180,
        materialCost: 7200,
        remarks: 'Initial requisition created with estimated quantity for structural fabrication.',
        targetDate: '05-Jun-2026',
        requestDate: '28-May-2026',
        issueDate: '-',
        planStart: '2026-05-28',
        planEnd: '2026-06-05',
        actualStart: '2026-05-28',
        actualEnd: '',
        eta: '2026-06-05'
      },
      {
        id: 5,
        stage: 'Fabrication',
        deliverable: 'Precision Machining',
        activity: 'Spindle & Drive Assembly',
        itemName: 'AC Servo Motors & Planetary Gearheads',
        requestedQuantity: 16,
        issuedQuantity: 16,
        requestedBy: 'Anita Desai',
        available: true,
        reserved: true,
        unitRate: 2450,
        materialCost: 39200,
        remarks: 'OEM servo drive assemblies delivered and incoming QC inspected.',
        targetDate: '20-Jun-2026',
        requestDate: '05-Jun-2026',
        issueDate: '12-Jun-2026',
        planStart: '2026-06-05',
        planEnd: '2026-06-20',
        actualStart: '2026-06-05',
        actualEnd: '2026-06-12',
        eta: '2026-06-20'
      },
      {
        id: 6,
        stage: 'Detailed Engg',
        deliverable: 'Automation & Controls',
        activity: 'Control Cabinet Build',
        itemName: 'PLC Processor Rack & Safety Relays',
        requestedQuantity: 8,
        issuedQuantity: 8,
        requestedBy: 'Priya Reddy',
        available: true,
        reserved: false,
        unitRate: 3200,
        materialCost: 25600,
        remarks: 'UL508A control enclosure safety PLC modules staged in assembly bay.',
        targetDate: '25-Jun-2026',
        requestDate: '08-Jun-2026',
        issueDate: '15-Jun-2026',
        planStart: '2026-06-08',
        planEnd: '2026-06-25',
        actualStart: '2026-06-08',
        actualEnd: '2026-06-15',
        eta: '2026-06-25'
      }
    ];
  }

  get paginatedRecords(): MaterialHistoryItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.historyRecords.slice(startIndex, startIndex + this.pageSize);
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  openTimelineModal(item: MaterialHistoryItem): void {
    this.selectedTimelineItem = item;
    this.showTimelineModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeTimelineModal(): void {
    this.showTimelineModal = false;
    this.selectedTimelineItem = null;
    document.body.style.overflow = 'auto';
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/materials'], {
      queryParamsHandling: 'merge'
    });
  }
}
