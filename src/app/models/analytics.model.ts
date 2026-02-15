
// src/app/analytics/models/analytics.model.ts

/**
 * Analytics module models (5th module).
 * NOTE: This file intentionally has NO imports or re-exports.
 * Keep it self-contained to avoid isolatedModules TS1205 errors.
 */

// --- Core Analytics Entity (per your requirement) ---

export interface AnalyticsReportMetrics {
  /** lossRatio = totalRecoveries / totalCededPremiums (0 when denominator is 0) */
  lossRatio: number;

  /**
   * treatyUtilization = totalCededPremiums / treaty.coverageLimit
   * (0 when limit is 0/undefined)
   */
  treatyUtilization: number;
}

export interface AnalyticsReport {
  reportId: string;
  treatyId?: string;        // optional association to a specific treaty
  metrics: AnalyticsReportMetrics;
  generatedDate: string;    // ISO string
}

// --- View models consumed by dashboards ---

export interface AnalyticsData<T> {
  data: T;
  generatedAt: string; // ISO string
  source?: string;
}

export interface DashboardKPI {
  activeTreaties: number;
  expiredTreaties: number;
  totalCededPremiums: number;
  totalRecoveries: number;
  outstandingRecoveries: number;
  averageLossRatio: number;
  averageCededPercentage: number;
}

export interface TreatyPerformanceSummary {
  treatyId: string;
  reinsurerName?: string;

  periodFrom?: string;
  periodTo?: string;

  totalCededPremiums: number;
  totalRecoveries: number;
  outstandingRecoveries: number;

  allocationsCount: number;
  averageCededPercentage?: number;
  lossRatio: number;

  status: 'ACTIVE' | 'EXPIRED' | 'ARCHIVED' | string;
}

export interface RiskExposure {
  treatyId: string;
  treatyType: 'PROPORTIONAL' | 'NON-PROPORTIONAL' | string;
  totalCededPremiums: number;
  maxCededPercentage: number;
  averageCededPercentage: number;
  cessionCount: number;
  policyCount?: number;
}

export type ComplianceSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ComplianceIssue {
  id: string;
  entityType: 'TREATY' | 'CESSION' | 'RECOVERY' | 'FINANCIAL_REPORT';
  entityId: string;
  message: string;
  severity: ComplianceSeverity;
  detectedAt: string; // ISO
  resolved: boolean;
}
