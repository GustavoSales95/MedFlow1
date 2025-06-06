import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Button
} from '@mui/material';
import api from "../../../../services/api";

interface Produtos {
  id_produto: number;
  nome: string;
  valor: number;
  data_pedido: string;
  validade: string;
  embalagem: string;
  unidade_medida: string;
  temperatura: string;
}

export const Entrada = () => {
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // Estado que controla se os detalhes de um produto já foram expandidos.
  const [expandedProducts, setExpandedProducts] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    api.get("/Estoque/entrada")
      .then((resp) => {
        console.log("Dados recebidos:", resp.data);
        setProdutos(resp.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar os produtos:", err);
      });
  }, []);

  // Função para alternar a exibição dos detalhes de um produto
  const handleToggleDetails = (id: number) => {
    setExpandedProducts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black'
      }}
    >
      {produtos.length === 0 && (
        <>
          <Box
            component="img"
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="Nenhum item"
            sx={{ width: 150, height: 150, mb: 4 }}
          />
          <Typography variant="h6" fontWeight="bold">
            Não há itens no momento
          </Typography>
        </>
      )}

      {produtos.length > 0 && (
        <Grid sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: "90%" }}>
          {produtos.map((produto) => (
            <Paper key={produto.id_produto} elevation={3} sx={{ padding: 3, margin: 3, width: "20%" }}>
              <Grid container spacing={2}>
                {/* Sempre exibe Nome e Id */}
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 18 }}>Nome do Produto</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {produto.nome}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 18 }}>Id do Produto</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {produto.id_produto}
                  </Typography>
                </Grid>
                {/* Exibe os detalhes adicionais somente se o produto estiver expandido */}
                {expandedProducts[produto.id_produto] && (
                  <>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Valor do Produto</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.valor}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Data do Pedido</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.data_pedido}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Data de Validade</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.validade}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Temperatura</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.temperatura}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Embalagem</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.embalagem || "Não informado"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18 }}>Unidade de Medida</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                        {produto.unidade_medida || "Não informado"}
                      </Typography>
                    </Grid>
                  </>
                )}
                {/* Botão que alterna a exibição dos detalhes */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleToggleDetails(produto.id_produto)}
                  >
                    {expandedProducts[produto.id_produto] ? "Ocultar Detalhes" : "Detalhes"}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>
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