import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, List, ListItem, ListItemText } from '@mui/material';

interface Consulta {
  nome: string;
  data: string;
  hora: string;
  cpf: string;
  sus: string;
}

export const Marcacao = () => {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [cpf, setCpf] = useState('');
  const [sus, setSus] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [consultas, setConsultas] = useState<Consulta[]>([]);

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação dos campos
    if (!nome || !data || !hora || !cpf || !sus) {
      setMensagem('Por favor, preencha todos os campos.');
    } else {
      const novaConsulta: Consulta = { nome, data, hora, cpf, sus };
      setConsultas((prevConsultas) => [...prevConsultas, novaConsulta]);
      setMensagem(`Consulta agendada com sucesso para ${nome} no dia ${data} às ${hora}.`);
      // Limpar campos após a submissão
      setNome('');
      setData('');
      setHora('');
      setCpf('');
      setSus('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          marginBottom: 4,
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
            maxLength: 14, // Para limitar ao formato XXX.XXX.XXX-XX
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

        {mensagem && (
          <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
            {mensagem}
          </Typography>
        )}
      </Box>

      {/* Lista de Consultas Marcadas */}
      <Typography variant="h5" gutterBottom>
        Consultas Marcadas
      </Typography>
      <List>
        {consultas.map((consulta, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${consulta.nome}`}
              secondary={`Data: ${consulta.data} - Hora: ${consulta.hora} - CPF: ${consulta.cpf} - SUS: ${consulta.sus}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
