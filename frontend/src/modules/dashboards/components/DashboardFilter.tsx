import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Category } from "../../categories/service";
import { Product } from "../../products/services";

const FiltersContainer = styled("div")({
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
  flexWrap: "wrap",
});

export interface FilterState {
  startDate: Date | null;
  endDate: Date | null;
  categoryIds: string[];
  productIds: string[];
}

interface DashboardFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  categories: Category[];
  products: Array<Partial<Product>>;
}

export const DashboardFilters = ({
  filters,
  setFilters,
  categories,
  products,
}: DashboardFiltersProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <FiltersContainer>
      <DatePicker
        label="Data Inicial"
        value={filters.startDate ? dayjs(filters.startDate) : null}
        onChange={(date) =>
          setFilters({ ...filters, startDate: date ? date.toDate() : null })
        }
      />

      <DatePicker
        label="Data Final"
        value={filters.endDate ? dayjs(filters.endDate) : null}
        onChange={(date) =>
          setFilters({ ...filters, endDate: date ? date.toDate() : null })
        }
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Categoria</InputLabel>
        <Select
          multiple
          value={filters.categoryIds || []}
          onChange={(e) =>
            setFilters({ ...filters, categoryIds: e.target.value as string[] })
          }
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Produto</InputLabel>
        <Select
          multiple
          value={filters.productIds || []}
          onChange={(e) =>
            setFilters({ ...filters, productIds: e.target.value as string[] })
          }
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FiltersContainer>
  </LocalizationProvider>
);
