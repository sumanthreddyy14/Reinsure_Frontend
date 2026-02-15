// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError } from 'rxjs/operators';
// import { throwError } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   const token = localStorage.getItem('auth_token');

//   const authReq = token
//     ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
//     : req;

//   return next(authReq).pipe(
//     catchError(err => {
//       if (err.status === 401 || err.status === 403) {
//         localStorage.removeItem('auth_token');
//         router.navigate(['/login']);
//       }
//       return throwError(() => err);
//     })
//   );
// };
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  let token: string | null = null;
  try { token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null; } catch { token = null; }

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError(err => {
      // Don’t redirect for /api/auth/*
      if ((err.status === 401 || err.status === 403) && !req.url.includes('/api/auth/')) {
        console.error('[AuthInterceptor] 401/403 Error', { url: req.url, status: err.status });
        try { window.localStorage.removeItem('auth_token'); } catch {}
        // if (router.url !== '/login') router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};

