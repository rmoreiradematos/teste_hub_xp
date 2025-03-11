import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './repositories/category.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    console.info('CategoriesService > starting create');
    return this.categoryRepository.create(createCategoryDto);
  }

  findAll() {
    console.info('CategoriesService > starting findAll');
    return this.categoryRepository.findAll();
  }

  findOne(id: string) {
    console.info('CategoriesService > starting findOne');
    return this.categoryRepository.findOne(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    console.info('CategoriesService > starting update');
    return this.categoryRepository.update(id, updateCategoryDto);
  }

  remove(id: string) {
    console.info('CategoriesService > starting remove');
    return this.categoryRepository.delete(id);
  }
}
