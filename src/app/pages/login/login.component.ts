import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Settings, SettingsService } from '@services/settings.service';
import { AuthService } from '@services/auth.service';
import { emailValidator } from '../../theme/utils/app-validators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',

  imports: [ReactiveFormsModule, RouterLink, MatIconModule],

  templateUrl: './login.component.html',

  styleUrl: './login.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements AfterViewInit {
  protected readonly authError = signal<string | null>(null);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly formBuilder = inject(FormBuilder);

  private readonly settingsService = inject(SettingsService);

  private readonly authService = inject(AuthService);

  protected readonly passwordVisible = signal(false);

  protected readonly submitted = signal(false);

  protected readonly form = this.formBuilder.nonNullable.group({
    email: ['admin@optionmatrix.com', [Validators.required, emailValidator]],

    password: ['admin@123', [Validators.required, Validators.minLength(6)]],

    rememberMe: false,
  });

  get settings(): Settings {
    return this.settingsService.settings;
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner.set(false);
  }

  protected submit(): void {
    this.submitted.set(true);
    this.authError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.getRawValue();

    if (credentials.email === 'admin@optionmatrix.com' && credentials.password === 'admin@123') {
      console.log('Login successful');

      // 1. Establish the session via AuthService
      this.authService.login(
        'mock-jwt-token-12345',
        { id: '1', email: credentials.email, name: 'Admin User' },
        credentials.rememberMe,
      );

      // 2. Redirect to the intended URL if intercepted by AuthGuard, or fallback to dashboard
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      console.warn('Login failed: Incorrect credentials');
      this.authError.set('Invalid email or password. Please try again.');
    }
  }
}
