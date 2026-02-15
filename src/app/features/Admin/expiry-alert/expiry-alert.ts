import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-expiry-alert',
  standalone: true, 
  imports: [CommonModule, MatCardModule],
  templateUrl: './expiry-alert.html',
  styleUrl: './expiry-alert.css',
})
export class ExpiryAlert {

  @Input() expiredTreaties: { id: string; name: string; endDate: Date }[] = [];
}
