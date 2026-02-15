import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { FinanceSummary } from '../finance-summary/finance-summary';
import { BalanceTable } from '../balance-table/balance-table';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserInfo } from '../../../services/auth.service';

@Component({
  selector: 'app-finance-dashboard',
  standalone:true,
  imports: [CommonModule, MatCardModule,RouterLink],
  templateUrl: './finance-dashboard.html',
  styleUrl: './finance-dashboard.css',
})
export class FinanceDashboard {
  user: UserInfo | null = null;
constructor(private router: Router,private auth: AuthService) {
   this.user = this.auth.getUser();
}
 
  onLogout() {
  this.auth.clearUser();
  this.router.navigate(['/login']);
  }
 
}
