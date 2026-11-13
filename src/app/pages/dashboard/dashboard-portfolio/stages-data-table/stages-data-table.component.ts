import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  INDUSTRIAL_STAGE_HEADERS,
  StageColumnHeader,
  StageRow,
  buildIndustrialStageRows,
} from '../../industrial-dashboard.data';

export type { StageColumnHeader };

@Component({
  selector: 'app-stages-data-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    // DashboardStagesComponent
  ],
  templateUrl: './stages-data-table.component.html',
  styleUrl: './stages-data-table.component.scss',
})
export class StagesDataTableComponent implements OnInit, AfterViewInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  gatesSearchTerm: string = '';
  canScrollLeft: boolean = false;
  canScrollRight: boolean = true;

  // 12 Industrial Manufacturing Stages from Industrial_Manufacturing_Data_Table.xlsx
  readonly stageHeaders: StageColumnHeader[] = INDUSTRIAL_STAGE_HEADERS;

  stageRows: StageRow[] = [];

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/dashboard/portfolio']);
  }

  ngOnInit(): void {
    this.stageRows = buildIndustrialStageRows();
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
