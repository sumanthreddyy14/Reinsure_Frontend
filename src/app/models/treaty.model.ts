export interface Treaty {
  treatyId: string;
  reinsurerId: string;
  reinsurerName: string;
  treatyType: 'PROPORTIONAL' | 'NON-PROPORTIONAL';
  coverageLimit: number;
  startDate: string; 
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'ARCHIVED';
  renewalDate?: string;
}
