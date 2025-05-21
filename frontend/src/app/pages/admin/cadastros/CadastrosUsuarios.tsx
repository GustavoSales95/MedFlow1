import React, { useState } from 'react';
import { TextField, Button, Grid2, Box, Typography, Paper, Snackbar, Alert, Radio, RadioGroup, FormControl, FormLabel, FormControlLabel } from '@mui/material';
import api from '../../../../services/api';
import { insertMaskCpf, insertMaskTel } from '../../../functions/InsertMasks';

interface UserData {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
}

interface MedicoData {
  id_medico: number;
  crm: string;
  especialidade: string;
  telefone: string;
}

export const CadastrosUsuarios = () => {
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    senha2: '',
    cpf: '',
    data_nascimento: '',
    crm: '',
    especialidade: '',
    telefone: '',
    id_perfis: ''
  });
  const [usuario, setUsuario] = useState<UserData | null>(null);
  const [medico, setMedico] = useState<MedicoData | null>(null);
  const [isMedic, setIsMedic] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  // Função para atualizar o estado com o valor do input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const rawValue = value.replace(/\D/g, '').slice(0, name === "cpf" ? 11 : name === "telefone" ? 11 : undefined);

    const maskedValue = name === "cpf" ? insertMaskCpf(rawValue) :
                        name === "telefone" ? insertMaskTel(rawValue) :
                        value;

    setFormData({ ...formData, [name]: maskedValue });
  };

  const handlePerfilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id_perfis = e.target.value;

      if(id_perfis == '3') {
        setIsMedic(true);
        setFormData({ ...formData, id_perfis });
      }
      else {
        setIsMedic(false);
        setFormData({ ...formData, crm: '', especialidade: '', telefone: '', id_perfis});
      }
  }

  // Função para simular o envio dos dados
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      if (formData.cpf.length != 14) {
        setSnackbarMessage("Insira um CPF válido.");
        setOpenSnackbar(true);
        return;
      }

      if (formData.id_perfis == '3') {
        if (formData.crm.length < 6) {
          setSnackbarMessage("Insira um CRM válido.");
          setOpenSnackbar(true);
          return;
        }
        if (formData.telefone.length < 14) {
          setSnackbarMessage("Insira um número de telefone válido.");
          setOpenSnackbar(true);
          return;
        }
      }
      // Verifica se já existe um médico/usuário com o mesmo CPF ou CRM
      const checkResponseCpf = await api.get('/Admin/CadastrosUsuarios', {
        params: {
          cpf: formData.cpf.replace(/\D/g, ''),
        }
      });

      // Se for retornado status 200, já existe um cadastro com esses dados
      if (checkResponseCpf.status === 200) {
        setSnackbarMessage("Já exite um Usuário com esse CPF.");
        setOpenSnackbar(true);
        return;
      }
      const checkResponseCrm = await api.get('/Admin/CadastrosUsuarios', {
        params: {
          crm: formData.crm,
        }
      });

      if (checkResponseCrm.status === 200) {
        setSnackbarMessage("Já exite um Médico com esse CRM.");
        setOpenSnackbar(true);
        return;
      }

      // Verifica se já existe um usuário com o mesmo e-mail
      const checkResponseEmail = await api.get('/Admin/CadastrosUsuarios', {
        params: {
          email: formData.email, 
        }
      });

      if (checkResponseEmail.status === 200) {
        setSnackbarMessage("Já existe um Usuário com esse E-mail.");
        setOpenSnackbar(true);
        return;
      }

      if (formData.senha != formData.senha2) {
        setSnackbarMessage("As senhas não coincidem.");
        setOpenSnackbar(true);
        return;
      }

    } catch (checkError: any) {
      // Caso ocorra um erro na consulta, mas se a resposta for 204 significa que não encontrou duplicata
      if (checkError.response && checkError.response.status !== 204) {
        console.error("Erro na verificação de duplicidade:", checkError);
        setSnackbarMessage("Erro ao verificar duplicidade.");
        setOpenSnackbar(true);
        return;
      }
      // Se o status for 204, continua o cadastro normalmente
    }

    // Se não houver duplicidade, realiza o cadastro
    try {
      const response = await api.post('/Admin/CadastrosUsuarios', {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''), // Remove a máscara antes do envio
        telefone: formData.telefone.replace(/\D/g, '') 
      });

      console.log('Médico cadastrado com sucesso:', response.data);
      setSnackbarMessage("Médico cadastrado com sucesso.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao cadastrar médico:', error);
      setSnackbarMessage("Erro ao cadastrar médico.");
      setOpenSnackbar(true);
    }
  };



  return (
    <Paper elevation={4} sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom alignItems={'center'}>
        Cadastro de Médico
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
              label="Data de Nascimento"
              variant="outlined"
              fullWidth
              type="date"
              name="data_nascimento"
              required
              value={formData.data_nascimento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="CPF"
              variant="outlined"
              fullWidth
              name="cpf"
              required
              inputProps={{ maxLength: 14 }}
              value={insertMaskCpf(formData.cpf)}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type='email'
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Senha"
              variant="outlined"
              fullWidth
              required
              type='password'
              name="senha"
              value={formData.senha}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Confirme a senha"
              variant="outlined"
              fullWidth
              required
              type='password'
              name="senha2"
              value={formData.senha2}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 size={12}>
            <FormControl>
              <FormLabel id="id_perfis">Tipo de Usuário</FormLabel>
              <RadioGroup
                name="id_perfis"
                row
                value={formData.id_perfis}
                onChange={handlePerfilChange}
              >
                <FormControlLabel value='1' control={<Radio />} label="Comum" />
                <FormControlLabel value='2' control={<Radio />} label="Admin" />
                <FormControlLabel value='3' control={<Radio />} label="Medico" />
              </RadioGroup>
            </FormControl>
          </Grid2>

          {isMedic && (
            <>
            <Grid2 size={12}>
              <TextField
                label="CRM"
                variant="outlined"
                fullWidth
                name="crm"
                required
                inputProps={{ maxLength: 6 }}
                value={formData.crm}
                onChange={handleChange} />
            </Grid2><Grid2 size={12}>
                <TextField
                  label="Especialidade"
                  variant="outlined"
                  fullWidth
                  name="especialidade"
                  required
                  value={formData.especialidade}
                  onChange={handleChange} />
              </Grid2><Grid2 size={12}>
                <TextField
                  label="Telefone"
                  variant="outlined"
                  fullWidth
                  name="telefone"
                  required
                  value={insertMaskTel(formData.telefone)}
                  onChange={handleChange} />
              </Grid2>
              </>
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

