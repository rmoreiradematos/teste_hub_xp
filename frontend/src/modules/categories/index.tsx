import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { CategoriesList } from "./components/CagetoriesList";

export function CategoriesPage() {
  return (
    <div>
      <Button
        variant="contained"
        component={Link}
        to="/categories/create"
        sx={{ mb: 2 }}
      >
        Nova Categoria
      </Button>
      <CategoriesList />
    </div>
  );
}
