
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Recovery } from '../models/recovery.model';

@Injectable({ providedIn: 'root' })
export class RecoveryService {
  private base = 'http://localhost:8080/api/v1/recoveries';

  constructor(private http: HttpClient) {}

  list(treatyId?: string, status?: 'PENDING' | 'COMPLETED' | 'DISPUTED'): Observable<Recovery[]> {
    let params = new HttpParams();
    if (treatyId) params = params.set('treatyId', treatyId);
    if (status) params = params.set('status', status);
    return this.http.get<Recovery[]>(this.base, { params });
  }

// //   getById(id: string): Observable<Recovery | undefined> {
// //     return this.http.get<Recovery>(`${this.base}/${id}`);
// //   }
// getById(id: string): Observable<Recovery> {
//   return this.http.get<Recovery>(`${this.base}/${id}`);
// }
getById(id: string): Observable<Recovery> {
  const url = `${this.base}/${encodeURIComponent(id)}`;
  console.log('GET', url);
  return this.http.get<Recovery>(url);
}
  add(rec: Omit<Recovery, 'recoveryId'> & { createdBy?: string; policyId?: string }): Observable<Recovery> {
    // backend accepts 'CreateRecoveryRequest'
    const payload = {
      claimId: rec.claimId,
      treatyId: rec.treatyId,
      recoveryAmount: rec.recoveryAmount,
      recoveryDate: rec.recoveryDate, // 'yyyy-MM-dd'
      status: rec.status,
      createdBy: (rec as any).createdBy,
      policyId: (rec as any).policyId
    };
    return this.http.post<Recovery>(this.base, payload);
  }

  update(id: string, patch: Partial<Recovery>): Observable<Recovery> {
    const payload: any = {
      recoveryAmount: patch.recoveryAmount,
      recoveryDate: patch.recoveryDate,
      status: patch.status
    };
    return this.http.put<Recovery>(`${this.base}/${id}`, payload);
  }

  updateStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'DISPUTED'): Observable<Recovery> {
    return this.http.patch<Recovery>(`${this.base}/${id}/status`, { status });
  }

  flagDispute(id: string): Observable<Recovery> {
    return this.http.post<Recovery>(`${this.base}/${id}/dispute`, {});
  }

  countPendingRecoveries(): Observable<number> {
    return this.http.get<number>(`${this.base}/metrics/pending-count`);
  }
}