import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Settings, SettingsService } from '@services/settings.service';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-register',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly settingsService = inject(SettingsService);
  get settings(): Settings {
    return this.settingsService.settings;
  }

  form: FormGroup = this.fb.group({
    'name': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
    'email': [null, Validators.compose([Validators.required, emailValidator])],
    'password': ['', Validators.required],
    'confirmPassword': ['', Validators.required]
  }, { validator: matchingPasswords('password', 'confirmPassword') });

  onSubmit(values: Object): void {
    if (this.form.valid) {
      this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner.set(false);
  }
}
