import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import api from "../../../../services/api";

export const ListaReceitas = () => {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const buscarReceitas = async () => {
      try {
        const response = await api.get("/Estoque/Receitas");
        setReceitas(response.data);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        setSnackbarMessage("Erro ao buscar receitas.");
        setOpenSnackbar(true);
      } finally {
        setCarregando(false);
      }
    };

    buscarReceitas();
  }, []);

  return (
    <Box sx={{ padding: "20px", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Lista de Receitas
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        {carregando ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : receitas.length === 0 ? (
          <Typography variant="body1">Nenhuma receita encontrada.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Médico</TableCell>
                <TableCell>Conteúdo</TableCell>
                <TableCell>Orientações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receitas.map((receita) => (
                <TableRow key={receita.id_receita}>
                  <TableCell>
                    {new Date(receita.data_emissao).toLocaleString()}
                  </TableCell>
                  <TableCell>{receita.paciente?.nome || "N/A"}</TableCell>
                  <TableCell>{receita.medico?.nome || "N/A"}</TableCell>
                  <TableCell>
                    <Tooltip title={receita.medicamentos || ""} arrow>
                      <span>
                        {receita.medicamentos?.length > 30
                          ? receita.medicamentos.substring(0, 30) + "..."
                          : receita.medicamentos}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={receita.orientacoes || ""} arrow>
                      <span>
                        {receita.orientacoes?.length > 30
                          ? receita.orientacoes.substring(0, 30) + "..."
                          : receita.orientacoes}
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
