import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { MonitorStateService } from './monitor-state.service';

@Component({
    selector: 'app-monitor',
    standalone: true,
    imports: [
        FlexLayoutModule,
        MatCardModule,
        MatIconModule,
        RouterModule,
        MatButtonModule
    ],
    templateUrl: './monitor.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './monitor.component.scss'
})
export class MonitorComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly monitorStateService = inject(MonitorStateService);
    private readonly cdr = inject(ChangeDetectorRef);
    private querySub?: Subscription;

    ngOnInit(): void {
        this.querySub = this.route.queryParams.subscribe(params => {
            this.monitorStateService.setOverdue(params['overdue'] === 'true');
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy(): void {
        this.monitorStateService.setOverdue(false);
        this.querySub?.unsubscribe();
    }
}

