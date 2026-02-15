
import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

// Local analytics models (NO imports inside the model file)
import {
  ComplianceIssue,
  AnalyticsData,
} from '../models/analytics.model';
 
// Existing base services (SIBLING paths because THIS file is under src/app/services/)
import { TreatyService } from './treaty.service';
import { RiskCessionService } from './risk-cession.service';
import { FinanceService } from './finance.service';

// Existing domain models (types only; go UP one level to models)
import type { Treaty } from '../models/treaty.model';
import type { RiskCession } from '../models/risk-cession.model';
import type {
  FinanceFilters,
  BalanceRow,
  FinancialReport,
  Recovery,
  RecoveryStatus
} from '../models/finance.model';

/**
 * Compliance rules (thresholds) you can tune per environment or UI.
 */
export interface ComplianceRules {
  /** Pending recovery older than this #days -> HIGH (default: 90) */
  maxPendingDays?: number;
  /** Treaty utilization below this % -> MEDIUM (default: 0.25 i.e., 25%) */
  minUtilization?: number;
  /** Outstanding balance per treaty above this -> HIGH (default: 0) */
  maxOutstandingPerTreaty?: number;
  /** Loss ratio above this -> MEDIUM/HIGH depending on threshold (optional) */
  maxLossRatio?: number;
}

@Injectable({ providedIn: 'root' })
export class ComplianceService {
  constructor(
    private treatyService: TreatyService,
    private cessionService: RiskCessionService,
    private financeService: FinanceService
  ) {}

