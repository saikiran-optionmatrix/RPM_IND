import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Settings, SettingsService } from '@services/settings.service';

@Component({
  selector: 'app-landing',
  imports: [
    RouterModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  @ViewChild('demosSection') demosSection!: ElementRef<HTMLElement>;
  readonly settingsService = inject(SettingsService);
  get settings(): Settings {
    return this.settingsService.settings;
  }

  ngOnInit() {
    this.settings.rtl = false;
  }

  ngAfterViewInit() {
    this.settings.loadingSpinner.set(false);
  }

  public scrollToDemos() {
    this.demosSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  public changeLayout(menu: any, menuType: any, isRtl: boolean) {
    this.settings.menu = menu;
    this.settings.menuType = menuType;
    this.settings.rtl = isRtl;
    this.settings.theme = 'indigo-light';
  }

  public changeTheme(theme: string) {
    this.settings.theme = theme;
  }

}
