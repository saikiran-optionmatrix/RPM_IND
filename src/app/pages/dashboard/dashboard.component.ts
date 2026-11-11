import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Make sure standalone is set to true
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
