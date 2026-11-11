import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-document',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './add-document.component.html',
  styleUrl: './add-document.component.scss'
})
export class AddDocumentComponent implements OnInit {
  isEditMode: boolean = false;

  documentType: string = '';
  documentTitle: string = '';
  category: string = '';
  context: string = '';
  remarks: string = '';
  pdfFileName: string | null = null;
  isDragging: boolean = false;

  documentTypes: string[] = [
    'Specification',
    'Formulation',
    'Analytical',
    'Manufacturing',
    'Stability',
    'Regulatory',
    'Clinical',
    'Quality',
    'Validation',
    'Other'
  ];

  constructor(
    public dialogRef: MatDialogRef<AddDocumentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.documentType = this.data.documentType || '';
      this.documentTitle = this.data.documentTitle || '';
      this.category = this.data.category || '';
      this.context = this.data.context || this.data.description || '';
      this.remarks = this.data.remarks || '';
      this.pdfFileName = this.data.uploadFile === 'View' ? (this.data.documentTitle ? this.data.documentTitle + '.pdf' : 'document.pdf') : (this.data.uploadFile || null);
    } else {
      this.isEditMode = false;
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.pdfFileName = file.name;
    }
  }

  onPdfSelected(event: any): void {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.pdfFileName = file.name;
    }
  }

  removePdf(): void {
    this.pdfFileName = null;
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      documentType: this.documentType,
      documentTitle: this.documentTitle,
      category: this.category,
      context: this.context,
      description: this.context,
      remarks: this.remarks,
      uploadFile: this.pdfFileName || 'View'
    });
  }
}
