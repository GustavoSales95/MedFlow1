import pkg from "@prisma/client";
const { PrismaClient, Temperatura } = pkg;

const prisma = new PrismaClient();

async function registroProduto(
  nome,
  valor,
  embalagem,
  unidade_medida,
  temperatura,
  quantidade
) {
  if (!temperatura) {
    throw new Error("Temperatura não fornecida.");
  }

  const temperaturaUpper = temperatura.toUpperCase();
  const temperaturasValidas = ["PERECIVEL", "RESFRIADO", "TERMOSSENSIVEL"];

  if (!temperaturasValidas.includes(temperaturaUpper)) {
    throw new Error("Temperatura inválida.");
  }

  const valorNumerico = parseFloat(valor);
  const quantidadeNumero = parseInt(quantidade);

  const novoProduto = await prisma.produtos.create({
    data: {
      nome,
      valor: valorNumerico,
      embalagem,
      unidade_medida,
      temperatura: Temperatura[temperaturaUpper],
      quantidade: quantidadeNumero,
    },
  });

  return novoProduto;
}

async function getTodosProdutos() {
  try {
    const produtos = await prisma.produtos.findMany();
    return produtos;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Erro ao buscar produtos");
  }
}

async function atualizarProduto(
  id_produto,
  nome,
  valor,
  embalagem,
  unidade_medida,
  temperatura,
  quantidade
) {
  try {
    const id = parseInt(id_produto);
    if (isNaN(id)) {
      throw new Error("ID do produto inválido.");
    }

    const valorNumerico = parseFloat(valor);
    const quantidadeNumero = parseInt(quantidade);

    const produtoAtualizado = await prisma.produtos.update({
      where: { id_produto },
      data: {
        nome,
        valor: valorNumerico,
        embalagem,
        unidade_medida,
        temperatura,
        quantidade: quantidadeNumero,
      },
    });
    return produtoAtualizado;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Erro ao atualizar produto");
  }
}

async function deletarProduto(id_produto_estoque) {
  try {
    const produtoDeletado = await prisma.produto_estoque.delete({
      where: { id_produto_estoque: parseInt(id_produto_estoque) },
    });
    return produtoDeletado;
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw new Error("Erro ao deletar produto");
  }
}

async function getById(id_produto) {
  try {
    const id = parseInt(id_produto);

    if (isNaN(id)) {
      throw new Error("ID inválido");
    }

    const produto = await prisma.produtos.findUnique({
      where: { id_produto: id },
    });

    return produto;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
}

async function BuscarProdutoEstoque(id_produto) {
  const id = parseInt(id_produto);
  try {
    const produtosEstoue = await prisma.produto_estoque.findMany({
      where: { id_produto: id },
      include: { produtos: true },
    });

    return produtosEstoue;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
}

async function adicionarProdutoEstoque(id_produto, validade, quantidade) {
  const id = parseInt(id_produto);
  try {
    const produtoEstoque = await prisma.produto_estoque.create({
      data: {
        validade: new Date(validade),
        quantidade,
        produtos: { connect: { id_produto: id } },
      },
    });
    return produtoEstoque;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
}
async function listarReceitas() {
  try {
    const receitas = await prisma.receitas.findMany({
      include: {
        pacientes: true,
        medicos: true,
        produtos: true,
      },
      orderBy: {
        data_emissao: "desc",
      },
    });

    return receitas;
  } catch (error) {
    console.error("Erro ao buscar receitas:", error);
    throw new Error("Erro ao buscar receitas");
  }
}

export default {
  listarReceitas,
  registroProduto,
  atualizarProduto,
  deletarProduto,
  getTodosProdutos,
  getById,
  BuscarProdutoEstoque,
  adicionarProdutoEstoque,
};
