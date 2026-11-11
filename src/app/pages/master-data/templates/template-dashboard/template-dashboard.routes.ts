import { Routes } from '@angular/router';
import { TemplateDashboardComponent } from './template-dashboard.component';

export const templateDashboardRoutes: Routes = [
  {
    path: '',
    component: TemplateDashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'npv',
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./template-setup/template-setup.component').then(
            (m) => m.TemplateSetupComponent,
          ),
        data: {
          breadcrumb: 'Setup',
          description: 'Configure the template settings and details.',
        },
      },
      {
        path: 'npv',
        loadComponent: () =>
          import('./template-npv/template-npv.component').then(
            (m) => m.TemplateNpvComponent,
          ),
        data: {
          breadcrumb: 'NPV Calculator',
          description: 'Estimate the template net present value.',
        },
      },
      {
        path: 'stages',
        loadComponent: () =>
          import('./template-stages/template-stages.component').then(
            (m) => m.TemplateStagesComponent,
          ),
        data: {
          breadcrumb: 'Stages',
          description: 'Manage the template lifecycle stages.',
        },
      },
      {
        path: 'stages/wbs',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-stages-wbs.component'
          ).then((m) => m.TemplateStagesWbsComponent),
        data: {
          breadcrumb: 'WBS',
          description: 'Manage Work Breakdown Structure.',
        },
      },
      {
        path: 'stages/wbs/tasks',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-wbs-tasks/template-wbs-tasks.component'
          ).then((m) => m.TemplateWbsTasksComponent),
        data: {
          breadcrumb: 'Tasks',
          description: 'Manage Activity Tasks.',
        },
      },
      {
        path: 'stages/wbs/requirements',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-wbs-requirements/template-wbs-requirements.component'
          ).then((m) => m.TemplateWbsRequirementsComponent),
        data: {
          breadcrumb: 'Requirements',
          description: 'Manage Activity Requirements.',
        },
      },
      {
        path: 'wbs',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-stages-wbs.component'
          ).then((m) => m.TemplateStagesWbsComponent),
        data: {
          breadcrumb: 'WBS',
          description: 'Manage Work Breakdown Structure.',
        },
      },
      {
        path: 'wbs/tasks',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-wbs-tasks/template-wbs-tasks.component'
          ).then((m) => m.TemplateWbsTasksComponent),
        data: {
          breadcrumb: 'Tasks',
          description: 'Manage Activity Tasks.',
        },
      },
      {
        path: 'wbs/requirements',
        loadComponent: () =>
          import(
            './template-stages/template-stages-wbs/template-wbs-requirements/template-wbs-requirements.component'
          ).then((m) => m.TemplateWbsRequirementsComponent),
        data: {
          breadcrumb: 'Requirements',
          description: 'Manage Activity Requirements.',
        },
      },
      {
        path: 'gates',
        loadComponent: () =>
          import('./template-gates/template-gates.component').then(
            (m) => m.TemplateGatesComponent,
          ),
        data: {
          breadcrumb: 'Gates',
          description: 'Track template reviews and decision gates.',
        },
      },
      {
        path: 'gates/activities',
        loadComponent: () =>
          import(
            './template-gates/template-gates-activities/template-gates-activities.component'
          ).then((m) => m.TemplateGatesActivitiesComponent),
        data: {
          breadcrumb: 'Gate Activities',
          description: 'Track gate activities and deliverables.',
        },
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./template-budget/template-budget.component').then(
            (m) => m.TemplateBudgetComponent,
          ),
        data: {
          breadcrumb: 'Budget',
          description: 'Monitor template costs and budget allocation.',
        },
      },
      {
        path: 'scrum',
        loadComponent: () =>
          import('./template-scrum/template-scrum.component').then(
            (m) => m.TemplateScrumComponent,
          ),
        data: {
          breadcrumb: 'Scrum',
          description: 'Plan and manage the template backlog.',
        },
      },
      {
        path: 'backlog',
        redirectTo: 'scrum',
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./template-activities/template-activities.component').then(
            (m) => m.TemplateActivitiesComponent,
          ),
        data: {
          breadcrumb: 'Activities',
          description: 'Track template activities and assigned tasks.',
        },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./template-resources/template-resources.component').then(
            (m) => m.TemplateResourcesComponent,
          ),
        data: {
          breadcrumb: 'Resources',
          description: 'View and manage template resources.',
        },
      },
    ],
  },
];
