import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Orders } from '../schemas/order.schema';

export abstract class OrdersRepository {
  abstract create(createOrderDto: CreateOrderDto): Promise<Orders>;

  abstract findAll(): Promise<Orders[]>;

  abstract findOne(id: string): Promise<Orders | null>;

  abstract update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Orders | null>;

  abstract delete(id: string): Promise<Orders | null>;

  abstract deleteMany(): Promise<void>;
}
