import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-team',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './project-team.component.html',
  styleUrl: './project-team.component.scss',
})
export class ProjectTeamComponent implements OnInit {
  // Project Header Properties
  projectName: string = 'Industrial Equipment Line Expansion';
  projectCode: string = '2026/IND/001';
  dynamicBreadcrumb: string = 'Team';

  // Migrated Properties
  availableMembers: string[] = [
    'Vikramaditya Rao',
    'Karthik Subramanian',
    'Deepa Nair',
    'Rohan Kulkarni',
    'Meera Iyer',
    'Arjun Mehta',
    'Neha Kapoor',
    'Siddharth Joshi',
    'Kavita Deshmukh',
    'Pranav Verma',
    'Sanjay Gupta'
  ];

  assignedMembers: string[] = [
    'Ananya Rao',
    'Rajesh Kumar',
    'Anita Desai',
    'Priya Reddy',
    'Suresh Naidu'
  ];

  selectedAvailable: string[] = [];
  selectedAssigned: string[] = [];

  availableSearch: string = '';
  assignedSearch: string = '';

  get filteredAvailableMembers(): string[] {
    if (!this.availableSearch?.trim()) {
      return this.availableMembers;
    }
    const term = this.availableSearch.toLowerCase().trim();
    return this.availableMembers.filter((m) => m.toLowerCase().includes(term));
  }

  get filteredAssignedMembers(): string[] {
    if (!this.assignedSearch?.trim()) {
      return this.assignedMembers;
    }
    const term = this.assignedSearch.toLowerCase().trim();
    return this.assignedMembers.filter((m) => m.toLowerCase().includes(term));
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name']) {
        this.projectName = params['projectName'] || params['name'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });
  }

  goBack(): void {
    this.router.navigate(['/projects/dashboard/analytics'], {
      queryParams: { code: this.projectCode || '2026/IND/001', name: this.projectName || 'Industrial Equipment Line Expansion' }
    });
  }

  // --- Migrated Methods ---

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  toggleSelection(member: string, list: string[]) {
    const index = list.indexOf(member);
    if (index > -1) {
      list.splice(index, 1); // Deselect
    } else {
      list.push(member); // Select
    }
  }

  addMembers() {
    if (this.selectedAvailable.length > 0) {
      this.assignedMembers.push(...this.selectedAvailable);
      this.availableMembers = this.availableMembers.filter(
        (member) => !this.selectedAvailable.includes(member)
      );
      this.selectedAvailable = [];
    }
  }

  removeMembers() {
    if (this.selectedAssigned.length > 0) {
      this.availableMembers.push(...this.selectedAssigned);
      this.assignedMembers = this.assignedMembers.filter(
        (member) => !this.selectedAssigned.includes(member)
      );
      this.selectedAssigned = [];
    }
  }

  save(): void {
    this.goBack();
  }
}