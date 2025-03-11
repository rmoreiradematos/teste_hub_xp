import { Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { getProducts, Product } from "../../products/services";
import { getCategories, getOrdersByPeriod, getSalesMetrics } from "../services";
import { DashboardFilters, FilterState } from "./DashboardFilter";
import { KPICards } from "./KPICards";
import { SalesChart, SalesData } from "./SalesChart";

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [chartData, setChartData] = useState<SalesData[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [products, setProducts] = useState<Array<Partial<Product>>>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: null,
    endDate: null,
    categoryIds: [],
    productIds: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        setError("Erro ao carregar dados iniciais");
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [metricsRes, chartRes] = await Promise.all([
          getSalesMetrics(filters),
          getOrdersByPeriod(filters),
        ]);

        setMetrics(metricsRes);
        setChartData(chartRes);
        setError("");
      } catch (err) {
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div>
      <DashboardFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        products={products}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <KPICards metrics={metrics} />
          <SalesChart data={chartData} />
        </>
      )}
    </div>
  );
};
