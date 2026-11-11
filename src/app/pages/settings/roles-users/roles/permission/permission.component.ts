import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ScreenPermissionItem {
  screenName: string;
  create: boolean | null;
  read: boolean | null;
  update: boolean | null;
  delete: boolean | null;
  upload: boolean | null;
  download: boolean | null;
  access: boolean | null;
}

export interface PermissionTab {
  id: string;
  name: string;
  items: ScreenPermissionItem[];
}

@Component({
  selector: 'app-permission',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss',
})
export class PermissionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  roleName = 'Admin';
  roleId = 1;
  activeTabIndex = 0;

  tabs: PermissionTab[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      items: [
        { screenName: 'Stages', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Gates', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Portfolio', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Timeline', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Variance', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Buffer', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      items: [
        { screenName: 'Manage Projects', create: true, read: true, update: true, delete: true, upload: false, download: false, access: true },
        { screenName: 'Kanban View', create: true, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Analytics', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Project Dashboard>> Overview', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Project Dashboard>> NPV Calculator', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Setup', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Project Dashboard>> Stages', create: null, read: true, update: true, delete: null, upload: null, download: null, access: null },
        { screenName: 'Project Dashboard>> Gates', create: true, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Project Dashboard>> Budget', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Scrum', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Schedule', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> To do', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Materials', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Resources', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Issues', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Hours', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Documents', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Dashboard>> Notes', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
      ],
    },
    {
      id: 'stages-gates',
      name: 'Stages & Gates',
      items: [
        { screenName: 'Stages', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Gates', create: true, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Stages >> WBS', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Gates >> Acceptance Criteria', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
      ],
    },
    {
      id: 'master-data',
      name: 'Master Data',
      items: [
        { screenName: 'Asset Master', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Molecule Master', create: true, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Item Inventory', create: true, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Item Category', create: true, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Item Sub Category', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Facilities Master', create: true, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Types', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Project Status', create: false, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Section', create: false, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Department', create: false, read: true, update: false, delete: null, upload: null, download: null, access: null },
        { screenName: 'Job Codes', create: false, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Tag Master', create: false, read: true, update: false, delete: null, upload: null, download: null, access: null },
        { screenName: 'Group Master', create: false, read: true, update: null, delete: true, upload: false, download: false, access: false },
        { screenName: 'Site Master', create: false, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'State Master', create: false, read: true, update: true, delete: null, upload: null, download: null, access: null },
        { screenName: 'City Master', create: false, read: true, update: null, delete: null, upload: null, download: null, access: null },
      ],
    },
    {
      id: 'activity',
      name: 'Activity',
      items: [
        { screenName: 'Activity >> Tasks', create: false, read: true, update: false, delete: true, upload: false, download: false, access: false },
        { screenName: 'Activity >> Issues', create: true, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Activity >> To Do', create: false, read: true, update: false, delete: false, upload: false, download: false, access: false },
      ],
    },
    {
      id: 'resources-admin',
      name: 'Resources & Admin',
      items: [
        { screenName: 'Resources', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Admin >> Roles & Users >> Users', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Admin >> Roles & Users >> Roles', create: null, read: true, update: null, delete: null, upload: null, download: null, access: null },
        { screenName: 'Admin >> Roles & Users >> Groups', create: false, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Admin >> Lookup Options', create: true, read: true, update: true, delete: true, upload: false, download: false, access: false },
        { screenName: 'Admin >> Preferences', create: false, read: true, update: true, delete: false, upload: false, download: false, access: false },
        { screenName: 'Admin >> Event Log', create: false, read: true, update: false, delete: false, upload: false, download: false, access: false },
        { screenName: 'Admin >> Escalation Matrix', create: false, read: true, update: false, delete: false, upload: false, download: false, access: false },
      ],
    },
  ];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['roleName']) {
        this.roleName = params['roleName'];
      }
      if (params['roleId']) {
        this.roleId = +params['roleId'];
      }
    });
  }

  get currentTab(): PermissionTab {
    return this.tabs[this.activeTabIndex];
  }

  selectTab(index: number): void {
    this.activeTabIndex = index;
  }

  nextTab(): void {
    if (this.activeTabIndex < this.tabs.length - 1) {
      this.activeTabIndex++;
    }
  }

  prevTab(): void {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex--;
    }
  }

  toggleAll(): void {
    const items = this.currentTab.items;
    const hasUnchecked = items.some((item) =>
      ['create', 'read', 'update', 'delete', 'upload', 'download', 'access'].some(
        (key) => (item as any)[key] === false,
      ),
    );

    const targetVal = hasUnchecked;
    items.forEach((item) => {
      (['create', 'read', 'update', 'delete', 'upload', 'download', 'access'] as const).forEach((key) => {
        if (item[key] !== null) {
          item[key] = targetVal;
        }
      });
    });
  }

  savePermissions(): void {
    alert(`Permissions saved successfully for role "${this.roleName}"!`);
    this.goBack();
  }

  goBack(): void {
    this.router.navigate(['/settings/manage-users/roles']);
  }
}
