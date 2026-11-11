// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { publicGuard } from './common/guards/public.guard';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    // Load the pages layout and all its child routes
    loadChildren: () =>
      import('./pages/pages.routes').then((m) => m.routes),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
