import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductsPage } from "./modules/products";
// import { CategoriesPage } from "./modules/categories";
// import { OrdersPage } from "./modules/orders";
// import { DashboardPage } from "./modules/dashboard";
import Layout from "./components/Layout";
import { CategoriesPage } from "./modules/categories";
import { CategoryCreate } from "./modules/categories/components/CategoryCreate";
import { CategoryEdit } from "./modules/categories/components/CategoryEdit";
import { DashboardPage } from "./modules/dashboards/components/DashboardPage";
import { OrdersPage } from "./modules/orders";
import { OrderCreate } from "./modules/orders/components/OrderCreate";
import { OrderEdit } from "./modules/orders/components/OrderEdit";
import { ProductCreate } from "./modules/products/components/ProductCreate";
import { ProductEdit } from "./modules/products/components/ProductEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products">
            <Route index element={<ProductsPage />} />
            <Route path="create" element={<ProductCreate />} />
            <Route path="edit/:id" element={<ProductEdit />} />
          </Route>

          <Route path="categories">
            <Route index element={<CategoriesPage />} />
            <Route path="create" element={<CategoryCreate />} />
            <Route path="edit/:id" element={<CategoryEdit />} />
          </Route>

          <Route path="orders">
            <Route index element={<OrdersPage />} />
            <Route path="create" element={<OrderCreate />} />
            <Route path="edit/:id" element={<OrderEdit />} />
          </Route>
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
