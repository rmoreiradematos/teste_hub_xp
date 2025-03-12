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
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { MessageModal } from "../../../components/MessageModal";
import { Category, getCategories } from "../../categories/service";
import { createProduct, Product } from "../services/index";

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

export const ProductCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);

  const { setValue } = useForm<ProductFormData>();
  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/products");
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryIds: [],
      image: null,
    },
  });

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));

      if (data.categoryIds) {
        data.categoryIds.forEach((id) => formData.append("categoryIds", id));
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      const productForm = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryIds: data.categoryIds,
        image: data.image,
      } as Omit<Product, "id">;

      console.log("productForm", formData);
      await createProduct(productForm);
      setModalMessage("Produto criado com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setModalMessage("Erro ao criar o pedido.");
      setModalType("error");
      setModalOpen(true);
      setShouldNavigate(true);
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
          Novo Produto
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
                    fullWidth
                    label="Nome do Produto"
                    variant="outlined"
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
                    fullWidth
                    label="Descrição"
                    variant="outlined"
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
                    fullWidth
                    label="Preço"
                    type="number"
                    variant="outlined"
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
                      renderValue={(selected) => {
                        const selectedNames = selected.map((id) => {
                          const category = categories.find(
                            (cat) => cat._id === id
                          );
                          return category ? category.name : "";
                        });
                        return selectedNames.join(", ");
                      }}
                    >
                      {categories.map((category) => {
                        return (
                          <MenuItem value={String(category._id)}>
                            {category.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <FormHelperText>
                      {errors.categoryIds?.message}
                    </FormHelperText>
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
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
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
                  "Criar Produto"
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
