import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { AddRoleComponent } from './add-role/add-role.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface RoleItem {
  id: number;
  roleName: string;
  usersCount: string;
  screenPermissions: string;
  isSystem?: boolean;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  roles: RoleItem[] = [
    {
      id: 1,
      roleName: 'Admin',
      usersCount: '11/49',
      screenPermissions: '158/281',
      isSystem: true,
    },
    {
      id: 2,
      roleName: 'Management',
      usersCount: '12/54',
      screenPermissions: '78/281',
      isSystem: false,
    },
    {
      id: 3,
      roleName: 'CFO',
      usersCount: '31/44',
      screenPermissions: '221/281',
      isSystem: false,
    },
    {
      id: 4,
      roleName: 'Finance',
      usersCount: '5/50',
      screenPermissions: '128/281',
      isSystem: false,
    },
    {
      id: 5,
      roleName: 'Scientist',
      usersCount: '36/48',
      screenPermissions: '22/281',
      isSystem: false,
    },
  ];

  showFilter = false;
  keyword = '';
  searchKeyword = '';

  pageIndex = 0;
  pageSize = 10;

  get filteredRoles(): RoleItem[] {
    return this.roles.filter((r) => {
      const matchesKeyword =
        !this.searchKeyword ||
        r.roleName.toLowerCase().includes(this.searchKeyword.toLowerCase());
      return matchesKeyword;
    });
  }

  get paginatedRoles(): RoleItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredRoles.slice(startIndex, startIndex + this.pageSize);
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

  onAdd(): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '600px',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.roleName) {
        const newRole: RoleItem = {
          id: this.roles.length + 1,
          roleName: res.roleName,
          usersCount: '0/0',
          screenPermissions: '0/281',
          isSystem: false,
        };
        this.roles = [newRole, ...this.roles];
      }
    });
  }

  onEdit(role: RoleItem): void {
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '600px',
      data: {
        mode: 'edit',
        role: { ...role },
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.roleName) {
        const index = this.roles.findIndex((r) => r.id === role.id);
        if (index > -1) {
          this.roles[index] = { ...this.roles[index], ...res };
          this.roles = [...this.roles];
        }
      }
    });
  }

  onDelete(role: RoleItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        title: 'Delete Role',
        content: `Are you sure you want to delete role "${role.roleName}"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.roles = this.roles.filter((r) => r.id !== role.id);
      }
    });
  }

  onPermissionsClick(role: RoleItem): void {
    this.router.navigate(['./permissions'], {
      relativeTo: this.route,
      queryParams: { roleId: role.id, roleName: role.roleName },
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
