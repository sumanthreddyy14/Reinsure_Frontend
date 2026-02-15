import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-cards.html',
  styleUrls: ['./dashboard-cards.css'], // ✅ plural
})
export class DashboardCards {
  @Input() activeTreaties!: number;
  @Input() pendingRecoveries!: number;

  get summary() {
    return {
      activeTreaties: this.activeTreaties,
      pendingRecoveries: this.pendingRecoveries
    };
  }

  get loading() {
    // Show "Loading…" until inputs are defined
    return this.activeTreaties === undefined || this.pendingRecoveries === undefined;
  }
}
