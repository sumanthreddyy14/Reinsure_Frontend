// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { BehaviorSubject, Observable, map } from 'rxjs';

// import {
//   FinanceFilters,
//   FinancialMetrics,
//   FinancialReport,
//   BalanceRow,
//   Recovery,
//   RecoveryStatus
// } from '../models/finance.model';

// @Injectable({ providedIn: 'root' })
// export class FinanceService {
//   private readonly apiUrl = 'http://localhost:8080/api/v1/finance';
  
//   // Keep the registry for the report list component to function
//   private readonly _reports$ = new BehaviorSubject<FinancialReport[]>([]);

//   constructor(private http: HttpClient) {}

//   /**
//    * Helper to rectify doubles/numbers from other modules
//    */
//   private rectify(val: any): number {
//     const num = parseFloat(val);
//     return isNaN(num) ? 0.0 : Math.round(num * 100) / 100;
//   }

//   /**
//    * PAGE 1: Top Cards
//    */
//     getSummary(filters?: any): Observable<FinancialMetrics> {
//       return this.http.get<any>(`${this.apiUrl}/summary`).pipe(
//         map(res => ({
//           cededPremiums: this.rectify(res.cededPremiums),
//           recoveries: this.rectify(res.recoveries),
//           outstandingBalance: this.rectify(res.outstandingBalance)
//         }))
//       );
//     }

//   /**
//    * PAGE 1: Balance Table
//    * Note: Backend returns BalanceRowDTO[]. We map to ensure number types.
//    */
//     getBalanceTable(filters?: any, groupBy?: string): Observable<BalanceRow[]> {
//       return this.http.get<any[]>(`${this.apiUrl}/balances`).pipe(
//         map(rows => rows.map(r => ({
//           key: r.key,
//           label: r.label,
//           cededPremiums: this.rectify(r.cededPremiums),
//           recoveries: this.rectify(r.recoveries),
//           outstandingBalance: this.rectify(r.outstandingBalance),
//           treaties: r.treaties || []
//         })))
//       );
//     }


//   /**
//    * PAGE 2: Generate Report (ID Search)
//    */
//   generateReport(filters: FinanceFilters): Observable<FinancialReport> {
//   let params = new HttpParams();
//   if (filters.treatyId) params = params.set('tId', filters.treatyId);
//   if (filters.reinsurerId) params = params.set('rId', filters.reinsurerId);

//   return this.http.get<any[]>(`${this.apiUrl}/report`, { params }).pipe(
//     map(resArray => {
//       // resArray is a List<BalanceRowDTO> from Java
//       const data = resArray[0] || { cededPremiums: 0, recoveries: 0, outstandingBalance: 0 };
      
//       const report: FinancialReport = {
//         reportId: 'FR-' + Date.now(),
//         generatedDate: new Date().toISOString(),
//         treatyId: filters.treatyId,
//         reinsurerId: filters.reinsurerId,
//         metrics: {
//           // ENSURE THESE MATCH THE JAVA DTO KEYS EXACTLY
//           cededPremiums: this.rectify(data.cededPremiums), 
//           recoveries: this.rectify(data.recoveries),
//           outstandingBalance: this.rectify(data.outstandingBalance)
//         }
//       };
      
//       this._reports$.next([report, ...this._reports$.value]);
//       return report;
//     })
//   );
// }

//   /**
//    * PAGE 2: Report History List
//    */
//   listReports(): Observable<FinancialReport[]> {
//     return this._reports$.asObservable();
//   }

//   /**
//    * CSV Export Logic - This now triggers your professional Backend CSV
//    */
//   triggerExport(tId?: string, rId?: string): void {
//     let url = `${this.apiUrl}/report/export?`;
//     if (tId) url += `tId=${tId}`;
//     if (rId) url += `rId=${rId}`;
//     window.open(url, '_blank');
//   }

//   // --- Placeholder methods for other modules depending on you ---
//   // (Keeping these so you don't break the build for other teams)
//   listRecoveries(): Observable<Recovery[]> { return this.http.get<Recovery[]>(`${this.apiUrl}/recoveries`); }
//   addRecovery(rec: any): Observable<Recovery> { return this.http.post<Recovery>(`${this.apiUrl}/recoveries`, rec); }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

