import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './repositories/order.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly OrdersRepository: OrdersRepository) {}

  create(createOrderDto: CreateOrderDto) {
    return this.OrdersRepository.create(createOrderDto);
  }

  findAll() {
    return this.OrdersRepository.findAll();
  }

  findOne(id: string) {
    return this.OrdersRepository.findOne(id);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.OrdersRepository.update(id, updateOrderDto);
  }

  remove(id: string) {
    return this.OrdersRepository.delete(id);
  }
}
