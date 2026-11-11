import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

import { UploadDocumentsComponent } from './upload-documents/upload-documents.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';

export interface NoteData {
  actions: string;
  date: string;
  postedBy: string;
  message: string;
  document: string;
  tags: string;
  updatedDate?: string;
  updatedBy?: string;
  historyCount?: number;
}

@Component({
  selector: 'app-project-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  templateUrl: './project-notes.component.html',
  styleUrl: './project-notes.component.scss'
})
export class ProjectNotesComponent implements OnInit {
  @ViewChild('editNoteDialog') editNoteDialog!: TemplateRef<any>;

  displayedColumns: string[] = ['actions', 'date', 'postedBy', 'message', 'document', 'tags', 'updated', 'updatedBy', 'history'];
  notesList: NoteData[] = [];
  paginatedNotes: NoteData[] = [];

  readonly historySequence: number[] = [3, 4, 2, 5, 1, 3, 8, 5, 2, 4, 6, 3, 7, 2, 5, 4];

  getHistoryCount(index: number): number {
    return this.historySequence[index % this.historySequence.length];
  }

  pageSize: number = 10;
  currentPage: number = 0;

  selectedTag: string = '';
  noteText: string = '';
  attachedDocument: string = '';
  availableTags: string[] = [];

  editingNote: NoteData | null = null;
  editSelectedTag: string = '';
  editNoteText: string = '';
  editDialogRef: any = null;

