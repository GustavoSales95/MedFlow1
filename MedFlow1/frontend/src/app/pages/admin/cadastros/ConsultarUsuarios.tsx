import React, { useState } from "react";
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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import api from '../../../../services/api.js';
import { insertMaskCpf } from '../../../functions/InsertMasks';


interface UserData {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  perfil: {
    tipo: string
  };
}

export const ConsultarUsuarios = () => {
  const [cpf, setCpf] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  async function getUsers(cpf: string) {
    try {
      const response = await api.get('/admin/ConsultarUsuarios', {
        params: { cpf }, // Envia CPF como query parameter
      });
      if (response.data.message) {
        setUsers([response.data.message]);
        console.log("Usuários armazenados no estado:", users);

      } else {
        setUsers([]);
        setSnackbarMessage("Nenhum usuário encontrado para este CPF.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setSnackbarMessage("Erro ao consultar usuários. Tente novamente.");
      setOpenSnackbar(true);
    }
  }

  // Função para atualizar o valor do CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value.replace(/\D/g, ''));
  };

  // Função para simular a pesquisa de usuários
  const handleSearch = async () => {
    if (cpf.length != 11) {
      setSnackbarMessage(
        "CPF inválido! Por favor, digite um CPF válido com 11 dígitos."
      );
      setOpenSnackbar(true);
      return;
    } 
    await getUsers(cpf);
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Consulta de Usuários
      </Typography>

      {/* Campo de pesquisa por CPF */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Digite o CPF"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 14 }}
            value={insertMaskCpf(cpf)}
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

      {/* Tabela de Resultados da Busca */}
      {users.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tipo de suário</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id_usuario}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{insertMaskCpf(user.cpf)}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.perfil.tipo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar para mensagens de feedback */}
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
