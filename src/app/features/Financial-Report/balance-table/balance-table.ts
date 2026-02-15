import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnInit } from '@angular/core';
import { BalanceRow, FinanceFilters } from '../../../models/finance.model';
import { FinanceService } from '../../../services/finance.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, tap } from 'rxjs'; // Import Observable

@Component({
  selector: 'app-balance-table',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,        
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './balance-table.html',
  styleUrl: './balance-table.css',
})
export class BalanceTable implements OnInit, OnChanges {
  @Input() filters: FinanceFilters = {};
  @Input() groupBy: 'reinsurer' | 'treaty' = 'reinsurer';
  @Output() rowsChanged = new EventEmitter<BalanceRow[]>();

  rows$!: Observable<BalanceRow[]>; 
  
  // Add 'treaties' to the end of this array
  displayedColumns = ['label', 'cededPremiums', 'recoveries', 'outstanding', 'treaties'];

  constructor(private financeService: FinanceService) {}
  
  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] || changes['groupBy']) {
      this.load();
    }
  }

  load(): void {
    // We assign the stream directly to rows$. 
    // The 'tap' operator ensures your rowsChanged event still fires for other modules.
    this.rows$ = this.financeService.getBalanceTable().pipe(
      tap(rows => this.rowsChanged.emit(rows))
    );
  }
}