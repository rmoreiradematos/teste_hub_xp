import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MessageModal } from "../../../components/MessageModal";
import { getProducts, ProductMapped } from "../../products/services";
import { createOrder, Order } from "../service";

interface OrderFormData {
  date: Date;
  products: string[];
  total: number;
}

export const OrderCreate = () => {
  const [products, setProducts] = useState<ProductMapped[]>([]);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);
  const { control, handleSubmit, watch } = useForm<OrderFormData>({
    defaultValues: {
      date: new Date(),
      products: [],
      total: 0,
    },
  });

  const selectedProducts = watch("products");

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/orders");
  };

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const total = data.products.reduce((acc, productId) => {
        const product = products.find((prod) => String(prod.id) === productId);
        return acc + (product?.price || 0);
      }, 0);

      const order: Omit<Order, "id"> = {
        date: new Date(),
        products: data.products,
        total,
      };

      await createOrder(order);
      setModalMessage("Pedido criado com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar o pedido.");
      setModalMessage("Erro ao criar o pedido.");
      setModalType("error");
      setModalOpen(true);
      setShouldNavigate(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Criar Pedido
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="products"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Produtos</InputLabel>
                    <Select
                      {...field}
                      multiple
                      label="Produtos"
                      renderValue={(selected) =>
                        selected
                          .map(
                            (id: string) =>
                              products.find((prod) => String(prod.id) === id)
                                ?.name
                          )
                          .join(", ")
                      }
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={String(product.id)}>
                          {product.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="total"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Total"
                    type="number"
                    variant="outlined"
                    disabled
                    value={selectedProducts.reduce((acc, productId) => {
                      const product = products.find(
                        (prod) => String(prod.id) === productId
                      );
                      return acc + (product?.price || 0);
                    }, 0)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button variant="outlined" onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Criar Pedido"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <MessageModal
        open={modalOpen}
        onClose={() => handleCloseModal()}
        message={modalMessage}
        type={modalType}
      />
    </Container>
  );
};
