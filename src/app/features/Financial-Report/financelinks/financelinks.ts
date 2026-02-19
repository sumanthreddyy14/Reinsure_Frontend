import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FinanceSummary } from '../finance-summary/finance-summary';
import { BalanceTable } from '../balance-table/balance-table';
import { FinanceDashboard } from '../finance-dashboard/finance-dashboard';

@Component({
  selector: 'app-financelinks',
  standalone:true,
  imports: [CommonModule, MatCardModule,FinanceSummary,BalanceTable,FinanceDashboard ],
  templateUrl: './financelinks.html',
  styleUrl: './financelinks.css',
})
export class Financelinks {}