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

interface UserData {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  data_nascimento: string;
}

export const ConsultarPessoas = () => {
  const [cpf, setCpf] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Função para atualizar o valor do CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value);
  };

  // Função para simular a pesquisa de usuários
  const handleSearch = async () => {
    if (cpf.length !== 11) {
      setSnackbarMessage(
        "CPF inválido! Por favor, digite um CPF válido com 11 dígitos."
      );
      setOpenSnackbar(true);
      return;
    }

    // Simulando uma busca de usuário com base no CPF
    const fetchedUsers: UserData[] = [
      {
        id: 1,
        nome: "Gustavo Sales",
        cpf: "01234567891",
        email: "gustavo.silva@example.com",
        telefone: "123456789",
        data_nascimento: "1990-01-01",
      },
      {
        id: 2,
        nome: "Maria Souza",
        cpf: "98765432100",
        email: "maria.souza@example.com",
        telefone: "987654321",
        data_nascimento: "1985-05-12",
      },
    ];

    // Filtrando por CPF (caso precise de busca real por CPF)
    const filteredUsers = fetchedUsers.filter((user) => user.cpf.includes(cpf));

    if (filteredUsers.length === 0) {
      setSnackbarMessage("Nenhum usuário encontrado para o CPF informado.");
      setOpenSnackbar(true);
    }

    setUsers(filteredUsers);
  };

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

      {/* Tabela de Resultados da Busca */}
      {users.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Data de Nascimento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nome}</TableCell>
                  <TableCell>{user.cpf}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telefone}</TableCell>
                  <TableCell>{user.data_nascimento}</TableCell>
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
