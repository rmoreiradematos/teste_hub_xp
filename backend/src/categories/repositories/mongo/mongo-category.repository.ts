import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { Category } from '../../schemas/category.schema';
import { CategoriesRepository } from '../category.repository';

@Injectable()
export class MongoCategoriesRepository implements CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    console.info('CategoriesRepository > starting save');
    const createdCategory = new this.categoryModel(createCategoryDto);
    console.debug('CategoriesRepository > createdCategory:', createdCategory);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    console.info('CategoriesRepository > starting findAll');
    return this.categoryModel.find({ isActive: true }).exec();
  }

  async findOne(id: string | Types.ObjectId): Promise<Category | null> {
    console.info('CategoriesRepository > starting findOne');
    console.debug('CategoriesRepository > id:', id);
    return this.categoryModel.findById(id).exec();
  }

  async find(query: Record<string, unknown>): Promise<Category[]> {
    console.info('CategoriesRepository > starting find');
    console.debug('CategoriesRepository > query:', query);
    return this.categoryModel.find(query).exec();
  }

  async update(
    id: string | Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    console.info('CategoriesRepository > starting update');
    console.debug('CategoriesRepository > {id, updateCategory}:', {
      id,
      updateCategoryDto,
    });
    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async delete(id: string | Types.ObjectId): Promise<Category | null> {
    console.info('CategoriesRepository > starting delete');
    console.debug('CategoriesRepository > id:', id);
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      return null;
    }
    category.isActive = false;
    console.debug('CategoriesRepository > category:', category);
    return category.save();
  }

  async deleteMany(): Promise<void> {
    console.info('CategoriesRepository > starting deleteMany');
    await this.categoryModel.deleteMany({}).exec();
  }
}
