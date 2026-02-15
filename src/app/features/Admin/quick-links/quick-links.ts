import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserInfo } from '../../../services/auth.service';

@Component({
  selector: 'app-quick-links',
  standalone: true, 
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './quick-links.html',
  styleUrl: './quick-links.css',
})
export class QuickLinks {

  user: UserInfo | null = null;
  constructor(private router: Router,private auth: AuthService) {
    this.user = this.auth.getUser();
  }
 
  onLogout() {
  this.auth.clearUser();
  this.router.navigate(['/login']);
  }
}
