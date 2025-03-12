import HttpService from "../../../service/httpService";
import { formateDateAsUSA } from "../../orders/service";
import { SalesData } from "../components/SalesChart";

export interface MetricsResults {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface FilterState {
  startDate: string | null;
  endDate: string | null;
  categoryIds: string[];
  productIds: string[];
}

export const getSalesMetrics = async (filters: any) => {
  const formattedFilters = buildQueryString(filters);

  return await HttpService.get<MetricsResults>(
    `/dashboards/metrics`,
    formattedFilters
  );
};

export const getOrdersByPeriod = async (filters: any) => {
  const formattedFilters = buildQueryString(filters);
  return await HttpService.get<SalesData[]>(
    `/dashboards/orders-by-period`,
    formattedFilters
  );
};

const buildQueryString = (params: FilterState) => {
  const formattedObject: Record<string, any> = {};
  if (params.startDate) {
    formattedObject["startDate"] = formateDateAsUSA(params.startDate);
  }

  if (params.endDate) {
    formattedObject["endDate"] = formateDateAsUSA(params.endDate);
  }

  if (params.categoryIds && params.categoryIds.length > 0) {
    formattedObject["categoryIds"] = params.categoryIds;
  }

  if (params.productIds && params.productIds.length > 0) {
    formattedObject["productIds"] = params.productIds;
  }

  return formattedObject;
};
