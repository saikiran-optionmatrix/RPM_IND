import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { UsersData } from '@data/users-data';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withPreloading(PreloadAllModules),  // comment this line for enable lazy-loading
    ),

    provideHttpClient(withXhr()),
    importProvidersFrom(InMemoryWebApiModule.forRoot(UsersData, { delay: 1000 })),
    provideNativeDateAdapter(),
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
  ]
};

