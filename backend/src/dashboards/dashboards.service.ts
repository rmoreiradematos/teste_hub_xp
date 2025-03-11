import { Injectable } from '@nestjs/common';
import { DashboardFiltersDto } from './dto/create-dashboard.dto';
import { DashboardRepository } from './repositories/dashboard.repository';

@Injectable()
export class DashboardsService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSalesMetrics(filters: DashboardFiltersDto) {
    console.info('DashboardsService > getSalesMetrics');
    return await this.dashboardRepository.getSalesMetrics(filters);
  }

  async getOrdersByPeriod(filters: DashboardFiltersDto) {
    console.info('DashboardsService > getOrdersByPeriod');
    return await this.dashboardRepository.getOrdersByPeriod(filters);
  }
}
