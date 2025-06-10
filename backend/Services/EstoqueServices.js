import pkg from "@prisma/client";
const { PrismaClient, Temperatura } = pkg;

const prisma = new PrismaClient();

<<<<<<< HEAD
async function registroProduto(
  nome,
  valor,
  embalagem,
  unidade_medida,
  temperatura,
  quantidade
) {
=======

async function registroProduto(nome, valor, embalagem, unidade_medida, temperatura) {
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
  if (!temperatura) {
    throw new Error("Temperatura não fornecida.");
  }

  const temperaturaUpper = temperatura.toUpperCase();
  const temperaturasValidas = ["PERECIVEL", "RESFRIADO", "TERMOSSENSIVEL"];

  if (!temperaturasValidas.includes(temperaturaUpper)) {
    throw new Error("Temperatura inválida.");
  }

  const valorNumerico = parseFloat(valor);
<<<<<<< HEAD
  const quantidadeNumero = parseInt(quantidade);

=======
  
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
  const novoProduto = await prisma.produtos.create({
    data: {
      nome,
      valor: valorNumerico,
      embalagem,
      unidade_medida,
<<<<<<< HEAD
      temperatura: Temperatura[temperaturaUpper],
      quantidade: quantidadeNumero,
    },
=======
      temperatura: Temperatura[temperaturaUpper]
    }
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
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

<<<<<<< HEAD
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
=======

async function atualizarProduto(id_produto, nome, valor, embalagem, unidade_medida, temperatura) {
try {
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
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
<<<<<<< HEAD
        quantidade: quantidadeNumero,
      },
=======
      }, 
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
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
      data: { deletado: 'Sim' }
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
<<<<<<< HEAD
      where: { id_produto: id },
      include: { produtos: true },
=======
      where: { id_produto: id, deletado: "Nao" },
      include: { produtos: true}
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
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
<<<<<<< HEAD
        quantidade,
        produtos: { connect: { id_produto: id } },
      },
=======
        quantidade: parseInt(quantidade),
        produtos: { connect: { id_produto: id} },
        
      } 
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
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

<<<<<<< HEAD
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
=======
async function realizarRetirada(id_produto_estoque, quantidadeRetirada, retiradoPara, retiradoPor, consultaRealizada) {
  const agendamento_id = parseInt(consultaRealizada);
  const id_paciente = parseInt(retiradoPara);
  const quantidade = parseInt(quantidadeRetirada)

  const medico = await prisma.medicos.findUnique({
    where: { crm: retiradoPor },
  });
  const consulta = await prisma.consultas.findUnique({
    where: { agendamento_id}
  });

  const id = parseInt(id_produto_estoque);
  const id_consulta = consulta.id_consulta;
  const id_medico = medico.id_medico;

  const saida = await prisma.entradaSaida.create({
    data: {
      ProdutoEstoque: { connect: { id_produto_estoque: id} },
      Consultas: { connect: {id_consulta} },
      Medicos: { connect: {id_medico} },
      Pacientes: { connect: {id_paciente}},
      quantidade,
      tipo_transacao: "Retirada"
    }
  });

  return saida
}

async function retiradaProduto(id_produto_estoque, quantidadeRetirada) { 
  const id = parseInt(id_produto_estoque);
  const quantidadeRemovida = parseInt(quantidadeRetirada)
  const produto_estoque = await prisma.produto_estoque.update({
    where: { id_produto_estoque: id },
    data: {
      quantidade: { decrement: quantidadeRemovida }
    }
  });
  return produto_estoque
}


export default { registroProduto, atualizarProduto, deletarProduto, getTodosProdutos, getById, BuscarProdutoEstoque, adicionarProdutoEstoque, realizarRetirada, retiradaProduto}
>>>>>>> dc43cd6a128d52db2a431de84c8051a05154860c
