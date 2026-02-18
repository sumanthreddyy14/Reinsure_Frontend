import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';
import { TreatyService } from '../../../services/treaty.service';

import type { Treaty } from '../../../models/treaty.model';
import type { AnalyticsData, RiskExposure } from '../../../models/analytics.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../../models/material.module';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';
import { finalize } from 'rxjs';

@Component({
    standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule, // 👈 REQUIRED for mat-table structural directives
    MatButtonModule,
    FinanceDashboard,
    MatFormFieldModule,
    MaterialModule
],
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.html',
  styleUrls: ['./management-dashboard.css']
})
export class ManagementDashboard implements OnInit {
  treaties: Treaty[] = [];
  selectedTreatyId?: string;

  exposure?: AnalyticsData<RiskExposure>;
  loading = false;
  errorMsg?: string;

  constructor(
    private analytics: AnalyticsService,
    private treatyService: TreatyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTreaties();
  }

  private loadTreaties(): void {
    this.treatyService.list().subscribe({
      next: (ts: Treaty[]) => {
        this.treaties = ts ?? [];
        const active = this.treaties.find(t => t.status === 'ACTIVE');
        this.selectedTreatyId = (active ?? this.treaties[0])?.treatyId;

        if (this.selectedTreatyId) {
          this.loadExposure(this.selectedTreatyId);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load treaties.';
      }
    });
  }

  loadExposure(treatyId: string): void {
    this.exposure = undefined;
    this.errorMsg = undefined;
    this.loading = true;

    this.analytics.getRiskExposureByTreaty(treatyId).subscribe({
      next: (res: AnalyticsData<RiskExposure>) => {
        this.exposure = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = `Failed to load exposure for ${treatyId}.`;
        this.loading = false;
      }
    });
  }

  onTreatyChange(tid: string): void {
    this.selectedTreatyId = tid;
    this.loadExposure(tid);
  }
  
// -------- Template helpers (avoid arrow functions in HTML) --------
  getSelectedTreaty(): Treaty | undefined {
    if (!this.selectedTreatyId) return undefined;
    return this.treaties.find(t => t.treatyId === this.selectedTreatyId);
  }

  getSelectedReinsurerName(): string {
    return this.getSelectedTreaty()?.reinsurerName ?? '—';
  }

  trackByTreaty(_: number, t: Treaty) { return t.treatyId; }
}
