import { Product } from "../../products/services";

const mockOrders = [
  {
    id: 1,
    products: [
      {
        id: 1,
        name: "Product 1",
      },
    ],
    total: 99.9,
  },
];

export interface Order {
  id: number;
  products: string[];
  total: number;
}

export interface OrderResponse {
  id: number;
  products: Array<Partial<Product>>;
  total: number;
}

export const getOrders = async (): Promise<OrderResponse[]> => {
  const orders = mockOrders.map((order) => ({
    ...order,
    products: order.products.map((product) => ({ name: product.name })),
  }));
  return orders;
};

export const createOrder = async (order: Omit<Order, "id">) => {
  const newOrder = { ...order, id: mockOrders.length + 1 };
  return newOrder;
};

export const getOrderById = async (id: number) => {
  return mockOrders[0];
};

export const updateOrder = async (order: Order) => {
  return order;
};
