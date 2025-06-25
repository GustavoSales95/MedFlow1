import React, { useEffect, useState } from "react";
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
import api from "../../../../services/api.js";
import { formatarDataHora } from "../../../functions/InsertMasks";
import { useParams } from "react-router-dom";

interface ConsultaData {
  id_agendamento: number;
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

interface MedicoData {
    id_medico: number;
    crm: string;
}

export const Consulta = () => {
  const { id_consulta } = useParams<{ id_consulta: string }>();
  const [consulta, setConsulta] = useState<ConsultaData >();
  const [medico, setMedico] = useState<MedicoData | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  
  useEffect(() => {
  api.get(`/Medico/Consulta/${id_consulta}`)
    .then((resp) => {
      const consultaData = resp.data.consulta as ConsultaData;
      const medicoData = resp.data.medico as MedicoData;
      setConsulta(consultaData);
      setMedico(medicoData)
      console.log("Dados da consulta recebidos:", consultaData, "\n Dados do medico:", medicoData);

    })
    .catch((err) => {
      console.error('Erro ao buscar dados da consulta:', err);
    });
    }, [id_consulta]);

    if (!consulta) {
    return <div>Carregando dados...</div>;
    }

    const {data, horario} = formatarDataHora(consulta.agendamentos.data_hora)

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
        
      {consulta && (
        
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3}}>

          <Grid>
            { data +" - "+ horario}
          </Grid>
          <Typography variant="h4" align="center" marginBottom={3}>
            Dados da consulta - ID {consulta.id_consulta}
          </Typography>
          
          <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1 }}>CRM do médico:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7, }}>
               {medico?.crm}
            </Typography>
           </Grid>
          <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1}}>Nome do paciente:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7, }}>
               {consulta.agendamentos.nome_paciente}
            </Typography>
           </Grid>
           <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1 }}>Descrição da consulta:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7,  }}>
               {consulta.descricao || "Consulta não finalizada"}
            </Typography>
           </Grid>
            <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1 }}>Observações:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7, }}>
               {consulta.observacoes || "Nenhuma"}
            </Typography>
           </Grid>
           <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1 }}>Receita passada:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7, }}>
               {consulta.receita || "Nenhuma"}
            </Typography>
           </Grid>
           <Grid item sm={6} md={6}>
            <Typography sx={{ fontSize: 18, marginTop: 1 }}>Status:</Typography>
            <Typography sx={{ fontSize: 16, padding: 0.7, }}>
               {consulta.agendamentos.status}
            </Typography>
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
