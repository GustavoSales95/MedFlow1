import React, { useState } from 'react';
import { TextField, Button, Grid2, Box, Typography } from '@mui/material';

export const CadastrosUsuarios = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    crm: '',
    email: '',
    senha: '',
    especialidade: '',
    cpf: '',
    nome: '',
    telefone: '',
    data_nascimento: '',
    sexo: '',
    data_cadastro:'',
    
  });

  // Função para atualizar o estado com o valor do input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  // Função para simular o envio dos dados
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    // Aqui você pode conectar com a API para salvar os dados
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom alignItems={'center'}>
        Cadastro de Medico
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Data de Nascimento"
              variant="outlined"
              fullWidth
              type="date"
              name="data_nascimento"
              value={formData.data_nascimento}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Sexo"
              variant="outlined"
              fullWidth
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Especialidade"
              variant="outlined"
              fullWidth
              name="especialidade"
              value={formData.especialidade}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Data de Cadastro"
              variant="outlined"
              fullWidth
              type='date'
              name="data_cadastro"
              value={formData.data_cadastro}
              onChange={handleChange}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Senha"
              variant="outlined"
              fullWidth
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            />
          </Grid2>
          {/* Campo de nome do responsável aparece apenas se a pessoa for menor de idade */}
          <Grid2 size={12}>
            <Button variant="contained" color="primary" type="submit">
              Cadastrar
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

