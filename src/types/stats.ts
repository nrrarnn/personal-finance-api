export interface CategoryStat {
  _id: string; // category name
  totalAmount: number;
  count: number;
}

export interface StatsQuery {
  month?: string;
  year?: string;
}

export interface PieChartQuery extends StatsQuery {
  type?: 'income' | 'expense';
}

export interface PieChartStat {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export interface MonthlyStatsResponse {
  success: boolean;
  data?: CategoryStat[];
  message?: string;
}

export interface PieChartResponse {
  success: boolean;
  data?: PieChartStat[];
  message?: string;
}

