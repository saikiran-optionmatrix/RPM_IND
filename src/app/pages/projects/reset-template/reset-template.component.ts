import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './reset-template.component.html',
  styleUrl: './reset-template.component.scss',
})
export class ResetTemplateComponent implements OnInit {
  projectName = '';
  selectedTemplate = '';

  readonly templatesList: string[] = [
    'Generic Tablet Development',
    'Generic API Process Development',
    'Complex Injectable Development',
    'Generic API Development',
    'Generic Injectable Formulation',
  ];

  constructor(
    private dialogRef: MatDialogRef<ResetTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.projectName =
        this.data.projectName ||
        this.data.project?.productName ||
        this.data.project?.projectCode ||
        'Selected Project';
      this.selectedTemplate =
        this.data.currentTemplate ||
        this.data.project?.template ||
        'Generic Tablet Development';
    } else {
      this.selectedTemplate = 'Generic Tablet Development';
    }
  }

  save(): void {
    this.dialogRef.close({
      confirmed: true,
      selectedTemplate: this.selectedTemplate,
      project: this.data?.project,
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
