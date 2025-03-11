import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, OrderResponse } from "../service";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150, align: "center" },
  {
    field: "products",
    headerName: "Produtos",
    width: 350,
    renderCell: (params) => (
      <div>
        {params.value
          .map((product: { name: string }) => product.name)
          .join(", ")}
      </div>
    ),
  },
  { field: "total", headerName: "Total", width: 200, align: "center" },
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

export const OrdersList = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  useEffect(() => {
    async function loadOrders() {
      const orders = await getOrders();
      setOrders(orders);
    }
    loadOrders();
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={orders}
        columns={columns}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => 60}
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
