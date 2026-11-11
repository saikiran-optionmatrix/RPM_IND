import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface StageColumnHeader {
  key: string;
  label: string;
  stageCode: string;
  stageNumber: number;
  subtitle: string;
  fullName: string;
  projectCount: number;
}

export interface StageRow {
  [key: string]: string;
}

@Component({
  selector: 'app-dashboard-stages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './dashboard-stages.component.html',
  styleUrl: './dashboard-stages.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardStagesComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  gatesSearchTerm: string = '';
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // 12 Stages strictly matching RpmStagesComponent
  readonly stageHeaders: StageColumnHeader[] = [
    { key: 's1', label: 'Stage 1', stageCode: 'S1', stageNumber: 1, subtitle: 'Business Case', fullName: 'Business Case Preparation by PMO Team', projectCount: 20 },
    { key: 's2', label: 'Stage 2', stageCode: 'S2', stageNumber: 2, subtitle: 'Product / Project In Initiation', fullName: 'Product / Project In Initiation - Kick-off & Charter Finalization', projectCount: 19 },
    { key: 's3', label: 'Stage 3', stageCode: 'S3', stageNumber: 3, subtitle: 'Development Procurement', fullName: 'Procurement of API, RM & Packaging materials - For Developmental studies.', projectCount: 18 },
    { key: 's4', label: 'Stage 4', stageCode: 'S4', stageNumber: 4, subtitle: 'POC Formulation', fullName: 'Formulation Development Phase 1: POC completion', projectCount: 17 },
    { key: 's5', label: 'Stage 5', stageCode: 'S5', stageNumber: 5, subtitle: 'EB Procurement', fullName: 'Procurement of API, Raw materials & Packaging materials - For Ebs', projectCount: 16 },
    { key: 's6', label: 'Stage 6', stageCode: 'S6', stageNumber: 6, subtitle: 'Pilot Bio Formulation', fullName: 'Formulation Development Phase 2: Pilot Bio', projectCount: 15 },
    { key: 's7', label: 'Stage 7', stageCode: 'S7', stageNumber: 7, subtitle: 'API Validation', fullName: 'API Method Validation / verification', projectCount: 14 },
    { key: 's8', label: 'Stage 8', stageCode: 'S8', stageNumber: 8, subtitle: 'FP Validation', fullName: 'FP method validation, FP specifications & STP', projectCount: 13 },
    { key: 's9', label: 'Stage 9', stageCode: 'S9', stageNumber: 9, subtitle: 'TTD Submission', fullName: 'TTD Submission', projectCount: 12 },
    { key: 's10', label: 'Stage 10', stageCode: 'S10', stageNumber: 10, subtitle: 'Exhibit Batches', fullName: 'Exhibit / Submission Batches execution', projectCount: 11 },
    { key: 's11', label: 'Stage 11', stageCode: 'S11', stageNumber: 11, subtitle: 'Pivotal BE', fullName: 'Pivotal BE studies', projectCount: 10 },
    { key: 's12', label: 'Stage 12', stageCode: 'S12', stageNumber: 12, subtitle: 'Dossier Filing', fullName: 'Dossier preparation and filing', projectCount: 9 }
  ];

  // Stage 1 to 12 Data Lists (Truncated for brevity in response, keep your original arrays here)
  readonly s1List = ["Dapagliflozin/Metformin Tablets 5/1000mg", "Sitagliptin/Metformin Tablets 50/500mg", "Liraglutide Injection 6mg/ml", "Semaglutide Injection 1.34mg/ml", "Dulaglutide Injection 1.5mg/0.5ml", "Empagliflozin/Linagliptin Tablets 10/5mg", "Sacubitril/Valsartan Tablets 97/103mg", "Spironolactone/Hydrochlorothiazide Tablets 25/25mg", "Montelukast/Levocetirizine Tablets 10/5mg", "Fluticasone Propionate Nasal Spray 50mcg", "Budesonide Inhalation Suspension 0.5mg/2ml", "Brimonidine Tartrate Ophthalmic Solution 0.15%", "Dorzolamide/Timolol Ophthalmic Solution 22.3/6.8mg/ml", "Bimatoprost Ophthalmic Solution 0.03%", "Travoprost Ophthalmic Solution 0.004%", "Pregabalin ER Tablets 82.5mg", "Gabapentin ER Tablets 600mg", "Mirogabalin Tablets 5mg", "Gliclazide MR Tablets 60mg", "Sitagliptin/Simvastatin Tablets 100/20mg"];
  readonly s2List = ["Empagliflozin Tablets 10mg", "Apixaban Tablets 5mg", "Dapagliflozin Tablets 10mg", "Sitagliptin Tablets 100mg", "Rivaroxaban Tablets 20mg", "Linagliptin Tablets 5mg", "Ticagrelor Tablets 90mg", "Vildagliptin Tablets 50mg", "Febuxostat Tablets 40mg", "Teneligliptin Tablets 20mg", "Canagliflozin Tablets 100mg", "Edoxaban Tablets 60mg", "Dabigatran Capsules 150mg", "Saxagliptin Tablets 5mg", "Lenalidomide Capsules 10mg", "Bortezomib Injection 3.5mg", "Palbociclib Capsules 125mg", "Dolutegravir Tablets 50mg", "Sofosbuvir Tablets 400mg"];
  readonly s3List = ["Atorvastatin Tablets 20mg", "Rosuvastatin Calcium Tablets 10mg", "Metformin ER Tablets 500mg", "Losartan Potassium Tablets 50mg", "Amlodipine Besylate Tablets 5mg", "Telmisartan Tablets 40mg", "Clopidogrel Tablets 75mg", "Pantoprazole Tablets 40mg", "Escitalopram Tablets 10mg", "Montelukast Tablets 10mg", "Duloxetine Capsules 30mg", "Pregabalin Capsules 75mg", "Valsartan Tablets 80mg", "Glimepiride Tablets 2mg", "Bisoprolol Fumarate Tablets 5mg", "Levetiracetam Tablets 500mg", "Aripiprazole Tablets 10mg", "Esomeprazole Capsules 40mg"];
  readonly s4List = ["Metoprolol Succinate ER Tablets 50mg", "Venlafaxine ER Capsules 75mg", "Tamsulosin ER Capsules 0.4mg", "Nifedipine ER Tablets 30mg", "Divalproex Sodium ER Tablets 500mg", "Quetiapine ER Tablets 300mg", "Oxybutynin ER Tablets 10mg", "Bupropion XL Tablets 150mg", "Diclofenac SR Tablets 100mg", "Trazodone ER Tablets 150mg", "Paliperidone ER Tablets 6mg", "Carvedilol Phosphate ER Capsules 20mg", "Tolterodine ER Capsules 4mg", "Methylphenidate ER Tablets 18mg", "Isosorbide Mononitrate ER Tablets 60mg", "Glipizide ER Tablets 10mg", "Niacin ER Tablets 500mg"];
  readonly s5List = ["Gabapentin Capsules 300mg", "Sertraline Tablets 50mg", "Amoxicillin Capsules 500mg", "Azithromycin Tablets 250mg", "Cefixime Tablets 200mg", "Ciprofloxacin Tablets 500mg", "Levofloxacin Tablets 500mg", "Doxycycline Capsules 100mg", "Fluconazole Capsules 150mg", "Itraconazole Capsules 100mg", "Ondansetron Tablets 4mg", "Domperidone Tablets 10mg", "Rosuvastatin/Ezetimibe Tablets 10/10mg", "Amlodipine/Telmisartan Tablets 5/40mg", "Metformin/Sitagliptin Tablets 500/50mg", "Salmeterol/Fluticasone Inhalation 25/125mcg"];
  readonly s6List = ["Budesonide/Formoterol Inhalation 160/4.5mcg", "Tiotropium Bromide Inhalation 18mcg", "Mometasone Nasal Spray 50mcg", "Latanoprost Ophthalmic Solution 0.005%", "Olopatadine Ophthalmic Solution 0.2%", "Bimatoprost/Timolol Solution 0.03/0.5%", "Travoprost/Timolol Solution 0.004/0.5%", "Fluorometholone Eye Drops 0.1%", "Moxifloxacin Eye Drops 0.5%", "Tobramycin/Dexamethasone Drops 0.3/0.1%", "Levofloxacin Infusion 500mg/100ml", "Linezolid Injection 2mg/ml", "Vancomycin Injection 1g", "Meropenem Injection 1g", "Piperacillin/Tazobactam 4.5g"];
  readonly s7List = ["Enoxaparin Sodium Injection 40mg/0.4ml", "Fondaparinux Sodium Injection 2.5mg/0.5ml", "Heparin Sodium Injection 5000 IU/ml", "Bivalirudin Injection 250mg", "Argatroban Injection 100mg/ml", "Iron Sucrose Injection 20mg/ml", "Ferric Carboxymaltose Injection 50mg/ml", "Erythropoietin Injection 4000 IU", "Darbepoetin Alfa Injection 25mcg", "Filgrastim Injection 300mcg", "Pegfilgrastim Injection 6mg", "Octreotide Acetate Injection 100mcg/ml", "Leuprolide Acetate Depot 3.75mg", "Goserelin Acetate Implant 3.6mg"];
  readonly s8List = ["Fulvestrant Injection 250mg/5ml", "Degarelix Injection 80mg", "Triptorelin Depot 3.75mg", "Teriparatide Injection 750mcg/3ml", "Denosumab Injection 60mg/ml", "Zoledronic Acid Infusion 5mg/100ml", "Ibandronate Sodium Injection 3mg/3ml", "Pamidronate Disodium 30mg", "Alendronate Sodium Tablets 70mg", "Risedronate Sodium Tablets 35mg", "Cinacalcet Tablets 30mg", "Sevelamer Carbonate Tablets 800mg", "Lanthanum Carbonate Tablets 500mg"];
  readonly s9List = ["Pazopanib Tablets 200mg", "Sunitinib Capsules 25mg", "Sorafenib Tablets 200mg", "Regorafenib Tablets 40mg", "Lenvatinib Capsules 10mg", "Cabozantinib Tablets 20mg", "Axitinib Tablets 5mg", "Erlotinib Tablets 100mg", "Gefitinib Tablets 250mg", "Afatinib Tablets 40mg", "Osimertinib Tablets 80mg", "Crizotinib Capsules 200mg"];
  readonly s10List = ["Ceritinib Capsules 150mg", "Alectinib Capsules 150mg", "Brigatinib Tablets 90mg", "Lorlatinib Tablets 25mg", "Dabrafenib Capsules 75mg", "Trametinib Tablets 2mg", "Vemurafenib Tablets 240mg", "Cobimetinib Tablets 20mg", "Encorafenib Capsules 75mg", "Binimetinib Tablets 15mg", "Ibrutinib Capsules 140mg"];
  readonly s11List = ["Acalabrutinib Capsules 100mg", "Zanubrutinib Capsules 80mg", "Venetoclax Tablets 100mg", "Idelalisib Tablets 150mg", "Duvelisib Capsules 25mg", "Copanlisib Injection 60mg", "Alpelisib Tablets 150mg", "Everolimus Tablets 5mg", "Temsirolimus Infusion 25mg/ml", "Sirolimus Tablets 1mg"];
  readonly s12List = ["Tacrolimus Capsules 1mg", "Cyclosporine Capsules 50mg", "Mycophenolate Mofetil Tablets 500mg", "Mycophenolic Acid Tablets 360mg", "Azathioprine Tablets 50mg", "Methotrexate Tablets 10mg", "Leflunomide Tablets 20mg", "Sulfasalazine Tablets 500mg", "Hydroxychloroquine Sulfate 200mg"];

  stageRows: StageRow[] = [];

  constructor() { }

  ngOnInit(): void {
    // Generate 20 rows dynamically based on the highest length
    for (let i = 0; i < 20; i++) {
      this.stageRows.push({
        s1: this.s1List[i] || '', s2: this.s2List[i] || '', s3: this.s3List[i] || '', s4: this.s4List[i] || '',
        s5: this.s5List[i] || '', s6: this.s6List[i] || '', s7: this.s7List[i] || '', s8: this.s8List[i] || '',
        s9: this.s9List[i] || '', s10: this.s10List[i] || '', s11: this.s11List[i] || '', s12: this.s12List[i] || ''
      });
    }
  }

  ngAfterViewInit(): void {
    this.updateScrollButtons();
  }

  scrollLeft(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.tableContainer) {
      this.tableContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  scrollTable(direction: 'left' | 'right', amount: number = 380): void {
    if (!this.tableContainer?.nativeElement) return;
    const container = this.tableContainer.nativeElement;
    const delta = direction === 'left' ? -amount : amount;
    container.scrollBy({ left: delta, behavior: 'smooth' });
    setTimeout(() => this.updateScrollButtons(), 350);
  }

  onTableScroll(): void {
    this.updateScrollButtons();
  }

  private updateScrollButtons(): void {
    if (!this.tableContainer?.nativeElement) return;
    const el = this.tableContainer.nativeElement;
    // Buffer of 5px to prevent floating point glitches
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
  }

  isRed(key: string, rowIndex: number): boolean {
    if (key === 's1' || key === 's2') return false;

    const redIndexesMap: { [key: string]: number[] } = {
      s3: [2, 7, 13], s4: [1, 6, 11], s5: [3, 8, 14], s6: [2, 9],
      s7: [1, 5, 10], s8: [3, 7], s9: [2, 6], s10: [1, 8],
      s11: [3, 7], s12: [2, 5]
    };
    return redIndexesMap[key]?.includes(rowIndex) || false;
  }

  isMatching(val: string): boolean {
    if (!this.gatesSearchTerm?.trim() || !val) return false;
    return val.toLowerCase().includes(this.gatesSearchTerm.toLowerCase());
  }

  highlight(text: string): string {
    if (!this.gatesSearchTerm?.trim() || !text) return text;
    const pattern = this.gatesSearchTerm.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<span class="highlight-text">$1</span>');
  }
}
