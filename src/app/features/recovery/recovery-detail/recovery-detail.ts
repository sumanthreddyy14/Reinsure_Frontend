import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private recoveryService: RecoveryService
  ) {}
 // recovery-detail.ts
// ngOnInit(): void {
//   const id = this.route.snapshot.paramMap.get('id');
//   if (id) {
//     this.recoveryService.getById(id).subscribe({
//       next: (r) => this.recovery = r,
//       error: () => this.recovery = undefined
//     });
//   }
// }
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  console.log('detail id:', id);
  if (id) {
    this.recoveryService.getById(id).subscribe({
      next: r => this.recovery = r,
      error: err => {
        console.error('getById failed', err);
        this.recovery = undefined;
      }
    });
  }
}
}
