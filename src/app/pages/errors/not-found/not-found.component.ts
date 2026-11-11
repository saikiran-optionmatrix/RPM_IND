import { Component, inject } from '@angular/core';
import { Settings, SettingsService } from '../../../services/settings.service';
import { Router, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-not-found',
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private readonly router = inject(Router);
  readonly settingsService = inject(SettingsService);
  get settings(): Settings {
    return this.settingsService.settings;
  }

  searchResult(): void {
    this.router.navigate(['/search']);
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner.set(false);
  }
}
