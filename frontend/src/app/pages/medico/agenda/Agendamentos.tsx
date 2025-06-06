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
import { formatarDataHora } from '../../../functions/InsertMasks';

interface AgendamentoData {
  id_agendamento: number;
  nome_paciente: string;
  data_hora: string;
  status: string;
  id_consulta: number;
  agendamento_id: string;
  descricao: string;
  receita: string;
  observacoes: string;
  data_consulta: string;
}

export const Agendamentos = () => {
  const [crmSearch, setCrmSearch] = useState<string>("");
  const [agendaMedico, setAgendaMedico] = useState<AgendamentoData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSearch = async () => {
    try {
      const response = await api.get('/Medico/Agendamentos', {
        params: { crm: crmSearch }
      });
      
      if (response.data.message && response.data.message.length > 0) {
        setAgendaMedico(response.data.message);
        console.log("Agendamentos armazenados no estado:", response.data.message);
      } else {
        setAgendaMedico([]);
        setSnackbarMessage("Nenhum agendamento encontrado.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Erro ao buscar os agendamentos");
      setOpenSnackbar(true);
    }
  }

  const handleCrm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCrmSearch(e.target.value);
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Consulta de Agendamentos
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Digite seu CRM"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 6 }}
            value={crmSearch}
            onChange={handleCrm}
            sx={{ marginBottom: "20px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch} // Chama a função sem passar parâmetro
            fullWidth
            sx={{ marginBottom: "20px" }}
            startIcon={<PersonSearchIcon />}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {/* Tabela de Resultados da Busca */}
      {agendaMedico.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="Agendamentos">
            <TableHead>
              <TableRow>
                <TableCell>Id do agendamento</TableCell>
                <TableCell>Nome do Paciente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agendaMedico.map((agendamento) => {
                const { data, horario } = formatarDataHora(agendamento.data_hora);
                return (
                  <TableRow key={agendamento.id_agendamento}>
                    <TableCell>{agendamento.id_agendamento}</TableCell>
                    <TableCell>{agendamento.nome_paciente}</TableCell>
                    <TableCell>{data}</TableCell>
                    <TableCell>{horario}</TableCell>
                    <TableCell>{agendamento.status}</TableCell>
                  </TableRow>
                );
              })}
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