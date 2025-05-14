import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
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

interface Prontuario {
  paciente_id: number;
  alergias: string;
  tipo_sanguineo: string;
  medicamentos: string;
  cirurgias: string;
  doencas_infecciosas: string;
}

export const ConsultarProntuario = () => {
  const [cpf, setCpf] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Pacientes, setPacientes] = useState<Pacientes[]>([]);
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);



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
      const response = await api.get('Medico/ConsultarProntuarios', {
        params: { cpf },
      });

      console.log("Resposta da API:", response.data);

      if (!response.data.message || !response.data.paciente) {
        setSnackbarMessage("Nenhum prontuário encontrado para o CPF informado.");
        setOpenSnackbar(true);
        return;
      }

      setPacientes([response.data.paciente]);
      setProntuario(response.data.message);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      setSnackbarMessage("Erro ao buscar prontuário. Tente novamente.");
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

      {prontuario && (
  <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
    <Table sx={{ minWidth: 650 }} aria-label="tabela de prontuário">
      <TableHead>
        <TableRow>
          <TableCell>Paciente ID</TableCell>
          <TableCell>Alergias</TableCell>
          <TableCell>Tipo Sanguíneo</TableCell>
          <TableCell>Medicamentos</TableCell>
          <TableCell>Cirurgias</TableCell>
          <TableCell>Doenças Infecciosas</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>{prontuario.paciente_id}</TableCell>
          <TableCell>{prontuario.alergias || "Nenhuma"}</TableCell>
          <TableCell>{prontuario.tipo_sanguineo || "Não informado"}</TableCell>
          <TableCell>{prontuario.medicamentos || "Nenhum"}</TableCell>
          <TableCell>{prontuario.cirurgias || "Nenhuma"}</TableCell>
          <TableCell>{prontuario.doencas_infecciosas || "Nenhuma"}</TableCell>
        </TableRow>
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
