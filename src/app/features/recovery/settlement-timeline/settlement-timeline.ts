import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settlement-timeline',
  standalone: true, 
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './settlement-timeline.html',
  styleUrl: './settlement-timeline.css',
})
export class SettlementTimeline {
@Input() timeline: { date: string; label: string; status: 'PENDING' | 'COMPLETED' | 'DISPUTED' }[] = [];
}
