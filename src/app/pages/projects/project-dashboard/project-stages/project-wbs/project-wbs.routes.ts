import { Routes } from '@angular/router';

export const projectWbsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./project-wbs.component').then((m) => m.ProjectWbsComponent),
    data: { breadcrumb: 'WBS', description: 'Manage Work Breakdown Structure.' },
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./project-wbs-tasks/project-wbs-tasks.component').then(
        (m) => m.ProjectWbsTasksComponent,
      ),
    data: { breadcrumb: 'Tasks', description: 'Manage Activity Tasks.' },
  },
  {
    path: 'tasks/history',
    loadComponent: () =>
      import(
        './project-wbs-tasks/project-wbs-tasks-history/project-wbs-tasks-history.component'
      ).then((m) => m.ProjectWbsTasksHistoryComponent),
    data: { breadcrumb: 'Tasks History', description: 'View Activity Tasks History.' },
  },
  {
    path: 'tasks-history',
    loadComponent: () =>
      import(
        './project-wbs-tasks/project-wbs-tasks-history/project-wbs-tasks-history.component'
      ).then((m) => m.ProjectWbsTasksHistoryComponent),
    data: { breadcrumb: 'Tasks History', description: 'View Activity Tasks History.' },
  },
  {
    path: 'requirements',
    loadComponent: () =>
      import('./project-wbs-requirements/project-wbs-requirements.component').then(
        (m) => m.ProjectWbsRequirementsComponent,
      ),
    data: { breadcrumb: 'Requirements', description: 'Manage Activity Requirements.' },
  },
  {
    path: 'requirements/history',
    loadComponent: () =>
      import(
        './project-wbs-requirements/project-wbs-requirements-history/project-wbs-requirements-history.component'
      ).then((m) => m.ProjectWbsRequirementsHistoryComponent),
    data: { breadcrumb: 'Requirements History', description: 'View Activity Requirements History.' },
  },
  {
    path: 'requirements-history',
    loadComponent: () =>
      import(
        './project-wbs-requirements/project-wbs-requirements-history/project-wbs-requirements-history.component'
      ).then((m) => m.ProjectWbsRequirementsHistoryComponent),
    data: { breadcrumb: 'Requirements History', description: 'View Activity Requirements History.' },
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./project-wbs-history/project-wbs-history.component').then(
        (m) => m.ProjectWbsHistoryComponent,
      ),
    data: { breadcrumb: 'WBS History', description: 'Activity History' },
  },
];
