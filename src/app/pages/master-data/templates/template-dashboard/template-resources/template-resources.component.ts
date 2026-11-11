import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { AddResourceComponent } from '../../../../projects/project-dashboard/project-resources/add-resource/add-resource.component';

export interface ResourceItem {
  code: string;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-template-resources',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './template-resources.component.html',
  styleUrl: './template-resources.component.scss'
})
export class TemplateResourcesComponent implements OnInit, OnDestroy {
  projectName: string =
    this.route.snapshot.queryParamMap.get('projectName') ||
    this.route.snapshot.queryParamMap.get('name') ||
    this.route.snapshot.queryParamMap.get('templateName') ||
    'Oral Solid Dosage (OSD) Formulation & Commercialization';
  projectCode: string =
    this.route.snapshot.queryParamMap.get('projectCode') ||
    this.route.snapshot.queryParamMap.get('code') ||
    '2026/GEN/001';
  dynamicBreadcrumb: string = 'Resources';

  availableResources: ResourceItem[] = [];
  allocatedResources: ResourceItem[] = [];

  private routeSub?: Subscription;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      if (params['projectName'] || params['name'] || params['templateName']) {
        this.projectName = params['projectName'] || params['name'] || params['templateName'];
      }
      if (params['projectCode'] || params['code']) {
        this.projectCode = params['projectCode'] || params['code'];
      }
      this.dynamicBreadcrumb = `${this.projectName} - ${this.projectCode}`;
    });

    this.initializeData();
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  initializeData(): void {
    this.availableResources = [
      { code: 'RES001', name: 'Lyophilizer A', selected: false },
      { code: 'RES002', name: 'Anita Desai', selected: false },
      { code: 'RES003', name: 'Lyophilizer B', selected: false },
      { code: 'RES004', name: 'Amit Patel', selected: false },
      { code: 'RES005', name: 'Lyophilizer C', selected: false },
      { code: 'RES006', name: 'Deepa Nair', selected: false },
      { code: 'RES007', name: 'Arun Joseph', selected: false },
      { code: 'RES008', name: 'Lakshmi Devi', selected: false }
    ];

    this.allocatedResources = [
      { code: 'RES009', name: 'Vikram Singh', selected: false },
      { code: 'RES010', name: 'Neha Sharma', selected: false },
      { code: 'RES011', name: 'Rohit Mehta', selected: false },
      { code: 'RES012', name: 'Kiran Rao', selected: false },
      { code: 'RES013', name: 'Harish Babu', selected: false }
    ];
  }

  toggleAvailableSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  toggleAllocatedSelect(res: ResourceItem): void {
    res.selected = !res.selected;
  }

  allocateResources(): void {
    const selected = this.availableResources.filter(r => r.selected);
    this.allocatedResources.push(...selected);
    this.availableResources = this.availableResources.filter(r => !r.selected);
    this.allocatedResources.forEach(r => r.selected = false);
  }

  deallocateResources(): void {
    const selected = this.allocatedResources.filter(r => r.selected);
    this.availableResources.push(...selected);
    this.allocatedResources = this.allocatedResources.filter(r => !r.selected);
    this.availableResources.forEach(r => r.selected = false);
  }

  canAllocate(): boolean {
    return this.availableResources.some(r => r.selected);
  }

  canDeallocate(): boolean {
    return this.allocatedResources.some(r => r.selected);
  }

  openAddResourceDialog(): void {
    const dialogRef = this.dialog.open(AddResourceComponent, {
      width: '1000px',
      minWidth: '950px',
      maxWidth: '95vw',
      data: null
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const newRes: ResourceItem = {
          code: result.code || `RES0${this.availableResources.length + this.allocatedResources.length + 10}`,
          name: result.name || result.resource || 'New Resource',
          selected: false
        };
        this.availableResources.push(newRes);
      }
    });
  }

  goBack(): void {
   this.router.navigate(['/master-data/templates']);
  }
}
