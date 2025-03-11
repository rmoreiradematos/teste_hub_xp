import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { CustomValidationPipe } from '../commom/pipes/custom-validation.pipe';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repositories/category.repository';
import { MongoCategoriesRepository } from './repositories/mongo/mongo-category.repository';
import { Category, CategorySchema } from './schemas/category.schema';
describe('CategoriesController', () => {
  let app: INestApplication;
  let repository: CategoriesRepository;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
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
          { name: Category.name, schema: CategorySchema },
        ]),
      ],
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useClass: MongoCategoriesRepository },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();

    repository = module.get<CategoriesRepository>(CategoriesRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Toalha' })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Toalha',
        _id: expect.any(String),
      }),
    );
  });

  it('/categories (POST) should returns 400 when there is no name', async () => {
    await request(app.getHttpServer()).post('/categories').send().expect(500);
  });

  it('/categories (POST) should returns 422 when name is empty', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .send({ name: '' })
      .expect(422);
  });

  it('/categories (GET) should get all categories', async () => {
    const response = await request(app.getHttpServer())
      .get('/categories')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Toalha',
          _id: expect.any(String),
        }),
      ]),
    );
  });

  it('/categories/:id (GET) should get a category by id', async () => {
    const category = await repository.create({ name: 'Cama' });

    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/categories/${category._id}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Cama',
        _id: expect.any(String),
      }),
    );
  });

  it('/categories/:id (PATCH) should update a category', async () => {
    const category = await repository.create({ name: 'Mesa' });

    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/categories/${category._id}`)
      .send({ name: 'Mesa de jantar' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Mesa de jantar',
        _id: expect.any(String),
      }),
    );
  });

  it('/categories/:id (PATCH) should return 422 when trying to update and name is empty', async () => {
    const category = await repository.create({ name: 'Mesa' });

    await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/categories/${category._id}`)
      .send({ name: '' })
      .expect(422);
  });

  it('/categories/:id (DELETE) should delete a category', async () => {
    const category = await repository.create({ name: 'Sofá' });

    await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/categories/${category._id}`)
      .expect(200);
  });
});
