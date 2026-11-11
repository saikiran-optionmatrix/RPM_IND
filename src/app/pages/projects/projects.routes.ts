import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

export const projectsRoutes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./projects-history/projects-history.component').then(
        (m) => m.ProjectsHistoryComponent
      ),
    data: {
      breadcrumb: 'History',
      description: 'Project History',
    },
  },
  {
    path: 'dashboard',
    // Updated to load a routing array instead of a module
    loadChildren: () =>
      import('./project-dashboard/project-dashboard.routes').then(
        (m) => m.projectDashboardRoutes
      ),
  },
];
