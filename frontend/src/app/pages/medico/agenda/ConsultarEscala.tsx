import React, { useContext, useEffect, useState } from "react";
import { Typography, Grid, Box, Snackbar, Alert, Paper } from "@mui/material";
import api from "../../../../services/api.js";
import { AppContext } from "../../../shared/contexts/AppContext";

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
    escala?: {
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
  const { usuario } = useContext(AppContext);
  const [user, setUser] = useState<UserData | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (usuario?.crm) {
      buscarEscala(usuario.crm);
    } else {
      setSnackbarMessage("CRM não encontrado para o usuário logado.");
      setOpenSnackbar(true);
    }
  }, [usuario]);

  const buscarEscala = async (crm: string) => {
    try {
      const response = await api.get("/admin/EditarEscala", {
        params: { crm },
      });
      const dados = response.data.message;

      if (!dados) {
        setSnackbarMessage("Escala não encontrada.");
        setOpenSnackbar(true);
        return;
      }

      setUser(Array.isArray(dados) ? dados[0] : dados);
    } catch (error) {
      console.error("Erro ao consultar escala:", error);
      setSnackbarMessage("Erro ao buscar escala.");
      setOpenSnackbar(true);
    }
  };

  const corEscala = (escala: string) =>
    escala === "Escalado" ? "green" : "red";

  const escala = user?.medico?.escala;

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Consulta de Escala
      </Typography>

      {user && escala ? (
        <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>
            Escala semanal
          </Typography>

          <Grid container spacing={2}>
            {[
              ["Segunda-Feira", escala?.segunda, escala?.segunda_horario],
              ["Terça-Feira", escala?.terca, escala?.terca_horario],
              ["Quarta-Feira", escala?.quarta, escala?.quarta_horario],
              ["Quinta-Feira", escala?.quinta, escala?.quinta_horario],
              ["Sexta-Feira", escala?.sexta, escala?.sexta_horario],
              ["Sábado", escala?.sabado, escala?.sabado_horario],
              ["Domingo", escala?.domingo, escala?.domingo_horario],
            ].map(([dia, status, horario]) => (
              <Grid item sm={6} md={6} key={dia}>
                <Typography sx={{ fontSize: 18 }}>{dia}</Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    padding: 0.7,
                    border: "1px solid black",
                    color: corEscala(status || ""),
                  }}
                >
                  {status ?? "Não definido"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    padding: 0.7,
                    border: "1px solid black",
                  }}
                >
                  {horario ?? "Não definido"}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        <Typography align="center" color="error" mt={3}>
          Escala não disponível para este usuário.
        </Typography>
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
