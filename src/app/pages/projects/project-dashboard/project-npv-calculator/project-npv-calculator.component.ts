import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NpvSetupComponent } from './npv-setup/npv-setup.component';
import { AddLineItemComponent } from './add-line-item/add-line-item.component';
import { RemarksPopComponent } from '../../../../common/shared/remarks-pop/remarks-pop.component';

export interface ExpenditureItem {
  id?: number;
  subject: string;
  remarks: string;
  total?: number | null;
  [key: string]: any;
}

export interface NpvSetupData {
  subject?: string;
  years?: string | number;
  periodForDcf?: string;
  discountRate?: number;
  exchangeRate?: number;
  rateDate?: string;
}

export interface NpvLineItemData {
  subject: string;
  remarks?: string;
  total?: number | null;
  year0?: number | null;
  year1?: number | null;
  year2?: number | null;
  year3?: number | null;
  [key: string]: any;
}

export interface NpvRemarksData {
  title?: string;
  placeholder?: string;
  notes?: string;
}

@Component({
  selector: 'app-project-npv-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './project-npv-calculator.component.html',
  styleUrl: './project-npv-calculator.component.scss',
})
export class ProjectNpvCalculatorComponent implements OnInit {
  @ViewChild('scrollContainer1') scrollContainer1!: ElementRef;
  @ViewChild('scrollContainer2') scrollContainer2!: ElementRef;

  projectName: string = this.route.snapshot.queryParamMap.get('projectName') || this.route.snapshot.queryParamMap.get('name') || 'Generic Tablet Development';
  
  // --- Properties ---
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  // Setup parameters
  discountRate: number = 12;
  exchangeRate: number = 95.25;
  rateDate: string = '04-09-2026';
  valuationMethod: string = 'Discounted Cash Flow (DCF)';

  // Years 0 to 15
  years: number[] = Array.from({ length: 16 }, (_, i) => i);

  // DCF Grid Data
  dcfData: {
    basedOnDcf: { [year: number]: any };
    cashOutflow: { [year: number]: any };
    cashInflow: { [year: number]: any };
    freeCashFlow: { [year: number]: any };
    pvFactors: { [year: number]: any };
    discountedCashFlow: { [year: number]: any };
    npvTotal: number;
  } = {
    basedOnDcf: {
      0: null,
      1: 0.33,
      2: 1.33,
      3: 2.33,
      4: 3.33,
      5: 4.33,
      6: 5.33,
      7: 6.33,
      8: 7.33,
      9: 8.33,
      10: 9.33,
      11: 10.33,
      12: 11.33,
      13: 12.33,
      14: 13.33,
      15: 14.33
    },
    cashOutflow: {},
    cashInflow: {
      0: null,
      1: null,
      2: null,
      3: 517027,
      4: 780000,
      5: 980000,
      6: 1250000,
      7: 1500000,
      8: 1700000,
      9: 1850000,
      10: 2000000,
      11: 2150000,
      12: 2250000,
      13: 2350000,
      14: 2450000,
      15: 2550000
    },
    freeCashFlow: {},
    pvFactors: {},
    discountedCashFlow: {},
    npvTotal: 0
  };

