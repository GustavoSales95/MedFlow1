import React from "react";
import { Grid2, TextField, Typography, Button } from "@mui/material";
import { Margin } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import { fontGrid } from '@mui/material/styles/cssUtils';
export const FormularioConfigClinica = () => {
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={7}>
        <Grid2 container spacing={1}>
          <Grid2 size={12}><TextField label="Nome da Clinica" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={7}><TextField label="Endereço" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={5}><TextField label="CEP" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={12}><TextField label="Bairro" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={8}><TextField label="Cidade" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={4}><TextField label="Estado" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={12}><TextField label="Telefone" variant="outlined" fullWidth /></Grid2>
          <Grid2 size={12}><TextField label="CNPJ" variant="outlined" fullWidth /></Grid2>
        </Grid2>
      </Grid2>
      <Grid2 size={5}>
        <Grid2 size={12}>
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#f0f0f0",
              textAlign: "center",
            }}
          >
            <Typography> Logo </Typography>
          </div>
        </Grid2>
        <Grid2 container spacing={1} alignItems={'center'} style={{
          marginTop:'5px', 
        }} >
          <Grid2 size={6}><Button color='secondary' variant='contained' startIcon={<UploadFileIcon></UploadFileIcon>} >Atualizar Logo</Button></Grid2>
          <Grid2 size={6}><Button color='error' variant='contained' startIcon={<DeleteIcon></DeleteIcon>}>Remover Logo</Button></Grid2>
        </Grid2>  
      </Grid2>
    </Grid2>
  );
};
