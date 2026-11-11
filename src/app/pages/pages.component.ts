import {
  Component,
  ElementRef,
  AfterViewInit,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { Settings, SettingsService } from '../services/settings.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { UserMenuComponent } from '../theme/components/user-menu/user-menu.component';
import { HorizontalMenuComponent } from '../theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { FullScreenComponent } from '../theme/components/fullscreen/fullscreen.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MonitorStateService } from './monitor/monitor-state.service';

export interface AiChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

@Component({
  selector: 'app-pages',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    FullScreenComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MessagesComponent,
    FlexLayoutModule,
    UserMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('backToTop') backToTop: any;
  @ViewChild('mainSidenavContent') mainSidenavContent: any;
  @ViewChild('mainContent') mainContent!: ElementRef;
  @ViewChild('aiChatBody') private aiChatBody?: ElementRef<HTMLDivElement>;
  @ViewChild('aiInputField') private aiInputField?: ElementRef<HTMLInputElement>;

  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute); // Injected to read route data
  readonly settingsService = inject(SettingsService);
  readonly monitorStateService = inject(MonitorStateService);

  // Generic signal that listens to the router data instead of hardcoded URLs
  protected readonly isFullBleed = signal(false);

  // AI Agent signals and reactive state
  public readonly isAiOpen = signal(false);
  public readonly isAiTyping = signal(false);
  public readonly aiInputText = signal('');
  public readonly aiMessages = signal<AiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello! 👋 I am your PRAGATI AI Assistant. Ask me anything about project stages, gate reviews, or resource allocations.',
      time: this.formatTime(new Date())
    }
  ]);

  public readonly aiSuggestions: string[] = [
    '📊 Project Health Summary',
    '🚪 Pending Gate Reviews',
    '👥 Resource Allocations',
    '⚡ Stage Progress'
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        // Traverse to the lowest active child route
        let currentRoute = this.activatedRoute.root;
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        // Check if the leaf route has the 'fullBleed' flag set to true
        this.isFullBleed.set(currentRoute.snapshot.data['fullBleed'] === true);
      });
  }

  get settings(): Settings {
    return this.settingsService.settings;
  }

  ngOnInit(): void {
    this.settings.menu = 'horizontal';
    this.settings.sidenavIsOpened = false;
    this.settings.sidenavIsPinned = false;
  }

  ngAfterViewInit(): void {
    this.settings.loadingSpinner.set(false);
    if (this.backToTop) {
      this.backToTop.nativeElement.style.display = 'none';
    }
  }

  public onPageScroll(event: any): void {
    if (!this.backToTop) return;

    this.backToTop.nativeElement.style.display = event.target.scrollTop > 300 ? 'flex' : 'none';

    const horizontalMenu = document.querySelector('#horizontal-menu');
    if (!horizontalMenu) return;

    if (event.target.scrollTop > 56) {
      horizontalMenu.classList.add('sticky');
      event.target.classList.add('horizontal-menu-hidden');
    } else {
      horizontalMenu.classList.remove('sticky');
      event.target.classList.remove('horizontal-menu-hidden');
    }
  }

  public scrollToTop(): void {
    this.mainSidenavContent?.scrollTo({ top: 0 });
    this.mainContent?.nativeElement?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public openBacklog(): void {
    this.monitorStateService.setOverdue(true);
    const urlParts = this.router.url.split('?');
    const currentPath = urlParts[0];
    const targetPath = (currentPath.startsWith('/monitor') && currentPath !== '/monitor')
      ? currentPath
      : '/monitor/activities';

    this.router.navigate([targetPath], {
      queryParams: { overdue: 'true' },
      queryParamsHandling: 'merge'
    });
  }

  public openSettings(): void {
    this.router.navigate(['/settings']);
  }

  // AI Agent Interactions
  public toggleAi(): void {
    const nextState = !this.isAiOpen();
    this.isAiOpen.set(nextState);
    if (nextState) {
      setTimeout(() => {
        this.scrollAiToBottom();
        this.aiInputField?.nativeElement?.focus();
      }, 150);
    }
  }

  public closeAi(): void {
    this.isAiOpen.set(false);
  }

  public clearAiChat(): void {
    this.aiMessages.set([
      {
        id: 'reset-' + Date.now(),
        sender: 'ai',
        text: 'Conversation reset. How can I assist you with your projects today?',
        time: this.formatTime(new Date())
      }
    ]);
  }

  public selectAiSuggestion(suggestion: string): void {
    this.aiInputText.set(suggestion);
    this.submitAiMessage();
  }

  public onAiInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.aiInputText.set(val);
  }

  public submitAiMessage(): void {
    const query = this.aiInputText().trim();
    if (!query || this.isAiTyping()) return;

    const userMsg: AiChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      time: this.formatTime(new Date())
    };

    this.aiMessages.update(msgs => [...msgs, userMsg]);
    this.aiInputText.set('');
    this.isAiTyping.set(true);
    this.scrollAiToBottom();

    setTimeout(() => {
      const response = this.generateAiResponse(query);
      const aiMsg: AiChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response,
        time: this.formatTime(new Date())
      };
      this.aiMessages.update(msgs => [...msgs, aiMsg]);
      this.isAiTyping.set(false);
      this.scrollAiToBottom();
    }, 700);
  }

  private generateAiResponse(query: string): string {
    const lower = query.toLowerCase();
    if (lower.includes('gate')) {
      return '🚪 Gate Reviews: Gate 2 for "Internal Tooling Migration" passed with 100% compliance. Next Gate 3 review for "Alpha Core" is scheduled for this Friday at 2:00 PM.';
    } else if (lower.includes('resource') || lower.includes('team') || lower.includes('capacity')) {
      return '👥 Resource Allocation: Overall team capacity is at 82%. 4 active engineers are assigned to critical path items, with 2 specialists available for new sprint tasks.';
    } else if (lower.includes('project') || lower.includes('health') || lower.includes('status')) {
      return '📊 Project Health: 8 projects active. 7 projects are on track (🟢), 1 requires milestone review (🟡). Overall progress average is 68%.';
    } else if (lower.includes('stage') || lower.includes('wbs') || lower.includes('task')) {
      return '⚡ Stage Breakdown: Initiation (1), Design & Architecture (3), Development (4), Validation & Gate (2). No critical blockers reported.';
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return '👋 Hello! I am here to help you monitor projects, track gates, and inspect resources. What would you like to review?';
    } else {
      return `✨ I've processed your query regarding "${query}". All RPM metrics and module states are currently synchronized.`;
    }
  }

  private scrollAiToBottom(): void {
    setTimeout(() => {
      if (this.aiChatBody) {
        this.aiChatBody.nativeElement.scrollTop = this.aiChatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
