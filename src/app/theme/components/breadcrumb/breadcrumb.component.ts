import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Settings, SettingsService } from '../../../services/settings.service';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  name: string;
  url: string;
  description?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [
    FlexLayoutModule,
    RouterModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly settingsService = inject(SettingsService);
  private readonly cdr = inject(ChangeDetectorRef);

  public breadcrumbs: BreadcrumbItem[] = [];
  public settings: Settings = this.settingsService.settings;

  ngOnInit(): void {
    // 1. Initial build on component load
    this.refreshBreadcrumbs();

    // 2. Re-build on route changes
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.refreshBreadcrumbs();
      });
  }

private refreshBreadcrumbs(): void {
    this.breadcrumbs = [];
    this.parseRoute(this.router.routerState.snapshot.root);

    if (this.breadcrumbs.length > 0) {
      // 1. Extract just the names
      // 2. Filter out consecutive duplicates ONLY for the tab title
      const uniqueTitles = this.breadcrumbs
        .map(b => b.name)
        .filter((name, index, self) => index === 0 || name !== self[index - 1]);

      // 3. Set the browser tab title
      const pageTitle = uniqueTitles.join(' > ');
      this.title.setTitle(`${this.settings.name} > ${pageTitle}`);
    }

    // Force update under OnPush strategy
    this.cdr.markForCheck();
  }

  private parseRoute(node: ActivatedRouteSnapshot): void {
    if (node.data['breadcrumb']) {
      const url = '/' + node.pathFromRoot
        .map(r => r.url.map(s => s.path).join('/'))
        .filter(Boolean)
        .join('/');

      this.breadcrumbs.push({
        name: node.data['breadcrumb'],
        url,
        description: node.data['description']
      });
    }

    // Traverse all children, not just firstChild
    for (const child of node.children) {
      this.parseRoute(child);
    }
  }
}
