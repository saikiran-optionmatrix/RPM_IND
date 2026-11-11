import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-roles-users',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, FlexLayoutModule],
  templateUrl: './roles-users.component.html',
  styleUrl: './roles-users.component.scss',
})
export class RolesUsersComponent {}
