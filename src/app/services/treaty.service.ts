import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Treaty } from '../models/treaty.model';

@Injectable({ providedIn: 'root' })
export class TreatyService {
  private base = 'http://localhost:8080/api/v1/treaties';

  // ✅ Cache of last-loaded treaties for sync stats
  private cache: Treaty[] = [];

  constructor(private http: HttpClient) {}

  list(): Observable<Treaty[]> {
    return this.http.get<Treaty[]>(this.base).pipe(
      tap((data) => (this.cache = data)) // ✅ update cache whenever we load
    );
  }

  


getById(id: string): Observable<Treaty> {
  const url = `${this.base}/${encodeURIComponent(id)}`;
  console.log('GET', url);
  return this.http.get<Treaty>(url);
}

  save(treaty: Treaty): Observable<Treaty> {
    const req$ = treaty.treatyId
      ? this.http.put<Treaty>(`${this.base}/${treaty.treatyId}`, treaty)
      : this.http.post<Treaty>(this.base, treaty);

    // ✅ Update cache optimistically for dashboard stats
    return req$.pipe(
      tap((saved) => {
        // Replace existing or push new
        const idx = this.cache.findIndex((t) => t.treatyId === saved.treatyId);
        if (idx > -1) {
          this.cache[idx] = saved;
        } else {
          this.cache.push(saved);
        }
      })
    );
  }

  // ✅ Synchronous count, using cache (so dashboard code doesn't need changes)
  countActiveTreaties(): number {
    return this.cache.filter((t: Treaty) => t.status === 'ACTIVE').length;
  }


upcomingRenewals(days = 90, includeStatuses: string[] = ['ACTIVE']): Observable<Treaty[]> {
  let params = new HttpParams().set('days', days.toString());
  if (includeStatuses && includeStatuses.length) {
    params = params.set('includeStatuses', includeStatuses.join(',')); // <-- CSV expected by backend
  }
  return this.http.get<Treaty[]>(`${this.base}/renewals`, { params });
}



}




