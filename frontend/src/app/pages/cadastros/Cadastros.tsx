import React, { useState } from 'react';
import { TextField, Button, Grid2, Box, Typography } from '@mui/material';

export const Cadastros = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    endereco: '',
    cpf: '',
    cartaoSUS: '',
    nomeResponsavel: '',
  });

  // Estado para controlar se a pessoa é menor de idade
  const [isMenorIdade, setIsMenorIdade] = useState(false);

  // Função para atualizar o estado com o valor do input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Função para verificar se a pessoa é menor de idade
  const handleIdadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idade = e.target.value;
    setFormData({ ...formData, idade });
    setIsMenorIdade(parseInt(idade) < 18); // Verifica se é menor de idade
  };

  // Função para simular o envio dos dados
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    // Aqui você pode conectar com a API para salvar os dados
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Pessoa na Clínica
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
              label="Idade"
              variant="outlined"
              fullWidth
              type="number"
              name="idade"
              value={formData.idade}
              onChange={handleIdadeChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Endereço"
              variant="outlined"
              fullWidth
              name="endereco"
              value={formData.endereco}
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
              label="Cartão do SUS"
              variant="outlined"
              fullWidth
              name="cartaoSUS"
              value={formData.cartaoSUS}
              onChange={handleChange}
            />
          </Grid2>

          {/* Campo de nome do responsável aparece apenas se a pessoa for menor de idade */}
          {isMenorIdade && (
            <Grid2 size={12}>
              <TextField
                label="Nome do Responsável"
                variant="outlined"
                fullWidth
                name="nomeResponsavel"
                value={formData.nomeResponsavel}
                onChange={handleChange}
              />
            </Grid2>
          )}

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

