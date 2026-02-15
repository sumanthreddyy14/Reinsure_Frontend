
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics.service';
import type {
  AnalyticsData,
  DashboardKPI,
  TreatyPerformanceSummary
} from '../../../models/analytics.model';
import type { FinanceFilters } from '../../../models/finance.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from "../../../models/material.module";
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule, // 👈 REQUIRED for mat-table structural directives
    MatButtonModule,
    MatFormFieldModule,
    MaterialModule,
    FinanceDashboard
],
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.html',
  styleUrls: ['./analytics-dashboard.css']
})
export class AnalyticsDashboard implements OnInit {
  kpi?: AnalyticsData<DashboardKPI>;
  summaries: TreatyPerformanceSummary[] = [];
  loading = false;

  // Example filter (set via form if you add one)
  filters: FinanceFilters = {
    from: '2025-01-01',
    to: '2025-12-31'
  };

  constructor(private analytics: AnalyticsService) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;

    this.analytics.getDashboardKpis(this.filters).subscribe({
      next: res => this.kpi = res,
      error: err => console.error(err),
    });

    this.analytics.getTreatyPerformanceSummaries(this.filters).subscribe({
      next: res => {
        this.summaries = res.data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  trackByTreaty(_: number, s: TreatyPerformanceSummary) { return s.treatyId; }
}

