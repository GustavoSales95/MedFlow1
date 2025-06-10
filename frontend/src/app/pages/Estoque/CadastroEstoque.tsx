import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  FormControl,
  Snackbar,
  Alert
} from '@mui/material';
import api from "../../../services/api";

export const CadastroEstoque = () => {
  const [formData, setFormData] = useState({
    nome: '',
    unidade_medida: '',
    valor: '',
    embalagem: '',
    temperatura: '', 
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);

    try {
      const response = await api.post('/Estoque/Cadastro', {
        ...formData
      });

      console.log('Produto cadastrado com sucesso:', response.data);
      setSnackbarMessage("Produto cadastrado com sucesso.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
      setSnackbarMessage("Erro ao cadastrar produto.");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Registrar Produto
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
            <Grid item xs={12}>
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </Grid>


          <Grid item xs={12}>
            <TextField
              label="Valor"
              variant="outlined"
              fullWidth
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>


          <Grid item xs={12}>
            <TextField
              label="Embalagem"
              variant="outlined"
              fullWidth
              name="embalagem" 
              value={formData.embalagem}
              onChange={handleChange}
            />
          </Grid>


          <Grid item xs={12}>
            <TextField
              label="Unidade de Medida"
              variant="outlined"
              fullWidth
              name="unidade_medida"
              value={formData.unidade_medida}
              onChange={handleChange}
            />
          </Grid>


          {/* Tipo (Temperatura) */}
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Temperatura</FormLabel>
              <RadioGroup
                row
                name="temperatura"  
                value={formData.temperatura}
                onChange={handleChange}
              >
                <FormControlLabel value="PERECIVEL" control={<Radio />} label="Perecível" />
                <FormControlLabel value="RESFRIADO" control={<Radio />} label="Resfriado" />
                <FormControlLabel value="TERMOSSENSIVEL" control={<Radio />} label="Termossensível" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Cadastrar
            </Button>
          </Grid>
        </Grid>
      </form>
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