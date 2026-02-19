import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Recovery } from '../../../models/recovery.model';
import { RecoveryService } from '../../../services/recovery.service';
import { SettlementTimeline } from '../settlement-timeline/settlement-timeline';
import { StatusBadge } from '../status-badge/status-badge';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';

@Component({
  selector: 'app-recovery-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,RouterLink,SettlementTimeline,StatusBadge,FinanceDashboard],
  templateUrl: './recovery-detail.html',
  styleUrls: ['./recovery-detail.css']
})
export class RecoveryDetail implements OnInit {
  recovery?: Recovery;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private recoveryService: RecoveryService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

ngOnInit(): void {
  // Skip during SSR
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.loading = true;
      this.recoveryService.getById(id).subscribe({
        next: r => {
          this.recovery = r;
          this.loading = false;
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('recovery-detail getById failed:', err);
          this.recovery = undefined;
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.loading = false;
      this.cdr.markForCheck();
    }
  });
}
}
