import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RiskCession } from '../../../models/risk-cession.model';
import { RiskCessionService } from '../../../services/risk-cession.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';

@Component({
  selector: ' app-risk-cession-list',
   standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule,FinanceDashboard],
  templateUrl: './risk-cession-list.html',
  styleUrl: './risk-cession-list.css',
})
export class RiskCessionList implements OnInit {
  displayedColumns = ['cessionId', 'treatyId', 'policyId', 'cededPercentage', 'cededPremium', 'commission', 'createdAt'];
  dataSource = new MatTableDataSource<RiskCession>([]);

  constructor(private cessionService: RiskCessionService) {}

  // ngOnInit(): void {
  //   this.cessionService.listAll().subscribe(data => (this.dataSource.data = data));
  // }
  
ngOnInit(): void {
    this.load();
    // Refresh table when a new cession is allocated
    this.cessionService.refresh$.subscribe(() => this.load());
  }

  
private load(): void {
    this.cessionService.listAll().subscribe(data => (this.dataSource.data = data));
  }

}