import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
}

export const MessageModal = ({
  open,
  onClose,
  message,
  type,
}: MessageModalProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{type === "success" ? "Sucesso" : "Erro"}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color={type === "success" ? "primary" : "error"}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
