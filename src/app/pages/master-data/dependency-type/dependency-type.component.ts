import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface DependencyType {
  code: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-dependency-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './dependency-type.component.html',
  styleUrl: './dependency-type.component.scss',
})
export class DependencyTypeComponent {
  readonly dependencyTypes: DependencyType[] = [
    {
      code: 'FS',
      name: 'Finish to Start',
      description: 'Finish A to Start B',
    },
    {
      code: 'SF',
      name: 'Start to Finish',
      description: 'B must be started to finish A',
    },
    {
      code: 'SS',
      name: 'Start to Start',
      description: 'A must start before B is started',
    },
    {
      code: 'FF',
      name: 'Finish to Finish',
      description: 'B can be finished only after A is finished',
    },
  ];

  showFilter = false;
  keyword = '';
  searchKeyword = '';

  pageIndex = 0;
  pageSize = 10;

  get filteredDependencyTypes(): DependencyType[] {
    return this.dependencyTypes.filter((item) => {
      if (!this.searchKeyword) return true;
      const term = this.searchKeyword.toLowerCase();
      return (
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    });
  }

  get paginatedDependencyTypes(): DependencyType[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredDependencyTypes.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.searchKeyword = '';
    this.pageIndex = 0;
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
