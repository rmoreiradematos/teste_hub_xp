import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    console.info('CategoriesController > Starting create');
    console.debug(
      'CategoriesController > createCategoryDto:',
      createCategoryDto,
    );
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    console.info('CategoriesController > Starting findAll');
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.info('CategoriesController > Starting findOne');
    console.debug('CategoriesController > id:', id);
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    console.info('CategoriesController > Starting update');
    console.debug('CategoriesController > {id, updateCategoryDto}:', {
      id,
      updateCategoryDto,
    });
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.info('CategoriesController > Starting remove');
    console.debug('CategoriesController > id:', id);
    return this.categoriesService.remove(id);
  }

  // @Post('teste')
  // async teste() {
  //   const t = await this.awsService.getPresignedUrl();
  //   return t;
  // }
}
