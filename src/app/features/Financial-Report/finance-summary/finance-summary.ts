import { Component, Input, OnChanges, SimpleChanges, OnInit, ChangeDetectorRef } from '@angular/core';
import { FinanceFilters, FinancialMetrics } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-finance-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, DecimalPipe],
  templateUrl: './finance-summary.html',
  styleUrl: './finance-summary.css',
})
export class FinanceSummary implements OnInit, OnChanges {
  @Input() filters: FinanceFilters = {};
  summary?: FinancialMetrics;
  loading = false;

  constructor(private financeService: FinanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If other modules change filters, we re-fetch from DB
    if (changes['filters']) {
      this.fetch();
    }
  }

  fetch(): void {
    this.loading = true;
    // Hits /api/v1/finance/summary on Spring Boot
    this.financeService.getSummary().subscribe({
      next: metrics => {
        console.log('Data received:', metrics);
        this.summary = metrics;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Summary fetch failed', err);
        this.loading = false;
      }
    });
  }
}