// src/app/pages/pages.routes.ts
import { Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent, // Renders the sidebar/header layout
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
        data: {
          breadcrumb: 'Dashboard',
          description: 'Overview of projects, activities, and key information.',
        },
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.routes').then((m) => m.projectsRoutes),
        data: {
          breadcrumb: 'Projects',
          description: 'Manage and track all projects in the portfolio.',
        },
      },
      {
        path: 'stages',
        loadComponent: () => import('./stages/stages.component').then((c) => c.StagesComponent),
        data: {
          breadcrumb: 'Stages',
          description: 'Define and manage the stages of your project lifecycle.',
        },
      },
      {
        path: 'stages/wbs',
        loadComponent: () =>
          import('./stages/stages-wbs/stages-wbs.component').then((c) => c.StagesWbsComponent),
        data: {
          breadcrumb: 'Work Breakdown Structure',
          description: 'Manage deliverables and activities for the selected stage.',
        },
      },
      {
        path: 'stages/wbs/history',
        loadComponent: () =>
          import('./stages/stages-wbs/stages-wbs-history/stages-wbs-history.component').then(
            (c) => c.StagesWbsHistoryComponent
          ),
        data: {
          breadcrumb: 'WBS Activity History',
          description: 'View activity change history.',
        },
      },
      // {
      //   path: 'stages-wbs-history',
      //   loadComponent: () =>
      //     import('./stages/stages-wbs/stages-wbs-history/stages-wbs-history.component').then(
      //       (c) => c.StagesWbsHistoryComponent
      //     ),
      //   data: {
      //     breadcrumb: 'WBS Activity History',
      //     description: 'View activity change history.',
      //   },
      // },
      {
        path: 'stages/wbs/tasks/history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-tasks/assign-tasks-history/assign-tasks-history.component'
          ).then((c) => c.AssignTasksHistoryComponent),
        data: {
          breadcrumb: 'Task History',
          description: 'View task change history.',
        },
      },
      {
        path: 'stages/wbs/assign-tasks/history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-tasks/assign-tasks-history/assign-tasks-history.component'
          ).then((c) => c.AssignTasksHistoryComponent),
        data: {
          breadcrumb: 'Task History',
          description: 'View task change history.',
        },
      },
      {
        path: 'assign-tasks-history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-tasks/assign-tasks-history/assign-tasks-history.component'
          ).then((c) => c.AssignTasksHistoryComponent),
        data: {
          breadcrumb: 'Task History',
          description: 'View task change history.',
        },
      },
      {
        path: 'stages/wbs/requirements/history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-requirements/assign-requirements-history/assign-requirements-history.component'
          ).then((c) => c.AssignRequirementsHistoryComponent),
        data: {
          breadcrumb: 'Requirement History',
          description: 'View requirement change history.',
        },
      },
      {
        path: 'stages/wbs/assign-requirements/history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-requirements/assign-requirements-history/assign-requirements-history.component'
          ).then((c) => c.AssignRequirementsHistoryComponent),
        data: {
          breadcrumb: 'Requirement History',
          description: 'View requirement change history.',
        },
      },
      {
        path: 'assign-requirements-history',
        loadComponent: () =>
          import(
            './stages/stages-wbs/assign-requirements/assign-requirements-history/assign-requirements-history.component'
          ).then((c) => c.AssignRequirementsHistoryComponent),
        data: {
          breadcrumb: 'Requirement History',
          description: 'View requirement change history.',
        },
      },
      {
        path: 'stages/history',
        loadComponent: () =>
          import('./stages/stages-history/stages-history.component').then((c) => c.StagesHistoryComponent),
        data: {
          breadcrumb: 'Stages History',
          description: 'View stage change history.',
        },
      },
      {
        path: 'stages-history',
        loadComponent: () =>
          import('./stages/stages-history/stages-history.component').then((c) => c.StagesHistoryComponent),
        data: {
          breadcrumb: 'Stages History',
          description: 'View stage change history.',
        },
      },
      {
        path: 'gates/history',
        loadComponent: () =>
          import('./gates/gates-history/gates-history.component').then((c) => c.GatesHistoryComponent),
        data: {
          breadcrumb: 'Gates History',
          description: 'View gate change history.',
        },
      },
      {
        path: 'gates-history',
        loadComponent: () =>
          import('./gates/gates-history/gates-history.component').then((c) => c.GatesHistoryComponent),
        data: {
          breadcrumb: 'Gates History',
          description: 'View gate change history.',
        },
      },
      {
        path: 'project-gates-history',
        loadComponent: () =>
          import(
            './projects/project-dashboard/project-gates/project-gates-history/project-gates-history.component'
          ).then((c) => c.ProjectGatesHistoryComponent),
        data: {
          breadcrumb: 'Gates History',
          description: 'View gate change history.',
        },
      },
      {
        path: 'gates/criteria/history',
        loadComponent: () =>
          import(
            './gates/gate-criteria/gate-criteria-history/gate-criteria-history.component'
          ).then((c) => c.GateCriteriaHistoryComponent),
        data: {
          breadcrumb: 'Criteria History',
          description: 'View gate criteria change history.',
        },
      },
      {
        path: 'gate-criteria-history',
        loadComponent: () =>
          import(
            './gates/gate-criteria/gate-criteria-history/gate-criteria-history.component'
          ).then((c) => c.GateCriteriaHistoryComponent),
        data: {
          breadcrumb: 'Criteria History',
          description: 'View gate criteria change history.',
        },
      },
      {
        path: 'gates-criteria-history',
        loadComponent: () =>
          import(
            './gates/gate-criteria/gate-criteria-history/gate-criteria-history.component'
          ).then((c) => c.GateCriteriaHistoryComponent),
        data: {
          breadcrumb: 'Criteria History',
          description: 'View gate criteria change history.',
        },
      },
      
      {
        path: 'gates',
        loadComponent: () => import('./gates/gates.component').then((c) => c.GatesComponent),
        data: { breadcrumb: 'Gates', description: 'Configure and manage project decision gates.' },
        // Add children HERE for the nested router-outlet
        children: [
          {
            // The :id parameter will capture 'feasibility', 'formulation', etc.
            path: ':id',
            loadComponent: () => import('./gates/gate-criteria/gate-criteria.component').then((c) => c.GateCriteriaComponent),
            data: { breadcrumb: 'Acceptance Criteria' }
          }
        ]
      },
      {
        path: 'master-data',
        loadChildren: () =>
          import('./master-data/master-data.routes').then((m) => m.MASTER_DATA_ROUTES),
        data: { fullBleed: true },
      },
      {
        path: 'monitor',
        loadChildren: () =>
          import('./monitor/monitor.routes').then((m) => m.MONITOR_ROUTES),
        data: {
          breadcrumb: 'Monitor',
          description: 'View and track recent activities and updates.',
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./resources/resources.component').then((c) => c.ResourcesComponent),
        data: {
          breadcrumb: 'Resources',
          description: 'Manage resources and information available to your projects.',
        },
      },
            {
        path: 'hours',
        loadComponent: () =>
          import('./hours/hours.component').then((c) => c.HoursComponent),
        data: {
          breadcrumb: 'Hours',
          description: 'Manage project and resource hours here.',
        },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((m) => m.settingsRoutes),
        data: {
          breadcrumb: 'Settings',
          description: 'Manage application settings, users, and configurations.',
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
];
