import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltipModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.scss',
})
export class ProjectDashboardComponent implements OnInit, OnDestroy {
  isNavOpen = true;
  isTemplate = false;
  private routerSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.isTemplate =
        params['isTemplate'] === 'true' ||
        params['isTemplate'] === true ||
        params['fromTemplate'] === 'true' ||
        params['fromTemplate'] === true;
      this.checkAndRedirectIfDisabled();
    });

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAndRedirectIfDisabled();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleNav() {
    this.isNavOpen = !this.isNavOpen;
  }

  private checkAndRedirectIfDisabled() {
    if (this.isTemplate) {
      const url = this.router.url;
      const disabledRoutes = [
        '/dashboard/analytics',
        '/dashboard/overview',
        '/dashboard/team',
        '/dashboard/todo',
        '/dashboard/issues',
        '/dashboard/expenses',
        '/dashboard/hours',
        '/dashboard/documents',
        '/dashboard/photos',
        '/dashboard/notes',
        '/dashboard/schedule',
      ];
      if (
        disabledRoutes.some((r) => url.includes(r)) ||
        url.endsWith('/dashboard') ||
        url.endsWith('/dashboard/')
      ) {
        this.router.navigate(['setup'], {
          relativeTo: this.route,
          queryParamsHandling: 'preserve',
        });
      }
    }
  }

  isGatesActive(): boolean {
    const fullUrl = this.router.url;
    const url = fullUrl.split('?')[0];
    if (url.includes('/dashboard/gates')) {
      return true;
    }
    if (
      url.includes('/dashboard/wbs') &&
      (fullUrl.includes('source=gates') ||
        fullUrl.includes('fromGate=true') ||
        fullUrl.includes('gateCode=') ||
        fullUrl.includes('gateName='))
    ) {
      return true;
    }
    return false;
  }

  isStagesActive(): boolean {
    if (this.isGatesActive() || this.isActivitiesActive()) {
      return false;
    }
    const url = this.router.url.split('?')[0];
    return url.includes('/dashboard/stages') || url.includes('/dashboard/wbs');
  }

  isActivitiesActive(): boolean {
    const fullUrl = this.router.url;
    const url = fullUrl.split('?')[0];
    if (url.includes('/dashboard/activities') || url.includes('/dashboard/tasks')) {
      return true;
    }
    if (url.includes('/dashboard/wbs') && fullUrl.includes('source=activities')) {
      return true;
    }
    return false;
  }

  isIssuesActive(): boolean {
    const url = this.router.url.split('?')[0];
    return url.includes('/dashboard/issues');
  }

  isTodoActive(): boolean {
    const url = this.router.url.split('?')[0];
    return url.includes('/dashboard/todo');
  }
}
