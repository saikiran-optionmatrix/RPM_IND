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
    const curDesc = this.description || 'API evaluation completed; supplier qualification is under review with 2 qualified DMF sources.';
    const curDoc = this.document || 'API Specification.pdf';
    const curTag = this.tags || 'API Assessment';

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
        remarks: 'Finalized audit findings and CoA qualification details.'
      },
      {
        id: 2,
        date: '06/02/2026',
        postedBy: curPoster,
        message: 'Initial CoA and impurity profile reviewed; requested DMF open part from candidate supplier.',
        document: 'CoA Initial Evaluation.pdf',
        tags: curTag,
        version: 'Rev 2',
        remarks: 'Sample lots tested with preliminary chromatographic assay.'
      },
      {
        id: 3,
        date: '05/28/2026',
        postedBy: curPoster,
        message: 'API supplier inquiry initiated following feasibility formulation specifications sign-off.',
        document: 'API Inquiry Form.pdf',
        tags: curTag,
        version: 'Rev 1',
        remarks: 'Initial vendor questionnaire dispatched.'
      }
    ];

    // Other project notes historical records
    const otherNotes: NoteHistoryItem[] = [
      {
        id: 4,
        date: '06/12/2026',
        postedBy: 'Anita Desai',
        message: 'Formulation trial completed with selected excipients; dissolution similarity f2 > 65 observed against RLD.',
        document: 'Formulation Development Report.pdf',
        tags: 'Formulation',
        version: 'Rev 2',
        remarks: 'Direct compression blend formula optimized.'
      },
      {
        id: 5,
        date: '06/20/2026',
        postedBy: 'Amit Patel',
        message: 'Analytical testing initiated for assay and degradation impurity HPLC method development.',
        document: 'Analytical Method Report.pdf',
        tags: 'Analytical',
        version: 'Rev 1',
        remarks: 'Method validation protocol submitted for QA review.'
      },
      {
        id: 6,
        date: '06/28/2026',
        postedBy: 'Neha Sharma',
        message: 'Tablet compression trial completed for the pilot development batch with uniform hardness and < 0.5% friability.',
        document: 'Manufacturing Process Record.pdf',
        tags: 'Manufacturing',
        version: 'Rev 2',
        remarks: 'Compression machine speed mapped between 30 and 45 rpm.'
      },
      {
        id: 7,
        date: '07/04/2026',
        postedBy: 'Vikram Malhotra',
        message: 'Initiated 3-month accelerated stability testing (40°C/75% RH) and controlled photostability stress testing.',
        document: 'Stability Protocol.pdf',
        tags: 'Stability',
        version: 'Rev 1',
        remarks: 'Chambers mapped and calibration verified.'
      },
      {
        id: 8,
        date: '07/11/2026',
        postedBy: 'Priya Nair',
        message: 'Completed eCTD Module 3 Drug Substance (3.2.S) documentation, CoA verification, and specification review.',
        document: 'eCTD Module 3 Draft.pdf',
        tags: 'Regulatory',
        version: 'Rev 1',
        remarks: 'Draft dossier ready for technical author sign-off.'
      },
      {
        id: 9,
        date: '07/18/2026',
        postedBy: 'Rajesh Kumar',
        message: 'Second vendor audit and CEP verification completed with clean quality assurance review.',
        document: 'Vendor Qualification Report.pdf',
        tags: 'API Assessment',
        version: 'Rev 1',
        remarks: 'Audit compliance certificate issued.'
      },
      {
        id: 10,
        date: '07/25/2026',
        postedBy: 'Anita Desai',
        message: 'Optimized aqueous film coating parameters to prevent tablet edge chipping during blister packaging trials.',
        document: 'Coating Parameter Study.pdf',
        tags: 'Formulation',
        version: 'Rev 1',
        remarks: 'Pan speed and inlet airflow optimized.'
      },
      {
        id: 11,
        date: '08/02/2026',
        postedBy: 'Amit Patel',
        message: 'Forced degradation stress study completed; demonstrated method specificity with no co-eluting peaks.',
        document: 'Degradation Study Report.pdf',
        tags: 'Analytical',
        version: 'Rev 1',
        remarks: 'Acid, base, peroxide, thermal stress validated.'
      },
      {
        id: 12,
        date: '08/09/2026',
        postedBy: 'Neha Sharma',
        message: 'Fluid bed drying LOD endpoint mapped within optimal 1.2% - 1.8% moisture range.',
        document: 'FBD Optimization Report.pdf',
        tags: 'Manufacturing',
        version: 'Rev 1',
        remarks: 'In-process moisture checks aligned.'
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
        code: this.projectCode || '2026/GEN/001',
        name: this.projectName || 'Generic Tablet Development'
      },
      queryParamsHandling: 'merge'
    });
  }
}
