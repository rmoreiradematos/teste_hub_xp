import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import * as request from 'supertest';
import { CustomValidationPipe } from '../commom/pipes/custom-validation.pipe';
import { MongoProductsRepository } from '../products/repositories/mongo/products.repositories';
import { ProductsRepository } from '../products/repositories/products.repositories';
import { Products, ProductsSchema } from '../products/schemas/products.schemas';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongoOrderRepository } from './repositories/mongo/mongo-order.repository';
import { OrdersRepository } from './repositories/order.repository';
import { Orders, OrdersSchema } from './schemas/order.schema';

describe('OrdersController', () => {
  let app: INestApplication;
  let ordersRepository: OrdersRepository;
  let productsRepository: ProductsRepository;
  let mongoServer: MongoMemoryServer;

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
          { name: Orders.name, schema: OrdersSchema },
          { name: Products.name, schema: ProductsSchema },
        ]),
      ],
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useClass: MongoOrderRepository,
        },
        {
          provide: ProductsRepository,
          useClass: MongoProductsRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new CustomValidationPipe());
    await app.init();

    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/orders (POST)', async () => {
    const product = await productsRepository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const createOrderDto: CreateOrderDto = {
      date: new Date(),
      products: [product._id as string],
      total: 100,
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto);

    expect(response.status).toBe(201);
    expect(response.body.total).toEqual(100);
    expect(response.body.products[0]).toEqual(String(product._id));
  });

  it('/orders (POST) should return 422 when there is something missing', async () => {
    const createOrderDto = {
      date: new Date(),
    };

    const response = await request(app.getHttpServer())
      .post('/orders')
      .send(createOrderDto);

    expect(response.status).toBe(422);
  });

  it('/orders (GET)', async () => {
    await productsRepository.create({
      name: 'Product',
      description: 'Product description',
      price: 100,
      categoryIds: [],
      imageUrl: '',
    });
    const response = await request(app.getHttpServer()).get('/orders');

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(expect.any(Array));
  });

  it('/orders/:id (GET)', async () => {
    const id = new Types.ObjectId();
    const order = await ordersRepository.create({
      date: new Date(),
      products: [String(id)],
      total: 150,
    });

    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .get(`/orders/${order._id}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toEqual(150);
    expect(response.body.products[0]).toEqual(String(id));
  });

  it('/orders/:id (PATCH)', async () => {
    const id = new Types.ObjectId();
    const order = await ordersRepository.create({
      date: new Date(),
      products: [String(id)],
      total: 150,
    });

    const updateOrderDto: UpdateOrderDto = {
      total: 200,
    };

    const response = await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/orders/${order._id}`)
      .send(updateOrderDto);

    expect(response.body.total).toEqual(200);
    expect(response.body.products[0]).toEqual(String(id));
  });

  it('/orders/:id (PATCH) should return 422 when something is missing', async () => {
    const id = new Types.ObjectId();
    const order = await ordersRepository.create({
      date: new Date(),
      products: [String(id)],
      total: 150,
    });

    const updateOrderDto = { date: '' };

    await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .patch(`/orders/${order._id}`)
      .send(updateOrderDto)
      .expect(422);
  });

  it('/orders/:id (DELETE)', async () => {
    const id = new Types.ObjectId();
    const order = await ordersRepository.create({
      date: new Date(),
      products: [String(id)],
      total: 150,
    });

    await request(app.getHttpServer())
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .delete(`/orders/${order._id}`)
      .expect(200);
  });

  it('/orders/:id (DELETE) should return 500 when id is incorrect', async () => {
    await request(app.getHttpServer()).delete('/orders/123').expect(500);
  });
});
