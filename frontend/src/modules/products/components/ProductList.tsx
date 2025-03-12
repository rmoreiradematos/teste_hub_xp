import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, ProductMapped } from "../services";

const columns: GridColDef[] = [
  { field: "name", headerName: "Nome", width: 200 },
  { field: "price", headerName: "Preço", type: "number" },
  { field: "description", headerName: "Descrição", width: 200 },
  { field: "categoryIds", headerName: "Categoria", width: 200 },
  {
    field: "imageUrl",
    headerName: "Imagem",
    width: 200,
    renderCell: (params) => (
      <img
        src={params.value}
        alt="Produto"
        style={{
          width: 50,
          height: 50,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
    ),
  },
  {
    field: "edit",
    headerName: "Editar",
    width: 100,
    renderCell: (params) => (
      <Link to={`edit/${params.id}`}>
        <IconButton>
          <EditIcon />
        </IconButton>
      </Link>
    ),
  },
];

export const ProductList = () => {
  const [products, setProducts] = useState<ProductMapped[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  console.log(products);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => "auto"}
        getRowId={(row) => row._id}
      />
    </div>
  );
};
