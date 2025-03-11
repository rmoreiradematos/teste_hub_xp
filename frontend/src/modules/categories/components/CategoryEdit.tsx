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
import { useNavigate, useParams } from "react-router-dom";
import { MessageModal } from "../../../components/MessageModal";
import { Category, getCategory, updateCategory } from "../service";

export const CategoryEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [_, setShouldNavigate] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        const category = await getCategory(id);
        if (category) {
          setCategory(category);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleCloseModal = () => {
    setModalOpen(false);
    navigate("/categories");
  };

  const handleSave = async () => {
    if (!category) return;

    setIsSubmitting(true);

    try {
      await updateCategory(category);
      setModalMessage("Categoria atualizada com sucesso!");
      setModalType("success");
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      setModalMessage("Erro ao editar categoria.");
      setModalType("error");
      setModalOpen(true);
      setShouldNavigate(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) {
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

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nome da Categoria"
              variant="outlined"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button variant="outlined" onClick={() => navigate("/categories")}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
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
