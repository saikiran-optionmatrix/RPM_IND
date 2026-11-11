import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DocumentItem {
  id?: number | string;
  title: string;
  file?: File;
  uploadedDate?: string;
  size?: string;
  url?: string;
}

@Component({
  selector: 'app-documents-pop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './documents-pop.component.html',
  styleUrl: './documents-pop.component.scss',
})
export class DocumentsPopComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  dialogTitle: string = 'Upload Documents';
  isDragging: boolean = false;
  docTitle: string = '';

  documentsList: DocumentItem[] = [];

  constructor(
    public dialogRef: MatDialogRef<DocumentsPopComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.title || this.data?.dialogTitle) {
      this.dialogTitle = this.data.title || this.data.dialogTitle;
    }

    if (this.data?.documents && Array.isArray(this.data.documents)) {
      this.documentsList = this.data.documents.map((d: any, idx: number) => {
        if (typeof d === 'string') {
          return { id: idx + 1, title: d };
        }
        return { ...d };
      });
    } else {
      this.documentsList = [
        { id: 1, title: 'Formulation_Protocol_Specification.pdf', url: 'sample.pdf' },
        { id: 2, title: 'Analytical_Method_Validation_Report.pdf', url: 'sample.pdf' },
        { id: 3, title: 'Stability_Testing_Summary_Q1.pdf', url: 'sample.pdf' }
      ];
    }
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.addFiles(Array.from(files));
      event.target.value = '';
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  addDocumentByTitle(): void {
    if (this.docTitle && this.docTitle.trim()) {
      let title = this.docTitle.trim();
      if (!title.toLowerCase().endsWith('.pdf')) {
        title += '.pdf';
      }
      this.documentsList.unshift({
        id: Date.now(),
        title: title,
        url: 'sample.pdf',
        uploadedDate: new Date().toLocaleDateString()
      });
      this.docTitle = '';
    }
  }

  addFiles(files: File[]): void {
    files.forEach((file, index) => {
      let title = file.name;
      if (this.docTitle && this.docTitle.trim()) {
        const customTitle = this.docTitle.trim();
        title = index === 0
          ? (customTitle.toLowerCase().endsWith('.pdf') ? customTitle : `${customTitle}.pdf`)
          : `${customTitle} (${index + 1}).pdf`;
      }
      this.documentsList.unshift({
        id: Date.now() + index,
        title: title,
        file: file,
        size: this.formatBytes(file.size),
        uploadedDate: new Date().toLocaleDateString()
      });
    });
    this.docTitle = '';
  }

  deleteDocument(index: number): void {
    this.documentsList.splice(index, 1);
  }

  getDocumentUrl(row: DocumentItem): string {
    if (row.url) {
      return row.url;
    }
    if (row.file) {
      try {
        return URL.createObjectURL(row.file);
      } catch {
        return 'sample.pdf';
      }
    }
    return 'sample.pdf';
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      documents: this.documentsList
    });
  }

  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
