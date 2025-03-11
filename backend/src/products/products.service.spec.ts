import { ConfigModule } from '@nestjs/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import { AwsService } from '../aws/aws.service';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsService } from './products.service';
import { MongoProductsRepository } from './repositories/mongo/products.repositories';
import { ProductsRepository } from './repositories/products.repositories';
import { Products, ProductsSchema } from './schemas/products.schemas';

describe('ProductsService', () => {
  let service: ProductsService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          useFactory: () => ({
            uri: mongoUri,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }),
        }),
        MongooseModule.forFeature([
          { name: Products.name, schema: ProductsSchema },
        ]),
        CategoriesModule,
      ],
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: {},
        },
        {
          provide: ProductsRepository,
          useClass: MongoProductsRepository,
        },
        AwsService,
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const input = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    };

    const result = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
      _id: new Types.ObjectId(),
      __v: 0,
    } as unknown as Promise<Products>;

    jest
      .spyOn(service, 'create')
      .mockImplementation(() => Promise.resolve(result));
    const expected = await service.create(input, new Buffer(''));
    expect(expected).toBe(result);
  });

  it('should return all products', async () => {
    const result = [
      {
        name: 'Product',
        description: 'Product description',
        price: 100,
        categoryIds: [],
        imageUrl: '',
        _id: new Types.ObjectId(),
        __v: 0,
      },
    ] as unknown as Promise<Products[]>;

    jest.spyOn(service, 'findAll').mockImplementation(async () => result);
    const expected = await service.findAll();
    expect(expected).toBe(result);
  });

  it('should return a product by id when id is a string', async () => {
    const id = new Types.ObjectId().toHexString();
    const result = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
      _id: id,
      __v: 0,
    } as unknown as Promise<Products>;

    jest.spyOn(service, 'findOne').mockImplementation(async () => result);
    const expected = await service.findOne(id);
    expect(expected).toBe(result);
  });

  it('should update a product', async () => {
    const id = new Types.ObjectId().toHexString();
    const input = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],

      imageUrl: '',
    };
    const result = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],

      imageUrl: '',

      _id: id,
      __v: 0,
    } as unknown as Promise<Products>;

    jest.spyOn(service, 'update').mockImplementation(async () => result);
    const expected = await service.update(id, input);
    expect(expected).toBe(result);
  });

  it('should delete a product when id is a string', async () => {
    const id = new Types.ObjectId().toHexString();
    const result = {
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
      _id: id,
      __v: 0,
    } as unknown as Promise<Products>;

    jest.spyOn(service, 'remove').mockImplementation(async () => result);
    const expected = await service.remove(id);
    expect(expected).toBe(result);
  });
});
