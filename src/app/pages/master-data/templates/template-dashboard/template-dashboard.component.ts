import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreadcrumbComponent } from '../../../../theme/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-template-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    BreadcrumbComponent,
  ],
  templateUrl: './template-dashboard.component.html',
  styleUrl: './template-dashboard.component.scss',
})
export class TemplateDashboardComponent {
  isNavOpen = true;

  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