  // Expenditure Working Items with rich data across Year 0 to Year 15
  expenditureItems: ExpenditureItem[] = [
    {
      id: 1,
      subject: 'COGS',
      remarks: 'Estimated based on API & excipient baseline costing model',
      year0: 2300000,
      year1: 1200000,
      year2: 850000,
      year3: 1400000,
      year4: 2100000,
      year5: 2800000,
      year6: 3500000,
      year7: 4200000,
      year8: 4800000,
      year9: 5300000,
      year10: 5800000,
      year11: 6200000,
      year12: 6500000,
      year13: 6800000,
      year14: 7000000,
      year15: 7200000,
      total: null
    },
    {
      id: 2,
      subject: 'ANFD',
      remarks: 'Purchased and validated in pilot facility with recurring maintenance',
      year0: 12300000,
      year1: 1500000,
      year2: 500000,
      year3: 350000,
      year4: 400000,
      year5: 450000,
      year6: 600000,
      year7: 500000,
      year8: 550000,
      year9: 700000,
      year10: 1200000,
      year11: 450000,
      year12: 500000,
      year13: 550000,
      year14: 600000,
      year15: 650000,
      total: null
    },
    {
      id: 3,
      subject: 'Vacuum Pump',
      remarks: 'Delivery, qualification and periodic seal replacement',
      year0: 3000000,
      year1: 1500000,
      year2: 250000,
      year3: 250000,
      year4: 300000,
      year5: 350000,
      year6: 400000,
      year7: 750000,
      year8: 300000,
      year9: 350000,
      year10: 400000,
      year11: 450000,
      year12: 500000,
      year13: 550000,
      year14: 600000,
      year15: 650000,
      total: null
    },
    {
      id: 4,
      subject: 'Droplet generation device',
      remarks: 'CDA executed with IIT Madras research team',
      year0: 1000000,
      year1: 450000,
      year2: 250000,
      year3: 200000,
      year4: 250000,
      year5: 300000,
      year6: 350000,
      year7: 400000,
      year8: 450000,
      year9: 500000,
      year10: 550000,
      year11: 400000,
      year12: 450000,
      year13: 500000,
      year14: 550000,
      year15: 600000,
      total: null
    },
    {
      id: 5,
      subject: 'Materials and Manpower costing',
      remarks: 'Manpower & analytical testing for developmental activities',
      year0: 1500000,
      year1: 1000000,
      year2: 1200000,
      year3: 1400000,
      year4: 1600000,
      year5: 1800000,
      year6: 2000000,
      year7: 2200000,
      year8: 2400000,
      year9: 2600000,
      year10: 2800000,
      year11: 3000000,
      year12: 3200000,
      year13: 3400000,
      year14: 3600000,
      year15: 3800000,
      total: null
    },
    {
      id: 6,
      subject: 'Packaging & Serialization Equipment',
      remarks: 'High-speed blister packaging and serialization lines',
      year0: 950000,
      year1: 1400000,
      year2: 600000,
      year3: 750000,
      year4: 850000,
      year5: 950000,
      year6: 1100000,
      year7: 1200000,
      year8: 1300000,
      year9: 1400000,
      year10: 1550000,
      year11: 1650000,
      year12: 1750000,
      year13: 1850000,
      year14: 1950000,
      year15: 2050000,
      total: null
    },
    {
      id: 7,
      subject: 'Scale-up & Validation Trials',
      remarks: 'Commercial pilot scale-up batches and process validation',
      year0: 1100000,
      year1: 1600000,
      year2: 850000,
      year3: 650000,
      year4: 700000,
      year5: 800000,
      year6: 900000,
      year7: 950000,
      year8: 1000000,
      year9: 1050000,
      year10: 1150000,
      year11: 1200000,
      year12: 1250000,
      year13: 1300000,
      year14: 1350000,
      year15: 1400000,
      total: null
    },
    {
      id: 8,
      subject: 'Regulatory Dossier & Pharmacovigilance',
      remarks: 'eCTD filings, site registration and annual post-market surveillance',
      year0: 750000,
      year1: 1100000,
      year2: 500000,
      year3: 600000,
      year4: 700000,
      year5: 800000,
      year6: 900000,
      year7: 950000,
      year8: 1000000,
      year9: 1050000,
      year10: 1100000,
      year11: 1150000,
      year12: 1200000,
      year13: 1250000,
      year14: 1300000,
      year15: 1350000,
      total: null
    }
  ];

