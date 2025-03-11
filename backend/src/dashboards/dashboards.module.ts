import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from '../orders/schemas/order.schema';
import { Products, ProductsSchema } from '../products/schemas/products.schemas';
import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';
import { DashboardRepository } from './repositories/dashboard.repository';
import { MongoDashBoardRepository } from './repositories/mongo/mongo-dashboard.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
      { name: Orders.name, schema: OrdersSchema },
    ]),
  ],
  controllers: [DashboardsController],
  providers: [
    DashboardsService,
    {
      provide: DashboardRepository,
      useClass: MongoDashBoardRepository,
    },
  ],
})
export class DashboardsModule {}
