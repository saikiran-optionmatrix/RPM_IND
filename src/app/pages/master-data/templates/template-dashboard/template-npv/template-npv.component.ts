import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ExpenditureItem {
  id?: number;
  subject: string;
  remarks: string;
  total?: number | null;
  year0?: number | null;
  year1?: number | null;
  year2?: number | null;
  year3?: number | null;
}

@Component({
  selector: 'app-template-npv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './template-npv.component.html',
  styleUrl: './template-npv.component.scss',
})
export class TemplateNpvComponent implements OnInit {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Generic Tablet Development';

  // --- Properties ---
  projectCode: string = '2026/GEN/001';
  dynamicBreadcrumb: string = 'Generic Tablet Development - 2026/GEN/001';

  // Setup parameters
  discountRate: number = 12;
  exchangeRate: number = 95.25;
  rateDate: string = '04-09-2026';
  valuationMethod: string = 'Discounted Cash Flow (DCF)';

  // DCF Grid Data
  dcfData: {
    basedOnDcf: { year0: any; year1: any; year2: any; year3: any; total: any };
    cashOutflow: { year0: any; year1: any; year2: any; year3: any };
    cashInflow: { year0: any; year1: any; year2: any; year3: any };
    freeCashFlow: { year0: any; year1: any; year2: any; year3: any };
    pvFactors: { year0: any; year1: any; year2: any; year3: any };
    discountedCashFlow: { year0: any; year1: any; year2: any; year3: any };
    npvTotal: number;
  } = {
    basedOnDcf: { year0: null, year1: 0.33, year2: 1.33, year3: 2.33, total: null },
    cashOutflow: { year0: null, year1: null, year2: null, year3: null },
    cashInflow: { year0: null, year1: null, year2: null, year3: 517027 },
    freeCashFlow: { year0: 0, year1: 0, year2: 0, year3: 0 },
    pvFactors: { year0: 1.0, year1: 0.96, year2: 0.86, year3: 0.77 },
    discountedCashFlow: { year0: 0, year1: 0, year2: 0, year3: 0 },
    npvTotal: 0,
  };

  // Expenditure Working Items
  expenditureItems: ExpenditureItem[] = [
    {
      subject: 'COGS',
      remarks: 'Estimated based on API & excipient baseline costing model',
      total: 3500000,
      year0: 2300000,
      year1: 1200000,
      year2: 0,
      year3: 0,
    },
    {
      subject: 'ANFD',
      remarks: 'Already purchased and validated in pilot facility',
      total: 13800000,
      year0: 12300000,
      year1: 1500000,
      year2: 500000,
      year3: 0,
    },
    {
      subject: 'Vacuum Pump',
      remarks: 'Expected delivery and qualification by 30th Apr 2025',
      total: 4500000,
      year0: 3000000,
      year1: 1500000,
      year2: 0,
      year3: 0,
    },
    {
      subject: 'Droplet generation device',
      remarks: 'CDA executed with IIT Madras research team',
      total: 1000000,
      year0: 1000000,
      year1: 0,
      year2: 0,
      year3: 0,
    },
    {
      subject: 'Materials and Manpower costing',
      remarks: 'Manpower & analytical testing for developmental activities',
      total: 2500000,
      year0: 1500000,
      year1: 1000000,
      year2: 0,
      year3: 0,
    },
  ];

  setupSubject: string = '';
  setupYears: string | number = '4';
  setupPeriodForDcf: string = 'Year 0 to Year 3';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const templateName = params['templateName'] || params['projectName'] || params['name'];
      if (templateName) {
        this.projectName = templateName;
      }
      if (params['code']) {
        this.projectCode = params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.recalculateAll();
  }

  goBack(): void {
    this.router.navigate(['/master-data/templates']);
  }

  get currentDateFormatted(): string {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  deleteExpenditureItem(index: number): void {
    this.expenditureItems.splice(index, 1);
    this.recalculateAll();
  }

  getItemTotal(item: ExpenditureItem): number | null {
    if (item.total !== undefined && item.total !== null) {
      return item.total;
    }
    const sum =
      (Number(item.year0) || 0) +
      (Number(item.year1) || 0) +
      (Number(item.year2) || 0) +
      (Number(item.year3) || 0);
    return item.year0 !== null || item.year1 !== null || item.year2 !== null || item.year3 !== null
      ? sum
      : null;
  }

  get totalExpenditureYear0(): number {
    return this.expenditureItems.reduce((acc, curr) => acc + (Number(curr.year0) || 0), 0);
  }

  get totalExpenditureYear1(): number {
    return this.expenditureItems.reduce((acc, curr) => acc + (Number(curr.year1) || 0), 0);
  }

  get totalExpenditureYear2(): number {
    return this.expenditureItems.reduce((acc, curr) => acc + (Number(curr.year2) || 0), 0);
  }

  get totalExpenditureYear3(): number {
    return this.expenditureItems.reduce((acc, curr) => acc + (Number(curr.year3) || 0), 0);
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

  get totalUsdYear0(): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.totalExpenditureYear0 / this.exchangeRate);
  }

