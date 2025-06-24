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
  Button,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import CheckIcon from "@mui/icons-material/Check";
import api from "../../../../services/api";

import { AxiosError } from "axios";

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError === true;
}

export const ListaReceitas = () => {
  const [receitas, setReceitas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const buscarReceitas = async () => {
    try {
      const response = await api.get("/Estoque/Receitas");
      setReceitas(response.data.filter((r: any) => r.status !== "Fechada"));
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      setSnackbarMessage("Erro ao buscar receitas.");
      setOpenSnackbar(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarReceitas();
  }, []);

  const handleFinalizarReceita = async (id_receita: number) => {
    try {
      await api.post("Estoque/FecharReceita", { id_receita });

      setReceitas((prev) => prev.filter((r) => r.id_receita !== id_receita));
      setSnackbarMessage("Receita finalizada com sucesso!");
      setOpenSnackbar(true);
    } catch (error: unknown) {
      console.error("Erro ao finalizar receita:", error);

      if (isAxiosError(error)) {
        console.log("Erro detalhado:", error.response?.data);
      }

      setSnackbarMessage("Erro ao finalizar receita.");
      setOpenSnackbar(true);
    }
  };

  const handleImprimir = (receita: any) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>Receita Médica</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h2 {
              text-align: center;
            }
            p {
              margin: 10px 0;
            }
            hr {
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h2>Receita Médica</h2>
          <p><strong>Paciente:</strong> ${receita.paciente?.nome || "N/A"}</p>
          <p><strong>CRM do Médico:</strong> ${receita.medico?.crm || "N/A"}</p>
          <p><strong>Data:</strong> ${new Date(
            receita.data_emissao
          ).toLocaleDateString()}</p>
          <hr />
          <p><strong>Medicamentos:</strong></p>
          <p>${receita.medicamentos || ""}</p>
          <p><strong>Orientações:</strong></p>
          <p>${receita.orientacoes || ""}</p>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Lista de Receitas em Aberto
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        {carregando ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : receitas.length === 0 ? (
          <Typography variant="body1">
            Nenhuma receita em aberto encontrada.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>CRM Médico</TableCell>
                <TableCell>Conteúdo</TableCell>
                <TableCell>Orientações</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receitas.map((receita) => (
                <TableRow key={receita.id_receita}>
                  <TableCell>
                    {new Date(receita.data_emissao).toLocaleString()}
                  </TableCell>
                  <TableCell>{receita.paciente?.nome || "N/A"}</TableCell>
                  <TableCell>{receita.medico?.crm || "N/A"}</TableCell>
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
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        startIcon={<PrintIcon />}
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => handleImprimir(receita)}
                        sx={{ flex: 1 }}
                      >
                        Imprimir
                      </Button>
                      <Button
                        startIcon={<CheckIcon />}
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{ flex: 1 }}
                        onClick={() =>
                          handleFinalizarReceita(receita.id_receita)
                        }
                      >
                        Finalizar
                      </Button>
                    </Box>
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
