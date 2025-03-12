import { BadRequestException, Injectable } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { CategoriesRepository } from '../categories/repositories/category.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repositories/products.repositories';

@Injectable()
export class ProductsService {
  constructor(
    private readonly awsService: AwsService,
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(createProductDto: CreateProductDto, image: Buffer) {
    try {
      const categories = await this.categoriesRepository.find({
        _id: { $in: createProductDto.categoryIds },
      });

      if (categories.length !== createProductDto.categoryIds.length) {
        throw new BadRequestException('Categoy not found', {
          cause: new Error(),
          description: 'One or more category ID does not exists',
        });
      }

      let imageUrl = '';
      if (image) {
        const { url, fullUrl } = await this.awsService.getPresignedUrl();
        imageUrl = fullUrl;

        await this.awsService.uploadFile(url, image);
      }

      const product = {
        ...createProductDto,
        imageUrl,
      } as CreateProductDto;

      return await this.productsRepository.create(product);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else if (err.name === 'CastError') {
        throw new BadRequestException('Invalid category ID format');
      }
      console.error(err);
      throw new Error('Error creating product');
    }
  }

  findAll() {
    return this.productsRepository.findAll();
  }

  findOne(id: string) {
    return this.productsRepository.findOne(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productsRepository.delete(id);
  }

  async updateImage(id: string, image: Buffer) {
    console.info('ProductsService > updateImage');
    try {
      const product = await this.productsRepository.findOne(id);
      console.debug('ProductsService > Product found', product);
      console.debug('ProductsService > Image', image);
      let imageUrl = '';
      if (image) {
        console.info('ProductsService > Uploading image to S3');
        const { url, fullUrl } = await this.awsService.getPresignedUrl();
        imageUrl = fullUrl;
        console.debug('ProductsService > {url, key}', { url, fullUrl });
        await this.awsService.uploadFile(url, image);
        console.info('ProductsService > Image uploaded to S3');
      }

      const updatedProduct = {
        imageUrl,
      } as UpdateProductDto;

      console.debug(
        'ProductsService > Updating product with new image',
        updatedProduct,
      );

      return await this.productsRepository.update(id, updatedProduct);
    } catch (err) {
      console.error('ProductsService > err:', err);
      throw new BadRequestException('Error updating product image');
    }
  }
}
