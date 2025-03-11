import { Controller, Get, Query } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardFiltersDto } from './dto/create-dashboard.dto';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('/metrics')
  async getSalesMetrics(@Query() filters: DashboardFiltersDto) {
    console.info('DashboardsController > getSalesMetrics');
    return this.dashboardsService.getSalesMetrics(filters);
  }

  @Get('/orders-by-period')
  async getOrdersByPeriod(@Query() filters: DashboardFiltersDto) {
    console.info('DashboardsController > getOrdersByPeriod');
    return this.dashboardsService.getOrdersByPeriod(filters);
  }
}
