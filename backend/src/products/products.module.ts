import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsService } from 'src/aws/aws.service';
import { CategoriesModule } from 'src/categories/categories.module';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongoProductsRepository } from './repositories/mongo/products.repositories';
import { ProductsRepository } from './repositories/products.repositories';
import { Products, ProductsSchema } from './schemas/products.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    CategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: ProductsRepository,
      useClass: MongoProductsRepository,
    },
    AwsService,
  ],
})
export class ProductsModule {}
