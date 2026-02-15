
// src/app/services/analytics.service.ts

import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// Analytics models (local, no imports inside the model file)
import {
  AnalyticsReport,
  AnalyticsReportMetrics,
  AnalyticsData,
  DashboardKPI,
  TreatyPerformanceSummary,
  RiskExposure,
  ComplianceIssue,
} from '../models/analytics.model';

// Existing base services (SIBLING paths because this file is in src/app/services/)
import { TreatyService } from './treaty.service';
import { RiskCessionService } from './risk-cession.service';
import { FinanceService } from './finance.service';

// Existing domain models (go UP one level)
import type { Treaty } from '../models/treaty.model';
import type { RiskCession } from '../models/risk-cession.model';
import type {
  FinanceFilters,
  BalanceRow,
  FinancialReport
} from '../models/finance.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private treatyService: TreatyService,
    private cessionService: RiskCessionService,
    private financeService: FinanceService
  ) {}

  /**
   * Generate AnalyticsReport per treaty:
   * - lossRatio = recoveries / cededPremiums
   * - treatyUtilization = cededPremiums / coverageLimit
   */
  getAnalyticsReports(filters: FinanceFilters = {}): Observable<AnalyticsReport[]> {
    return combineLatest<[Treaty[], BalanceRow[]]>([
      this.treatyService.list(),                         // Observable<Treaty[]>
      this.financeService.getBalanceTable(filters, 'treaty'), // Observable<BalanceRow[]>
    ]).pipe(
      map(([treaties, balanceRows]: [Treaty[], BalanceRow[]]) => {
        const nowIso = new Date().toISOString();
        const byTreaty: Record<string, BalanceRow> = {};
        (balanceRows ?? []).forEach((r: BalanceRow) => (byTreaty[r.key] = r));

        return (treaties ?? []).map((t: Treaty) => {
          const row = byTreaty[t.treatyId];
          const ceded = safeNumber(row?.cededPremiums);
          const recov = safeNumber(row?.recoveries);
          const limit = safeNumber(t.coverageLimit);

          const lossRatio = ceded > 0 ? recov / ceded : 0;
          const treatyUtilization = limit > 0 ? ceded / limit : 0;

          const metrics: AnalyticsReportMetrics = {
            lossRatio: round(lossRatio),
            treatyUtilization: round(treatyUtilization),
          };

          const report: AnalyticsReport = {
            reportId: `AR-${t.treatyId}-${Date.now()}`,
            treatyId: t.treatyId,
            metrics,
            generatedDate: nowIso,
          };

          return report;
        });
      })
    );
  }

  /**
   * Dashboard KPIs using FinanceService.getSummary() to avoid double-counting.
   */
  getDashboardKpis(filters: FinanceFilters = {}): Observable<AnalyticsData<DashboardKPI>> {
    return combineLatest<[Treaty[], { cededPremiums: number; recoveries: number; outstandingBalance: number }, RiskCession[]]>([
      this.treatyService.list(),               // Observable<Treaty[]>
      this.financeService.getSummary(filters), // Observable<FinancialMetrics>
      this.cessionService.listAll(),           // Observable<RiskCession[]>
    ]).pipe(
      map(([treaties, totals, cessions]: [Treaty[], { cededPremiums: number; recoveries: number; outstandingBalance: number }, RiskCession[]]) => {
        const activeTreaties = (treaties ?? []).filter((t: Treaty) => t.status === 'ACTIVE').length;
        const expiredTreaties = (treaties ?? []).filter((t: Treaty) => t.status === 'EXPIRED').length;

        const totalCededPremiums = safeNumber(totals?.cededPremiums);
        const totalRecoveries = safeNumber(totals?.recoveries);
        const outstandingRecoveries = safeNumber(totals?.outstandingBalance);

        const avgCededPct = (cessions ?? []).length
          ? average((cessions ?? []).map((c: RiskCession) => safeNumber(c.cededPercentage)))
          : 0;

        const avgLossRatio = totalCededPremiums > 0 ? totalRecoveries / totalCededPremiums : 0;

        const kpi: DashboardKPI = {
          activeTreaties,
          expiredTreaties,
          totalCededPremiums: round(totalCededPremiums),
          totalRecoveries: round(totalRecoveries),
          outstandingRecoveries: round(outstandingRecoveries),
          averageLossRatio: round(avgLossRatio),
          averageCededPercentage: round(avgCededPct),
        };

        return {
          data: kpi,
          generatedAt: new Date().toISOString(),
          source: 'AnalyticsService v1.0',
        };
      })
    );
  }

 
  getTreatyPerformanceSummaries(
    filters: FinanceFilters = {}
  ): Observable<AnalyticsData<TreatyPerformanceSummary[]>> {
    return combineLatest<[Treaty[], BalanceRow[], RiskCession[]]>([
      this.treatyService.list(),                         // Observable<Treaty[]>
      this.financeService.getBalanceTable(filters, 'treaty'), // Observable<BalanceRow[]>
      this.cessionService.listAll(),                     // Observable<RiskCession[]>
    ]).pipe(
      map(([treaties, balanceRows, cessions]: [Treaty[], BalanceRow[], RiskCession[]]) => {
        const byTreaty: Record<string, BalanceRow> = {};
        (balanceRows ?? []).forEach((r: BalanceRow) => (byTreaty[r.key] = r));

        const summaries: TreatyPerformanceSummary[] = (treaties ?? []).map((t: Treaty) => {
          const row = byTreaty[t.treatyId];
          const cessionsForTreaty = (cessions ?? []).filter((c: RiskCession) => c.treatyId === t.treatyId);

          const allocationsCount = cessionsForTreaty.length;
          const avgCededPct = allocationsCount
            ? average(cessionsForTreaty.map((c: RiskCession) => safeNumber(c.cededPercentage)))
            : 0;

          const totalCededPremiums = safeNumber(row?.cededPremiums);
          const totalRecoveries = safeNumber(row?.recoveries);
          const outstanding = safeNumber(row?.outstandingBalance);
          const lossRatio = totalCededPremiums > 0 ? totalRecoveries / totalCededPremiums : 0;

          return {
            treatyId: t.treatyId,
            reinsurerName: t.reinsurerName ?? undefined,
            periodFrom: filters.from,
            periodTo: filters.to,
            totalCededPremiums: round(totalCededPremiums),
            totalRecoveries: round(totalRecoveries),
            outstandingRecoveries: round(outstanding),
            allocationsCount,
            averageCededPercentage: round(avgCededPct),
            lossRatio: round(lossRatio),
            status: t.status,
          };
        });

        return {
          data: summaries,
          generatedAt: new Date().toISOString(),
          source: 'AnalyticsService v1.0',
        };
      })
    );
  }

  /**
   * Risk exposure for a given treaty derived from cessions.
   */
  getRiskExposureByTreaty(treatyId: string): Observable<AnalyticsData<RiskExposure>> {
    // Guard undefined from getById
    const treaty$: Observable<Treaty> = this.treatyService.getById(treatyId).pipe(
      map((t: Treaty | undefined) => {
        if (!t) throw new Error(`Treaty ${treatyId} not found`);
        return t;
      })
    );

    return combineLatest<[Treaty, RiskCession[]]>([
      treaty$,                                  // Observable<Treaty>
      this.cessionService.listByTreaty(treatyId) // Observable<RiskCession[]>
    ]).pipe(
      map(([treaty, cessions]: [Treaty, RiskCession[]]) => {
        const cessionCount = (cessions ?? []).length;
        const totalCededPremiums = sum((cessions ?? []).map((c: RiskCession) => safeNumber(c.cededPremium)));
        const maxCededPercentage = cessionCount
          ? Math.max(...(cessions ?? []).map((c: RiskCession) => safeNumber(c.cededPercentage)))
          : 0;
        const averageCededPercentage = cessionCount
          ? average((cessions ?? []).map((c: RiskCession) => safeNumber(c.cededPercentage)))
          : 0;

        const exposure: RiskExposure = {
          treatyId: treaty.treatyId,
          treatyType: treaty.treatyType,
          totalCededPremiums: round(totalCededPremiums),
          maxCededPercentage: round(maxCededPercentage),
          averageCededPercentage: round(averageCededPercentage),
          cessionCount,
          policyCount: uniqueCount((cessions ?? []).map((c: RiskCession) => c.policyId)),
        };

        return {
          data: exposure,
          generatedAt: new Date().toISOString(),
          source: 'AnalyticsService v1.0',
        };
      })
    );
  }

  /**
   * Lightweight compliance checks.
   */
  getComplianceIssues(filters: FinanceFilters = {}): Observable<AnalyticsData<ComplianceIssue[]>> {
    return combineLatest<[Treaty[], RiskCession[], BalanceRow[], FinancialReport[]]>([
      this.treatyService.list(),                          // Observable<Treaty[]>
      this.cessionService.listAll(),                      // Observable<RiskCession[]>
      this.financeService.getBalanceTable(filters, 'treaty'), // Observable<BalanceRow[]>
      this.financeService.listReports()                   // Observable<FinancialReport[]>
    ]).pipe(
      map(([treaties, cessions, balanceRows, finReports]: [Treaty[], RiskCession[], BalanceRow[], FinancialReport[]]) => {
        const issues: ComplianceIssue[] = [];
        const nowIso = new Date().toISOString();
        const byTreatyId: Record<string, BalanceRow> = {};
        (balanceRows ?? []).forEach((r: BalanceRow) => (byTreatyId[r.key] = r));

        // 1) Active treaty with zero cessions -> MEDIUM
        (treaties ?? []).forEach((t: Treaty) => {
          const hasCession = (cessions ?? []).some((c: RiskCession) => c.treatyId === t.treatyId);
          if (t.status === 'ACTIVE' && !hasCession) {
            issues.push({
              id: `CMP-T-${t.treatyId}`,
              entityType: 'TREATY',
              entityId: t.treatyId,
              message: 'Active treaty has no risk cessions recorded.',
              severity: 'MEDIUM',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        // 2) Active treaty with outstanding balance > 0 -> HIGH
        (treaties ?? []).forEach((t: Treaty) => {
          const row = byTreatyId[t.treatyId];
          if (row && safeNumber(row.outstandingBalance) > 0 && t.status === 'ACTIVE') {
            issues.push({
              id: `CMP-O-${t.treatyId}`,
              entityType: 'FINANCIAL_REPORT',
              entityId: t.treatyId,
              message: 'Outstanding balance exists for active treaty.',
              severity: 'HIGH',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        // 3) Financial report with zero totals -> LOW
        (finReports ?? []).forEach((fr: FinancialReport) => {
          const ceded = safeNumber(fr.metrics?.cededPremiums);
          const recov = safeNumber(fr.metrics?.recoveries);
          if (ceded === 0 && recov === 0) {
            issues.push({
              id: `CMP-FR-${fr.reportId}`,
              entityType: 'FINANCIAL_REPORT',
              entityId: fr.reportId,
              message: 'Financial report has zero premiums and recoveries.',
              severity: 'LOW',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        return {
          data: issues,
          generatedAt: nowIso,
          source: 'AnalyticsService v1.0',
        };
      })
    );
  }
}

/* ------------------------------ Helpers ------------------------------ */

function safeNumber(n: unknown): number {
  const x = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(x) ? x : 0;
}

function sum(arr: number[]): number {
  return arr.reduce((acc, cur) => acc + safeNumber(cur), 0);
}

function average(arr: number[]): number {
  if (!arr.length) return 0;
  return sum(arr) / arr.length;
}

function round(n: number, decimals = 2): number {
  const p = Math.pow(10, decimals);
  return Math.round(n * p) / p;
}

function uniqueCount<T>(arr: T[]): number {
  return new Set(arr.filter(Boolean)).size;
}
