import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';

import { AddUserComponent } from './add-user/add-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ManagersPopComponent } from './managers-pop/managers-pop.component';
import { JobCodeComponent } from './job-code/job-code.component';
import { LocationComponent } from './location/location.component';
import { AuditTypesComponent } from './audit-types/audit-types.component';
import { ConfirmationDialogComponent } from '../../../../common/shared/confirmation-dialog/confirmation-dialog.component';
import { SpecialPermissionsComponent } from './special-permissions/special-permissions.component';
import { DeleteConfirmationComponent } from '../../../../common/shared/delete-confirmation/delete-confirmation.component';

export interface UserItem {
  id: number;
  userName: string;
  shortForm: string;
  managers: number;
  email: string;
  phone: string;
  department: string;
  group: string;
  site: string;
  section: string;
  role: string;
  workHours: number;
  jobCode: string;
  location: string;
  managerialRole: boolean;
  auditTypes: number;
  rpm: boolean;
  twoFactor: boolean;
  cft?: boolean;
  specialPermissions?: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(private dialog: MatDialog) {}

  users: UserItem[] = [
    {
      id: 1,
      userName: 'Satya',
      shortForm: 'SP',
      managers: 4,
      email: 'spaswan383@gmail.com',
      phone: '7070936188',
      department: 'Engineering',
      group: 'Assembly Group',
      site: 'Hyderabad OSD Formulation Plant',
      section: 'Formulation Section',
      role: 'Group Leader',
      workHours: 8,
      jobCode: '3/40',
      location: '6/10',
      managerialRole: false,
      auditTypes: 10,
      rpm: false,
      twoFactor: false,
      cft: false,
      specialPermissions: '2/8',
      status: 'Inactive',
    },
    {
      id: 2,
      userName: 'Pavan Kalyan',
      shortForm: 'PK',
      managers: 4,
      email: 'pavankalyan@gmail.com',
      phone: '9347153602',
      department: 'Quality',
      group: 'Quality Group',
      site: 'Goa Injectables Plant',
      section: 'QC Analytical Section',
      role: 'Group Leader',
      workHours: 8,
      jobCode: '7/40',
      location: '4/10',
      managerialRole: false,
      auditTypes: 10,
      rpm: false,
      twoFactor: false,
      cft: true,
      specialPermissions: '4/8',
      status: 'Inactive',
    },
    {
      id: 3,
      userName: 'Gaurav',
      shortForm: 'GV',
      managers: 4,
      email: 'gvrav@gmail.com',
      phone: '7894444444',
      department: 'R&D',
      group: 'Engineering Group',
      site: 'Bengaluru R&D Hub',
      section: 'CAD Section',
      role: 'Shop Head',
      workHours: 9,
      jobCode: '6/40',
      location: '6/10',
      managerialRole: false,
      auditTypes: 10,
      rpm: false,
      twoFactor: false,
      cft: false,
      specialPermissions: '1/8',
      status: 'Inactive',
    },
    {
      id: 4,
      userName: 'Ayush',
      shortForm: 'AK',
      managers: 4,
      email: 'ak@gmail.com',
      phone: '1234563213',
      department: 'EHS',
      group: 'EHS & Safety Group',
      site: 'Hosur Proving Grounds',
      section: 'Safety Section',
      role: 'General Manager',
      workHours: 8,
      jobCode: '22/40',
      location: '7/10',
      managerialRole: false,
      auditTypes: 10,
      rpm: false,
      twoFactor: false,
      cft: true,
      specialPermissions: '5/8',
      status: 'Inactive',
    },
    {
      id: 5,
      userName: 'Santosh',
      shortForm: 'SK',
      managers: 4,
      email: 'santosh@gmail.com',
      phone: '9878998887',
      department: 'Supply Chain',
      group: 'Supply Chain Group',
      site: 'Gurugram Spares Depot',
      section: 'Logistics Section',
      role: 'Test',
      workHours: 8,
      jobCode: '32/40',
      location: '4/10',
      managerialRole: false,
      auditTypes: 10,
      rpm: false,
      twoFactor: false,
      cft: false,
      specialPermissions: '3/8',
      status: 'Inactive',
    },
  ];

