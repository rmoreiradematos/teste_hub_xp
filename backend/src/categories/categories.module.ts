import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/category.repository';
import { MongoCategoriesRepository } from './repositories/mongo/mongo-category.repository';
import { Category, CategorySchema } from './schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CategoriesRepository, useClass: MongoCategoriesRepository },
  ],
  exports: [MongooseModule, CategoriesRepository],
})
export class CategoriesModule {}
