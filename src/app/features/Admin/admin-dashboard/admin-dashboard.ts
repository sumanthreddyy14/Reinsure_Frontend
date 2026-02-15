import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, catchError, startWith, combineLatest, of, shareReplay } from 'rxjs';
import { DashboardCards } from '../dashboard-cards/dashboard-cards';
import { ExpiryAlert } from '../expiry-alert/expiry-alert';
import { QuickLinks } from '../quick-links/quick-links';
import { TreatyService } from '../../../services/treaty.service';
import { RecoveryService } from '../../../services/recovery.service';

type ExpiredVM = { id: string; name: string; endDate: Date };

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardCards, ExpiryAlert, QuickLinks],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard {
  private treatyService = inject(TreatyService);
  private recoveryService = inject(RecoveryService);

  // Emit right away with startWith to render the shell immediately.
  // Also catch errors so the template still renders instead of disappearing.
  activeTreaties$ = this.treatyService.list().pipe(
    map(treaties => treaties.filter(t => t.status === 'ACTIVE').length),
    startWith(0),
    catchError(err => {
      console.error('[activeTreaties error]', err);
      return of(0);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  expiredTreaties$ = this.treatyService.list().pipe(
    map(treaties =>
      treaties
        .filter(t => t.status === 'EXPIRED')
        .map(t => ({
          id: t.treatyId,
          name: t.treatyId,
          endDate: new Date(t.endDate),
        }) as ExpiredVM)
    ),
    startWith([] as ExpiredVM[]),
    catchError(err => {
      console.error('[expiredTreaties error]', err);
      return of([] as ExpiredVM[]);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  pendingRecoveries$ = this.recoveryService.list().pipe(
    map(recoveries => recoveries.filter(r => r.status === 'PENDING').length),
    startWith(0),
    catchError(err => {
      console.error('[pendingRecoveries error]', err);
      return of(0);
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Optional: consolidate to a single view model to keep the template clean
  vm$ = combineLatest({
    active: this.activeTreaties$,
    pending: this.pendingRecoveries$,
    expired: this.expiredTreaties$,
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
}