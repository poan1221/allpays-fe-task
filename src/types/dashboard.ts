export type DashboardFilter = {
  fromDate?: string; // 'YYYY-MM-DD'
  toDate?: string; // 'YYYY-MM-DD'
  mchtCode?: string;
  status?: string;
  payType?: string;
};

export type Summary = {
  totalCount: number;
  totalSuccessAmount: number;
  successCount: number;
  successRate: number; // 0 ~ 1
  avgTicket: number;
};
