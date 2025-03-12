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
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { MessageModal } from "../../../components/MessageModal";
import { Category, getCategory, updateCategory } from "../service";

interface CategoryFormData {
  name: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
});

export const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (id) {
        try {
          const category = await getCategory(id);
          reset({ name: category.name });
        } catch (error) {
          console.error("Erro ao carregar categoria:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCategory();
  }, [id, reset]);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/categories");
  };

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    try {
      if (!id) return;

      await updateCategory(id, {
        name: data.name,
      } as Category);

      setModalMessage("Categoria atualizada com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      setModalMessage("Erro ao editar categoria.");
      setModalType("error");
      setModalOpen(true);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Editar Categoria
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
                  "Salvar Alterações"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <MessageModal
        open={modalOpen}
        onClose={handleCloseModal}
        message={modalMessage}
        type={modalType}
      />
    </Container>
  );
};
