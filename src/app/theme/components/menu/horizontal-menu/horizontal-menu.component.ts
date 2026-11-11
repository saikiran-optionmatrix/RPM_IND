import { Component, OnInit, Input, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router'; 
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuService } from '../../../../services/menu.service';
import { Settings, SettingsService } from '../../../../services/settings.service';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MonitorStateService } from '../../../../pages/monitor/monitor-state.service';

@Component({
    selector: 'app-horizontal-menu',
    imports: [
        RouterModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './horizontal-menu.component.html',
    styleUrls: ['./horizontal-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    encapsulation: ViewEncapsulation.None
})
export class HorizontalMenuComponent implements OnInit {
  @Input('menuParentId') menuParentId: any;
  public menuItems: Array<any>;
  public settings: Settings;
  public backlogText = 'Backlog - 078';
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(
    public settingsService: SettingsService, 
    public menuService: MenuService, 
    public router: Router,
    public monitorStateService: MonitorStateService
  ) { 
    this.settings = this.settingsService.settings;
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

  ngOnInit() {
    this.menuItems = this.menuService.getHorizontalMenuItems();
    this.menuItems = this.menuItems.filter(item => item.parentId == this.menuParentId);
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(this.settings.fixedHeader){
          let mainContent = document.getElementById('main-content');
          if(mainContent){
            mainContent.scrollTop = 0;
          }
        }
        else{
          document.getElementsByClassName('mat-drawer-content')[0].scrollTop = 0;
        }
      }                
    });
  } 

}