import { Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface SalesData {
  date: string;
  total: number;
}

export interface SalesChartProps {
  data: SalesData[];
}

export const SalesChart = ({ data }: SalesChartProps) => (
  <div style={{ height: 400 }}>
    <Typography variant="h6" gutterBottom>
      Vendas por Período
    </Typography>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#1976d2"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
