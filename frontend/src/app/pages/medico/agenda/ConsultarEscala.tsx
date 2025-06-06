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
  InputLabel
} from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import api from '../../../../services/api.js';
import { insertMaskHora } from '../../../functions/InsertMasks';

interface UserData {
  id_usuario: number;
  nome: string;
  cpf: string;
  perfil: {
    tipo: string;
  };
  medico: {
    id_medico: number;
    crm: string;
    escala: {
      medico_id: number;
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
    };
  };
}

export const ConsultarEscala = () => {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  async function getUsers(params: object) {
    try {
      const response = await api.get('/admin/EditarEscala', { params });
      if (response.data.message) {
        let returnedUsers: UserData[] = [];
        if (response.data.message.length === undefined) {
          returnedUsers = [response.data.message];
        } else if (response.data.message.length > 0) {
          returnedUsers = response.data.message;
        } else {
          setUsers([]);
          setSnackbarMessage("Nenhum usuário encontrado para os parâmetros informados.");
          setOpenSnackbar(true);
          return;
        }
        setUsers(returnedUsers);
      } else {
        setUsers([]);
        setSnackbarMessage("Nenhum usuário encontrado para os parâmetros informados.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setSnackbarMessage("Erro ao consultar usuários. Tente novamente.");
      setOpenSnackbar(true);
    }
  }

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    if (searchValue.trim() === "") {
      setSnackbarMessage("CRM inválido! Por favor, digite um CRM válido.");
      setOpenSnackbar(true);
      return;
    }
    const params = { crm: searchValue };
    await getUsers(params);
  };

  function corEscala(escala: string) {
    return escala === "Escalado" ? "green" : "red";
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Consulta de Escala
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Digite seu CRM"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 6 }}
            value={searchValue}
            onChange={handleSearchValueChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ marginBottom: "20px" }}
            startIcon={<PersonSearchIcon />}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {users.length > 0 && (   
        <>
          {users.map((user) => (
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
              
              <Typography variant="h4" align="center" marginBottom={1.5}>{user.nome}</Typography>
              <Typography variant="h5" marginTop={3} marginBottom={1}>Escala Semanal</Typography>
              <Grid container spacing={2}>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Segunda-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.segunda) }}>{user.medico.escala?.segunda ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.segunda_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Terça-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.terca) }}>{user.medico.escala?.terca ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.terca_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Quarta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.quarta) }}>{user.medico.escala?.quarta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.quarta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Quinta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.quinta ) }}>{user.medico.escala?.quinta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.quinta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Sexta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.sexta) }}>{user.medico.escala?.sexta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.sexta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Sábado</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.sabado) }}>{user.medico.escala?.sabado ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.sabado_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Domingo</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.domingo) }}>{user.medico.escala?.domingo ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.domingo_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} sx={{ alignContent: 'center' }}>
                  </Grid>
              </Grid>
              </Paper>
          ))}
        </>
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