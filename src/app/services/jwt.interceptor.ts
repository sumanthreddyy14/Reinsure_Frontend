// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { AuthService } from '../services/auth.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {

//   constructor(private auth: AuthService, private router: Router) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.auth.getToken();

//     const isAuthEndpoint = req.url.includes('/auth/');
//     let authReq = req;

//     if (token && !isAuthEndpoint) {
//       authReq = req.clone({
//         setHeaders: { Authorization: `Bearer ${token}` }
//       });
//     }

//     return next.handle(authReq).pipe(
//       catchError((err: HttpErrorResponse) => {
//         if (err.status === 401 || err.status === 403) {
//           this.auth.logout(false);
//           this.router.navigateByUrl('/login');
//         }
//         return throwError(() => err);
//       })
//     );
//   }
// }
