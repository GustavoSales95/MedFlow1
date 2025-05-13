import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface Pacientes {
  id_paciente: number;
  nome: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
}

export const ConsultarProntuario = () => {
  const [cpf, setCpf] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Pacientes, setPacientes] = useState<Pacientes[]>([]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  const handleSearch = async () => {
    if (cpf.length !== 11) {
      setSnackbarMessage(
        "CPF inválido! Por favor, digite um CPF válido com 11 dígitos."
      );
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.get<Pacientes[]>(
        `http://localhost:3333`
      );

      if (response.data.length === 0) {
        setSnackbarMessage("Nenhum usuário encontrado para o CPF informado.");
        setOpenSnackbar(true);
      }

      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      setSnackbarMessage("Erro ao buscar usuários. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Consulta de Usuários
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Digite o CPF"
            variant="outlined"
            fullWidth
            value={cpf}
            onChange={handleCpfChange}
            sx={{ marginBottom: "20px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {Pacientes.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Data de Nascimento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Pacientes.map((paciente) => (
                <TableRow key={paciente.id_paciente}>
                  <TableCell>{paciente.nome}</TableCell>
                  <TableCell>{paciente.cpf}</TableCell>
                  <TableCell>{paciente.telefone}</TableCell>
                  <TableCell>{paciente.data_nascimento}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
