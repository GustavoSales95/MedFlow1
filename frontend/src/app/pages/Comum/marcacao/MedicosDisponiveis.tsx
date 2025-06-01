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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import api from '../../../../services/api.js';
import { insertMaskTel, formatarDataHora } from '../../../functions/InsertMasks';

interface AgendamentoData {
  id_agendamento: number;
  nome_paciente: string;
  data_hora: string;
  status: string;
}



interface MedicoData {
  // Dados da escala
  id_escala: number;
  id_medico: number;
  segunda: string;
  segunda_horario: string;
  terca: string;
  terca_horario: string;
  quarta: string;
  quarta_horario: string;
  quinta: string;
  quinta_horario: string;
  sexta: string;
  sexta_horario: string;
  sabado: string;
  sabado_horario: string;
  domingo: string;
  domingo_horario: string;
  
  // Dados do médico 
  usuario_id: number;
  crm: string;
  especialidade: string;
  telefone: string;
  
  // Dados do usuário 
  id_usuario: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  data_nascimento: string;
  data_Cadastro: string;
  perfil_id: number;

  // Dados dos agendamentos
  agendamentos: AgendamentoData[];

}

type DiaSemana = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";
type HorarioKey = `${DiaSemana}_horario`;

export const MedicosDisponiveis = () => {
  const [searchDay, setSearchDay] = useState<DiaSemana>("segunda");
  const [medicos, setMedicos] = useState<MedicoData[]>([]);
  const [crmSearch, setCrmSearch] = useState<string>("");
  const [agendaMedico, setAgendaMedico] = useState<AgendamentoData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSearch = async (dia: string) => {
  try {
    const response = await api.get('/Comum/MedicosDisponiveis', { params: { dia } });
    
    const transformedData = response.data.message.map((item: any) => ({
      ...item,
      id: item.Medico.id_medico,
      nome: item.Medico.Usuarios.nome,
      especialidade: item.Medico.especialidade,
      crm: item.Medico.crm,
      email: item.Medico.Usuarios.email,
      telefone: item.Medico.telefone,
      agendamentos: item.Medico.Agendamentos
        ? item.Medico.Agendamentos.map((agenda: any) => ({
            id_agendamento: agenda.id_agendamento,
            nome_paciente: agenda.nome_paciente,
            data_hora: agenda.data_hora,
            status: agenda.status,
          }))
        : []
    }));


    setMedicos(transformedData);

  } catch (error) {
    setSnackbarMessage("Erro ao buscar os médicos");
    setOpenSnackbar(true);
  }
};

const handleSearchAgenda = () => {
  if (!crmSearch) {
    setSnackbarMessage("Informe o CRM para buscar a agenda do médico");
    setOpenSnackbar(true);
    return;
  }

  const medicoEncontrado = medicos.find((medico) => medico.crm === crmSearch);

  if (medicoEncontrado?.agendamentos.length === 0 ) {
      setSnackbarMessage("Médico selecionado não possui nenhum agendamento");
      setOpenSnackbar(true);
    }

  if (medicoEncontrado) {
    setAgendaMedico(medicoEncontrado.agendamentos);

  } else {
    setAgendaMedico([]);
    setSnackbarMessage("Médico não encontrado com o CRM informado");
    setOpenSnackbar(true);
  }
};

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Médicos Disponíveis
      </Typography>

      <Grid item xs={12} sm={8}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Dia</InputLabel>
          <Select
            value={searchDay}
            label="Dia"
            onChange={(e) => setSearchDay(e.target.value as DiaSemana)}
          >
            <MenuItem value="segunda">Segunda</MenuItem>
            <MenuItem value="terca">Terça</MenuItem>
            <MenuItem value="quarta">Quarta</MenuItem>
            <MenuItem value="quinta">Quinta</MenuItem>
            <MenuItem value="sexta">Sexta</MenuItem>
            <MenuItem value="sabado">Sábado</MenuItem>
            <MenuItem value="domingo">Domingo</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSearch(searchDay)}  // Encapsula a chamada da função
          fullWidth
          sx={{ marginBottom: "20px" }}
          startIcon={<PersonSearchIcon />}
        >
          Pesquisar
        </Button>
      </Grid>

      {medicos.length > 0 && (
        <>
            <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
                <Table sx={{ minWidth: 650 }} aria-label="tabela de medicos">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Especialidade</TableCell>
                            <TableCell>CRM</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Horário</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {medicos.map((medico) => (
                            <TableRow key={medico.id_medico}>
                                <TableCell>{medico.nome}</TableCell>
                                <TableCell>{medico.especialidade}</TableCell>
                                <TableCell>{medico.crm}</TableCell>
                                <TableCell>{medico.email}</TableCell>
                                <TableCell>{insertMaskTel(medico.telefone)}</TableCell>
                                <TableCell>{medico[`${searchDay}_horario` as HorarioKey]}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                </Table>
            </TableContainer>
        </>
      )}
      <Box sx={{ marginTop: "20px" }}>
        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
          Buscar Agendamentos do médico
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <TextField
              label="CRM"
              variant="outlined"
              fullWidth
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearchAgenda}
            >
              Buscar Agendamentos
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Exibição da agenda do médico, se disponível */}
      {agendaMedico.length > 0 && (
        <Box sx={{ marginTop: "20px" }}>
          <Typography variant="h6" sx={{ marginBottom: "10px" }}>
            Agenda do Médico
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de agenda">
              <TableHead>
                <TableRow>
                  <TableCell>ID Agendamento</TableCell>
                  <TableCell>Nome do Paciente</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendaMedico
                  .filter((agenda) => agenda.status === "Agendado")
                  .map((agenda) => {
                    const { data, horario } = formatarDataHora(agenda.data_hora);
                    return (
                      <TableRow key={agenda.id_agendamento}>
                        <TableCell>{agenda.id_agendamento}</TableCell>
                        <TableCell>{agenda.nome_paciente}</TableCell>
                        <TableCell>{data}</TableCell>
                        <TableCell>{horario}</TableCell>
                        <TableCell>{agenda.status}</TableCell>
                      </TableRow>
                )})}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
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