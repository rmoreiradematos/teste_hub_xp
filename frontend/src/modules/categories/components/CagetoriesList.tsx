import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Category as CategoryResponse, getCategories } from "../service";

const columns: GridColDef[] = [
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
];

export const CategoriesList = () => {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={categories}
        columns={columns}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => "auto"}
        getRowId={(row) => row._id}
      />
    </div>
  );
};
