import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface TimesheetRow {
  project?: string;
  module: string;
  task: string;
  hours: number;
  description: string;
  searchProjectText?: string;
  searchModuleText?: string;
  searchText?: string;
}

@Component({
  selector: 'app-hours-timesheet',
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
  templateUrl: './hours-timesheet.component.html',
  styleUrl: './hours-timesheet.component.scss'
})
export class HoursTimesheetComponent implements OnInit {

  isEditMode = false;
  dateStr = '';
  name: string | null = null;

  employeeOptions: string[] = [
    'Ravi Sharma',
    'Priya Singh',
    'Amit Kumar',
    'Neha Sharma',
    'Vikram Joshi',
    'Rajesh Kumar',
    'Anita Desai',
    'Priya Reddy',
    'Amit Patel',
    'Suresh Naidu',
    'Arun Joseph',
    'Lakshmi Devi',
    'Deepa Nair'
  ];
  nameSearchTerm = '';

  get filteredEmployeeOptions(): string[] {
    if (!this.nameSearchTerm || !this.nameSearchTerm.trim()) {
      return this.employeeOptions;
    }
    const term = this.nameSearchTerm.toLowerCase().trim();
    return this.employeeOptions.filter(e => e.toLowerCase().includes(term));
  }

  rows: TimesheetRow[] = [];

  availableProjects: string[] = [
    '2026/RD/001 - Abiraterone Acetate Film Coated',
    '2026/RD/002 - Apremilast Tablets',
    '2026/RD/003 - Brivaracetam Film Coated Tablets',
    '2026/RD/004 - Cabozantinib Tablets',
    '2026/RD/005 - Dapagliflozin Propanediol Tablets',
    '2026/RD/006 - Empagliflozin Tablets',
    '2026/RD/007 - Fimasartan Potassium Tablets',
    '2026/RD/008 - Macitentan Film Coated Tablets',
    '2026/RD/009 - Niraparib Tosylate Capsules',
    '2026/RD/010 - Olaparib Film Coated Tablets',
    '2026/GEN/001 - Generic Tablet Development'
  ];

  availableModules: string[] = [
    'Product Selection',
    'Pre-Formulation',
    'Formulation Development',
    'Prototype & Optimization',
    'Analytical Development',
    'Scale-Up',
    'Testing & Validation',
    'BA/BE & Stability',
    'Regulatory Submission',
    'Regulatory Approval',
    'Manufacturing Readiness',
    'Commercialization',
    'General'
  ];

  availableTasks = [
    'Reference Product Characterization',
    'API Characterization',
    'API–Excipient Compatibility',
    'Excipient Screening',
    'Prototype Formulation Design',
    'Laboratory Prototype Batch',
    'Dissolution Testing',
    'Analytical Method Development',
    'Formulation Optimization',
    'Scale-Up & Pilot Batch',
    'Stability Study',
    'Bioequivalence Readiness',
    'Regulatory Dossier Preparation',
    'Regulatory Review',
    'Commercial Manufacturing Readiness',
    'Launch Readiness',
    'Define product & technical specifications',
    'Identify raw material requirements',
    'Estimate target production volume',
    'Initial BOM & labor cost estimation'
  ];

  constructor(
    public dialogRef: MatDialogRef<HoursTimesheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.name = this.data.name || null;
      if (this.data.dateObj) {
        const d = new Date(this.data.dateObj);
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const yyyy = d.getFullYear();
        this.dateStr = `${yyyy}-${mm}-${dd}`;
      }
      if (this.data.tasksList && this.data.tasksList.length > 0) {
        this.rows = this.data.tasksList.map((t: any) => {
          if (t.project && !this.availableProjects.includes(t.project)) {
            this.availableProjects.push(t.project);
          }
          if (t.module && !this.availableModules.includes(t.module)) {
            this.availableModules.push(t.module);
          }
          return {
            project: t.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
            module: t.module || 'General',
            task: t.task || '',
            hours: t.hours || 0,
            description: t.description || ''
          };
        });
      } else {
        if (this.data.project && !this.availableProjects.includes(this.data.project)) {
          this.availableProjects.push(this.data.project);
        }
        if (this.data.module && !this.availableModules.includes(this.data.module)) {
          this.availableModules.push(this.data.module);
        }
        this.rows = [
          {
            project: this.data.project || '2026/RD/001 - Abiraterone Acetate Film Coated',
            module: this.data.module || 'General',
            task: this.data.task || '',
            hours: this.data.hours || 0,
            description: this.data.description || ''
          }
        ];
      }
    } else {
      this.isEditMode = false;
      const today = new Date();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.dateStr = `${today.getFullYear()}-${mm}-${dd}`;
      this.rows = [
        { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'General', task: '', hours: 0, description: '' }
      ];
    }
  }

  addRow(): void {
    this.rows.push({ project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'General', task: '', hours: 0, description: '' });
  }

  deleteRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.splice(index, 1);
    } else {
      this.rows[0] = { project: '2026/RD/001 - Abiraterone Acetate Film Coated', module: 'General', task: '', hours: 0, description: '' };
    }
  }

  getFilteredProjects(searchText?: string): string[] {
    if (!searchText) {
      return this.availableProjects;
    }
    const term = searchText.toLowerCase();
    return this.availableProjects.filter(p => p.toLowerCase().includes(term));
  }

  getFilteredModules(searchText?: string): string[] {
    if (!searchText) {
      return this.availableModules;
    }
    const term = searchText.toLowerCase();
    return this.availableModules.filter(m => m.toLowerCase().includes(term));
  }

  getFilteredTasks(searchText?: string): string[] {
    if (!searchText) {
      return this.availableTasks;
    }
    const term = searchText.toLowerCase();
    return this.availableTasks.filter(t => t.toLowerCase().includes(term));
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      dateObj: this.dateStr ? new Date(this.dateStr + 'T00:00:00') : new Date(),
      name: this.name,
      rows: this.rows
    });
  }
}
