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
    console.info('MongoDashBoardRepository > getSalesMetrics');
    console.debug('MongoDashBoardRepository > Filters:', filters);
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date();
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    console.debug('MongoDashBoardRepository > { StartDate, EndDate }:', {
      startDate,
      endDate,
    });

    console.info(
      'MongoDashBoardRepository > Getting productIds from categories',
    );
    let productIdsFromCategories: string[] = [];
    if (filters.categoryIds?.length) {
      const products = await this.productModel.find({
        categoryIds: { $in: filters.categoryIds },
      });
      productIdsFromCategories = products.map((p) => String(p._id));
    }

    console.debug(
      'MongoDashBoardRepository > ProductIdsFromCategories:',
      productIdsFromCategories,
    );
    const matchQuery: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    console.info('MongoDashBoardRepository > Building match query');
    const allProductIds = [
      ...(filters.productIds || []),
      ...productIdsFromCategories,
    ];

    if (allProductIds.length > 0) {
      matchQuery.productIds = { $in: allProductIds };
    }

    console.debug('MongoDashBoardRepository > MatchQuery Inicial:', matchQuery);

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

    console.debug('MongoDashBoardRepository > Result:', result);

    return result || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 };
  }

  async getOrdersByPeriod(filters: DashboardFiltersDto) {
    console.info('MongoDashBoardRepository > getOrdersByPeriod');
    console.debug('MongoDashBoardRepository > Filters:', filters);
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
    console.debug('MongoDashBoardRepository > Pipeline:', pipeline);

    return this.orderModel.aggregate(pipeline);
  }
}
