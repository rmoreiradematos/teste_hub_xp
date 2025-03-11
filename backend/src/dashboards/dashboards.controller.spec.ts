import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types } from 'mongoose';
import * as request from 'supertest';
import {
  Category,
  CategorySchema,
} from '../categories/schemas/category.schema';
import { Orders, OrdersSchema } from '../orders/schemas/order.schema';
import { Products, ProductsSchema } from '../products/schemas/products.schemas';
import { DashboardsModule } from './dashboards.module';

describe('DashboardsController (E2E)', () => {
  let app: INestApplication;
  let productModel: Model<Products>;
  let orderModel: Model<Orders>;
  let categoryModel: Model<Category>;
  let mongoServer: MongoMemoryServer;

  const mockCategories = [
    { _id: String(new Types.ObjectId()), name: 'Eletrônicos' },
    { _id: String(new Types.ObjectId()), name: 'Roupas' },
  ];

  const mockProducts = [
    {
      _id: '67cf204440645d8f0a8da531',
      name: 'Smartphone',
      price: 1500,
      description: 'Smartphone description',
      categoryIds: [mockCategories[0]._id],
      imageUrl: 'url1',
    },
    {
      _id: '67cf204c40645d8f0a8da537',
      name: 'Camisa',
      price: 50,
      description: 'Camisa description',
      categoryIds: [mockCategories[1]._id],
      imageUrl: 'url2',
    },
  ];

  const mockOrders = [
    {
      date: new Date('2023-01-01'),
      productIds: ['67cf204440645d8f0a8da531', '67cf204c40645d8f0a8da537'],
      total: 1550,
    },
    {
      date: new Date('2023-01-02'),
      productIds: ['67cf204440645d8f0a8da531'],
      total: 1500,
    },
  ];

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
          { name: Orders.name, schema: OrdersSchema },
          { name: Category.name, schema: CategorySchema },
        ]),
        DashboardsModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    productModel = module.get<Model<Products>>(getModelToken(Products.name));
    orderModel = module.get<Model<Orders>>(getModelToken(Orders.name));
    categoryModel = module.get<Model<Category>>(getModelToken(Category.name));

    await categoryModel.insertMany(mockCategories);
    await productModel.insertMany(mockProducts);
    await orderModel.insertMany(mockOrders);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/dashboard/metrics (GET)', () => {
    it('should return correct sales metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboards/metrics')
        .query({
          startDate: '2023-01-01',
          endDate: '2023-01-02',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: null,
        totalOrders: 2,
        totalRevenue: 3050,
        averageOrderValue: 1525,
      });
    });

    it('should filter metrics by category', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboards/metrics')
        .query({
          'categoryIds[]': '65d9a7d3f9b1a8436fe6a7a3',
          startDate: '2023-01-01',
          endDate: '2023-01-02',
        });

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: null,
        totalOrders: 2,
        totalRevenue: 3050,
        averageOrderValue: 1525,
      });
    });
  });

  describe('/dashboard/orders-by-period (GET)', () => {
    it('should return orders grouped by day', async () => {
      const response = await request(app.getHttpServer())
        .get('/dashboards/orders-by-period')
        .query({
          startDate: '2023-01-01',
          endDate: '2023-01-02',
        })
        .expect(200);

      expect(response.body).toEqual([
        { date: '2023-01-01', total: 1550 },
        { date: '2023-01-02', total: 1500 },
      ]);
    });
  });
});
