import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { BalanceRow, FinanceFilters, FinancialReport } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './export-button.html',
  styleUrls: ['./export-button.css'],
})
export class ExportButton {
  @Input() report?: FinancialReport;
  @Input() rows?: BalanceRow[];
  @Input() title = 'Balances';
  @Input() filters?: FinanceFilters;

  generating = false;

  constructor(private financeService: FinanceService) {}

  export(): void {
    // 1) Export based on an existing report object (ID Search)
    if (this.report) {
      const m = this.report.metrics;
      // Block 0-value reports from triggering a download
      if (m.cededPremiums === 0 && m.recoveries === 0 && m.outstandingBalance === 0) {
        alert('Invalid report. No data found to export.');
        return;
      }
      // Call backend export via IDs
      this.financeService.triggerExport(this.report.treatyId, this.report.reinsurerId);
      return;
    }

    // 2) Export for General Dashboard (Page 1)
    // If we are on Page 1, we just want the master balance list
    if (this.rows && this.rows.length) {
      this.financeService.triggerExport(); // Calling without params hits 'getAllTreatyBalances' export
      return;
    }

    // 3) Generate from filter inputs (Page 2 search)
    if (this.filters) {
      this.financeService.triggerExport(this.filters.treatyId, this.filters.reinsurerId);
    }
  }
}