import { Component } from '@angular/core';
import { Treaty } from '../../../models/treaty.model';
import { Policy } from '../../../models/policy.model';
import { RiskCessionService } from '../../../services/risk-cession.service';
import { TreatyService } from '../../../services/treaty.service';
import { PolicyService } from '../../../services/policy.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { RiskCessionList } from '../risk-cession-list/risk-cession-list';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-risk-cession-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
   QuickLinks
  ],
  templateUrl: './risk-cession-form.html',
  styleUrl: './risk-cession-form.css',
})
export class RiskCession {
  treaties: Treaty[] = [];
  policies: Policy[] = [];
  selectedTreatyId = '';
  selectedPolicyId = '';
  cededPercentage = 0;
  commissionRate = 0.1;
  lastResult?: { cededPremium: number; commission: number; cessionId: string };

  constructor(
    private cessionService: RiskCessionService,
    private treatyService: TreatyService,
    private policyService: PolicyService,
    private snack: MatSnackBar
  ) {
    this.treatyService.list().subscribe(t => (this.treaties = t.filter(tt => tt.status === 'ACTIVE')));
    this.policyService.listPolicies().subscribe({
      next: p => this.policies = p,
      error: err => this.snack.open('Failed to load policies', 'Dismiss', { duration: 3000 })
    });
  }

allocate(): void {
  if (!this.selectedTreatyId || !this.selectedPolicyId || this.cededPercentage <= 0) return;

  this.cessionService
    .allocateRisk({
      treatyId: this.selectedTreatyId,
      policyId: this.selectedPolicyId,
      cededPercentage: this.cededPercentage,
      commissionRate: this.commissionRate,
      createdBy: 'admin'
    })
    .subscribe({
      next: res => {
        this.lastResult = { cededPremium: res.cededPremium, commission: res.commission ?? 0, cessionId: res.cessionId };
        this.cededPercentage = 0; // reset
        this.snack.open(`Allocated ${res.cededPercentage}% → ${res.cessionId}`, 'OK', { duration: 2500 });
      },
      error: err => {
        const msg = err?.error?.error || err?.message || 'Allocation failed';
        this.snack.open(msg, 'Dismiss', { duration: 4000 });
      }
    });
}




  // allocate(): void {
  //   if (!this.selectedTreatyId || !this.selectedPolicyId || this.cededPercentage <= 0) return;
  //   this.cessionService
  //     .allocateRisk({
  //       treatyId: this.selectedTreatyId,
  //       policyId: this.selectedPolicyId,
  //       cededPercentage: this.cededPercentage,
  //       commissionRate: this.commissionRate,
  //       createdBy: 'admin'
  //     })
  //     .subscribe(res => {
  //       this.lastResult = { cededPremium: res.cededPremium, commission: res.commission ?? 0, cessionId: res.cessionId };
  //       // Reset percentage for convenience
  //       this.cededPercentage = 0;
  //     });
  // }
}