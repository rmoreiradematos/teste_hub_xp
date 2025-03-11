import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongoOrderRepository } from './repositories/mongo/mongo-order.repository';
import { OrdersRepository } from './repositories/order.repository';
import { Orders, OrdersSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: OrdersRepository,
      useClass: MongoOrderRepository,
    },
  ],
})
export class OrdersModule {}
