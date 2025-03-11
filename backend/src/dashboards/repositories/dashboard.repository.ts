import { DashboardFiltersDto } from '../dto/create-dashboard.dto';
import { SalesMetric } from '../entities/dashboard.entity';

export abstract class DashboardRepository {
  abstract getSalesMetrics(filters: DashboardFiltersDto): Promise<SalesMetric>;
  abstract getOrdersByPeriod(filters: DashboardFiltersDto): Promise<
    Array<{
      date: Date;
      total: number;
    }>
  >;
}
