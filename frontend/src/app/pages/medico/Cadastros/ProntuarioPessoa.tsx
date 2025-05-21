import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import { insertMaskCpf, insertMaskTel, insertMaskCep, insertMaskSus } from '../../../functions/InsertMasks';
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
  FormControlLabel,
  Checkbox
} from "@mui/material";

interface Pacientes {
  id_paciente: number;
  nome: string;
  cpf: string;
  cartao_sus: string;
  telefone: string;
  cep: string;
  endereco: string;
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
    setCpf(e.target.value.replace(/\D/g, ''));
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

  function formatarData(dataNasc:string) {
    const data = new Date(dataNasc);

    const dataFormatada = data.toLocaleDateString("pt-BR");

    return dataFormatada
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Consulta de Porntuário
      </Typography>

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

      {prontuario && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>Prontuário Médico</Typography>

          <Typography variant="h5" marginTop={3} marginBottom={1} >Dados Pessoais</Typography>
          <Grid container spacing={2}>
            {Pacientes.map((paciente) => (
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

        <Typography variant="h5" marginTop={3} marginBottom={1} >Histórico</Typography>
        <Grid container spacing={2}>
            <>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18}}>Alergias</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{prontuario.alergias || "Nenhuma"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Doenças Infecciosas</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{prontuario.doencas_infecciosas || "Nenhuma"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Medicamentos de Uso Contínuo</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{prontuario.medicamentos || "Nenhum"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Cirurgias Anteriores</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{prontuario.cirurgias || "Nenhuma"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{fontSize: 18,}}>Tipo Sanguíneo</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{prontuario.tipo_sanguineo || "Não informado"}</Typography>
                </Grid>
              </>
          </Grid>

      </Paper>


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
