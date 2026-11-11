import { Component, inject } from '@angular/core';
import { Settings, SettingsService } from '../../../services/settings.service';
import { Router, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-error',
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent { 
  private readonly router = inject(Router);
  readonly settingsService = inject(SettingsService); 
  get settings(): Settings {
    return this.settingsService.settings;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner.set(false);
  }
}
