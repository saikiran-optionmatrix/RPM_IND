import { Component, ViewEncapsulation, ChangeDetectionStrategy, inject } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
    selector: 'app-user-menu',
    imports: [
        RouterModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule
    ],
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
    // Note: Changed from invalid 'Eager' to standard 'OnPush' for modern performance
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UserMenuComponent {
    public userImage = 'img/users/user.jpg';

    // Inject the authentication service using the modern standard
    protected readonly authService = inject(AuthService);

    protected logout(): void {
        this.authService.logout();
    }
}
