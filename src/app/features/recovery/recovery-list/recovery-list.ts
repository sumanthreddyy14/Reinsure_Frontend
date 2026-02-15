import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Recovery } from '../../../models/recovery.model';
import { RecoveryService } from '../../../services/recovery.service';
import { StatusBadge } from '../status-badge/status-badge';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { MatIconModule } from '@angular/material/icon';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';


@Component({
  selector: 'app-recovery-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatButtonModule,StatusBadge,FinanceDashboard, MatIconModule],
  templateUrl: './recovery-list.html',
  styleUrls: ['./recovery-list.css']
})
export class RecoveryList implements OnInit {
  displayedColumns = ['recoveryId', 'claimId', 'treatyId', 'recoveryAmount', 'recoveryDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<Recovery>([]);

  constructor(private recoveryService: RecoveryService) {}


ngOnInit(): void {
  this.recoveryService.list().subscribe(res => {
    this.dataSource.data = res;
  });
}

generateFromCessions(): void {
  fetch('http://localhost:8080/api/v1/recoveries/generate-from-cessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(() => this.recoveryService.list().subscribe(res => this.dataSource.data = res))
  .catch(err => console.error(err));
}

flagDispute(row: Recovery): void {
  this.recoveryService.flagDispute(row.recoveryId).subscribe(updated => {
    // update row locally
    const idx = this.dataSource.data.findIndex(x => x.recoveryId === updated.recoveryId);
    if (idx >= 0) {
      const data = [...this.dataSource.data];
      data[idx] = updated;
      this.dataSource.data = data;
    }
  });
}



}
