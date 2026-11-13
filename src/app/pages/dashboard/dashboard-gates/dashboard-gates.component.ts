import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  INDUSTRIAL_GATE_HEADERS,
  GateColumnHeader,
  GateRow,
  buildIndustrialGateRows,
} from '../industrial-dashboard.data';

export type { GateColumnHeader, GateRow };

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

  readonly gateHeaders: GateColumnHeader[] = INDUSTRIAL_GATE_HEADERS;

  gateRows: GateRow[] = [];

  constructor() { }

  ngOnInit(): void {
    this.gateRows = buildIndustrialGateRows();
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
