import React, { useState } from "react";
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
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import api from "../../../../services/api";
import { insertMaskCpf } from "../../../functions/InsertMasks";

export const CriarReceita = () => {
  const [cpf, setCpf] = useState("");
  const [pacienteNome, setPacienteNome] = useState("");
  const [crm, setCrm] = useState("");
  const [conteudoReceita, setConteudoReceita] = useState("");
  const [orientacoes, setOrientacoes] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChangeCpf = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value.replace(/\D/g, ""));
  };

  const handleBuscarPaciente = async () => {
    if (cpf.length !== 11) {
      setSnackbarMessage("CPF inválido. Digite 11 dígitos.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await api.get("/Medico/BuscarPacientePorCpf", {
        params: { cpf },
      });

      if (!response.data || !response.data.nome) {
        throw new Error();
      }

      setPacienteNome(response.data.nome);
    } catch {
      setPacienteNome("");
      setSnackbarMessage("Paciente não encontrado.");
      setOpenSnackbar(true);
    }
  };

  const handleCriarReceita = async () => {
    if (!conteudoReceita || !pacienteNome || !crm) {
      setSnackbarMessage("Preencha todos os campos.");
      setOpenSnackbar(true);
      return;
    }

    try {
      await api.post("/Medico/CriarReceita", {
        cpf,
        crm,
        conteudo: conteudoReceita,
        orientacoes,
      });

      setSnackbarMessage("Receita criada com sucesso!");
      setOpenSnackbar(true);
      setConteudoReceita("");
      setOrientacoes("");
      setCrm("");
      setPacienteNome("");
      setCpf("");
    } catch (error: any) {
      console.error("Erro ao criar receita:", error);
      const msg = error?.response?.data?.error || "Erro ao criar receita.";
      setSnackbarMessage(msg);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Criar Receita Médica
      </Typography>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="CPF do Paciente"
              fullWidth
              variant="outlined"
              value={insertMaskCpf(cpf)}
              onChange={handleChangeCpf}
              inputProps={{ maxLength: 14 }}
            />
          </Grid>

          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBuscarPaciente}
              disabled={cpf.length !== 11}
              sx={{ height: "100%" }}
            >
              Buscar Paciente
            </Button>
          </Grid>

          {pacienteNome && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6">Paciente: {pacienteNome}</Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="CRM do Médico"
                  fullWidth
                  variant="outlined"
                  value={crm}
                  onChange={(e) => setCrm(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Conteúdo da Receita"
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  value={conteudoReceita}
                  onChange={(e) => setConteudoReceita(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Orientações"
                  multiline
                  rows={3}
                  fullWidth
                  variant="outlined"
                  value={orientacoes}
                  onChange={(e) => setOrientacoes(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleCriarReceita}
                  startIcon={<SaveAltIcon />}
                >
                  Salvar Receita
                </Button>
              </Grid>
            </>
          )}
        </Grid>
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
