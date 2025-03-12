import { Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { Category, getCategories } from "../../categories/service";
import { getProducts, ProductMapped } from "../../products/services";
import { getOrdersByPeriod, getSalesMetrics } from "../services";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductMapped[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    startDate: new Date(),
    endDate: new Date(),
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
