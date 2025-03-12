import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardsService } from './dashboards.service';
import { DashboardFiltersDto } from './dto/create-dashboard.dto';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('/metrics')
  @ApiOperation({ summary: 'Find dashboard sales metrics' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getSalesMetrics(@Query() filters: DashboardFiltersDto) {
    console.info('DashboardsController > getSalesMetrics');
    return this.dashboardsService.getSalesMetrics(filters);
  }

  @Get('/orders-by-period')
  @ApiOperation({ summary: 'Find dashboard orders by period' })
  @ApiResponse({ status: 200, description: 'Order found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getOrdersByPeriod(@Query() filters: DashboardFiltersDto) {
    console.info('DashboardsController > getOrdersByPeriod');
    return this.dashboardsService.getOrdersByPeriod(filters);
  }
}
