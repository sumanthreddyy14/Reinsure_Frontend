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
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn() && this.auth.isAdmin()) return true;
    this.router.navigate(['/not-authorized']);
    return false;
  }
}


@Injectable({ providedIn: 'root' })
export class FinanceGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn() && this.auth.isFinance()) return true;
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
