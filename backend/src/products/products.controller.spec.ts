import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as request from 'supertest';
import { AwsService } from '../aws/aws.service';
import { CategoriesModule } from '../categories/categories.module';
import { CategoriesRepository } from '../categories/repositories/category.repository';
import { CustomValidationPipe } from '../commom/pipes/custom-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongoProductsRepository } from './repositories/mongo/products.repositories';
import { ProductsRepository } from './repositories/products.repositories';
import { Products, ProductsSchema } from './schemas/products.schemas';

describe('ProductsController', () => {
  let app: INestApplication;
  let repository: ProductsRepository;
  let mongoServer: MongoMemoryServer;
  let categoryRepositoy: CategoriesRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useClass: MongoProductsRepository,
        },
        AwsService,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();

    repository = module.get<ProductsRepository>(ProductsRepository);
    categoryRepositoy = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/products (POST)', async () => {
    const responseCategory = await categoryRepositoy.create({
      name: 'Category',
    });

    const categoryIds = [String(responseCategory._id)];
    const productData: CreateProductDto = {
      name: 'New Product',
      description: 'Product description',
      price: 100,
      categoryIds,
      imageUrl: '',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .field('name', productData.name)
      .field('description', productData.description)
      .field('price', productData.price.toString())
      .field('categoryIds[]', productData.categoryIds)
      .attach('image', Buffer.from('image data'), 'image.png');

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'New Product',
        _id: expect.any(String),
      }),
    );
  });

  it('/products (POST) shoul return 422', async () => {
    const body = await request(app.getHttpServer()).get('/categories');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const categoryIds = body.body.map((category) => category._id);
    const productData = {
      price: 100,
      categoryIds,
      imageUrl: '',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .field('price', productData.price.toString())
      .field('categoryIds', productData.categoryIds)
      .attach('image', Buffer.from('image data'), 'image.png');

    expect(response.status).toBe(422);
  });

  it('/products (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'New Product',
          _id: expect.any(String),
        }),
      ]),
    );
  });

  it('/products/:id (GET)', async () => {
    const product = await repository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Product',
        _id: expect.any(String),
      }),
    );
  });

  it('/products/:id (PATCH)', async () => {
    const product = await repository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/products/${product._id}`)
      .send({ name: 'Updated Product' } as UpdateProductDto);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Updated Product',
        _id: expect.any(String),
      }),
    );
  });

  it('/products/:id (PATCH) shoul return 422 when name is empty', async () => {
    const response = await request(app.getHttpServer())
      .patch('/products/1')
      .send({ name: '' });

    expect(response.status).toBe(422);
  });

  it('/products/:id (DELETE)', async () => {
    const product = await repository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const response = await request(app.getHttpServer()).delete(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `/products/${product._id}`,
    );

    expect(response.status).toBe(200);
  });

  it('/products/:id (DELETE) should return 500 when ID does not exist', async () => {
    const response = await request(app.getHttpServer()).delete('/products/1');

    expect(response.status).toBe(500);
  });

  it('/products/:id/image (PATCH)', async () => {
    const product = await repository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/products/${product._id}/image`)
      .attach('image', Buffer.from('image data'), 'image.png');

    expect(response.status).toBe(200);
  });
});
