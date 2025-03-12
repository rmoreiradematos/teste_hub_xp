import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, getProducts, ProductMapped } from "../services";

const handleDelete = async (
  id: string,
  setProducts: (products: ProductMapped[]) => void
) => {
  try {
    await deleteProduct(id);
    const products = await getProducts();
    setProducts(products);
  } catch (err) {
    console.error(err);
  }
};

const getColumns = (
  setProducts: (products: ProductMapped[]) => void
): GridColDef[] => [
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
  { field: "name", headerName: "Nome", width: 200 },
  { field: "description", headerName: "Descrição", width: 200 },
  { field: "price", headerName: "Preço", width: 200 },
  { field: "categoryIds", headerName: "Categoria", width: 200 },
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
  {
    field: "delete",
    headerName: "Deletar",
    width: 100,
    renderCell: (params) => (
      <IconButton
        onClick={() => handleDelete(params.id as string, setProducts)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export const ProductList = () => {
  const [products, setProducts] = useState<ProductMapped[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={getColumns(setProducts)}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => "auto"}
        getRowId={(row) => row._id}
      />
    </div>
  );
};
