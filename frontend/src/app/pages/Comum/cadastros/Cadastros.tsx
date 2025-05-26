import React, { useState } from 'react';
import { TextField, Button, Grid2, Box, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { insertMaskCpf, insertMaskTel, insertMaskCep, insertMaskSus } from '../../../functions/InsertMasks';
import api from '../../../../services/api';

export const Cadastros = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    telefone: '',
    cpf: '',
    cep: '',
    endereco: '',
    cartao_sus: '',
    nome_responsavel: ''
  });

  // Estado para controlar se a pessoa é menor de idade
  const [isMenorIdade, setIsMenorIdade] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Função para atualizar o estado com o valor do input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const rawValue = value.replace(/\D/g, '').slice(0, name === "cpf" ? 11 : name === "telefone" ? 11 : undefined);
    
    const maskedValue = name === "cpf" ? insertMaskCpf(rawValue) :
                        name === "telefone" ? insertMaskTel(rawValue) :
                        name === "cep" ? insertMaskCep(rawValue) :
                        name === "cartao_sus" ? insertMaskSus(rawValue) :
                        value;

    setFormData({ ...formData, [name]: maskedValue });
  };

  // Função para verificar se a pessoa é menor de idade
  const handleIdadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data_nascimento = e.target.value;

    const nascimento = new Date(data_nascimento);
    const data = new Date();

    let idade = data.getFullYear() - nascimento.getFullYear();

    const monthDiff = data.getMonth() - nascimento.getMonth();
    const dayDiff = data.getDate() - nascimento.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      idade--; 
    }

    setFormData({ ...formData, data_nascimento });
    setIsMenorIdade(idade < 18); 
  };

  // Função para simular o envio dos dados
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      if (formData.cpf.length != 14) {
        setSnackbarMessage("Insira um CPF válido.");
        setOpenSnackbar(true);
        return;
      }
      if (formData.telefone.length < 14) {
        setSnackbarMessage("Insira um número de telefone válido.");
        setOpenSnackbar(true);
        return;
      }
      
      const checkResponseCpf = await api.get('/Comum/Cadastros', {
        params: {
          cpf: formData.cpf.replace(/\D/g, ''),
        }
      });

      if (checkResponseCpf.status === 200) {
        setSnackbarMessage("CPF já cadastrado.");
        setOpenSnackbar(true);
        return;
      }

      const checkResponseSus = await api.get('/Comum/Cadastros', {
        params: {
          cartao_sus: formData.cartao_sus.replace(/\D/g, ''),
        }
      });

      if (checkResponseSus.status === 200) {
        setSnackbarMessage("Cartão SUS já cadastrado.");
        setOpenSnackbar(true);
        return;
      }

    } catch (checkError: any) {
      if (checkError.response && checkError.response.status !== 204) {
        console.error("Erro na verificação de duplicidade:", checkError);
        setSnackbarMessage("Erro ao verificar duplicidade.");
        setOpenSnackbar(true);
        return;
      }
    }

    try {
      const response = await api.post('/Comum/Cadastros', {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''), 
        telefone: formData.telefone.replace(/\D/g, ''), 
        cep: formData.cep.replace(/\D/g, ''),
        cartao_sus: formData.cartao_sus.replace(/\D/g, '')
      });

      console.log('Paciente cadastrado com sucesso:', response.data);
      setSnackbarMessage("Paciente cadastrado com sucesso.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao cadastrar Paciente:', error);
      setSnackbarMessage("Erro ao cadastrar Paciente.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Paciente na Clínica
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Data de nascimento"
              variant="outlined"
              fullWidth
              type="date"
              name="data_nascimento"
              InputLabelProps={{ shrink: true }}
              required
              value={formData.data_nascimento}
              onChange={handleIdadeChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Telefone"
              variant="outlined"
              fullWidth
              name="telefone"
              required
              value={insertMaskTel(formData.telefone)}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="CEP"
              variant="outlined"
              fullWidth
              name="cep"
              inputProps={{ maxLength: 9 }}
              value={insertMaskCep(formData.cep)}
              onChange={handleChange}
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
              required
              value={insertMaskCpf(formData.cpf)}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Cartão do SUS"
              variant="outlined"
              fullWidth
              name="cartao_sus"
              inputProps={{ maxLength: 18 }}
              value={insertMaskSus(formData.cartao_sus)}
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
                name="nome_responsavel"
                required
                value={formData.nome_responsavel}
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
      {/* Snackbar para mensagens de feedback */}
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
              >
                <Alert onClose={() => setOpenSnackbar(false)} severity="info">
                  {snackbarMessage}
                </Alert>
              </Snackbar>
    </Paper>
  );
};