  setupSubject: string = '';
  setupYears: string | number = '16';
  setupPeriodForDcf: string = 'Year 0 to Year 15';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private dialog: MatDialog,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['name'] && params['code']) {
        this.projectName = params['name'];
        this.projectCode = params['code'];
        this.dynamicBreadcrumb = `${params['name']} - ${this.projectCode}`;
      } else if (params['projectName']) {
        this.projectName = params['projectName'];
        if (params['code']) this.projectCode = params['code'];
        this.dynamicBreadcrumb = `${params['projectName']} - ${this.projectCode}`;
      } else {
        this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
      }
    });

    this.expenditureItems.forEach(item => {
      item.total = this.getItemTotal(item);
    });

    this.recalculateAll();
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: {
        projectName: this.projectName,
        code: this.projectCode
      }
    });
  }

  // --- Scrolling logic (fast rewind & fast forward) ---
  scrollLeft(): void {
    const el1 = this.scrollContainer1?.nativeElement;
    const el2 = this.scrollContainer2?.nativeElement;
    if (el1) {
      el1.scrollBy({ left: -350, behavior: 'smooth' });
    }
    if (el2) {
      el2.scrollBy({ left: -350, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    const el1 = this.scrollContainer1?.nativeElement;
    const el2 = this.scrollContainer2?.nativeElement;
    if (el1) {
      el1.scrollBy({ left: 350, behavior: 'smooth' });
    }
    if (el2) {
      el2.scrollBy({ left: 350, behavior: 'smooth' });
    }
  }

  // --- Methods ---

  get currentDateFormatted(): string {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  openSetupDialog(): void {
    const dialogRef = this.dialog.open(NpvSetupComponent, {
      width: '600px',
      data: {
        subject: this.setupSubject || this.projectName || '',
        years: this.setupYears || '16',
        periodForDcf: this.setupPeriodForDcf || 'Year 0 to Year 15',
        discountRate: this.discountRate,
        exchangeRate: this.exchangeRate,
        rateDate: this.rateDate
      } as NpvSetupData
    });

    dialogRef.afterClosed().subscribe((res: NpvSetupData) => {
      if (res) {
        if (res.subject) this.setupSubject = res.subject;
        if (res.years) this.setupYears = res.years;
        if (res.periodForDcf) this.setupPeriodForDcf = res.periodForDcf;
        if (res.discountRate !== undefined) this.discountRate = res.discountRate;
        if (res.exchangeRate !== undefined) this.exchangeRate = res.exchangeRate;
        if (res.rateDate) this.rateDate = res.rateDate;
        this.recalculateAll();
      }
    });
  }

  openAddLineItemDialog(): void {
    const dialogRef = this.dialog.open(AddLineItemComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((res: NpvLineItemData) => {
      if (res && res.subject) {
        const newItem: ExpenditureItem = {
          id: Date.now(),
          subject: res.subject,
          remarks: res.remarks || '',
          year0: res.year0 !== null && res.year0 !== undefined ? Number(res.year0) : null,
          year1: res.year1 !== null && res.year1 !== undefined ? Number(res.year1) : null,
          year2: res.year2 !== null && res.year2 !== undefined ? Number(res.year2) : null,
          year3: res.year3 !== null && res.year3 !== undefined ? Number(res.year3) : null,
          total: null
        };
        newItem.total = res.total !== null && res.total !== undefined ? Number(res.total) : this.getItemTotal(newItem);
        this.expenditureItems.push(newItem);
        this.recalculateAll();
      }
    });
  }

  openRemarksDialog(item: ExpenditureItem): void {
    const dialogRef = this.dialog.open(RemarksPopComponent, {
      width: '500px',
      data: {
        title: `Remarks for ${item.subject}`,
        placeholder: 'Enter remarks...',
        notes: item.remarks || ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== null) {
        if (typeof result === 'string') {
          item.remarks = result;
        } else if (result && typeof result.notes === 'string') {
          item.remarks = result.notes;
        }
      }
    });
  }

  deleteExpenditureItem(index: number): void {
    this.expenditureItems.splice(index, 1);
    this.recalculateAll();
  }

  getItemYearValue(item: ExpenditureItem, y: number): string {
    const val = item['year' + y];
    return (val !== null && val !== undefined && val !== '') ? this.formatIndianNumber(val) : '';
  }

  getTotalExpenditureYear(year: number): number {
    return this.expenditureItems.reduce((acc, curr) => acc + (Number(curr['year' + year]) || 0), 0);
  }

  getTotalUsdYear(year: number): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.getTotalExpenditureYear(year) / this.exchangeRate);
  }

  getItemTotal(item: ExpenditureItem): number {
    if (item.total !== undefined && item.total !== null && item.total > 0) {
      return item.total;
    }
    let sum = 0;
    for (const y of this.years) {
      const val = item['year' + y];
      if (val !== null && val !== undefined && val !== '') {
        sum += Number(val) || 0;
      }
    }
    return sum;
  }

  get totalExpenditureAll(): number {
    return this.expenditureItems.reduce((acc, curr) => {
      const tot = this.getItemTotal(curr);
      return acc + (Number(tot) || 0);
    }, 0);
  }

  get totalUsdAll(): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.totalExpenditureAll / this.exchangeRate);
  }

  get totalCashOutflow(): number {
    return this.years.reduce((acc, y) => acc + (Number(this.dcfData.cashOutflow[y]) || 0), 0);
  }

  get totalCashInflow(): number {
    return this.years.reduce((acc, y) => acc + (Number(this.dcfData.cashInflow[y]) || 0), 0);
  }

  get totalFreeCashFlow(): number {
    return this.years.reduce((acc, y) => acc + (Number(this.dcfData.freeCashFlow[y]) || 0), 0);
  }

  getDcfPlaceholder(y: number): string {
    if (y === 0) return '-';
    return ((y - 1) + 0.33).toFixed(2);
  }

  getInflowPlaceholder(y: number): string {
    if (y < 3) return '-';
    return (500000 + (y - 3) * 200000).toString();
  }

  calculatePvFactor(period: any): number {
    if (period === null || period === undefined || period === '') return 1.0;
    const t = Number(period);
    if (isNaN(t) || t === 0) return 1.0;
    const r = (this.discountRate || 0) / 100;
    const factor = 1 / Math.pow(1 + r, t);
    return Math.round(factor * 100) / 100;
  }

  recalculateAll(): void {
    let totalDcFlow = 0;

    for (const y of this.years) {
      // 1. PV Factor
      const dcfVal = this.dcfData.basedOnDcf[y];
      if (dcfVal !== null && dcfVal !== undefined && dcfVal !== '') {
        this.dcfData.pvFactors[y] = this.calculatePvFactor(dcfVal);
      } else {
        this.dcfData.pvFactors[y] = y === 0 ? 1.00 : this.calculatePvFactor((y - 1) + 0.33);
      }

      // 2. Cash Outflow from Expenditure Table in USD
      const usdOutflow = this.getTotalUsdYear(y);
      this.dcfData.cashOutflow[y] = usdOutflow > 0 ? usdOutflow : null;

      // 3. Cash Inflow & Free Cash Flow
      const inflow = Number(this.dcfData.cashInflow[y]) || 0;
      const outflow = Number(this.dcfData.cashOutflow[y]) || 0;
      this.dcfData.freeCashFlow[y] = inflow - outflow;

      // 4. Discounted Cash Flow
      const factor = this.dcfData.pvFactors[y] ?? 1;
      this.dcfData.discountedCashFlow[y] = Math.round(this.dcfData.freeCashFlow[y] * factor);

      totalDcFlow += this.dcfData.discountedCashFlow[y];
    }

    this.dcfData.npvTotal = totalDcFlow;
  }

  formatIndianNumber(val: number | null | undefined): string {
    if (val === null || val === undefined || isNaN(val)) return '-';
    const isNegative = val < 0;
    const absVal = Math.abs(Math.round(val));
    const str = absVal.toString();
    
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    return isNegative ? `-${res}` : res;
  }

  formatBracketNumber(val: number | null | undefined): string {
    if (val === null || val === undefined || isNaN(val)) return '-';
    if (val < 0) {
      return `(${this.formatIndianNumber(Math.abs(val))})`;
    }
    return this.formatIndianNumber(val);
  }
}