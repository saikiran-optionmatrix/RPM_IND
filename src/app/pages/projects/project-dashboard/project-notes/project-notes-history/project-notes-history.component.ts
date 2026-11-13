import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface NoteHistoryItem {
  id?: number;
  date: string;
  postedBy: string;
  message: string;
  document: string;
  tags: string;
  version?: string;
  remarks?: string;
}

@Component({
  selector: 'app-project-notes-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './project-notes-history.component.html',
  styleUrl: './project-notes-history.component.scss'
})
export class ProjectNotesHistoryComponent implements OnInit {
  projectName: string = '';
  projectCode: string = '';
  date: string = '';
  postedBy: string = '';
  description: string = '';
  document: string = '';
  tags: string = '';
  historyCount: number = 3;

  pageSize: number = 10;
  currentPage: number = 0;

  historyNotes: NoteHistoryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      if (params['date']) {
        this.date = params['date'];
      }
      if (params['postedBy']) {
        this.postedBy = params['postedBy'];
      }
      if (params['description']) {
        this.description = params['description'];
      }
      if (params['document']) {
        this.document = params['document'];
      }
      if (params['tags']) {
        this.tags = params['tags'];
      }
      if (params['historyCount']) {
        this.historyCount = Number(params['historyCount']) || 3;
      }

      this.initHistoryNotes();
    });
  }

  initHistoryNotes(): void {
    const curDate = this.date || '06/05/2026';
    const curPoster = this.postedBy || 'Rajesh Kumar';
    const curDesc = this.description || 'Line throughput benchmark completed; URS target of 120 units/hr approved across two primary CNC bays.';
    const curDoc = this.document || 'URS Baseline Specification.pdf';
    const curTag = this.tags || 'URS & Feasibility';

    // Build revision chain for the selected note
    const selectedRevisions: NoteHistoryItem[] = [
      {
        id: 1,
        date: curDate,
        postedBy: curPoster,
        message: curDesc,
        document: curDoc,
        tags: curTag,
        version: 'Rev 3 (Current)',
        remarks: 'Finalized URS capacity envelope and utility sizing baseline.'
      },
      {
        id: 2,
        date: '06/02/2026',
        postedBy: curPoster,
        message: 'Initial bay cycle-time study reviewed; requested spindle power duty curves from shortlisted OEMs.',
        document: 'Capacity Audit Initial Readout.pdf',
        tags: curTag,
        version: 'Rev 2',
        remarks: 'Line bottleneck mapped across Stations 2 through 5.'
      },
      {
        id: 3,
        date: '05/28/2026',
        postedBy: curPoster,
        message: 'OEM equipment inquiry dispatched following Stage 1 capital business case approval.',
        document: 'OEM RFQ Package.pdf',
        tags: curTag,
        version: 'Rev 1',
        remarks: 'Initial technical questionnaire sent to 4 machinery suppliers.'
      }
    ];

    // Other project notes historical records
    const otherNotes: NoteHistoryItem[] = [
      {
        id: 4,
        date: '06/12/2026',
        postedBy: 'Anita Desai',
        message: 'Gantry structural FEA completed with 2.4x safety factor and gusset stiffeners added for spindle harmonic damping.',
        document: 'Structural FEA Analysis Report.pdf',
        tags: 'CAD & Mechanical',
        version: 'Rev 2',
        remarks: 'Base polymer-concrete damping parameters locked.'
      },
      {
        id: 5,
        date: '06/20/2026',
        postedBy: 'Priya Reddy',
        message: 'PLC safety circuit EPLAN schematics updated; dual-channel E-stop and light curtain PLd validation verified.',
        document: 'PLC Safety Interlock Spec.pdf',
        tags: 'Controls & PLC',
        version: 'Rev 1',
        remarks: 'Safety relay validation protocol submitted for QA review.'
      },
      {
        id: 6,
        date: '06/28/2026',
        postedBy: 'Suresh Naidu',
        message: 'Prototype fixture endurance cycling completed across 5,000 clamp cycles with zero dimensional repeatability drift.',
        document: 'Prototype Tooling Trial Log.pdf',
        tags: 'Fabrication & FAT',
        version: 'Rev 2',
        remarks: 'Hydraulic clamping repeatability held within +/- 0.01 mm.'
      },
      {
        id: 7,
        date: '07/04/2026',
        postedBy: 'Arun Joseph',
        message: 'Bay 2 reinforced concrete foundation cured to 4,500 psi; 480V substation feeder and chilled water manifold tested.',
        document: 'Foundation & Utility Audit.pdf',
        tags: 'Site & Rigging',
        version: 'Rev 1',
        remarks: 'Utilities hookup ready prior to crane rigging window.'
      },
      {
        id: 8,
        date: '07/11/2026',
        postedBy: 'Ananya Rao',
        message: 'Completed As-Built CAD package, CMMS preventive maintenance schedule upload, and operator LOTO SOP sign-off.',
        document: 'Operations TTD Dossier Draft.pdf',
        tags: 'SAT & OQ Handover',
        version: 'Rev 1',
        remarks: 'Handover package staged for Plant Operations director sign-off.'
      },
      {
        id: 9,
        date: '07/18/2026',
        postedBy: 'Rajesh Kumar',
        message: 'Backup Japanese servo-drive vendor ISO 9001 quality audit and 24-hour critical spares SLA finalized.',
        document: 'OEM Supplier Audit Report.pdf',
        tags: 'URS & Feasibility',
        version: 'Rev 1',
        remarks: 'Supplier approved and added to Approved Vendor List.'
      },
      {
        id: 10,
        date: '07/25/2026',
        postedBy: 'Anita Desai',
        message: 'Updated GD&T tolerance stack-up to +/- 0.015 mm on rotary indexer bed mounting interface.',
        document: 'GDT Tolerance StackUp Rev2.pdf',
        tags: 'CAD & Mechanical',
        version: 'Rev 1',
        remarks: 'Fixture datum pin clearances verified.'
      },
      {
        id: 11,
        date: '08/02/2026',
        postedBy: 'Amit Patel',
        message: 'OPC-UA SCADA edge gateway stress test passed; 1,200 high-frequency spindle telemetry tags verified < 10 ms.',
        document: 'SCADA Telemetry Stress Log.pdf',
        tags: 'Controls & PLC',
        version: 'Rev 1',
        remarks: 'Historian buffering verified over VLAN failover.'
      },
      {
        id: 12,
        date: '08/09/2026',
        postedBy: 'Deepa Nair',
        message: 'OEM Factory Acceptance Test (FAT) completed with acoustic enclosure measuring 75.8 dBA (< 78 dBA limit).',
        document: 'OEM FAT Witness Report.pdf',
        tags: 'Fabrication & FAT',
        version: 'Rev 1',
        remarks: 'Zero open safety punch-list items.'
      }
    ];

    // Filter out duplicate if matching message
    const filteredOther = otherNotes.filter(
      n => n.message.toLowerCase() !== curDesc.toLowerCase()
    );

    this.historyNotes = [...selectedRevisions, ...filteredOther];
  }

  get paginatedNotes(): NoteHistoryItem[] {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.historyNotes.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  viewPdf(fileName: string): void {
    alert('Viewing document: ' + fileName);
  }

  downloadPdf(fileName: string): void {
    alert('Downloading document: ' + fileName);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/notes'], {
      queryParams: {
        code: this.projectCode || '2026/IND/001',
        name: this.projectName || 'Industrial Equipment Line Expansion'
      },
      queryParamsHandling: 'merge'
    });
  }
}
