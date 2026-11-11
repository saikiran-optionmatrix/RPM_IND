import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';

export const settingsRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'manage-users',
      },
      {
        path: 'manage-users',
        // Updated to load a routing file instead of a module
        loadChildren: () =>
          import('./roles-users/roles-users.routes').then(
            (m) => m.rolesUsersRoutes,
          ),
        data: {
          breadcrumb: 'Roles & Users',
          description: 'Manage user accounts, roles, and security groups.',
        },
      },
      {
        path: 'lookups',
        loadComponent: () =>
          import('./lookup-options/lookup-options.component').then(
            (m) => m.LookupOptionsComponent,
          ),
        data: {
          breadcrumb: 'Lookup Options',
          description: 'Configure and customize system lookup values.',
        },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./preferences/preferences.component').then(
            (m) => m.PreferencesComponent,
          ),
        data: {
          breadcrumb: 'Preferences',
          description: 'Manage application preferences and system settings.',
        },
      },
      {
        path: 'event-log',
        loadComponent: () =>
          import('./event-log/event-log.component').then(
            (m) => m.EventLogComponent,
          ),
        data: {
          breadcrumb: 'Event Log',
          description: 'View system audit trails and event logs.',
        },
      },
      {
        path: 'escalation',
        loadComponent: () =>
          import('./escalation-matrix/escalation-matrix.component').then(
            (m) => m.EscalationMatrixComponent,
          ),
        data: {
          breadcrumb: 'Escalation Matrix',
          description: 'Configure notification and escalation rules.',
        },
      },
    ],
  },
];