  get totalUsdYear1(): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.totalExpenditureYear1 / this.exchangeRate);
  }

  get totalUsdYear2(): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.totalExpenditureYear2 / this.exchangeRate);
  }

  get totalUsdYear3(): number {
    if (!this.exchangeRate || this.exchangeRate === 0) return 0;
    return Math.round(this.totalExpenditureYear3 / this.exchangeRate);
  }

  get totalCashOutflow(): number {
    return (
      (Number(this.dcfData.cashOutflow.year0) || 0) +
      (Number(this.dcfData.cashOutflow.year1) || 0) +
      (Number(this.dcfData.cashOutflow.year2) || 0) +
      (Number(this.dcfData.cashOutflow.year3) || 0)
    );
  }

  get totalCashInflow(): number {
    return (
      (Number(this.dcfData.cashInflow.year0) || 0) +
      (Number(this.dcfData.cashInflow.year1) || 0) +
      (Number(this.dcfData.cashInflow.year2) || 0) +
      (Number(this.dcfData.cashInflow.year3) || 0)
    );
  }

  get totalFreeCashFlow(): number {
    return (
      (Number(this.dcfData.freeCashFlow.year0) || 0) +
      (Number(this.dcfData.freeCashFlow.year1) || 0) +
      (Number(this.dcfData.freeCashFlow.year2) || 0) +
      (Number(this.dcfData.freeCashFlow.year3) || 0)
    );
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
    if (
      this.dcfData.basedOnDcf.year0 !== null &&
      this.dcfData.basedOnDcf.year0 !== undefined &&
      this.dcfData.basedOnDcf.year0 !== ''
    ) {
      this.dcfData.pvFactors.year0 = this.calculatePvFactor(this.dcfData.basedOnDcf.year0);
    } else {
      this.dcfData.pvFactors.year0 = 1.0;
    }

    if (
      this.dcfData.basedOnDcf.year1 !== null &&
      this.dcfData.basedOnDcf.year1 !== undefined &&
      this.dcfData.basedOnDcf.year1 !== ''
    ) {
      this.dcfData.pvFactors.year1 = this.calculatePvFactor(this.dcfData.basedOnDcf.year1);
    } else {
      this.dcfData.pvFactors.year1 = 0.96;
    }

    if (
      this.dcfData.basedOnDcf.year2 !== null &&
      this.dcfData.basedOnDcf.year2 !== undefined &&
      this.dcfData.basedOnDcf.year2 !== ''
    ) {
      this.dcfData.pvFactors.year2 = this.calculatePvFactor(this.dcfData.basedOnDcf.year2);
    } else {
      this.dcfData.pvFactors.year2 = 0.86;
    }

    if (
      this.dcfData.basedOnDcf.year3 !== null &&
      this.dcfData.basedOnDcf.year3 !== undefined &&
      this.dcfData.basedOnDcf.year3 !== ''
    ) {
      this.dcfData.pvFactors.year3 = this.calculatePvFactor(this.dcfData.basedOnDcf.year3);
    } else {
      this.dcfData.pvFactors.year3 = 0.77;
    }

    this.dcfData.cashOutflow.year0 = this.totalUsdYear0 > 0 ? this.totalUsdYear0 : null;
    this.dcfData.cashOutflow.year1 = this.totalUsdYear1 > 0 ? this.totalUsdYear1 : null;
    this.dcfData.cashOutflow.year2 = this.totalUsdYear2 > 0 ? this.totalUsdYear2 : null;
    this.dcfData.cashOutflow.year3 = this.totalUsdYear3 > 0 ? this.totalUsdYear3 : null;

    const in0 = 0;
    const in1 = 0;
    const in2 = 0;
    const in3 = Number(this.dcfData.cashInflow.year3) || 0;

    const out0 = Number(this.dcfData.cashOutflow.year0) || 0;
    const out1 = Number(this.dcfData.cashOutflow.year1) || 0;
    const out2 = Number(this.dcfData.cashOutflow.year2) || 0;
    const out3 = Number(this.dcfData.cashOutflow.year3) || 0;

    this.dcfData.freeCashFlow.year0 = in0 - out0;
    this.dcfData.freeCashFlow.year1 = in1 - out1;
    this.dcfData.freeCashFlow.year2 = in2 - out2;
    this.dcfData.freeCashFlow.year3 = in3 - out3;

    this.dcfData.discountedCashFlow.year0 = Math.round(
      this.dcfData.freeCashFlow.year0 * (this.dcfData.pvFactors.year0 || 1),
    );
    this.dcfData.discountedCashFlow.year1 = Math.round(
      this.dcfData.freeCashFlow.year1 * (this.dcfData.pvFactors.year1 || 0.96),
    );
    this.dcfData.discountedCashFlow.year2 = Math.round(
      this.dcfData.freeCashFlow.year2 * (this.dcfData.pvFactors.year2 || 0.86),
    );
    this.dcfData.discountedCashFlow.year3 = Math.round(
      this.dcfData.freeCashFlow.year3 * (this.dcfData.pvFactors.year3 || 0.77),
    );

    this.dcfData.npvTotal =
      this.dcfData.discountedCashFlow.year0 +
      this.dcfData.discountedCashFlow.year1 +
      this.dcfData.discountedCashFlow.year2 +
      this.dcfData.discountedCashFlow.year3;
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