  projectName: string = 'Generic Tablet Development';
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Notes';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
    this.loadTags();
    this.loadNotes();
  }

  loadTags(): void {
    const stored = localStorage.getItem('rpm_tags_v2');
    let tagsList = [];
    if (stored) {
      tagsList = JSON.parse(stored);
    } else {
      tagsList = [
        { id: 1, name: 'API Assessment', isActive: true, description: 'Notes regarding API evaluation and sourcing' },
        { id: 2, name: 'Formulation', isActive: true, description: 'Notes regarding formulation trials and excipients' },
        { id: 3, name: 'Analytical', isActive: true, description: 'Notes regarding assay and dissolution testing' },
        { id: 4, name: 'Manufacturing', isActive: true, description: 'Notes regarding compression and batch processing' },
        { id: 5, name: 'Stability', isActive: true, description: 'Notes regarding stability study evaluations' },
        { id: 6, name: 'Regulatory', isActive: true, description: 'Notes regarding dossier preparation and filings' }
      ];
      localStorage.setItem('rpm_tags_v2', JSON.stringify(tagsList));
    }
    this.availableTags = tagsList.filter((t: any) => t.isActive).map((t: any) => t.name);
    if (this.availableTags.length > 0 && !this.selectedTag) {
      this.selectedTag = this.availableTags[0];
    }
  }

  loadNotes(): void {
    const stored = localStorage.getItem('rpm_notes_v3');
    if (stored) {
      this.notesList = JSON.parse(stored);
    } else {
      this.notesList = [
        {
          actions: '',
          date: '06/05/2026',
          postedBy: 'Rajesh Kumar',
          message: 'API evaluation completed; supplier qualification is under review with 2 qualified DMF sources.',
          document: 'API Specification.pdf',
          tags: 'API Assessment'
        },
        {
          actions: '',
          date: '06/12/2026',
          postedBy: 'Anita Desai',
          message: 'Formulation trial completed with selected excipients; dissolution similarity f2 > 65 observed against RLD.',
          document: 'Formulation Development Report.pdf',
          tags: 'Formulation'
        },
        {
          actions: '',
          date: '06/20/2026',
          postedBy: 'Amit Patel',
          message: 'Analytical testing initiated for assay and degradation impurity HPLC method development.',
          document: 'Analytical Method Report.pdf',
          tags: 'Analytical'
        },
        {
          actions: '',
          date: '06/28/2026',
          postedBy: 'Neha Sharma',
          message: 'Tablet compression trial completed for the pilot development batch with uniform hardness and < 0.5% friability.',
          document: 'Manufacturing Process Record.pdf',
          tags: 'Manufacturing'
        },
        {
          actions: '',
          date: '07/04/2026',
          postedBy: 'Vikram Malhotra',
          message: 'Initiated 3-month accelerated stability testing (40°C/75% RH) and controlled photostability stress testing.',
          document: 'Stability Protocol.pdf',
          tags: 'Stability'
        },
        {
          actions: '',
          date: '07/11/2026',
          postedBy: 'Priya Nair',
          message: 'Completed eCTD Module 3 Drug Substance (3.2.S) documentation, CoA verification, and specification review.',
          document: 'eCTD Module 3 Draft.pdf',
          tags: 'Regulatory'
        },
        {
          actions: '',
          date: '07/18/2026',
          postedBy: 'Rajesh Kumar',
          message: 'Second vendor audit and CEP verification completed with clean quality assurance review.',
          document: 'Vendor Qualification Report.pdf',
          tags: 'API Assessment'
        },
        {
          actions: '',
          date: '07/25/2026',
          postedBy: 'Anita Desai',
          message: 'Optimized aqueous film coating parameters to prevent tablet edge chipping during blister packaging trials.',
          document: 'Coating Parameter Study.pdf',
          tags: 'Formulation'
        },
        {
          actions: '',
          date: '08/02/2026',
          postedBy: 'Amit Patel',
          message: 'Forced degradation stress study completed; demonstrated method specificity with no co-eluting peaks.',
          document: 'Degradation Study Report.pdf',
          tags: 'Analytical'
        },
        {
          actions: '',
          date: '08/09/2026',
          postedBy: 'Neha Sharma',
          message: 'Fluid bed drying LOD endpoint mapped within optimal 1.2% - 1.8% moisture range.',
          document: 'FBD Optimization Report.pdf',
          tags: 'Manufacturing'
        },
        {
          actions: '',
          date: '08/16/2026',
          postedBy: 'Vikram Malhotra',
          message: '1-Month accelerated stability testing shows 99.8% active potency retention and no out-of-spec degradants.',
          document: 'Stability Interim Readout.pdf',
          tags: 'Stability'
        },
        {
          actions: '',
          date: '08/23/2026',
          postedBy: 'Priya Nair',
          message: 'Preliminary QA gap analysis conducted for regulatory submission readiness dossier.',
          document: 'Regulatory Gap Analysis.pdf',
          tags: 'Regulatory'
        }
      ];
      localStorage.setItem('rpm_notes_v3', JSON.stringify(this.notesList));
    }
    const defaultUpdaters = ['Dr. Sarah Jenkins', 'Rajesh Kumar', 'Anita Desai', 'Amit Patel', 'Neha Sharma', 'Vikram Malhotra', 'Priya Nair'];
    const defaultDates = ['2026-06-05', '2026-06-12', '2026-06-20', '2026-06-28', '2026-07-04', '2026-07-11', '2026-07-18', '2026-07-25', '2026-08-02', '2026-08-09', '2026-08-16', '2026-08-23'];
    this.notesList.forEach((n, idx) => {
      if (!n.historyCount) {
        n.historyCount = this.getHistoryCount(idx);
      }
      if (!n.updatedDate) {
        n.updatedDate = defaultDates[idx % defaultDates.length];
      }
      if (!n.updatedBy) {
        n.updatedBy = n.postedBy || defaultUpdaters[idx % defaultUpdaters.length];
      }
    });
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedNotes = this.notesList.slice(startIndex, endIndex);
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  addNote(): void {
    if (!this.selectedTag || !this.noteText.trim()) {
      return;
    }
    const now = new Date().toISOString().split('T')[0];
    const newNote: NoteData = {
      actions: '',
      date: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      postedBy: 'Dr. Sarah Jenkins',
      message: this.noteText.trim(),
      document: this.attachedDocument || '',
      tags: this.selectedTag,
      updatedDate: now,
      updatedBy: 'Dr. Sarah Jenkins'
    };
    this.notesList = [newNote, ...this.notesList];
    localStorage.setItem('rpm_notes_v3', JSON.stringify(this.notesList));
    this.clearForm();
    this.updatePagination();
  }

  editNote(note: NoteData): void {
    this.editingNote = note;
    this.editSelectedTag = note.tags;
    this.editNoteText = note.message;
    this.editDialogRef = this.dialog.open(this.editNoteDialog, {
      width: '500px',
      maxWidth: '95vw'
    });
  }

  closeEditDialog(): void {
    if (this.editDialogRef) {
      this.editDialogRef.close();
      this.editDialogRef = null;
    }
    this.editingNote = null;
  }

  saveEditDialog(): void {
    if (!this.editSelectedTag || !this.editNoteText.trim()) {
      return;
    }
    if (this.editingNote) {
      this.editingNote.tags = this.editSelectedTag;
      this.editingNote.message = this.editNoteText.trim();
      this.editingNote.updatedDate = new Date().toISOString().split('T')[0];
      this.editingNote.updatedBy = 'Dr. Sarah Jenkins';
      localStorage.setItem('rpm_notes_v3', JSON.stringify(this.notesList));
      this.updatePagination();
    }
    this.closeEditDialog();
  }

  deleteNote(note: NoteData): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Delete Confirmation',
        content: 'Are you sure you want to delete this note?'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.editingNote === note) {
          this.closeEditDialog();
        }
        this.notesList = this.notesList.filter(n => n !== note);
        localStorage.setItem('rpm_notes_v3', JSON.stringify(this.notesList));
        this.updatePagination();
      }
    });
  }

  clearForm(): void {
    this.selectedTag = this.availableTags[0] || '';
    this.noteText = '';
    this.attachedDocument = '';
  }

  viewPdf(fileName: string): void {
    alert('Viewing document: ' + fileName);
  }

  downloadPdf(fileName: string): void {
    alert('Downloading document: ' + fileName);
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || "2026/GEN/001", name: this.projectName || "Generic Tablet Development" }
    });
  }

  uploaddoc(value?: any): void {
    const dialogRef = this.dialog.open(UploadDocumentsComponent, {
      data: value,
      width: '500px',
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result && result.fileName) {
        this.attachedDocument = result.fileName;
      }
    });
  }

  openHistory(note?: NoteData, index?: number): void {
    const historyCount = note?.historyCount || (index !== undefined ? this.getHistoryCount(index) : 3);
    this.router.navigate(['/projects/dashboard/notes/history'], {
      queryParams: {
        date: note?.date || '',
        postedBy: note?.postedBy || '',
        description: note?.message || '',
        document: note?.document || '',
        tags: note?.tags || '',
        historyCount: historyCount,
        projectName: this.projectName,
        projectCode: this.projectCode
      },
      queryParamsHandling: 'merge'
    });
  }
}
