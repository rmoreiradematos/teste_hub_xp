import { Injectable } from '@nestjs/common';
import { DashboardFiltersDto } from './dto/create-dashboard.dto';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardsService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSalesMetrics(filters: DashboardFiltersDto) {
    return await this.dashboardRepository.getSalesMetrics(filters);
  }

  async getOrdersByPeriod(filters: DashboardFiltersDto) {
    return await this.dashboardRepository.getOrdersByPeriod(filters);
  }
}
