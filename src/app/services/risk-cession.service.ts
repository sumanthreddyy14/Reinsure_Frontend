
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RiskCession {
  cessionId: string;
  treatyId: string;
  policyId: string;
  cededPercentage: number;
  cededPremium: number;
  commission?: number;
  createdAt: string;
  createdBy: string;
}

@Injectable({ providedIn: 'root' })
export class RiskCessionService {
  private base = `${environment.apiBaseUrl}/cessions`;

  /** Emit when a new cession is created to refresh lists */
  refresh$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  listAll(): Observable<RiskCession[]> {
    return this.http.get<RiskCession[]>(this.base);
  }

  listByTreaty(treatyId: string): Observable<RiskCession[]> {
    return this.http.get<RiskCession[]>(`${this.base}/by-treaty/${treatyId}`);
  }

  allocateRisk(params: {
    treatyId: string;
    policyId: string;
    cededPercentage: number;
    commissionRate?: number;
    createdBy: string;
  }): Observable<RiskCession> {
    return this.http.post<RiskCession>(`${this.base}/allocate`, params).pipe(
      tap(() => this.refresh$.next())
    );
  }
}