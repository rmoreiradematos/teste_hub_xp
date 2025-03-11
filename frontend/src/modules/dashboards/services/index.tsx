export const getSalesMetrics = async (filters: any) => {
  return {
    totalOrders: 10,
    totalRevenue: 1000,
    averageOrderValue: 100,
  };
};

export const getOrdersByPeriod = async (filters: any) => {
  return [
    { date: "2021-01-01", total: 10 },
    { date: "2021-01-02", total: 20 },
    { date: "2021-01-03", total: 30 },
    { date: "2021-01-04", total: 40 },
    { date: "2021-01-05", total: 50 },
  ];
};

export const getCategories = async () => {
  return [
    { id: 1, name: "Eletrônicos" },
    { id: 2, name: "Livros" },
    { id: 3, name: "Roupas" },
  ];
};
