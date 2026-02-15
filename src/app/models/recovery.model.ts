export interface Recovery {
  recoveryId: string;
  claimId: string;
  treatyId: string;
  recoveryAmount: number;
  recoveryDate: string;
  status: 'PENDING' | 'COMPLETED' | 'DISPUTED';
}