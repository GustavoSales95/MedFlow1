import React, { useState, useEffect, useContext } from "react";
import {
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
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../../../services/api.js";
import { formatarDataHora } from "../../../functions/InsertMasks";
import { AppContext } from "../../../shared/contexts/AppContext";
import { useNavigate } from "react-router-dom";

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
  const { usuario } = useContext(AppContext);
  const crmUsuario = usuario?.crm || "";
  const navigate = useNavigate();

  const [agendaMedico, setAgendaMedico] = useState<AgendamentoData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [abaSelecionada, setAbaSelecionada] = useState(0);

  useEffect(() => {
    if (crmUsuario) {
      buscarAgendamentos(crmUsuario);
    }
  }, [crmUsuario]);

  const buscarAgendamentos = async (crm: string) => {
    try {
      const response = await api.get("/Medico/Agendamentos", {
        params: { crm },
      });

      if (response.data.message && response.data.message.length > 0) {
        setAgendaMedico(response.data.message);
      } else {
        setAgendaMedico([]);
        setSnackbarMessage("Nenhum agendamento encontrado.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("Erro ao buscar os agendamentos.");
      setOpenSnackbar(true);
    }
  };

  const agendamentosAgendados = agendaMedico.filter(
    (a) => a.status.toLowerCase() === "agendado"
  );

  const agendamentosConcluidos = agendaMedico.filter(
    (a) => a.status.toLowerCase() !== "agendado"
  );

  const handleChangeAba = (event: React.SyntheticEvent, newValue: number) => {
    setAbaSelecionada(newValue);
  };

  const renderTabela = (dados: AgendamentoData[]) => (
    <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>N° Agendamento</TableCell>
            <TableCell>Paciente</TableCell>
            <TableCell>Data</TableCell>
            <TableCell>Hora</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dados.map((agendamento) => {
            const { data, horario } = formatarDataHora(agendamento.data_hora);
            return (
              <TableRow key={agendamento.id_agendamento}>
                <TableCell>{agendamento.id_agendamento}</TableCell>
                <TableCell>{agendamento.nome_paciente}</TableCell>
                <TableCell>{data}</TableCell>
                <TableCell>{horario}</TableCell>
                <TableCell>{agendamento.status}</TableCell>
                <TableCell>
                  {agendamento.status.toLowerCase() === "agendado" && (
                    <Button
                      startIcon={<CheckIcon />}
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        navigate("/Medico/FinalizarConsulta", {
                          state: {
                            agendamento_id:
                              agendamento.id_agendamento.toString(),
                          },
                        })
                      }
                    >
                      Finalizar
                    </Button>
                  )}
                  {agendamento.status.toLowerCase() === "concluido" && (
                    <Button
                      startIcon={<SearchIcon />}
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: "orange" }}
                    >
                      Consultar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ padding: "20px", maxWidth: 1000, margin: "0 auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Meus Agendamentos
      </Typography>

      <Tabs value={abaSelecionada} onChange={handleChangeAba} centered>
        <Tab label="Agendados" />
        <Tab label="Concluídos" />
      </Tabs>

      {abaSelecionada === 0 && renderTabela(agendamentosAgendados)}
      {abaSelecionada === 1 && renderTabela(agendamentosConcluidos)}

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
