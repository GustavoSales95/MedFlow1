import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function criarPacientes( nome, data_nascimento, telefone, cep, endereco, cpf, cartao_sus ) {
    await prisma.pacientes.create({
        data: {
            nome,
            data_nascimento: new Date(data_nascimento),
            telefone,
            cep,
            endereco,
            cpf, 
            cartao_sus
        }
    });
}

async function buscarPacienteCpf( cpf ) {
    const paciente = await prisma.pacientes.findUnique({
        where: { cpf }
    });

    return paciente
}

async function buscarPacienteSus( cartao_sus ) {
    const paciente = await prisma.pacientes.findUnique({
        where: { cartao_sus }
    });

    return paciente
}

export default { criarPacientes, buscarPacienteCpf, buscarPacienteSus }