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
import { getProducts, ProductMapped } from "../../products/services";
import { getOrderById, Order, updateOrder } from "../service";

interface OrderFormData {
  products: string[];
  total: number;
}

export const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductMapped[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const { control, handleSubmit, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      products: [],
      total: 0,
    },
  });

  const selectedProducts = watch("products");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);

        if (id) {
          const orderData = await getOrderById(id);
          setOrder({ ...orderData, id: Number(orderData.id) });

          const productIds = orderData.products.map((productName) => {
            const product = productsData.find(
              (prod) => prod.name === productName
            );
            return product ? String(product.id) : "";
          });

          setValue("products", productIds);
          setValue("total", orderData.total);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, [id, setValue]);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/orders");
  };

  const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      if (id) {
        const total = data.products.reduce((acc, productId) => {
          const product = products.find(
            (prod) => String(prod.id) === productId
          );
          return acc + (product?.price || 0);
        }, 0);

        const updatedOrder: Omit<Order, "id"> = {
          date: new Date(),
          products: data.products,
          total,
        };
        await updateOrder(id, updatedOrder);
        setModalMessage("Pedido atualizado com sucesso!");
        setModalType("success");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      setModalMessage("Erro ao editar o pedido.");
      setModalType("error");
      setModalOpen(true);
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
                              products.find((prod) => String(prod.id) === id)
                                ?.name
                          )
                          .join(", ")
                      }
                    >
                      {products.map((product) => {
                        return (
                          <MenuItem key={product.id} value={String(product.id)}>
                            {product.name}
                          </MenuItem>
                        );
                      })}
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
