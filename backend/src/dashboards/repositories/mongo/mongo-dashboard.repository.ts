import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Orders } from '../../../orders/schemas/order.schema';
import { Products } from '../../../products/schemas/products.schemas';
import { DashboardFiltersDto } from '../../dto/create-dashboard.dto';
import { SalesMetric } from '../../entities/dashboard.entity';
import { DashboardRepository } from '../dashboard.repository';

interface AggregationResult {
  _id: null;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export class MongoDashBoardRepository implements DashboardRepository {
  constructor(
    @InjectModel(Orders.name) private readonly orderModel: Model<Orders>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
  ) {}

  async getSalesMetrics(filters: DashboardFiltersDto): Promise<SalesMetric> {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    let productIdsFromCategories: string[] = [];
    if (filters.categoryIds?.length) {
      const products = await this.productModel.find({
        categoryIds: { $in: filters.categoryIds },
      });
      productIdsFromCategories = products.map((p) => String(p._id));
    }

    const matchQuery: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    const allProductIds = [
      ...(filters.productIds || []),
      ...productIdsFromCategories,
    ];

    if (allProductIds.length > 0) {
      matchQuery.productIds = { $in: allProductIds };
    }

    console.log('MatchQuery Final:', matchQuery);

    const [result] = await this.orderModel.aggregate<AggregationResult>([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
        },
      },
    ]);

    return result || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
  }

  async getOrdersByPeriod(filters: DashboardFiltersDto) {
    const pipeline = [
      {
        $match: {
          date: {
            $gte: filters.startDate ? new Date(filters.startDate) : new Date(),
            $lte: filters.endDate ? new Date(filters.endDate) : new Date(),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          total: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 as 1 | -1 } },
      {
        $project: {
          date: '$_id',
          total: 1,
          _id: 0,
        },
      },
    ];

    return this.orderModel.aggregate(pipeline);
  }
}
