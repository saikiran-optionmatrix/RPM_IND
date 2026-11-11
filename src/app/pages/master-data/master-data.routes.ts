// src/app/pages/master-data/master-data.routes.ts
import { Routes } from '@angular/router';
import { MasterDataComponent } from './master-data.component';
import { authGuard } from '../../common/guards/auth.guard';

export const MASTER_DATA_ROUTES: Routes = [
  {
    path: 'template-dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./templates/template-dashboard/template-dashboard.routes').then(
        (m) => m.templateDashboardRoutes,
      ),

      
  },
  {
    path: 'templates/dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./templates/template-dashboard/template-dashboard.routes').then(
        (m) => m.templateDashboardRoutes,
      ),
  },
  {
    path: '',
    component: MasterDataComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'assets',
      },
      {
        path: 'assets',
        loadComponent: () =>
          import('./assets/assets.component').then((m) => m.AssetsComponent),
        data: {
          breadcrumb: 'Resources',
          description: 'Configure and monitor company Resources.',
        },
      },
      {
        path: 'molecules',
        loadComponent: () =>
          import('./molecules/molecules.component').then((m) => m.MoleculesComponent),
        data: {
          breadcrumb: 'Component',
          description: 'Maintain component registries.',
        },
      },
      {
        path: 'inventory-items',
        loadComponent: () =>
          import('./inventory-items/inventory-items.component').then((m) => m.InventoryItemsComponent),
        data: {
          breadcrumb: 'Inventory Items',
          description: 'Track stock balances, lot numbers, and current inventory.',
        },
      },
      {
        path: 'item-categories',
        loadComponent: () =>
          import('./item-categories/item-categories.component').then((m) => m.ItemCategoriesComponent),
        data: {
          breadcrumb: 'Item Categories',
          description: 'Classify inventory items into primary business categories.',
        },
      },
      {
        path: 'item-sub-categories',
        loadComponent: () =>
          import('./item-sub-categories/item-sub-categories.component').then((m) => m.ItemSubCategoriesComponent),
        data: {
          breadcrumb: 'Item Sub Categories',
          description: 'Define granular sub-classifications for inventory items.',
        },
      },
      {
        path: 'facilities',
        loadComponent: () =>
          import('./facilities/facilities.component').then((m) => m.FacilitiesComponent),
        data: {
          breadcrumb: 'Facilities',
          description: 'Manage facility locations, laboratories, and physical spaces.',
        },
      },
      {
        path: 'project-types',
        loadComponent: () =>
          import('./project-types/project-types.component').then((m) => m.ProjectTypesComponent),
        data: {
          breadcrumb: 'Project Types',
          description: 'Configure project delivery models and operational project types.',
        },
      },
      {
        path: 'project-statuses',
        loadComponent: () =>
          import('./project-statuses/project-statuses.component').then((m) => m.ProjectStatusesComponent),
        data: {
          breadcrumb: 'Project Statuses',
          description: 'Set lifecycle status keys and progression milestones.',
        },
      },
      {
        path: 'sections',
        loadComponent: () =>
          import('./sections/sections.component').then((m) => m.SectionsComponent),
        data: {
          breadcrumb: 'Sections',
          description: 'Configure organizational sections and business divisions.',
        },
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./departments/departments.component').then((m) => m.DepartmentsComponent),
        data: {
          breadcrumb: 'Departments',
          description: 'Organize team structures and corporate departments.',
        },
      },
      {
        path: 'divisions',
        loadComponent: () =>
          import('./divisions/divisions.component').then((m) => m.DivisionsComponent),
        data: {
          breadcrumb: 'Divisions',
          description: 'Configure and monitor company business divisions.',
        },
      },
      {
        path: 'job-codes',
        loadComponent: () =>
          import('./job-codes/job-codes.component').then((m) => m.JobCodesComponent),
        data: {
          breadcrumb: 'Job Codes',
          description: 'Maintain standardized employee and role job codes.',
        },
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./tags/tags.component').then((m) => m.TagsComponent),
        data: {
          breadcrumb: 'Tags',
          description: 'The tag master can be managed here.',
        },
      },
      {
        path: 'groups',
        loadComponent: () =>
          import('./groups/groups.component').then((m) => m.GroupsComponent),
        data: {
          breadcrumb: 'Groups',
          description: 'The list of groups can be managed here.',
        },
      },
      {
        path: 'sites',
        loadComponent: () =>
          import('./sites/sites.component').then((m) => m.SitesComponent),
        data: {
          breadcrumb: 'Locations',
          description: 'The list of Locations can be managed here.',
        },
      },
      {
        path: 'states',
        loadComponent: () =>
          import('./states/states.component').then((m) => m.StatesComponent),
        data: {
          breadcrumb: 'States',
          description: 'The list of states can be managed here.',
        },
      },
      {
        path: 'cities',
        loadComponent: () =>
          import('./cities/cities.component').then((m) => m.CitiesComponent),
        data: {
          breadcrumb: 'Cities',
          description: 'The list of cities can be managed here.',
        },
      },
      {
        path: 'templates',
        loadComponent: () =>
          import('./templates/templates.component').then((m) => m.TemplatesComponent),
        data: {
          breadcrumb: 'Templates',
          description: 'The list of templates can be managed here.',
        },
      },

      
      {
        path: 'delay-reasons',
        loadComponent: () =>
          import('./delay-reasons/delay-reasons.component').then((m) => m.DelayReasonsComponent),
        data: {
          breadcrumb: 'Delay Reasons',
          description: 'The list of delay reasons can be managed here.',
        },
      },
      {        path: 'dependency-type',
        loadComponent: () =>
          import('./dependency-type/dependency-type.component').then((m) => m.DependencyTypeComponent),
        data: {
          breadcrumb: 'Dependency Type',
          description: 'The list of Dependency Type can be Viewed.',
        },
      },
      {
        path: 'ttd-master',
        loadComponent: () =>
          import('./ttd-master/ttd-master.component').then((m) => m.TtdMasterComponent),
        data: {
          breadcrumb: 'TTD Master',
          description: 'The list of TTD Master can be Viewed.',
        },
      },



    ],
  },
];
