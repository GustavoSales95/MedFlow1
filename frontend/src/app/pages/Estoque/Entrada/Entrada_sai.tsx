import { Box,Typography } from '@mui/material';
import React from 'react';

export const Entrada = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
      }}
    >
      <Box
        component="img"
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" 
        alt="Nenhum item"
        sx={{ width: 150, height: 150, mb: 4 }}
      />
      <Typography variant="h6" fontWeight="bold">
        Não há itens no momento
      </Typography>
    </Box>
  );
};


 