import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface GateColumnHeader {
  key: string;
  label: string;
  subtitle: string;
}

export interface GateRow {
  [key: string]: string;
}

@Component({
  selector: 'app-dashboard-gates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-gates.component.html',
  styleUrl: './dashboard-gates.component.scss',
  // Required so the dynamically injected 'highlight-text' class can be styled in your SCSS
  encapsulation: ViewEncapsulation.None
})
export class DashboardGatesComponent implements OnInit {

  gatesSearchTerm: string = '';

  readonly gateHeaders: GateColumnHeader[] = [
    { key: 'g1', label: 'Gate 1', subtitle: 'Idea Screening' },
    { key: 'g2', label: 'Gate 2', subtitle: 'Molecule Selection' },
    { key: 'g3', label: 'Gate 3', subtitle: 'Feasibility & FTO' },
    { key: 'g4', label: 'Gate 4', subtitle: 'Formulation Dev' },
    { key: 'g5', label: 'Gate 5', subtitle: 'Exhibit & BE' }
  ];

  readonly g1List: string[] = [
    "Dapagliflozin/Metformin Tablets 5/1000mg",
    "Sitagliptin/Metformin Tablets 50/500mg",
    "Liraglutide Injection 6mg/ml",
    "Semaglutide Injection 1.34mg/ml",
    "Dulaglutide Injection 1.5mg/0.5ml",
    "Empagliflozin/Linagliptin Tablets 10/5mg",
    "Sacubitril/Valsartan Tablets 97/103mg",
    "Spironolactone/Hydrochlorothiazide Tablets 25/25mg",
    "Montelukast/Levocetirizine Tablets 10/5mg",
    "Fluticasone Propionate Nasal Spray 50mcg",
    "Budesonide Inhalation Suspension 0.5mg/2ml",
    "Brimonidine Tartrate Ophthalmic Solution 0.15%",
    "Dorzolamide/Timolol Ophthalmic Solution 22.3/6.8mg/ml",
    "Bimatoprost Ophthalmic Solution 0.03%",
    "Travoprost Ophthalmic Solution 0.004%",
    "Pregabalin ER Tablets 82.5mg",
    "Gabapentin ER Tablets 600mg",
    "Mirogabalin Tablets 5mg",
    "Gliclazide MR Tablets 60mg",
    "Sitagliptin/Simvastatin Tablets 100/20mg"
  ];

  readonly g2List: string[] = [
    "Empagliflozin Tablets 10mg",
    "Apixaban Tablets 5mg",
    "Dapagliflozin Tablets 10mg",
    "Sitagliptin Tablets 100mg",
    "Rivaroxaban Tablets 20mg",
    "Linagliptin Tablets 5mg",
    "Ticagrelor Tablets 90mg",
    "Vildagliptin Tablets 50mg",
    "Febuxostat Tablets 40mg",
    "Teneligliptin Tablets 20mg",
    "Canagliflozin Tablets 100mg",
    "Edoxaban Tablets 60mg",
  ];

  readonly g3List: string[] = [
    "Atorvastatin Tablets 20mg",
    "Rosuvastatin Calcium Tablets 10mg",
    "Metformin ER Tablets 500mg",
    "Losartan Potassium Tablets 50mg",
    "Amlodipine Besylate Tablets 5mg",
    "Telmisartan Tablets 40mg",
    "Clopidogrel Tablets 75mg",
    "Pantoprazole Tablets 40mg",
    "Escitalopram Tablets 10mg",
  ];

  readonly g4List: string[] = [
    "Metoprolol Succinate ER Tablets 50mg",
    "Venlafaxine ER Capsules 75mg",
    "Tamsulosin ER Capsules 0.4mg",
    "Nifedipine ER Tablets 30mg",
  ];

  readonly g5List: string[] = [
    "Gabapentin Capsules 300mg",
    "Sertraline Tablets 50mg",
    "Amoxicillin Capsules 500mg",
    "Azithromycin Tablets 250mg",
    "Cefixime Tablets 200mg",
    "Ciprofloxacin Tablets 500mg",
    "Levofloxacin Tablets 500mg",
  ];

  gateRows: GateRow[] = [];

  constructor() { }

  ngOnInit(): void {
    // Dynamically calculate the max length to prevent hardcoding row limits
    const maxLength = Math.max(
      this.g1List.length,
      this.g2List.length,
      this.g3List.length,
      this.g4List.length,
      this.g5List.length
    );

    this.gateRows = Array.from({ length: maxLength }, (_, i) => ({
      g1: this.g1List[i] || '',
      g2: this.g2List[i] || '',
      g3: this.g3List[i] || '',
      g4: this.g4List[i] || '',
      g5: this.g5List[i] || ''
    }));
  }

  isMatching(val: string): boolean {
    if (!this.gatesSearchTerm?.trim() || !val) return false;
    return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
  }

  highlight(text: string): string {
    if (!this.gatesSearchTerm?.trim() || !text) {
      return text;
    }

    // Safely escape special regex characters
    const pattern = this.gatesSearchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${pattern})`, 'gi');

    // Use $1 to preserve the original casing of the matched text
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
}
