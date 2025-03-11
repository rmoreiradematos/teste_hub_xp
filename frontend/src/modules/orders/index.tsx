import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { OrdersList } from "./components/OrdersList";

export function OrdersPage() {
  return (
    <div>
      <Button
        variant="contained"
        component={Link}
        to="/orders/create"
        sx={{ mb: 2 }}
      >
        Novo Pedido
      </Button>
      <OrdersList />
    </div>
  );
}
