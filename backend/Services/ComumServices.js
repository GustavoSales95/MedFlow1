import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function criarPacientes(cpf, data_nascimento, telefone, endereco) {
    await prisma.pacientes.create({
        data: {
            cpf,
            data_nascimento: new Date(data_nascimento),
            telefone,
            endereco
        }
    });
}

export default { criarPacientes }