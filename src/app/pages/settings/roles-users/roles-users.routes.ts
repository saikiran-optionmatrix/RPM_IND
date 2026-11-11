import { Routes } from '@angular/router';
import { RolesUsersComponent } from './roles-users.component';

export const rolesUsersRoutes: Routes = [
  {
    path: '',
    component: RolesUsersComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/users.component').then((m) => m.UsersComponent),
        data: {
          breadcrumb: 'Users',
          description: 'Manage system users and access permissions.',
        },
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./roles/roles.component').then((m) => m.RolesComponent),
        data: {
          breadcrumb: 'Roles',
          description: 'Define and manage roles and permission levels.',
        },
      },
      {
        path: 'roles/permissions',
        loadComponent: () =>
          import('./roles/permission/permission.component').then(
            (m) => m.PermissionComponent,
          ),
        data: {
          breadcrumb: 'Screen Permissions',
          description: 'Configure screen permissions for the role.',
        },
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./groups/groups.component').then((m) => m.GroupsComponent),
        data: {
          breadcrumb: 'Groups',
          description: 'Organize users into permission groups.',
        },
      },
    ],
  },
];
