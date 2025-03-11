import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Products } from '../schemas/products.schemas';

export abstract class ProductsRepository {
  abstract create(createProductDto: CreateProductDto): Promise<Products>;

  abstract findAll(): Promise<Products[]>;

  abstract findOne(id: string): Promise<Products | null>;

  abstract update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Products | null>;

  abstract delete(id: string): Promise<Products | null>;

  abstract deleteMany(): Promise<void>;
}
