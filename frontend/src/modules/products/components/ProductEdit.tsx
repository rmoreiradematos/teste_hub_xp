import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { MessageModal } from "../../../components/MessageModal";
import { Category, getCategories } from "../../categories/service";
import {
  getProductById,
  Product,
  updateImage,
  updateProduct,
} from "../services";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  categoryIds?: string[];
  image?: File | null | undefined;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  description: yup.string().required("Descrição é obrigatória"),
  price: yup
    .number()
    .required("Preço é obrigatório")
    .min(0.01, "Preço deve ser maior que zero"),
  categoryIds: yup
    .array()
    .of(yup.string().required())
    .min(1, "Selecione pelo menos uma categoria"),
  image: yup.mixed<File>().nullable(),
});

export const ProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const { setValue } = useForm<ProductFormData>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const [productData, categoriesData] = await Promise.all([
            getProductById(id),
            getCategories(),
          ]);

          reset({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            categoryIds: productData.categoryIds,
          });
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, reset, navigate]);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/products");
  };

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      if (id) {
        const updatedImage = data.image;
        const updatedProduct = {
          name: data.name,
          description: data.description,
          price: data.price,
        } as Omit<Product, "id | imageUrl">;

        console.log("updatedProduct", updatedProduct);
        await updateProduct(id, updatedProduct);
        if (updatedImage) await updateImage(id, updatedImage);
        setModalMessage("Produto atualizado com sucesso!");
        setModalType("success");
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setModalMessage("Erro ao editar o produto.");
      setModalType("error");
      setModalOpen(true);
      setShouldNavigate(true);
    }
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Editar Produto
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome"
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Preço"
                    type="number"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.categoryIds}>
                    <InputLabel>Categorias</InputLabel>
                    <Select
                      {...field}
                      multiple
                      label="Categorias"
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {categories.map((category) => (
                        <MenuItem value={category._id as string}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setValue("image", file);
                        field.onChange(file);

                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    />
                    {errors.image && (
                      <FormHelperText error>
                        {errors.image.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </Grid>

            {imagePreview && (
              <Grid item xs={12}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                  }}
                />
              </Grid>
            )}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
            >
              <Button variant="outlined" onClick={() => navigate("/products")}>
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
