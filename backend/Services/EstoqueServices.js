import pkg from '@prisma/client';
const { PrismaClient, Temperatura } = pkg;

const prisma = new PrismaClient();


async function registroProduto(nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura) {
  if (!temperatura) {
    throw new Error('Temperatura não fornecida.');
  }
  
  const temperaturaUpper = temperatura.toUpperCase();
  const temperaturasValidas = ['PERECIVEL', 'RESFRIADO', 'TERMOSSENSIVEL'];
  
  if (!temperaturasValidas.includes(temperaturaUpper)) {
    throw new Error('Temperatura inválida.');
  }
  
  const valorNumerico = parseFloat(valor);
  
  const novoProduto = await prisma.produtos.create({
    data: {
      nome,
      valor: valorNumerico, 
      fornecedor,
      data_pedido: new Date(data_pedido),
      validade: new Date(validade),
      embalagem,
      unidade_medida,
      temperatura: Temperatura[temperaturaUpper] 
    }
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


async function atualizarProduto(id_produto, nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura) {
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
        data_pedido: new Date(data_pedido),
        validade: new Date(validade),
        embalagem,
        unidade_medida,
        temperatura
      }, 
    });
    return produtoAtualizado;
  } 
  catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Erro ao atualizar produto");
  }
}

async function deletarProduto(id_produto) {
  try {
    const produtoDeletado = await prisma.produtos.delete({
      where: { id_produto: parseInt(id_produto) },
    });
    return produtoDeletado;
  }
  catch (error) {
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


export default { registroProduto, atualizarProduto, deletarProduto, getTodosProdutos, getById}