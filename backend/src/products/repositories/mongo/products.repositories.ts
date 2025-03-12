import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products } from '../../schemas/products.schemas';
import { ProductsRepository } from '../products.repositories';

@Injectable()
export class MongoProductsRepository implements ProductsRepository {
  constructor(
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  async create(createProductDto: any): Promise<Products> {
    console.info('ProductsRepository > starting save');
    const createdProduct = new this.productModel(createProductDto);
    console.debug('ProductsRepository > createdProduct:', createdProduct);
    return createdProduct.save();
  }

  async findAll() {
    console.info('ProductsRepository > starting findAll');
    return this.productModel
      .find({ isActive: true })
      .populate({
        path: 'categoryIds',
        select: 'name',
        model: 'Category',
      })
      .exec();
  }

  async findOne(id: string): Promise<Products | null> {
    console.info('ProductsRepository > starting findOne');
    console.debug('ProductsRepository > id:', id);
    return this.productModel
      .findById(id)
      .populate({
        path: 'categoryIds',
        select: 'name',
        model: 'Category',
      })
      .exec();
  }

  async update(id: string, updateProductDto: any): Promise<Products | null> {
    console.info('ProductsRepository > starting update');
    console.debug('ProductsRepository > {id, updateProductDto}:', {
      id,
      updateProductDto,
    });
    return this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Products | null> {
    console.info('ProductsRepository > starting delete');
    console.debug('ProductsRepository > id:', id);
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      return null;
    }
    product.isActive = false;
    console.debug('ProductsRepository > product:', product);
    return product.save();
  }

  async deleteMany(): Promise<void> {
    console.info('ProductsRepository > starting deleteMany');
    await this.productModel.deleteMany().exec();
  }
}