import {
  FinanceFilters,
  FinancialMetrics,
  FinancialReport,
  BalanceRow,
  Recovery,
  RecoveryStatus
} from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/finance';

  private readonly _reports$ = new BehaviorSubject<FinancialReport[]>([]);

  constructor(private http: HttpClient) {}

  /** Normalize numbers coming from BE */
  private rectify(val: any): number {
    const num = parseFloat(val);
    return isNaN(num) ? 0.0 : Math.round(num * 100) / 100;
  }

  /** Ensure datepicker Date is converted to 'YYYY-MM-DD' */
  private asYMD(d?: any): string | undefined {
    if (!d) return undefined;
    if (d instanceof Date && !isNaN(d.valueOf())) return d.toISOString().slice(0, 10);
    if (typeof d === 'string' && d.length >= 10) return d.slice(0, 10);
    return undefined;
  }

  private buildParams(filters?: FinanceFilters): HttpParams {
    let params = new HttpParams();
    const from = this.asYMD(filters?.from as any);
    const to   = this.asYMD(filters?.to as any);
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return params;
  }

  /** PAGE 1: Top Cards */
  getSummary(filters?: FinanceFilters): Observable<FinancialMetrics> {
    const params = this.buildParams(filters);
    return this.http.get<any>(`${this.apiUrl}/summary`, { params }).pipe(
      map(res => ({
        cededPremiums: this.rectify(res?.cededPremiums),
        recoveries: this.rectify(res?.recoveries),
        outstandingBalance: this.rectify(res?.outstandingBalance),
      }))
    );
  }

  /** PAGE 1: Balance Table (groupBy = treaty | reinsurer) */
  getBalanceTable(
    filters?: FinanceFilters,
    groupBy: 'treaty' | 'reinsurer' = 'treaty'
  ): Observable<BalanceRow[]> {
    let params = this.buildParams(filters);
    params = params.set('groupBy', groupBy);
    return this.http.get<any[]>(`${this.apiUrl}/balances`, { params }).pipe(
      map(rows =>
        (rows ?? []).map(r => ({
          key: r.key,
          label: r.label,
          cededPremiums: this.rectify(r.cededPremiums),
          recoveries: this.rectify(r.recoveries),
          outstandingBalance: this.rectify(r.outstandingBalance),
          treaties: r.treaties || [],
        }))
      )
    );
  }

  /** PAGE 2: Generate Report (ID Search) */
  generateReport(filters: FinanceFilters): Observable<FinancialReport> {
    let params = new HttpParams();
    if (filters.treatyId)    params = params.set('tId', filters.treatyId);
    if (filters.reinsurerId) params = params.set('rId', filters.reinsurerId);

    return this.http.get<any[]>(`${this.apiUrl}/report`, { params }).pipe(
      map(resArray => {
        const data = resArray?.[0] ?? { cededPremiums: 0, recoveries: 0, outstandingBalance: 0 };
        const report: FinancialReport = {
          reportId: 'FR-' + Date.now(),
          generatedDate: new Date().toISOString(),
          treatyId: filters.treatyId,
          reinsurerId: filters.reinsurerId,
          metrics: {
            cededPremiums: this.rectify(data.cededPremiums),
            recoveries: this.rectify(data.recoveries),
            outstandingBalance: this.rectify(data.outstandingBalance),
          },
        };
        this._reports$.next([report, ...this._reports$.value]);
        return report;
      })
    );
  }

  listReports(): Observable<FinancialReport[]> {
    return this._reports$.asObservable();
  }

  triggerExport(tId?: string, rId?: string): void {
    const base = `${this.apiUrl}/report/export`;
    const url = new URL(base);
    if (tId) url.searchParams.set('tId', tId);
    if (rId) url.searchParams.set('rId', rId);
    window.open(url.toString(), '_blank');
  }

  // For other modules
  listRecoveries(treatyId?: string, status?: RecoveryStatus | string): Observable<Recovery[]> {
    let params = new HttpParams();
    if (treatyId) params = params.set('treatyId', treatyId);
    if (status)   params = params.set('status', String(status));
    return this.http.get<Recovery[]>(`${this.apiUrl}/recoveries`, { params });
  }

  addRecovery(rec: any): Observable<Recovery> {
    return this.http.post<Recovery>('http://localhost:8080/api/v1/recoveries', rec);
  }
}