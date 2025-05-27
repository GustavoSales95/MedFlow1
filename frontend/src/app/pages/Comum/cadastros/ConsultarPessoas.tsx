import React, { useState } from "react";
import { insertMaskCpf, insertMaskSus, insertMaskTel, insertMaskCep } from '../../../functions/InsertMasks';
import api from '../../../../services/api.js';
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
  id_paciente: number;
  nome: string;
  cpf: string;
  cartao_sus: string;
  telefone: string;
  cep: string;
  endereco: string;
  data_nascimento: string;
}

export const ConsultarPessoas = () => {
  const [cpf, setCpf] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

async function getUsers(cpf: string) {
    try {
      const response = await api.get('/Comum/ConsultarPessoas', {
        params: { cpf }, // Envia CPF como query parameter
      });
      if (response.data.message) {
        setUsers([response.data.message]);
        console.log("Paciente armazenados no estado:", users);

      } else {
        setUsers([]);
        setSnackbarMessage("Nenhum paciente encontrado para este CPF.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);
      setSnackbarMessage("Erro ao consultar paciente. Tente novamente.");
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

    function formatarData(dataNasc:string) {
    const data = new Date(dataNasc);

    const dataFormatada = data.toLocaleDateString("pt-BR");

    return dataFormatada
  }  

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Consulta de Pacientes
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
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>Dados do paciente</Typography>

          <Grid container spacing={2}>
            {users.map((paciente) => (
            <>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18}}>Nome</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{paciente.nome}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>CPF</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCpf(paciente.cpf)}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Cartão do SUS</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskSus(paciente.cartao_sus) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Data de Nascimento</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{formatarData(paciente.data_nascimento)}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Telefone</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskTel(paciente.telefone) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>CEP</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCep(paciente.cep) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Endereço</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{paciente.endereco || "Não informado"}</Typography>
                </Grid>
              </>
            ))}
          </Grid>
        </Paper>
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
