import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { ProductList } from "./components/ProductList";

export function ProductsPage() {
  return (
    <div>
      <Button
        variant="contained"
        component={Link}
        to="/products/create"
        sx={{ mb: 2 }}
      >
        Novo Produto
      </Button>
      <ProductList />
    </div>
  );
}
