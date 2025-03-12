import HttpService from "../../../service/httpService";
import { Product } from "../../products/services";
export interface Order {
  id: number;
  date: Date;
  products: string[];
  total: number;
}

export interface OrderResponse {
  _id: string;
  date: Date;
  products: Array<Partial<Product>>;
  total: number;
}

export interface OrderMapped {
  id: string;
  date: string;
  products: string[];
  total: number;
}

export const getOrders = async (): Promise<OrderMapped[]> => {
  const orders = await HttpService.get<OrderResponse[]>("/orders");

  return orders.map((order) => ({
    id: order._id,
    date: formatDate(order.date.toString()),
    total: order.total,
    products:
      order.products
        ?.filter((product): product is { name: string } => !!product?.name)
        .map((product) => product.name) || [],
  }));
};

export const createOrder = async (order: Omit<Order, "id">) => {
  return HttpService.post<OrderResponse>("/orders", order);
};

export const getOrderById = async (id: string) => {
  const order = await HttpService.get<OrderResponse>(`/orders/${id}`);
  return {
    id: order._id,
    date: order.date,
    total: order.total,
    products:
      order.products
        ?.filter((product): product is { name: string } => !!product?.name)
        .map((product) => product.name) || [],
  };
};

export const updateOrder = async (id: String, order: Omit<Order, "id">) => {
  return HttpService.patch<OrderResponse>(`/orders/${id}`, order);
};

export const deleteOrder = async (id: string) => {
  return HttpService.delete(`/orders/${id}`);
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

export function formateDateAsUSA(dateString: string) {
  const date = new Date(dateString);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${year}-${month}-${day}`;
}
