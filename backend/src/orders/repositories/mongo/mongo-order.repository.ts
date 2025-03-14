import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { UpdateOrderDto } from '../../dto/update-order.dto';
import { Orders } from '../../schemas/order.schema';
import { OrdersRepository } from '../order.repository';

export class MongoOrderRepository implements OrdersRepository {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<Orders>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    console.info('MongoOrderRepository > createOrderDto');
    const createdOrder = new this.orderModel(createOrderDto);
    console.debug('MongoOrderRepository > createdOrder', createdOrder);
    return createdOrder.save();
  }
  async findAll() {
    console.info('MongoOrderRepository > findAll');
    return this.orderModel
      .find({ isActive: true })
      .populate({
        path: 'products',
        select: 'name',
        model: 'Products',
      })
      .exec();
  }
  async findOne(id: string) {
    console.info('MongoOrderRepository > findOne');
    return this.orderModel
      .findById(id)
      .populate({
        path: 'products',
        select: 'name',
        model: 'Products',
      })
      .exec();
  }
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    console.info('MongoOrderRepository > update');
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, {
      new: true,
    });
  }
  async delete(id: string) {
    console.info('MongoOrderRepository > delete');
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      return null;
    }
    order.isActive = false;
    return order.save();
  }
  async deleteMany(): Promise<void> {
    console.info('MongoOrderRepository > deleteMany');
    await this.orderModel.deleteMany({});
  }
}
