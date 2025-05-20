import pkg from '@prisma/client';
const { PrismaClient, Temperatura } = pkg;

const prisma = new PrismaClient();


async function registroProduto(nome, valor, fornecedor, data_pedido, validade, embalagem, unidade_medida, temperatura) {

    if (!temperatura) {
       throw new Error('Temperatura inválida ou não fornecida.');
    }
    
    const temperaturaUpper = temperatura.toUpperCase();

    const temperaturasValidas = ['PERECIVEL', 'RESFRIADO', 'TERMOSSENSIVEL'];
    if (!temperaturasValidas.includes(temperaturaUpper)) {
      throw new Error('Temperatura inválida ou não fornecida.');
    }

    await prisma.estoque_produto.create({
      data: {
            nome,
            valor,
            fornecedor,
            data_pedido: new Date(data_pedido),
            validade: new Date(validade),
            embalagem,
            unidade_medida,
            temperatura: Temperatura[temperaturaUpper]
        }
    });
}


async function atualizarProduto(id_produto, dadosAtualizados) {
try {
    const id = parseInt(id_produto);
    if (isNaN(id)) {
      throw new Error("ID do produto inválido.");
    }

    if ('id_produto' in dadosAtualizados) {
      delete dadosAtualizados.id_produto;
    }

    const produtoAtualizado = await prisma.estoque_produto.update({
      where: { id_produto: id },
      data: dadosAtualizados, 
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
    const produtoDeletado = await prisma.estoque_produto.delete({
      where: { id_produto: parseInt(id_produto) },
    });
    return produtoDeletado;
  }
  catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw new Error("Erro ao deletar produto");
  }
}

async function getTodosProdutos() {
try {
    const produtos = await prisma.estoque_produto.findMany();
    return produtos;
  } catch (error) {  
    console.error("Erro ao buscar produtos:", error);
    throw new Error("Erro ao buscar produtos");
  }
}

async function getById(id_produto) {
  try {
    const id = parseInt(id_produto);

    if (isNaN(id)) {
      throw new Error("ID inválido");
    }

    const produto = await prisma.estoque_produto.findUnique({
      where: { id_produto: id }, 
    });

    return produto;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw new Error("Erro ao buscar produto");
  }
}


export default { registroProduto, atualizarProduto, deletarProduto, getTodosProdutos, getById}