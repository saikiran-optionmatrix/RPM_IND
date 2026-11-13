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

  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
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
    const stored = localStorage.getItem('rpm_ind_tags_v1');
    let tagsList = [];
    if (stored) {
      tagsList = JSON.parse(stored);
    } else {
      tagsList = [
        { id: 1, name: 'URS & Feasibility', isActive: true, description: 'Notes regarding URS scope, line capacity, and ROI' },
        { id: 2, name: 'CAD & Mechanical', isActive: true, description: 'Notes regarding 3D CAD, structural FEA, and GD&T tolerances' },
        { id: 3, name: 'Controls & PLC', isActive: true, description: 'Notes regarding PLC, SCADA telemetry, and safety interlocks' },
        { id: 4, name: 'Fabrication & FAT', isActive: true, description: 'Notes regarding prototype tooling, CMM metrology, and OEM FAT' },
        { id: 5, name: 'Site & Rigging', isActive: true, description: 'Notes regarding plant foundation, utilities, and equipment alignment' },
        { id: 6, name: 'SAT & OQ Handover', isActive: true, description: 'Notes regarding commissioning endurance runs and CMMS PM handover' }
      ];
      localStorage.setItem('rpm_ind_tags_v1', JSON.stringify(tagsList));
    }
    this.availableTags = tagsList.filter((t: any) => t.isActive).map((t: any) => t.name);
    if (this.availableTags.length > 0 && !this.selectedTag) {
      this.selectedTag = this.availableTags[0];
    }
  }

  loadNotes(): void {
    const stored = localStorage.getItem('rpm_ind_notes_v1');
    if (stored) {
      this.notesList = JSON.parse(stored);
    } else {
      this.notesList = [
        {
          actions: '',
          date: '06/05/2026',
          postedBy: 'Rajesh Kumar',
          message: 'Line throughput benchmark completed; URS target of 120 units/hr approved across two primary CNC bays.',
          document: 'URS Baseline Specification.pdf',
          tags: 'URS & Feasibility'
        },
        {
          actions: '',
          date: '06/12/2026',
          postedBy: 'Anita Desai',
          message: 'Gantry structural FEA completed with 2.4x safety factor and gusset stiffeners added for spindle harmonic damping.',
          document: 'Structural FEA Analysis Report.pdf',
          tags: 'CAD & Mechanical'
        },
        {
          actions: '',
          date: '06/20/2026',
          postedBy: 'Priya Reddy',
          message: 'PLC safety circuit EPLAN schematics updated; dual-channel E-stop and light curtain PLd validation verified.',
          document: 'PLC Safety Interlock Spec.pdf',
          tags: 'Controls & PLC'
        },
        {
          actions: '',
          date: '06/28/2026',
          postedBy: 'Suresh Naidu',
          message: 'Prototype fixture endurance cycling completed across 5,000 clamp cycles with zero dimensional repeatability drift.',
          document: 'Prototype Tooling Trial Log.pdf',
          tags: 'Fabrication & FAT'
        },
        {
          actions: '',
          date: '07/04/2026',
          postedBy: 'Arun Joseph',
          message: 'Bay 2 reinforced concrete foundation cured to 4,500 psi; 480V substation feeder and chilled water manifold tested.',
          document: 'Foundation & Utility Audit.pdf',
          tags: 'Site & Rigging'
        },
        {
          actions: '',
          date: '07/11/2026',
          postedBy: 'Ananya Rao',
          message: 'Completed As-Built CAD package, CMMS preventive maintenance schedule upload, and operator LOTO SOP sign-off.',
          document: 'Operations TTD Dossier Draft.pdf',
          tags: 'SAT & OQ Handover'
        },
        {
          actions: '',
          date: '07/18/2026',
          postedBy: 'Rajesh Kumar',
          message: 'Backup Japanese servo-drive vendor ISO 9001 quality audit and 24-hour critical spares SLA finalized.',
          document: 'OEM Supplier Audit Report.pdf',
          tags: 'URS & Feasibility'
        },
        {
          actions: '',
          date: '07/25/2026',
          postedBy: 'Anita Desai',
          message: 'Updated GD&T tolerance stack-up to +/- 0.015 mm on rotary indexer bed mounting interface.',
          document: 'GDT Tolerance StackUp Rev2.pdf',
          tags: 'CAD & Mechanical'
        },
        {
          actions: '',
          date: '08/02/2026',
          postedBy: 'Amit Patel',
          message: 'OPC-UA SCADA edge gateway stress test passed; 1,200 high-frequency spindle telemetry tags verified < 10 ms.',
          document: 'SCADA Telemetry Stress Log.pdf',
          tags: 'Controls & PLC'
        },
        {
          actions: '',
          date: '08/09/2026',
          postedBy: 'Deepa Nair',
          message: 'OEM Factory Acceptance Test (FAT) completed with acoustic enclosure measuring 75.8 dBA (< 78 dBA limit).',
          document: 'OEM FAT Witness Report.pdf',
          tags: 'Fabrication & FAT'
        },
        {
          actions: '',
          date: '08/16/2026',
          postedBy: 'Arun Joseph',
          message: 'Optical laser bed leveling completed along Bay 2 main rail within 0.008 mm/300 mm squareness tolerance.',
          document: 'Laser Alignment Readout.pdf',
          tags: 'Site & Rigging'
        },
        {
          actions: '',
          date: '08/23/2026',
          postedBy: 'Lakshmi Devi',
          message: 'Pre-SAT EHS machine guarding walkthrough cleared with zero open Class-A safety punch items.',
          document: 'EHS Safety Clearance Audit.pdf',
          tags: 'SAT & OQ Handover'
        }
      ];
      localStorage.setItem('rpm_ind_notes_v1', JSON.stringify(this.notesList));
    }
    const defaultUpdaters = ['Ananya Rao', 'Rajesh Kumar', 'Anita Desai', 'Amit Patel', 'Priya Reddy', 'Suresh Naidu', 'Deepa Nair'];
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
      postedBy: 'Ananya Rao',
      message: this.noteText.trim(),
      document: this.attachedDocument || '',
      tags: this.selectedTag,
      updatedDate: now,
      updatedBy: 'Ananya Rao'
    };
    this.notesList = [newNote, ...this.notesList];
    localStorage.setItem('rpm_ind_notes_v1', JSON.stringify(this.notesList));
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
      this.editingNote.updatedBy = 'Ananya Rao';
      localStorage.setItem('rpm_ind_notes_v1', JSON.stringify(this.notesList));
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
        localStorage.setItem('rpm_ind_notes_v1', JSON.stringify(this.notesList));
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
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
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
