import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { DashboardPage } from "./components/DashboardPage";

export function DashboardHome() {
  return (
    <div>
      <Button
        variant="contained"
        component={Link}
        to="/dashboard/full-view"
        sx={{ mb: 2 }}
      >
        Ver Dashboard Completo
      </Button>
      <DashboardPage />
    </div>
  );
}
