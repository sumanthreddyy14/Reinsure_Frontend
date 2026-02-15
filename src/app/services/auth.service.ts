// // auth.service.ts
// import { Injectable } from '@angular/core';

// export interface UserInfo {
//   userId: string;
//   persona: string;
//   lastLogin: string;
// }

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   private currentUser: UserInfo | null = null;

//   private isBrowser(): boolean {
//      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'; 
//     }


//   setUser(user: UserInfo) {
//   this.currentUser = user;

//   // derive role from persona string
//   if (user.persona === 'Administrator') {
//     this.role = 'ADMIN';
//   } else if (user.persona === 'Finance Specialist') {
//     this.role = 'FINANCE';
//   }

//   if (this.isBrowser()) {
//     localStorage.setItem('user', JSON.stringify(user));
//   }
// }


//   getUser(): UserInfo | null {
//     if (this.currentUser) return this.currentUser; 
//     if (this.isBrowser()) { 
//         const stored = localStorage.getItem('user'); 
//         if (stored) this.currentUser = JSON.parse(stored); 
//     } 
//     return this.currentUser;
//   }

//   clearUser() {
//     this.currentUser = null;
//     if (this.isBrowser()) {
//          localStorage.removeItem('user'); 
//     }
//   }


  
//   private role: 'ADMIN' | 'FINANCE' | null = null;

//   setRole(role: 'ADMIN' | 'FINANCE') {
//     this.role = role;
//   }

//   getRole(): 'ADMIN' | 'FINANCE' | null {
//     return this.role;
//   }

//   isAdmin(): boolean {
//     return this.role === 'ADMIN';
//   }

//   isFinance(): boolean {
//     return this.role === 'FINANCE';
//   }


// }
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface UserInfo {
  userId: string;
  persona: string;
  lastLogin: string;
}

export interface AuthUser {
  username: string;
  role: 'ADMIN' | 'FINANCE';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';

  // Fallback memory store if not in browser (SSR/tests)
  private memoryStore = new Map<string, string>();

  // DO NOT eagerly decode at field init in SSR. Start as null and populate in ctor (browser only).
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // legacy support
  private currentUserInfo: UserInfo | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Only attempt to load token on the browser
    if (this.isBrowser()) {
      const user = this.loadUserFromToken();
      this.currentUserSubject.next(user);
    }
  }

  /** ------------------- Backend calls ------------------- */
  login(username: string, password: string) {
    return this.http.post(`${this.apiBase}/login`, { username, password }, { responseType: 'text' })
      .pipe(map(token => this.persistToken(token)));
  }

  register(username: string, password: string, role: 'ADMIN' | 'FINANCE') {
    return this.http.post(`${this.apiBase}/register`, { username, password, role }, { responseType: 'text' });
  }

  /** ------------------- Token state ------------------- */
  private persistToken(token: string): AuthUser {
    this.setItem(this.tokenKey, token);

    const payload = this.decodeJwt(token);
    const username = (payload?.sub ?? payload?.username ?? '').toString();
    const role = (payload?.role ?? '').toString().toUpperCase();

    if (!username || !role) {
      throw new Error('Invalid token payload');
    }

    const user: AuthUser = {
      username,
      role: role === 'ADMIN' ? 'ADMIN' : 'FINANCE',
      token
    };
    this.currentUserSubject.next(user);
    return user;
  }

  getToken(): string | null {
    return this.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodeJwt(token);
    if (!payload) return false;
    if (!payload.exp) return true; // no exp -> assume valid
    const nowSec = Math.floor(Date.now() / 1000);
    return payload.exp > nowSec;
  }

  logout() {
    this.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    if (this.isBrowser()) {
      this.router.navigate(['/login']);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  getRole(): 'ADMIN' | 'FINANCE' | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isFinance(): boolean {
    return this.getRole() === 'FINANCE';
  }

  /** ------------------- Legacy compatibility ------------------- */
  setUser(user: UserInfo) {
    this.currentUserInfo = user;
    this.setItem('user', JSON.stringify(user));
  }

  getUser(): UserInfo | null {
    if (this.currentUserInfo) return this.currentUserInfo;
    const stored = this.getItem('user');
    if (stored) this.currentUserInfo = JSON.parse(stored);
    return this.currentUserInfo;
  }

  clearUser() {
    this.currentUserInfo = null;
    this.removeItem('user');
  }

  /** ------------------- Helpers ------------------- */
  private loadUserFromToken(): AuthUser | null {
    const token = this.getItem(this.tokenKey);
    if (!token) return null;
    try {
      const payload = this.decodeJwt(token);
      const username = (payload?.sub ?? payload?.username ?? '').toString();
      const role = (payload?.role ?? '').toString().toUpperCase();
      if (!username || !role) {
        console.warn('[AuthService] Invalid token payload', payload);
        return null;
      }
      console.log('[AuthService] Restoring user from token', { username, role });
      return {
        username,
        role: role === 'ADMIN' ? 'ADMIN' : 'FINANCE',
        token
      };
    } catch {
      return null;
    }
  }

  private decodeJwt(token: string): any | null {
    try {
      const part = token.split('.')[1];
      const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(json);
    } catch {
      try {
        const part = token.split('.')[1];
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
      } catch {
        return null;
      }
    }
  }

  
  /** ------------------- Safe storage layer ------------------- */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId)
      && typeof window !== 'undefined'
      && typeof window.localStorage !== 'undefined'
      && typeof window.localStorage.getItem === 'function'
      && typeof window.localStorage.setItem === 'function'
      && typeof window.localStorage.removeItem === 'function';
  }

  private getItem(key: string): string | null {
    if (this.isBrowser()) {
      return window.localStorage.getItem(key);
    }
    return this.memoryStore.get(key) ?? null;
    // Alternatively return null to disable storage on server
  }

  private setItem(key: string, value: string): void {
    if (this.isBrowser()) {
      window.localStorage.setItem(key, value);
    } else {
      this.memoryStore.set(key, value);
    }
  }

  private removeItem(key: string): void {
    if (this.isBrowser()) {
      window.localStorage.removeItem(key);
    } else {
      this.memoryStore.delete(key);
    }
  }
}