  /**
   * Main compliance executor.
   * Generates a list of ComplianceIssue[] based on the provided filters and rules.
   */
  listIssues(
    filters: FinanceFilters = {},
    rules: ComplianceRules = {}
  ): Observable<AnalyticsData<ComplianceIssue[]>> {
    const {
      maxPendingDays = 90,
      minUtilization = 0.25,            // 25%
      maxOutstandingPerTreaty = 0,
      maxLossRatio,                     // optional e.g., 1.2 (120%)
    } = rules;

    return combineLatest<[Treaty[], RiskCession[], BalanceRow[], FinancialReport[], Recovery[]]>([
      this.treatyService.list(),                          // Observable<Treaty[]>
      this.cessionService.listAll(),                      // Observable<RiskCession[]>
      this.financeService.getBalanceTable(filters, 'treaty'), // Observable<BalanceRow[]>
      this.financeService.listReports(),                  // Observable<FinancialReport[]>
      this.financeService.listRecoveries()                // Observable<Recovery[]>
    ]).pipe(
      map(([treaties, cessions, balanceRows, finReports, recoveries]: [Treaty[], RiskCession[], BalanceRow[], FinancialReport[], Recovery[]]) => {
        const issues: ComplianceIssue[] = [];
        const nowIso = new Date().toISOString();

        const byTreatyId: Record<string, BalanceRow> = {};
        (balanceRows ?? []).forEach((r: BalanceRow) => (byTreatyId[r.key] = r));

        // --- Rule 1: Active treaty with zero cessions -> MEDIUM ---
        (treaties ?? []).forEach((t: Treaty) => {
          const hasCession = (cessions ?? []).some((c: RiskCession) => c.treatyId === t.treatyId);
          if (t.status === 'ACTIVE' && !hasCession) {
            issues.push({
              id: `CMP-T-NOCESSION-${t.treatyId}`,
              entityType: 'TREATY',
              entityId: t.treatyId,
              message: 'Active treaty has no risk cessions recorded.',
              severity: 'MEDIUM',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        // --- Rule 2: Pending recovery older than maxPendingDays -> HIGH ---
        const maxPendingMs = maxPendingDays * 24 * 60 * 60 * 1000;
        (recoveries ?? []).forEach((r: Recovery) => {
          if (r.status === 'PENDING') {
            const dateForAge = r.recoveryDate ?? r.createdAt ?? new Date().toISOString();
            const ageMs = Date.now() - new Date(dateForAge).getTime();
            if (ageMs > maxPendingMs) {
              issues.push({
                id: `CMP-R-OLDPENDING-${r.recoveryId}`,
                entityType: 'RECOVERY',
                entityId: r.recoveryId,
                message: `Pending recovery exceeds ${maxPendingDays} days.`,
                severity: 'HIGH',
                detectedAt: nowIso,
                resolved: false,
              });
            }
          }
        });

        // --- Rule 3: Treaty utilization below minUtilization -> MEDIUM ---
        (treaties ?? []).forEach((t: Treaty) => {
          const row = byTreatyId[t.treatyId];
          const ceded = safeNumber(row?.cededPremiums);
          const limit = safeNumber(t.coverageLimit);
          const utilization = limit > 0 ? ceded / limit : 0;

          if (t.status === 'ACTIVE' && utilization < minUtilization) {
            issues.push({
              id: `CMP-T-LOWUTIL-${t.treatyId}`,
              entityType: 'TREATY',
              entityId: t.treatyId,
              message: `Treaty utilization below threshold (${fmtPct(utilization)} < ${fmtPct(minUtilization)}).`,
              severity: 'MEDIUM',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        // --- Rule 4: Outstanding balance per treaty above threshold -> HIGH ---
        (treaties ?? []).forEach((t: Treaty) => {
          const row = byTreatyId[t.treatyId];
          const outstanding = safeNumber(row?.outstandingBalance);

          if (outstanding > maxOutstandingPerTreaty) {
            issues.push({
              id: `CMP-T-OUTSTANDING-${t.treatyId}`,
              entityType: 'FINANCIAL_REPORT',
              entityId: t.treatyId,
              message: `Outstanding balance (${fmt(outstanding)}) exceeds threshold (${fmt(maxOutstandingPerTreaty)}).`,
              severity: 'HIGH',
              detectedAt: nowIso,
              resolved: false,
            });
          }
        });

        // --- Rule 5: Loss ratio above threshold -> MEDIUM/HIGH (optional) ---
        if (typeof maxLossRatio === 'number') {
          (treaties ?? []).forEach((t: Treaty) => {
            const row = byTreatyId[t.treatyId];
            const ceded = safeNumber(row?.cededPremiums);
            const recov = safeNumber(row?.recoveries);
            const lr = ceded > 0 ? recov / ceded : 0;

            if (lr > maxLossRatio) {
              issues.push({
                id: `CMP-T-LOSSRATIO-${t.treatyId}`,
                entityType: 'TREATY',
                entityId: t.treatyId,
                message: `Loss ratio (${fmtPct(lr)}) exceeds threshold (${fmtPct(maxLossRatio)}).`,
                severity: lr > maxLossRatio * 1.2 ? 'HIGH' : 'MEDIUM',
                detectedAt: nowIso,
                resolved: false,
              });
            }
          });
        }

        // --- Rule 6: Financial report with zero totals -> LOW ---
        (finReports ?? []).forEach((fr: FinancialReport) => {
          const ceded = safeNumber(fr.metrics?.cededPremiums);
          const recov = safeNumber(fr.metrics?.recoveries);
          if (ceded === 0 && recov === 0) {
            issues.push({
              id: `CMP-FR-ZERO-${fr.reportId}`,
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
          source: 'ComplianceService v1.0',
        };
      })
    );
  }

  /**
   * Compact summary: counts by severity.
   */
  summarize(issues: ComplianceIssue[]): { LOW: number; MEDIUM: number; HIGH: number; total: number } {
    const s = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
    (issues ?? []).forEach((i: ComplianceIssue) => {
      if (i.severity === 'LOW') s.LOW++;
      else if (i.severity === 'MEDIUM') s.MEDIUM++;
      else if (i.severity === 'HIGH') s.HIGH++;
      s.total++;
    });
    return s;
  }

  /**
   * CSV export for compliance issues (handy for audits/regulators).
   */
  exportIssuesCSV(issues: ComplianceIssue[], title = 'Compliance Issues'): Blob {
    const lines: string[] = [];
    lines.push(title);
    lines.push('ID,EntityType,EntityId,Severity,DetectedAt,Resolved,Message');
    (issues ?? []).forEach((i: ComplianceIssue) => {
      lines.push(`${i.id},${i.entityType},${i.entityId},${i.severity},${i.detectedAt},${i.resolved},${sanitize(i.message)}`);
    });
    return new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  }
}



function safeNumber(n: unknown): number {
  const x = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(x) ? x : 0;
}
function fmt(n: number): string { return (Math.round(n * 100) / 100).toFixed(2); }
function fmtPct(n: number): string { return `${Math.round(n * 10000) / 100}%`; }
function sanitize(s: string): string { return (s ?? '').replace(/,/g, ' '); }
