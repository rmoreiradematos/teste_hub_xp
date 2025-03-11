import { AppBar, Button, Container, Toolbar } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Produtos
          </Button>
          <Button color="inherit" component={Link} to="/categories">
            Categorias
          </Button>
          <Button color="inherit" component={Link} to="/orders">
            Pedidos
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
