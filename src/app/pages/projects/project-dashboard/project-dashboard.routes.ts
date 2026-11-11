import { Routes } from '@angular/router';
import { ProjectDashboardComponent } from './project-dashboard.component';

export const projectDashboardRoutes: Routes = [
  {
    path: '',
    component: ProjectDashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'analytics',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./project-analytics/project-analytics.component').then(
            (m) => m.ProjectAnalyticsComponent,
          ),
        data: { breadcrumb: 'Analytics', description: 'Review project performance and trends.' },
      },
      {
        path: 'npv',
        loadComponent: () =>
          import('./project-npv-calculator/project-npv-calculator.component').then(
            (m) => m.ProjectNpvCalculatorComponent,
          ),
        data: {
          breadcrumb: 'NPV Calculator',
          description: 'Estimate the project net present value.',
        },
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./project-overview/project-overview.component').then(
            (m) => m.ProjectOverviewComponent,
          ),
        data: { breadcrumb: 'Overview', description: 'View the project summary and key details.' },
      },
      {
        path: 'setup',
        loadComponent: () =>
          import('./project-setup/project-setup.component').then((m) => m.ProjectSetupComponent),
        data: { breadcrumb: 'Setup', description: 'Configure the project settings and details.' },
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./project-team/project-team.component').then((m) => m.ProjectTeamComponent),
        data: { breadcrumb: 'Team', description: 'Manage project members and responsibilities.' },
      },
      {
        path: 'stages',
        loadComponent: () =>
          import('./project-stages/project-stages.component').then((m) => m.ProjectStagesComponent),
        data: { breadcrumb: 'Stages', description: 'Manage the project lifecycle stages.' },
      },
      {
        path: 'stages/history',
        loadComponent: () =>
          import(
            './project-stages/project-stages-history/project-stages-history.component'
          ).then((m) => m.ProjectStagesHistoryComponent),
        data: { breadcrumb: 'Stage History', description: 'View stage change history.' },
      },
      {
        path: 'stages-history',
        loadComponent: () =>
          import(
            './project-stages/project-stages-history/project-stages-history.component'
          ).then((m) => m.ProjectStagesHistoryComponent),
        data: { breadcrumb: 'Stage History', description: 'View stage change history.' },
      },
      {
        path: 'stages/wbs',
        loadChildren: () =>
          import('./project-stages/project-wbs/project-wbs.routes').then(
            (m) => m.projectWbsRoutes,
          ),
      },
      {
        path: 'wbs',
        loadChildren: () =>
          import('./project-stages/project-wbs/project-wbs.routes').then(
            (m) => m.projectWbsRoutes,
          ),
      },
      {
        path: 'gates',
        loadComponent: () =>
          import('./project-gates/project-gates.component').then((m) => m.ProjectGatesComponent),
        data: { breadcrumb: 'Gates', description: 'Track project reviews and decision gates.' },
      },
      {
        path: 'gates/history',
        loadComponent: () =>
          import(
            './project-gates/project-gates-history/project-gates-history.component'
          ).then((m) => m.ProjectGatesHistoryComponent),
        data: { breadcrumb: 'Gate History', description: 'View gate change history.' },
      },
      {
        path: 'gates-history',
        loadComponent: () =>
          import(
            './project-gates/project-gates-history/project-gates-history.component'
          ).then((m) => m.ProjectGatesHistoryComponent),
        data: { breadcrumb: 'Gate History', description: 'View gate change history.' },
      },
      {
        path: 'gates/activities',
        loadComponent: () =>
          import(
            './project-gates/proj-gates-activities/proj-gates-activities.component'
          ).then((m) => m.ProjGatesActivitiesComponent),
        data: {
          breadcrumb: 'Gate Activities',
          description: 'Track gate activities and deliverables.',
        },
      },
      {
        path: 'gates/activities/history',
        loadComponent: () =>
          import(
            './project-gates/proj-gates-activities/gates-activity-history/gates-activity-history.component'
          ).then((m) => m.GatesActivityHistoryComponent),
        data: {
          breadcrumb: 'Gate Activity History',
          description: 'Track gate activity revisions and change history.',
        },
      },
      {
        path: 'budget',
        loadComponent: () =>
          import('./project-budget/project-budget.component').then((m) => m.ProjectBudgetComponent),
        data: { breadcrumb: 'Budget', description: 'Monitor project costs and budget allocation.' },
      },
      {
        path: 'backlog',
        loadComponent: () =>
          import('./project-scrum/project-scrum.component').then((m) => m.ProjectScrumComponent),
        data: { breadcrumb: 'Scrum', description: 'Plan and manage the project backlog.' },
      },
      {
        path: 'backlog/history',
        loadComponent: () =>
          import(
            './project-scrum/project-scrum-hitory/project-scrum-hitory.component'
          ).then((m) => m.ProjectScrumHitoryComponent),
        data: { breadcrumb: 'Scrum History', description: 'View scrum task history.' },
      },
      {
        path: 'scrum/history',
        loadComponent: () =>
          import(
            './project-scrum/project-scrum-hitory/project-scrum-hitory.component'
          ).then((m) => m.ProjectScrumHitoryComponent),
        data: { breadcrumb: 'Scrum History', description: 'View scrum task history.' },
      },
      {
        path: 'activities',
        loadComponent: () =>
          import('./project-activities/project-activities.component').then(
            (m) => m.ProjectActivitiesComponent,
          ),
        data: {
          breadcrumb: 'Activities',
          description: 'Track project activities and assigned tasks.',
        },
      },
      {
        path: 'activities/history',
        loadComponent: () =>
          import(
            './project-activities/project-activities-history/project-activities-history.component'
          ).then((m) => m.ProjectActivitiesHistoryComponent),
        data: {
          breadcrumb: 'Activities History',
          description: 'Track project activity revision history.',
        },
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./project-activities/project-activities.component').then(
            (m) => m.ProjectActivitiesComponent,
          ),
        data: {
          breadcrumb: 'Activities',
          description: 'Track project activities and assigned tasks.',
        },
      },
      {
        path: 'tasks/history',
        loadComponent: () =>
          import(
            './project-activities/project-activities-history/project-activities-history.component'
          ).then((m) => m.ProjectActivitiesHistoryComponent),
        data: {
          breadcrumb: 'Tasks History',
          description: 'Track project task revision history.',
        },
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./project-schedule/project-schedule.component').then(
            (m) => m.ProjectScheduleComponent,
          ),
        data: { breadcrumb: 'Schedule', description: 'Plan dates, milestones, and deliverables.' },
      },
      {
        path: 'schedule/tasks',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks.component'
          ).then((m) => m.ProjectSchedulingTasksComponent),
        data: {
          breadcrumb: 'Scheduling Tasks',
          description: 'View and manage schedule tasks.',
        },
      },
      {
        path: 'schedule/tasks/history',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks-history/project-scheduling-tasks-history.component'
          ).then((m) => m.ProjectSchedulingTasksHistoryComponent),
        data: {
          breadcrumb: 'Scheduling Tasks History',
          description: 'View schedule task revision history.',
        },
      },
      {
        path: 'schedule-tasks',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks.component'
          ).then((m) => m.ProjectSchedulingTasksComponent),
        data: {
          breadcrumb: 'Scheduling Tasks',
          description: 'View and manage schedule tasks.',
        },
      },
      {
        path: 'schedule-tasks-history',
        loadComponent: () =>
          import(
            './project-schedule/project-scheduling-tasks/project-scheduling-tasks-history/project-scheduling-tasks-history.component'
          ).then((m) => m.ProjectSchedulingTasksHistoryComponent),
        data: {
          breadcrumb: 'Scheduling Tasks History',
          description: 'View schedule task revision history.',
        },
      },
      {
        path: 'todo',
        loadComponent: () =>
          import('./project-todo/project-todo.component').then((m) => m.ProjectTodoComponent),
        data: { breadcrumb: 'To do', description: 'Manage your outstanding project tasks.' },
      },
      {
        path: 'todo/history',
        loadComponent: () =>
          import(
            './project-todo/project-todo-history/project-todo-history.component'
          ).then((m) => m.ProjectTodoHistoryComponent),
        data: { breadcrumb: 'To do History', description: 'View to do change history.' },
      },
      {
        path: 'todo-history',
        loadComponent: () =>
          import(
            './project-todo/project-todo-history/project-todo-history.component'
          ).then((m) => m.ProjectTodoHistoryComponent),
        data: { breadcrumb: 'To do History', description: 'View to do change history.' },
      },
      {
        path: 'materials',
        loadComponent: () =>
          import('./project-materials/project-materials.component').then(
            (m) => m.ProjectMaterialsComponent,
          ),
        data: { breadcrumb: 'Materials', description: 'Track materials required for the project.' },
      },
      {
        path: 'materials/history',
        loadComponent: () =>
          import(
            './project-materials/project-materials-history/project-materials-history.component'
          ).then((m) => m.ProjectMaterialsHistoryComponent),
        data: { breadcrumb: 'Materials History', description: 'View material requisition history.' },
      },
      {
        path: 'materials-history',
        loadComponent: () =>
          import(
            './project-materials/project-materials-history/project-materials-history.component'
          ).then((m) => m.ProjectMaterialsHistoryComponent),
        data: { breadcrumb: 'Materials History', description: 'View material requisition history.' },
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./project-resources/project-resources.component').then(
            (m) => m.ProjectResourcesComponent,
          ),
        data: { breadcrumb: 'Resources', description: 'View and manage project resources.' },
      },
      {
        path: 'resources/history',
        loadComponent: () =>
          import(
            './project-resources/project-resources-history/project-resources-history.component'
          ).then((m) => m.ProjectResourcesHistoryComponent),
        data: { breadcrumb: 'Resources History', description: 'View resource history.' },
      },
      {
        path: 'resources-history',
        loadComponent: () =>
          import(
            './project-resources/project-resources-history/project-resources-history.component'
          ).then((m) => m.ProjectResourcesHistoryComponent),
        data: { breadcrumb: 'Resources History', description: 'View resource history.' },
      },
      {
        path: 'issues',
        loadComponent: () =>
          import('./project-issues/project-issues.component').then((m) => m.ProjectIssuesComponent),
        data: { breadcrumb: 'Issues', description: 'Identify and resolve project issues.' },
      },
      {
        path: 'issues/history',
        loadComponent: () =>
          import(
            './project-issues/project-issues-history/project-issues-history.component'
          ).then((m) => m.ProjectIssuesHistoryComponent),
        data: { breadcrumb: 'Issues History', description: 'View project issues history.' },
      },
      {
        path: 'issues-history',
        loadComponent: () =>
          import(
            './project-issues/project-issues-history/project-issues-history.component'
          ).then((m) => m.ProjectIssuesHistoryComponent),
        data: { breadcrumb: 'Issues History', description: 'View project issues history.' },
      },
      {
        path: 'hours',
        loadComponent: () =>
          import('./project-hours/project-hours.component').then((m) => m.ProjectHoursComponent),
        data: { breadcrumb: 'Hours', description: 'Track time spent on project work.' },
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./project-documents/project-documents.component').then(
            (m) => m.ProjectDocumentsComponent,
          ),
        data: { breadcrumb: 'Documents', description: 'Store and manage project documents.' },
      },
      {
        path: 'notes',
        loadComponent: () =>
          import('./project-notes/project-notes.component').then((m) => m.ProjectNotesComponent),
        data: { breadcrumb: 'Notes', description: 'Capture and organize project notes.' },
      },
      {
        path: 'notes/history',
        loadComponent: () =>
          import(
            './project-notes/project-notes-history/project-notes-history.component'
          ).then((m) => m.ProjectNotesHistoryComponent),
        data: { breadcrumb: 'Notes History', description: 'View project notes history.' },
      },
      {
        path: 'notes-history',
        loadComponent: () =>
          import(
            './project-notes/project-notes-history/project-notes-history.component'
          ).then((m) => m.ProjectNotesHistoryComponent),
        data: { breadcrumb: 'Notes History', description: 'View project notes history.' },
      },
      {
        path: 'ttd',
        loadComponent: () =>
          import('./project-ttd/project-ttd.component').then((m) => m.ProjectTtdComponent),
        data: { breadcrumb: 'Technology Transfer Dossier', description: 'View project and Manage technology transfer documentation.' },
      },
      {
        path: 'sourcing',
        loadComponent: () =>
          import('./project-sourcing/project-sourcing.component').then((m) => m.ProjectSourcingComponent),
        data: { breadcrumb: 'Sourcing', description: 'View project and Manage sourcing.' },
      }
    ],
  },
];
