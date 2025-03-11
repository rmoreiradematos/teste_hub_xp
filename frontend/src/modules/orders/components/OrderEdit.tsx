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
import { useNavigate, useParams } from "react-router-dom";
import { MessageModal } from "../../../components/MessageModal";
import { getProducts, ProductResponse } from "../../products/services";
import { getOrderById, Order, updateOrder } from "../service";

interface OrderFormData {
  products: string[];
  total: number;
}

export const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);
  const { control, handleSubmit, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      products: [],
      total: 0,
    },
  });

  const selectedProducts = watch("products");

  useEffect(() => {
    getProducts().then(setProducts);

    if (id) {
      getOrderById(parseInt(id)).then((orderData) => {
        setOrder({
          ...orderData,
          products: orderData.products.map((product) => product.name),
        });
        setValue(
          "products",
          orderData.products.map((product) => product.id.toString())
        );
        setValue("total", orderData.total);
      });
    }
  }, [id, setValue]);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/orders");
  };

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const total = data.products.reduce((acc, productId) => {
        const product = products.find(
          (prod) => prod.id.toString() === productId
        );
        return acc + (product?.price || 0);
      }, 0);

      const updatedOrder: Order = {
        ...order!,
        products: data.products.map(
          (id) => products.find((prod) => prod.id.toString() === id)?.name || ""
        ),
        total,
      };

      await updateOrder(updatedOrder);
      setModalMessage("Pedido atualizado com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      setModalMessage("Erro ao editar o pedido.");
      setModalType("error");
      setModalOpen(true);
      setShouldNavigate(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Editar Pedido
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
                              products.find((prod) => prod.id.toString() === id)
                                ?.name
                          )
                          .join(", ")
                      }
                    >
                      {products.map((product) => (
                        <MenuItem
                          key={product.id}
                          value={product.id.toString()}
                        >
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
                        (prod) => prod.id.toString() === productId
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
              <Button variant="outlined" onClick={() => navigate("/orders")}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  "Salvar Alterações"
                )}
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