  showFilter = false;
  keyword = '';
  status = '';
  department = '';
  role = '';

  searchKeyword = '';
  searchStatus = '';
  searchDepartment = '';
  searchRole = '';

  pageIndex = 0;
  pageSize = 10;

  readonly departments = [
    'Engineering',
    'Quality',
    'R&D',
    'EHS',
    'Supply Chain',
  ];

  readonly roles = [
    'Group Leader',
    'Shop Head',
    'General Manager',
    'Test',
  ];

  get filteredUsers(): UserItem[] {
    return this.users.filter((u) => {
      const keywordMatches =
        !this.searchKeyword ||
        u.userName.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        u.shortForm.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        u.email.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        u.phone.includes(this.searchKeyword) ||
        u.site.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const statusMatches = !this.searchStatus || u.status === this.searchStatus;
      const deptMatches = !this.searchDepartment || u.department === this.searchDepartment;
      const roleMatches = !this.searchRole || u.role === this.searchRole;

      return keywordMatches && statusMatches && deptMatches && roleMatches;
    });
  }

  get paginatedUsers(): UserItem[] {
    const startIndex = this.pageIndex * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  onSearch(): void {
    this.searchKeyword = this.keyword.trim();
    this.searchStatus = this.status;
    this.searchDepartment = this.department;
    this.searchRole = this.role;
    this.pageIndex = 0;
  }

  onClear(): void {
    this.keyword = '';
    this.status = '';
    this.department = '';
    this.role = '';
    this.searchKeyword = '';
    this.searchStatus = '';
    this.searchDepartment = '';
    this.searchRole = '';
    this.pageIndex = 0;
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { mode: 'add' },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const newUser: UserItem = {
          id: this.users.length + 1,
          userName: res.userName,
          shortForm: res.shortForm,
          managers: 4,
          email: res.email,
          phone: res.phone,
          department: res.department,
          group: 'Assembly Group',
          site: 'Pune Manufacturing Facility',
          section: 'Packaging Section',
          role: res.role,
          workHours: res.workHours || 8,
          jobCode: '0/40',
          location: '0/10',
          managerialRole: res.managerialRole ?? false,
          auditTypes: 10,
          rpm: false,
          twoFactor: false,
          status: res.status ?? 'Active',
        };
        this.users = [newUser, ...this.users];
      }
    });
  }

  onEdit(user: UserItem): void {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '850px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: {
        mode: 'edit',
        user: { ...user },
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const index = this.users.findIndex((u) => u.id === user.id);
        if (index > -1) {
          this.users[index] = { ...this.users[index], ...res };
          this.users = [...this.users];
        }
      }
    });
  }

  onDelete(user: UserItem): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '350px',
      data: {
        title: 'Delete User',
        content: `Are you sure you want to delete user ${user.userName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        this.users = this.users.filter((u) => u.id !== user.id);
      }
    });
  }

  onStatusChange(user: UserItem): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'Change Status',
        content: `Are you sure you want to change status for ${user.userName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (confirmed) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      }
    });
  }

  onResetPassword(user: UserItem): void {
    this.dialog.open(ResetPasswordComponent, {
      width: '600px',
      data: { user },
    });
  }

  onManagersClick(user: UserItem): void {
    this.dialog.open(ManagersPopComponent, {
      width: '450px',
      data: { user },
    });
  }

  onJobCodeClick(user: UserItem): void {
    const dialogRef = this.dialog.open(JobCodeComponent, {
      width: '1200px',
      maxWidth: '95vw',
      autoFocus: false,
      data: { user },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.summary) {
        user.jobCode = res.summary;
      }
    });
  }

  onLocationClick(user: UserItem): void {
    this.dialog.open(LocationComponent, {
      width: '550px',
      data: { user },
    });
  }

  onAuditTypesClick(user: UserItem): void {
    const dialogRef = this.dialog.open(AuditTypesComponent, {
      width: '600px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.totalSelected !== undefined) {
        user.auditTypes = res.totalSelected;
      }
    });
  }

  onSpecialPermissionsClick(user: UserItem): void {
    const dialogRef = this.dialog.open(SpecialPermissionsComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res && res.summary) {
        user.specialPermissions = res.summary;
      }
    });
  }

  handlePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
