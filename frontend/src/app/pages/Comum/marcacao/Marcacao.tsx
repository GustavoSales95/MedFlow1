import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert
} from "@mui/material";
import { Notificacao } from "../../components/NotificacaoSpan";
import { insertMaskCpf, formatarDataHora } from '../../../functions/InsertMasks';
import api from '../../../../services/api';

export const Marcacao = () => {
  const [formData, setFormData] = useState({
    paciente_id: '',
    medico_id: '',
    nome_paciente: '',
    data_hora: '',
    cpf: '',
    crm: ''
  });

  const [mensagem, setMensagem] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const rawValue = value.replace(/\D/g, '').slice(0, name === "cpf" ? 11 : name === "telefone" ? 11 : undefined);

    const maskedValue = name === "cpf" ? insertMaskCpf(rawValue) :
                        value;

    setFormData({ ...formData, [name]: maskedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.cpf.length != 14) {
        setSnackbarMessage("Insira um CPF válido.");
        setOpenSnackbar(true);
        return;
      }

    const checkResponse = await api.get('/Comum', {
      params: { 
      cpf: formData.cpf.replace(/\D/g, ''),
      crm: formData.crm  
      }
    });

  const { paciente, medico } = checkResponse.data;

  if (!paciente) {
    setSnackbarMessage("Nenhum paciente encontrado para este CPF.");
    setOpenSnackbar(true);
    return;
  }

  if (!medico) {
    setSnackbarMessage("Nenhum médico encontrado para este CRM.");
    setOpenSnackbar(true);
    return;
  }

  const marcacaoDate = new Date(formData.data_hora);
  
  // Define a data de hoje sem considerar as horas
  const hoje = new Date();

  // Checa se a data de validade é menor ou igual à data atual
  if (marcacaoDate <= hoje) {
    setSnackbarMessage("Por favor insira uma data valida.");
    setOpenSnackbar(true);
    return; // Interrompe a execução se a validação falhar
  }


  if (
  medico.Agendamentos &&
  medico.Agendamentos.find((agenda: { data_hora: string | Date }) => {
    const agendaFormatada = formatarDataHora(agenda.data_hora);
    const formFormatada = formatarDataHora(formData.data_hora);
    return agendaFormatada.data === formFormatada.data && agendaFormatada.horario === formFormatada.horario;
  })
  ) {
    setSnackbarMessage("O médico selecionado já tem um agendamento nesta data e horário.");
    setOpenSnackbar(true);
    return;
  }

    try {
      const response = await api.post('/Comum', {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, '')
      });

      console.log('Agendamento cadastrado com sucesso:', response.data);
      setMensagem(
        `Consulta agendada com sucesso para ${formData.nome_paciente} no dia e horário ${formData.data_hora}.`
      );
    } catch (error) {
      console.error('Erro ao cadastrar Agendamento:', error);
      setSnackbarMessage("Erro ao cadastrar Agendamento.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      {mensagem && (
        <Notificacao mensagem={mensagem} onClose={() => setMensagem("")} />
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          marginBottom: 4,
          marginTop: 10, // adiciona espaço abaixo da notificação
        }}
      >
        <Typography variant="h4" gutterBottom>
          Marcação de Consulta
        </Typography>

        <TextField
          label="nome do paciente"
          name="nome_paciente"
          variant="outlined"
          value={formData.nome_paciente}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Data da Consulta"
          name="data_hora"
          type="datetime-local"
          variant="outlined"
          value={formData.data_hora}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          label="CPF do paciente"
          name="cpf"
          variant="outlined"
          value={insertMaskCpf(formData.cpf)}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          inputProps={{
            maxLength: 14,
          }}
        />

        <TextField
          label="CRM do médico"
          name="crm"
          variant="outlined"
          value={formData.crm}
          onChange={handleChange}
          inputProps={{ maxLength: 6 }}
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Agendar Consulta
        </Button>
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
    </Container>
  );
};
