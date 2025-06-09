import React, { useEffect, useState } from 'react';
import { 
  Grid,
  Box,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Button,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,
  TableContainer
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from "../../../../services/api";

interface Produtos {
  id_produto: number;
  nome: string;
  valor: number;
  quantidade: number;
  embalagem: string;
  unidade_medida: string;
  temperatura: string;
}

export const Entrada = () => {
  const [produtos, setProdutos] = useState<Produtos[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
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
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de usuários">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Embalagem</TableCell>
                <TableCell>Unidade de Medida</TableCell>
                <TableCell>Temperatura</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow key={produto.id_produto}>
                  <TableCell>{produto.nome}</TableCell>
                  <TableCell>
                    {produto.quantidade}
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() =>
                        navigate(`/Estoque/ProdutoEstoque/${produto.id_produto}`)
                      }
                    >
                      Ver Estoque
                    </Button>
                  </TableCell>
                  <TableCell>R${produto.valor}</TableCell>
                  <TableCell>{produto.embalagem || "Não informado"}</TableCell>
                  <TableCell>{produto.unidade_medida || "Não informado"}</TableCell>
                  <TableCell>{produto.temperatura}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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