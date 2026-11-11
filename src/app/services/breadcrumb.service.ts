import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface BreadcrumbItem {
  name: string;
  url: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly router = inject(Router);

  readonly breadcrumbs = signal<BreadcrumbItem[]>([]);
  readonly currentTitle = signal<string>('');
  readonly currentDescription = signal<string>('');

  constructor() {
    // 1. Parse on direct initialization (handles initial load and direct hits)
    this.buildBreadcrumbs(this.router.routerState.snapshot.root);

    // 2. Parse on every subsequent navigation
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.buildBreadcrumbs(this.router.routerState.snapshot.root);
      });
  }

  private buildBreadcrumbs(rootSnapshot: ActivatedRouteSnapshot): void {
    const items: BreadcrumbItem[] = [];
    this.parseRoute(rootSnapshot, items);

    this.breadcrumbs.set(items);
    if (items.length > 0) {
      const active = items[items.length - 1];
      this.currentTitle.set(active.name);
      this.currentDescription.set(active.description || '');
    } else {
      this.currentTitle.set('');
      this.currentDescription.set('');
    }
  }

  private parseRoute(node: ActivatedRouteSnapshot, items: BreadcrumbItem[]): void {
    if (node.data['breadcrumb']) {
      const url = node.pathFromRoot
        .map((r) => r.url.map((segment) => segment.path).join('/'))
        .filter(Boolean)
        .join('/');

      items.push({
        name: node.data['breadcrumb'],
        url: '/' + url,
        description: node.data['description'],
      });
    }

    if (node.firstChild) {
      this.parseRoute(node.firstChild, items);
    }
  }
}
