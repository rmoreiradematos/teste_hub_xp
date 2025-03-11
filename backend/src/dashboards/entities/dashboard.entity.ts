export class Dashboard {}

export interface SalesMetric {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrdersByPeriod {
  date: Date;
  total: number;
}
