// src/app/pages/dashboard/dashboard.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: DashboardComponent, // This loads the parent layout with the tabs
    children: [
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' },
      {
        path: 'stages',
        loadComponent: () => import('./dashboard-stages/dashboard-stages.component').then(c => c.DashboardStagesComponent)
      },
      {
        path: 'gates',
        loadComponent: () => import('./dashboard-gates/dashboard-gates.component').then(c => c.DashboardGatesComponent)
      },
      {
        path: 'portfolio',
        children: [
          {
            path: '',
            loadComponent: () => import('./dashboard-portfolio/dashboard-portfolio.component').then(c => c.DashboardPortfolioComponent)
          },
          {
            path: 'stages-data-table',
            loadComponent: () => import('./dashboard-portfolio/stages-data-table/stages-data-table.component').then(c => c.StagesDataTableComponent)
          },
          {
            path: 'gates-data-table',
            loadComponent: () => import('./dashboard-portfolio/gates-data-table/gates-data-table.component').then(c => c.GatesDataTableComponent)
          }
        ]
      },
      {
        path: 'timeline',
        loadComponent: () => import('./dashboard-timeline/dashboard-timeline.component').then(c => c.DashboardTimelineComponent)
      },
      {
        path: 'variance',
        loadComponent: () => import('./dashboard-variance/dashboard-variance.component').then(c => c.DashboardVarianceComponent)
      },
      {
        path: 'buffer',
        loadComponent: () => import('./dashboard-buffer/dashboard-buffer.component').then(c => c.DashboardBufferComponent)
      },
      {
        path: 'delay-reasons',
        loadComponent: () => import('./dashboard-delay-reasons/dashboard-delay-reasons.component').then(c => c.DashboardDelayReasonsComponent)
      },
      {
        path: 'backlog',
        loadComponent: () => import('./dashboard-backlog/dashboard-backlog.component').then(c => c.DashboardBacklogComponent)
      }
    ]
  }
];
