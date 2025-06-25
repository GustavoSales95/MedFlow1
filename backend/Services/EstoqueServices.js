import pkg from "@prisma/client";
const { PrismaClient, Temperatura } = pkg;

const prisma = new PrismaClient();

async function registroProduto(
  nome,
  valor,
  embalagem,
  unidade_medida,
  temperatura,
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


  const novoProduto = await prisma.produtos.create({
    data: {
      nome,
      valor: valorNumerico,
      embalagem,
      unidade_medida,
      temperatura: Temperatura[temperaturaUpper],
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
  temperatura
) {
  try {
    const id = parseInt(id_produto);
    if (isNaN(id)) {
      throw new Error("ID do produto inválido.");
    }

    const valorNumerico = parseFloat(valor);

    const produtoAtualizado = await prisma.produtos.update({
      where: { id_produto },
      data: {
        nome,
        valor: valorNumerico,
        embalagem,
        unidade_medida,
        temperatura,
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
    const produtoDeletado = await prisma.produto_estoque.update({
      where: { id_produto_estoque: parseInt(id_produto_estoque) },
      data: { deletado: "Sim" },
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
      where: { id_produto: id, deletado: "Nao" },
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
        quantidade: parseInt(quantidade),
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
      where: {
        status: {
          not: "Fechada", // só traz as receitas que não estão fechadas
        },
      },
      include: {
        paciente: true,
        medico: true,
        produto: true,
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

async function fecharReceita(id_receita) {
  try {
    const receitaAtualizada = await prisma.receitas.update({
      where: { id_receita: Number(id_receita) },
      data: { status: "Fechada" }, // Exatamente como no enum
    });
    return receitaAtualizada;
  } catch (error) {
    console.error("Erro no prisma ao fechar receita:", error);
    throw error; // para mostrar o erro real no controller
  }
}

async function realizarRetirada(
  id_produto_estoque,
  quantidadeRetirada,
  retiradoPara,
  retiradoPor,
  consultaRealizada
) {
  const id_consulta = parseInt(consultaRealizada);
  const id_paciente = parseInt(retiradoPara);
  const quantidade = parseInt(quantidadeRetirada);

  const medico = await prisma.medicos.findUnique({
    where: { crm: retiradoPor },
  });

  const id = parseInt(id_produto_estoque);
  const id_medico = medico.id_medico;

  const saida = await prisma.entradaSaida.create({
    data: {
      ProdutoEstoque: { connect: { id_produto_estoque: id } },
      Consultas: { connect: { id_consulta } },
      Medicos: { connect: { id_medico } },
      Pacientes: { connect: { id_paciente } },
      quantidade,
      tipo_transacao: "Retirada",
    },
  });

  return saida;
}

async function retiradaProduto(id_produto_estoque, quantidadeRetirada) {
  const id = parseInt(id_produto_estoque);
  const quantidadeRemovida = parseInt(quantidadeRetirada);
  const produto_estoque = await prisma.produto_estoque.update({
    where: { id_produto_estoque: id },
    data: {
      quantidade: { decrement: quantidadeRemovida },
    },
  });
  return produto_estoque;
}

export default {
  registroProduto,
  atualizarProduto,
  deletarProduto,
  getTodosProdutos,
  getById,
  BuscarProdutoEstoque,
  adicionarProdutoEstoque,
  realizarRetirada,
  retiradaProduto,
  fecharReceita,
  listarReceitas,
};
