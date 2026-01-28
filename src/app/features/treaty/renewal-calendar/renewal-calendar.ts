
import { Component, OnInit } from '@angular/core';
import { Treaty } from '../../../models/treaty.model';
import { TreatyService } from '../../../services/treaty.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { QuickLinks } from '../../Admin/quick-links/quick-links';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-renewal-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule,RouterLink, MatTableModule, MatButtonModule, MatChipsModule, QuickLinks],
  templateUrl: './renewal-calendar.html',
  styleUrl: './renewal-calendar.css',
})
export class RenewalCalendar implements OnInit {
  upcomingRenewals: Treaty[] = [];
  loading = true;
  error?: string;
  days = 90;
  includeActive = false;
  includeExpired = false;
  includeArchived = false;

  constructor(private treatyService: TreatyService) {}

  ngOnInit(): void {
    this.load();
  }



load(): void {
  this.loading = true;
  this.error = undefined;

  const statuses = [
    this.includeActive ? 'ACTIVE' : null,
    this.includeExpired ? 'EXPIRED' : null,
    this.includeArchived ? 'ARCHIVED' : null,
  ].filter((x): x is string => !!x);

  const finalStatuses = statuses.length ? statuses : ['ACTIVE'];

  // DEBUG: See what we’re sending
  console.log('Renewals → days:', this.days, 'statuses:', finalStatuses);

  this.treatyService.upcomingRenewals(this.days, finalStatuses).subscribe({
    next: (rows) => { this.upcomingRenewals = rows ?? []; this.loading = false; },
    error: (err) => { console.error('Renewals failed', err); this.error = err?.error?.error || 'Failed to load'; this.loading = false; }
  });
}

}


