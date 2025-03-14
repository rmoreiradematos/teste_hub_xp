import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteOrder, getOrders, OrderMapped } from "../service";

const handleDelete = async (
  id: string,
  setOrders: (orders: OrderMapped[]) => void
) => {
  try {
    await deleteOrder(id);
    const orders = await getOrders();
    setOrders(orders);
  } catch (err) {
    console.error(err);
  }
};

const getColumns = (
  setOrders: (orders: OrderMapped[]) => void
): GridColDef[] => [
  { field: "date", headerName: "Data", width: 200, align: "center" },
  {
    field: "products",
    headerName: "Produtos",
    width: 400,
    renderCell: (params) => (
      <div>{params.value.map((product: string) => product).join(", ")}</div>
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
  {
    field: "excluir",
    headerName: "Excluir",
    width: 100,
    renderCell: (params) => (
      <IconButton
        onClick={() => handleDelete(params.id as string, setOrders)}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    ),
  },
];

export const OrdersList = () => {
  const [orders, setOrders] = useState<OrderMapped[]>([]);

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
        columns={getColumns(setOrders)}
        pagination
        pageSizeOptions={[5]}
        getRowHeight={() => 60}
        getRowId={(row) => String(row.id)}
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
