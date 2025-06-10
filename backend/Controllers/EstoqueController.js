import express from "express";
import service from "../Services/EstoqueServices.js";

const route = express.Router();

route.get("/entrada", async (req, res) => {
  try {
    const produtos = await service.getTodosProdutos();
    return res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar produtos no banco de dados." });
  }
});

route.post("/Cadastro", async (req, res) => {
<<<<<<< HEAD
  const { nome, valor, embalagem, unidade_medida, temperatura, quantidade } =
    req.body;
=======
  const { nome, valor, embalagem, unidade_medida, temperatura } = req.body;
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c

  if (!nome || !valor || !temperatura) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
<<<<<<< HEAD
    const novoProduto = await service.registroProduto(
      nome,
      valor,
      embalagem,
      unidade_medida,
      temperatura,
      quantidade
    );
=======
    const novoProduto = await service.registroProduto(nome, valor, embalagem, unidade_medida, temperatura);
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c

    res.status(201).json({
      message: "Produto registrado com sucesso",
      data: novoProduto,
    });
  } catch (error) {
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
    return res
      .status(500)
      .json({ error: "Erro ao buscar produto no banco de dados." });
  }
});

route.put("/Editar", async (req, res) => {
<<<<<<< HEAD
  const {
    id_produto,
    nome,
    valor,
    embalagem,
    unidade_medida,
    temperatura,
    quantidade,
  } = req.body;
  try {
    const produtoAtualizado = await service.atualizarProduto(
      id_produto,
      nome,
      valor,
      embalagem,
      unidade_medida,
      temperatura,
      quantidade
    );
=======
  const { id_produto, nome, valor, embalagem, unidade_medida, temperatura } = req.body;
  try {
    const produtoAtualizado = await service.atualizarProduto(id_produto, nome, valor, embalagem, unidade_medida, temperatura);
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c

    if (!produtoAtualizado) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.status(200).json(produtoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar produto no banco de dados." });
  }
});

route.delete("/ProdutoEstoque/:id_produto_estoque", async (req, res) => {
  const { id_produto_estoque } = req.params;

  try {
    const produtoDeletado = await service.deletarProduto(id_produto_estoque);
    if (!produtoDeletado) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    return res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return res
      .status(500)
      .json({ error: "Erro ao deletar produto no banco de dados." });
  }
});

route.get("/ProdutoEstoque/:id_produto", async (req, res) => {
  const { id_produto } = req.params;
  try {
    const produtosEstoue = await service.BuscarProdutoEstoque(id_produto);

    return res.status(200).json(produtosEstoue);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar produtos no banco de dados." });
  }
});

route.post("/ProdutoEstoque/:id_produto", async (req, resp) => {
  const { id_produto } = req.params;
  const { validade, quantidade } = req.body;
  try {
    await service.adicionarProdutoEstoque(id_produto, validade, quantidade);

    return resp.status(201).json(req.body);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return resp
      .status(400)
      .json({ error: "Erro ao cadastrar produto no banco de dados." });
  }
});
route.get("/Receitas", async (req, res) => {
  try {
    const receitas = await service.listarReceitas();
    return res.status(200).json(receitas);
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar receitas no banco de dados." });
  }
});

<<<<<<< HEAD
export default route;
=======
route.put("/Retirada/:id_produto_estoque", async (req, resp) => {
  const { id_produto_estoque } = req.params;
  const { quantidadeRetirada, retiradoPara, retiradoPor, consultaRealizada } = req.body;
  try {
    const saida = await service.realizarRetirada(id_produto_estoque, quantidadeRetirada, retiradoPara, retiradoPor, consultaRealizada);
    const produto_estoque = await service.retiradaProduto(id_produto_estoque, quantidadeRetirada)
    return resp.status(201).json(req.body);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
    return resp.status(400).json({ error: "Erro ao cadastrar produto no banco de dados." });
  }
});

export default route;
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
