import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { useLocation } from "react-router-dom";
import api from "../../../../services/api.js";
import { formatarDataHora } from "../../../functions/InsertMasks";

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
  agendamentos: {
    id_agendamento: number;
    paciente_id: number;
    medico_id: number;
    nome_paciente: string;
    data_hora: string;
    status: string;
  };
}

export const FinalizarConsulta = () => {
  const location = useLocation();
  const state = location.state as { agendamento_id?: string };

  const [idSearch, setIdSearch] = useState<string>("");
  const [agendaMedico, setAgendaMedico] = useState<AgendamentoData | null>(
    null
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (state?.agendamento_id) {
      setIdSearch(state.agendamento_id);
      buscarAgendamento(state.agendamento_id);
    }
  }, [state]);

  const buscarAgendamento = async (idParam?: string) => {
    try {
      const id = idParam || idSearch;
      const response = await api.get("/Medico/FinalizarConsulta", {
        params: { agendamento_id: id },
      });
      if (response.data.message) {
        setAgendaMedico(response.data.message);
      } else {
        setAgendaMedico(null);
        setSnackbarMessage("Nenhum agendamento encontrado.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamento:", error);
      setSnackbarMessage("Erro ao buscar o agendamento.");
      setOpenSnackbar(true);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdSearch(e.target.value);
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (agendaMedico) {
      setAgendaMedico({
        ...agendaMedico,
        [name]: value,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaMedico) return;

    try {
      await api.put("/Medico/FinalizarConsulta", agendaMedico);
      setSnackbarMessage("Consulta finalizada com sucesso.");
      setOpenSnackbar(true);
      buscarAgendamento(idSearch);
    } catch (error) {
      console.error("Erro ao finalizar consulta:", error);
      setSnackbarMessage("Erro ao finalizar consulta.");
      setOpenSnackbar(true);
    }
  };

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
            label="Digite o id do agendamento"
            variant="outlined"
            fullWidth
            value={idSearch}
            onChange={handleIdChange}
            sx={{ marginBottom: "20px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => buscarAgendamento()}
            fullWidth
            sx={{ marginBottom: "20px" }}
            startIcon={<ContentPasteSearchIcon />}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {agendaMedico && (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>
            Dados da consulta
          </Typography>
          <Grid container spacing={2}>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Nome do paciente</Typography>
              <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                {agendaMedico.agendamentos.nome_paciente}
              </Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Id da consulta</Typography>
              <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                {agendaMedico.id_consulta}
              </Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Data da consulta</Typography>
              <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                {formatarDataHora(agendaMedico.agendamentos.data_hora).data}
              </Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Horário da consulta</Typography>
              <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                {formatarDataHora(agendaMedico.agendamentos.data_hora).horario}
              </Typography>
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>
                Descrição da consulta
              </Typography>
              <TextField
                name="descricao"
                variant="standard"
                fullWidth
                multiline
                rows={4}
                size="small"
                sx={{ fontSize: 16, padding: 0.7, border: "1px solid black" }}
                value={agendaMedico.descricao || ""}
                onChange={handleEdit}
              />
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Receita passada</Typography>
              <TextField
                name="receita"
                variant="standard"
                fullWidth
                size="small"
                sx={{ fontSize: 16, padding: 0.7, border: "1px solid black" }}
                value={agendaMedico.receita || ""}
                onChange={handleEdit}
              />
            </Grid>
            <Grid item sm={6} md={6}>
              <Typography sx={{ fontSize: 18 }}>Observações</Typography>
              <TextField
                name="observacoes"
                variant="standard"
                fullWidth
                size="small"
                multiline
                rows={4}
                sx={{ fontSize: 16, padding: 0.7, border: "1px solid black" }}
                value={agendaMedico.observacoes || ""}
                onChange={handleEdit}
              />
            </Grid>
            <Grid
              item
              sm={6}
              md={6}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                fullWidth
                startIcon={<ContentPasteGoIcon />}
              >
                Salvar
              </Button>
            </Grid>
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
