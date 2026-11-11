// src/app/pages/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';
import { MonitorComponent } from './monitor.component';


export const MONITOR_ROUTES: Routes = [
  {
    path: '',
    component: MonitorComponent, // This loads the parent layout with the tabs
    children: [
      { path: '', redirectTo: 'activities', pathMatch: 'full' },
      {
        path: 'activities',
        loadComponent: () => import('./monitor-activities/monitor-activities.component').then(c => c.MonitorActivitiesComponent)
      },
      {
        path: 'issues',
        loadComponent: () => import('./monitor-issues/monitor-issues.component').then(c => c.MonitorIssuesComponent)
      },
      {
        path: 'to-do',
        loadComponent: () => import('./monitor-todo/monitor-todo.component').then(c => c.MonitorTodoComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./monitor-tasks/monitor-tasks.component').then(c => c.MonitorTasksComponent)
      },
      {
        path: 'requirements',
        loadComponent: () => import('./monitor-requirements/monitor-requirements.component').then(c => c.MonitorRequirementsComponent)
      },

    ]
  }
];
