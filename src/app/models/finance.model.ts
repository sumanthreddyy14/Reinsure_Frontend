// Finance filters used across dashboard and reports
export interface FinanceFilters {
  from?: string;       // ISO date (inclusive)
  to?: string;         // ISO date (inclusive)
  treatyId?: string;
  reinsurerId?: string;
}

// Core financial metrics
export interface FinancialMetrics {
  cededPremiums: number;
  recoveries: number;
  outstandingBalance: number;
}

// Report breakdowns
export interface FinancialReportBreakdownByTreaty {
  [treatyId: string]: FinancialMetrics;
}
export interface FinancialReportBreakdownByReinsurer {
  [reinsurerId: string]: FinancialMetrics;
}

// Financial report entity
export interface FinancialReport {
  reportId: string;
  generatedDate: string; // ISO
  period?: { from?: string; to?: string };
  treatyId?: string;
  reinsurerId?: string;
  metrics: FinancialMetrics;
  breakdown?: {
    byTreaty?: FinancialReportBreakdownByTreaty;
    byReinsurer?: FinancialReportBreakdownByReinsurer;
  };
}

// Summary alias for convenience
export interface FinanceSummary extends FinancialMetrics {}

// Balance table row for dashboard table
export interface BalanceRow {
  key: string;          // treatyId or reinsurerId based on grouping
  label: string;        // display label (e.g., treatyId or reinsurerName)
  cededPremiums: number;
  recoveries: number;
  outstandingBalance: number;
  treaties?: string[];  // when grouped by reinsurer
}

// --- Recovery model (aligned to your latest stub: recoveryAmount + statuses) ---

export type RecoveryStatus = 'PENDING' | 'COMPLETED' | 'DISPUTED';

export interface Recovery {
  recoveryId: string;
  claimId: string;
  treatyId: string;
  policyId?: string;
  recoveryAmount: number;   // amount recovered/expected from reinsurer
  recoveryDate?: string;    // set when COMPLETED
  status: RecoveryStatus;
  createdAt?: string;
  createdBy?: string;
}