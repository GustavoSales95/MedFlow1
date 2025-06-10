// ProdutoEstoque.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Table,
  TableContainer,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import api from '../../../../services/api';
import { formatarDataHora } from '../../../functions/InsertMasks';

interface ProdutoEstoqueData {
  id_produto_estoque: number;
  id_produto: number;
  quantidade: string;
  validade: string;
  produtos: {
    nome: string;
    valor: number;
    embalagem: string;
    unidade_medida: string;
    temperatura: string;
    quantidade: number;
  }
}

interface FormData {
  quantidade: string;
  validade: string;
}

interface RetiradaFormData {
  quantidadeRetirada: string;
  retiradoPara: string;
  retiradoPor: string;
  consultaRealizada: string;
}

export const ProdutoEstoque = () => {
  const { id_produto } = useParams<{ id_produto: string }>();
  const [produtos, setProdutos] = useState<ProdutoEstoqueData[]>([]);
  const [adicionar, setAdicionar] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ quantidade: "", validade: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Estados para o diálogo de retirada:
  const [openRetiradaDialog, setOpenRetiradaDialog] = useState(false);
  const [retiradaFormData, setRetiradaFormData] = useState<RetiradaFormData>({
    quantidadeRetirada: "",
    retiradoPara: "",
    retiradoPor: "",
    consultaRealizada: ""
  });
  // Guarda o produto selecionado para retirada.
  const [selectedProduct, setSelectedProduct] = useState<ProdutoEstoqueData | null>(null);

  useEffect(() => {
    api.get(`/Estoque/ProdutoEstoque/${id_produto}`)
      .then((resp) => {
        setProdutos(resp.data);
      })
      .catch((err) => {
        console.error('Erro ao buscar dados do produto:', err);
      });
  }, [id_produto]);

  const produtoInfo = produtos[0]?.produtos;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveForm = async () => {
  // Converte a data informada para um objeto Date
  const validadeDate = new Date(formData.validade);
  
  // Define a data de hoje sem considerar as horas
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Checa se a data de validade é menor ou igual à data atual
  if (validadeDate <= hoje) {
    setSnackbarMessage("Produtos vencidos não podem ser cadastrados.");
    setOpenSnackbar(true);
    return; // Interrompe a execução se a validação falhar
  }

  console.log("Dados do formulário:", formData);
  try {
    const response = await api.post(
      `/Estoque/ProdutoEstoque/${id_produto}`,
      { ...formData }
    );
    const resp = await api.get(`/Estoque/ProdutoEstoque/${id_produto}`);
    setProdutos(resp.data);
    console.log("Produto cadastrado com sucesso:", response.data);
    setSnackbarMessage("Produto cadastrado com sucesso.");
    setOpenSnackbar(true);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    setSnackbarMessage("Erro ao cadastrar produto.");
    setOpenSnackbar(true);
  }
  setAdicionar(false);
};

  const deleteProduto = async (id_produto_estoque: number) => {
    try {
      const response = await api.delete(`/Estoque/ProdutoEstoque/${id_produto_estoque}`);
      const resp = await api.get(`/Estoque/ProdutoEstoque/${id_produto}`);
      setProdutos(resp.data);
      console.log('Produto deletado com sucesso:', response.data);
      setSnackbarMessage("Produto deletado com sucesso.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      setSnackbarMessage("Erro ao deletar produto.");
      setOpenSnackbar(true);
    }
  };


  // Funções para os inputs do diálogo de retirada
  const handleRetiradaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRetiradaFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função exemplo de submissão do formulário de retirada.
  const handleRetiradaSubmit = async () => {
  console.log("Dados da Retirada:", retiradaFormData, "Produto:", selectedProduct);

  // Certifique-se de que o selectedProduct esteja definido.
  if (!selectedProduct) {
    setSnackbarMessage("Nenhum produto selecionado para retirada.");
    setOpenSnackbar(true);
    return;
  }

  try {
    // Use o id do produto selecionado para realizar o post.
    const response = await api.put(
      `/Estoque/Retirada/${selectedProduct.id_produto_estoque}`,
      { produtoId: selectedProduct.id_produto_estoque, ...retiradaFormData }
    );
    
    console.log("Produto retirado com sucesso:", response.data);
    setSnackbarMessage("Retirada realizada com sucesso.");
    setOpenSnackbar(true);
    setOpenRetiradaDialog(false);
    
    // Atualiza a lista de produtos, se necessário
    const resp = await api.get(`/Estoque/ProdutoEstoque/${id_produto}`);
    setProdutos(resp.data);
  } catch (error) {
    console.error("Erro ao realizar a retirada:", error);
    setSnackbarMessage("Erro ao realizar a retirada.");
    setOpenSnackbar(true);
  }
};

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white', padding: 2 }}>
      <Typography variant="h4" mb={2}>Detalhes do Produto - {id_produto}</Typography>
      
      {produtos.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de produtos">
            <TableHead>
              <TableRow>
                <TableCell>Id do produto</TableCell>
                <TableCell>Quantidade em Estoque</TableCell>
                <TableCell>Validade</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Embalagem</TableCell>
                <TableCell>Unidade de Medida</TableCell>
                <TableCell>Temperatura</TableCell>
                <TableCell>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    color="primary"
                    onClick={() => setAdicionar(true)}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {produtos.map((produto) => {
                const { data } = formatarDataHora(produto.validade);
                return (
                  <TableRow key={produto.id_produto_estoque}>
                    <TableCell>{produto.id_produto_estoque}</TableCell>
                    <TableCell>
                      {produto.quantidade}
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={() => {
                          setSelectedProduct(produto);
                          setOpenRetiradaDialog(true);
                        }}
                      >
                        Realizar Retirada
                      </Button>
                    </TableCell>
                    <TableCell>{data}</TableCell>
                    <TableCell>R${produto.produtos.valor}</TableCell>
                    <TableCell>{produto.produtos.embalagem || "Não informado"}</TableCell>
                    <TableCell>{produto.produtos.unidade_medida || "Não informado"}</TableCell>
                    <TableCell>{produto.produtos.temperatura}</TableCell>
                    <TableCell>
                      <Button
                        startIcon={<DeleteIcon />}
                        variant="contained"
                        color="primary"
                        onClick={() => deleteProduto(produto.id_produto_estoque)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {produtos.length <= 0 && (
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

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setAdicionar(true)}
        >
          Adicionar Item
        </Button>
      </>
      )}
      
      {/* Tabela de formulário para entrada de novos dados */}
      {adicionar && (
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de formulário">
            <TableHead>
              <TableRow>
                <TableCell>Quantidade em Estoque</TableCell>
                <TableCell>Validade</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Embalagem</TableCell>
                <TableCell>Unidade de Medida</TableCell>
                <TableCell>Temperatura</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloseIcon />}
                    onClick={() => setAdicionar(false)}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    name="validade"
                    type="date"
                    value={formData.validade}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="small"
                    placeholder="DD/MM/YYYY"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={produtoInfo?.valor !== undefined ? `R$${produtoInfo.valor}` : ""}
                    variant="outlined"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={produtoInfo?.embalagem || "Não informado"}
                    variant="outlined"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={produtoInfo?.unidade_medida || "Não informado"}
                    variant="outlined"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={produtoInfo?.temperatura || ""}
                    variant="outlined"
                    size="small"
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<SaveAltIcon />}
                    variant="contained"
                    color="primary"
                    onClick={handleSaveForm}
                  >
                    Salvar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Diálogo para realizar a retirada */}
      <Dialog open={openRetiradaDialog} onClose={() => setOpenRetiradaDialog(false)}>
  <DialogTitle>Realizar Retirada</DialogTitle>
  <DialogContent>
    <TextField
      label="Quantidade a ser retirada"
      name="quantidadeRetirada"
      type="number"
      value={retiradaFormData.quantidadeRetirada}
      onChange={handleRetiradaInputChange}
      fullWidth
      margin="dense"
    />
    <TextField
      label="Retirado para (Paciente ID)"
      name="retiradoPara"
      type="number"
      value={retiradaFormData.retiradoPara}
      onChange={handleRetiradaInputChange}
      fullWidth
      margin="dense"
    />
    <TextField
      label="Retirado por (CRM do Médico)"
      name="retiradoPor"
      type="number"
      value={retiradaFormData.retiradoPor}
      onChange={handleRetiradaInputChange}
      fullWidth
      margin="dense"
    />
    <TextField
      label="Consulta realizada (ID da Consulta)"
      name="consultaRealizada"
      type="number"
      value={retiradaFormData.consultaRealizada}
      onChange={handleRetiradaInputChange}
      fullWidth
      margin="dense"
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenRetiradaDialog(false)} color="secondary">
      Cancelar
    </Button>
    <Button onClick={handleRetiradaSubmit} color="primary" variant="contained">
      Confirmar
    </Button>
  </DialogActions>
</Dialog>
      
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