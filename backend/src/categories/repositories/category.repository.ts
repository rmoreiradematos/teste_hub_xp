import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../schemas/category.schema';

export abstract class CategoriesRepository {
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;

  abstract findAll(): Promise<Category[]>;

  abstract findOne(id: string): Promise<Category | null>;

  abstract find(query: any): Promise<Category[]>;

  abstract update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null>;

  abstract delete(id: string): Promise<Category | null>;

  abstract deleteMany(): Promise<void>;
}
