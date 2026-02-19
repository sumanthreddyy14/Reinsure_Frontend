import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FinanceFilters, FinancialReport } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ExportButton } from '../export-button/export-button';
import { MatInputModule } from '@angular/material/input';
import { FinanceDashboard } from '../finance-dashboard/finance-dashboard';

@Component({
  selector: 'app-financial-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ExportButton,
    MatCardModule,
    MatInputModule,
    MatTableModule,   
    MatButtonModule,
    MatFormFieldModule,
    FinanceDashboard
  ],
  templateUrl: './financial-report-list.html',
  styleUrl: './financial-report-list.css',
})
export class FinancialReportList implements OnInit {
  reports: FinancialReport[] = [];
  generating = false;
  errorMessage = '';
  // Input bindings
  treatyId?: string;
  reinsurerId?: string;

  displayedColumns = ['reportId', 'searchId', 'generatedDate', 'actions'];

  constructor(private financeService: FinanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Subscribe to the reports stream so the table updates automatically
    this.financeService.listReports().subscribe({
      next: (r) => {
        this.reports = r;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error syncing report list', err)
    });
  }

  generate(): void {
  this.errorMessage = '';
  this.generating = true;
  this.cdr.detectChanges(); // Force UI to show "generating" state immediately
  const filters: FinanceFilters = {
    treatyId: this.treatyId?.trim(),
    reinsurerId: this.reinsurerId?.trim()
  };

  if (!filters.treatyId && !filters.reinsurerId) {
    this.errorMessage = 'Please enter a Treaty ID or Reinsurer ID.';
    this.generating = false;
    return;
  }

  this.financeService.generateReport(filters).subscribe({
    next: (r) => {
      this.generating = false;
      const hasData = r.metrics.cededPremiums > 0 || 
                      r.metrics.recoveries > 0 ||
                      r.metrics.outstandingBalance > 0;
      if (!hasData) {
        this.errorMessage = 'No records found for this ID.';
      }
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.generating = false;
      // Handle the [object Object] issue
      this.errorMessage = typeof err.error === 'string' ? err.error : 'Invalid input or Server Error.';
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  });
}
}