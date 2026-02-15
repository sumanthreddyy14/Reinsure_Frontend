export interface RiskCession {
  cessionId: string;
  treatyId: string;
  policyId: string;
  cededPercentage: number; // 0–100
  cededPremium: number;
  commission?: number; // optional if commissions apply
  createdAt: string;   // ISO timestamp
  createdBy: string;   // username or ID
}

export interface AuditLog {
  cessionId: string;
  timestamp: string;
  action: string;
  user: string;
}
