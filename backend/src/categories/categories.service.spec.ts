import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, Types } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesRepository } from './repositories/category.repository';
import { MongoCategoriesRepository } from './repositories/mongo/mongo-category.repository';
import { Category } from './schemas/category.schema';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken('Category'),
          useValue: {},
        },
        {
          provide: CategoriesRepository,
          useClass: MongoCategoriesRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });
  it('should create a category', async () => {
    const input: CreateCategoryDto = {
      name: 'Category',
    };
    const result = { name: 'Category', _id: new Types.ObjectId(), __v: 0 };
    jest
      .spyOn(service, 'create')
      .mockImplementation(() =>
        Promise.resolve(
          result as unknown as Document<unknown, object, Category> &
            Category & { _id: Types.ObjectId } & { __v: number },
        ),
      );

    expect(await service.create(input)).toBe(result);
  });

  it('should return all categories', async () => {
    const result = [
      { name: 'Category', _id: new Types.ObjectId() },
    ] as unknown as Promise<Category[]>;
    jest.spyOn(service, 'findAll').mockImplementation(async () => result);
    console.log(result);

    const expected = await service.findAll();

    expect(expected).toBe(result);
  });

  it('should return a category by id when id is a string', async () => {
    const id = new Types.ObjectId().toHexString();
    const result = {
      name: 'Category',
      _id: id,
    } as unknown as Promise<Category>;
    jest.spyOn(service, 'findOne').mockImplementation(async () => result);

    const expected = await service.findOne(id);

    expect(expected).toBe(result);
  });

  it('should update a category', async () => {
    const id = '123';
    const input = {
      name: 'Category',
    };
    const result = {
      name: 'Category',
      _id: id,
    } as unknown as Promise<Category>;
    jest.spyOn(service, 'update').mockImplementation(async () => result);

    const expected = await service.update(id, input);

    expect(expected).toBe(result);
  });

  it('should delete a category when id is a string', async () => {
    const id = new Types.ObjectId().toHexString();
    const result = {
      name: 'Category',
      _id: id,
    } as unknown as Promise<Category>;
    jest.spyOn(service, 'remove').mockImplementation(async () => result);

    const expected = await service.remove(id);

    expect(expected).toBe(result);
  });
});
