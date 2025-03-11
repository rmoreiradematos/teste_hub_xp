import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Types } from 'mongoose';
import { OrdersService } from './orders.service';
import { MongoOrderRepository } from './repositories/mongo/mongo-order.repository';
import { OrdersRepository } from './repositories/order.repository';
import { Orders, OrdersSchema } from './schemas/order.schema';

describe('OrdersService', () => {
  let service: OrdersService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
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
        ]),
      ],
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useClass: MongoOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should create a new order', async () => {
    const input = {
      total: 130,
      products: [String(new Types.ObjectId())],
      date: new Date(),
    };

    const result = {
      customerId: '123',
      products: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
      _id: expect.any(String),
      __v: 0,
    } as unknown as Promise<Orders>;

    jest.spyOn(service, 'create').mockResolvedValue(result);
    const expected = await service.create(input);
    expect(expected).toEqual(result);
  });

  it('should return all orders', async () => {
    const result = [
      {
        customerId: '123',
        products: [
          {
            productId: '123',
            quantity: 2,
          },
        ],
        _id: '123',
        __v: 0,
      },
    ] as unknown as Promise<Orders[]>;

    jest.spyOn(service, 'findAll').mockResolvedValue(result);
    const expected = await service.findAll();
    expect(expected).toEqual(result);
  });

  it('should return an order by id', async () => {
    const id = '123';
    const result = {
      customerId: '123',
      products: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
      _id: id,
      __v: 0,
    } as unknown as Promise<Orders>;

    jest.spyOn(service, 'findOne').mockResolvedValue(result);
    const expected = await service.findOne(id);
    expect(expected).toEqual(result);
  });

  it('should update an order', async () => {
    const id = '123';
    const input = {
      total: 130,
      products: [String(new Types.ObjectId())],
      date: new Date(),
    };

    const result = {
      customerId: '123',
      products: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
      _id: id,
      __v: 0,
    } as unknown as Promise<Orders>;

    jest.spyOn(service, 'update').mockResolvedValue(result);
    const expected = await service.update(id, input);
    expect(expected).toEqual(result);
  });

  it('should delete an order', async () => {
    const id = '123';
    const result = {
      customerId: '123',
      products: [
        {
          productId: '123',
          quantity: 2,
        },
      ],
      _id: id,
      __v: 0,
    } as unknown as Promise<Orders>;

    jest.spyOn(service, 'remove').mockResolvedValue(result);
    const expected = await service.remove(id);
    expect(expected).toEqual(result);
  });
});
