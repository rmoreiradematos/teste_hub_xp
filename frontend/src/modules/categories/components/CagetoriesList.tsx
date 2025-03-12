import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Category as CategoryResponse,
  deleteCategory,
  getCategories,
} from "../service";

const handleDelete = async (
  id: string,
  setCategories: (categories: CategoryResponse[]) => void
) => {
  try {
    await deleteCategory(id);
    const categories = await getCategories();
    setCategories(categories);
  } catch (err) {
    console.error(err);
  }
};

const getColumns = (
  setCategories: (categories: CategoryResponse[]) => void
): GridColDef[] => [
  { field: "name", headerName: "Nome", width: 200 },
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
        onClick={() => handleDelete(params.id as string, setCategories)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export const CategoriesList = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div style={{ height: 400, width: "70%" }}>
      <DataGrid
        rows={categories}
        columns={getColumns(setCategories)}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => "auto"}
        getRowId={(row) => row._id}
        sx={{
          border: "1px solid #ccc",
          boxShadow: 2,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
            textAlign: "center",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #ccc",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      />
    </div>
  );
};
