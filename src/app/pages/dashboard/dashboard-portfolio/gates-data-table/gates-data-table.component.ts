import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  INDUSTRIAL_GATE_HEADERS,
  GateColumnHeader,
  GateRow,
  buildIndustrialGateRows,
} from '../../industrial-dashboard.data';

export type { GateColumnHeader };
@Component({
  selector: 'app-gates-data-table',
  standalone: true,
   imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './gates-data-table.component.html',
  styleUrl: './gates-data-table.component.scss',
})
export class GatesDataTableComponent {


    gatesSearchTerm: string = '';
  
    readonly gateHeaders: GateColumnHeader[] = INDUSTRIAL_GATE_HEADERS;

    gateRows: GateRow[] = [];

    constructor(private router: Router) { }

    goBack(): void {
      this.router.navigate(['/dashboard/portfolio']);
    }

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

