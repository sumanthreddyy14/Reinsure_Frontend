// // admin.guard.ts
// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from './auth.service';

// @Injectable({ providedIn: 'root' })
// export class AdminGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.auth.isAdmin()) return true;
//     this.router.navigate(['/not-authorized']);
//     return false;
//   }
// }

// // finance.guard.ts
// @Injectable({ providedIn: 'root' })
// export class FinanceGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.auth.isFinance()) return true;
//     this.router.navigate(['/not-authorized']);
//     return false;
//   }
// }

import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Use Client Hydration for Auth
    }

    if (!this.auth.isLoggedIn()) {
      console.warn('[AdminGuard] User not logged in. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }

    if (this.auth.isAdmin()) {
      return true;
    }

    console.warn('[AdminGuard] User is logged in but not ADMIN. Redirecting to not-authorized.');
    this.router.navigate(['/not-authorized']);
    return false;
  }
}


@Injectable({ providedIn: 'root' })
export class FinanceGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // Use Client Hydration for Auth
    }

    if (!this.auth.isLoggedIn()) {
      console.warn('[FinanceGuard] User not logged in. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }

    if (this.auth.isFinance()) {
      return true;
    }

    console.warn('[FinanceGuard] User is logged in but not FINANCE. Redirecting to not-authorized.');
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
