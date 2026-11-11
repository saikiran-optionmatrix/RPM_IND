import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../../theme/components/breadcrumb/breadcrumb.component';

export interface MasterDataNavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: string;
}

@Component({
  selector: 'app-master-data',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    BreadcrumbComponent,
  ],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDataComponent {
  protected readonly isNavCollapsed = signal(false);

  protected readonly navItems: readonly MasterDataNavItem[] = [
    { label: 'Resources', route: 'assets', icon: 'precision_manufacturing' },
    { label: 'Divisions', route: 'divisions', icon: 'domain' },
    { label: 'Component', route: 'molecules', icon: 'biotech' },
    // { label: 'Inventory Items', route: 'inventory-items', icon: 'inventory_2' },
    // { label: 'Item Categories', route: 'item-categories', icon: 'category' },
    // { label: 'Item Sub Categories', route: 'item-sub-categories', icon: 'subdirectory_arrow_right' },
    // { label: 'Facilities', route: 'facilities', icon: 'domain' },
    { label: 'Project Types', route: 'project-types', icon: 'folder_special' },
    { label: 'Project Statuses', route: 'project-statuses', icon: 'rule' },
      { label: 'Departments', route: 'departments', icon: 'corporate_fare' },
    { label: 'Sections', route: 'sections', icon: 'view_agenda' },
  
    { label: 'Job Codes', route: 'job-codes', icon: 'badge' },
    // { label: 'Tags', route: 'tags', icon: 'label' },
    // { label: 'Groups', route: 'groups', icon: 'group_work' },
    { label: 'Locations', route: 'sites', icon: 'location_on' },
    { label: 'States', route: 'states', icon: 'map' },
    { label: 'Cities', route: 'cities', icon: 'location_city' },
    { label: 'Templates', route: 'templates', icon: 'description' },
    { label: 'Delay Reasons', route: 'delay-reasons', icon: 'timer' },
    { label: 'Dependency Type', route: 'dependency-type', icon: 'description' },
    // { label: 'TTD Master', route: 'ttd-master', icon: 'label' },
    
  ];

  protected toggleNav(): void {
    this.isNavCollapsed.update((v) => !v);
  }
}
