import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { MessageModal } from "../../../components/MessageModal";
import { Category, createCategory } from "../service";

interface CategoryFormData {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
});

export const CategoryCreate = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/categories");
  };

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      const newCategory = {
        name: data.name,
      } as Omit<Category, "id">;

      await createCategory(newCategory);
      setModalMessage("Categoria criada com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setModalMessage("Erro ao criar categoria.");
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
          Nova Categoria
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
                    label="Nome da Categoria"
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/categories")}
              >
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
                  "Criar Categoria"
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
