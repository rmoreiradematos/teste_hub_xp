import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsModule } from './aws/aws.module';
import { CategoriesModule } from './categories/categories.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    AwsModule,
    DashboardsModule,
  ],
})
export class AppModule {}
