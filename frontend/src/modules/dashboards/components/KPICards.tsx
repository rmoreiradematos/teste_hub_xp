import { Card, CardContent, Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  backgroundColor: "#1976d2",
  color: "white",
}));

interface Metrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export const KPICards = ({ metrics }: { metrics: Metrics }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} md={4}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6">Total de Pedidos</Typography>
          <Typography variant="h4">{metrics.totalOrders}</Typography>
        </CardContent>
      </StyledCard>
    </Grid>

    <Grid item xs={12} md={4}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6">Receita Total</Typography>
          <Typography variant="h4">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(metrics.totalRevenue)}
          </Typography>
        </CardContent>
      </StyledCard>
    </Grid>

    <Grid item xs={12} md={4}>
      <StyledCard>
        <CardContent>
          <Typography variant="h6">Valor Médio</Typography>
          <Typography variant="h4">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(metrics.averageOrderValue)}
          </Typography>
        </CardContent>
      </StyledCard>
    </Grid>
  </Grid>
);
