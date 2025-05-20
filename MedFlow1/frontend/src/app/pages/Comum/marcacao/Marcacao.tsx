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
} from "@mui/material";
import { Notificacao } from "../../components/NotificacaoSpan";

interface Consulta {
  nome: string;
  data: string;
  hora: string;
  cpf: string;
  sus: string;
}

export const Marcacao = () => {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [cpf, setCpf] = useState("");
  const [sus, setSus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !data || !hora || !cpf || !sus) {
      setMensagem("Por favor, preencha todos os campos.");
    } else {
      const novaConsulta: Consulta = { nome, data, hora, cpf, sus };
      setConsultas((prevConsultas) => [...prevConsultas, novaConsulta]);
      setMensagem(
        `Consulta agendada com sucesso para ${nome} no dia ${data} às ${hora}.`
      );
      setNome("");
      setData("");
      setHora("");
      setCpf("");
      setSus("");
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
          label="Nome"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Data da Consulta"
          type="date"
          variant="outlined"
          value={data}
          onChange={(e) => setData(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          label="Hora da Consulta"
          type="time"
          variant="outlined"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />

        <TextField
          label="CPF"
          variant="outlined"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{
            maxLength: 14,
          }}
        />

        <TextField
          label="Cartão do SUS"
          variant="outlined"
          value={sus}
          onChange={(e) => setSus(e.target.value)}
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
      </Box>
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
        <Typography variant="h5" gutterBottom>
          Consultas Marcadas
        </Typography>
        <List>
          {consultas.map((consulta, index) => (
            <ListItem key={index}>
              <ListItemText sx={{
                border: "1px",
                borderRadius: 2,
              }}
                primary={`${consulta.nome}`}
                secondary={`Data: ${consulta.data} - Hora: ${consulta.hora} - CPF: ${consulta.cpf} - SUS: ${consulta.sus}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};
