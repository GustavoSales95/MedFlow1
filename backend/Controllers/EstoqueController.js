import express from "express";
import service from "../Services/EstoqueServices.js";

const route = express.Router()

route.get("/entrada", async (req, res) => {
  try {
    const produtos = await service.getTodosProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res.status(500).json({ error: "Erro ao buscar produtos no banco de dados." });
  }
});



route.post("/Cadastro", async (req, res) => {
  const { nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura } = req.body;

    if (!nome || !valor || !data_pedido || !validade || !temperatura) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

  try {
    const novoProduto = await service.registroProduto(nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura);

    res.status(201).json({
      message: "Produto registrado com sucesso",
      data: novoProduto
    });
  }
  catch (error) {
    console.error("Erro ao registrar produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

route.get("/Editar", async (req, res) => {
  const { id_produto } = req.query;
  try {
    const produto = await service.getById(id_produto);
    return res.status(200).json(produto);
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: "Erro ao buscar produto no banco de dados." });
  }
});

route.put("/Editar", async (req, res) => {
  const { id_produto, nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura } = req.body;
  try {
    const produtoAtualizado = await service.atualizarProduto(id_produto, nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura);

    if (!produtoAtualizado) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: "Erro ao atualizar produto no banco de dados." });
  }
});

route.delete("/Deletar/:id_produto", async (req, res) => {
   const { id_produto } = req.params; 

  try {
    const produtoDeletado = await service.deletarProduto(id_produto);
    if (!produtoDeletado) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.status(200).json({ message: "Produto deletado com sucesso" });
  } 
  catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res.status(500).json({ error: "Erro ao deletar produto no banco de dados." });
  }
});


route.get("/BuscarPorId", async (req, res) => {
    const { id_produto } = req.params;
  try {
    const produto = await service.getById(id_produto);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(produto);
  } 
  catch (error) {
    console.error("Erro ao buscar produto:", error);
    return res.status(500).json({ error: "Erro ao buscar produto no banco de dados." });
  }
});

export default route;