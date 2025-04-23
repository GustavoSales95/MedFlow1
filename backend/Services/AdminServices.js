import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buscarUsuarios(cpf) {
    const usuario = await prisma.usuarios.findUnique({
        where: { cpf },
    });

    return usuario;
}

async function criarUsuarios(nome, email, senha, cpf, perfil_id) {
    await prisma.usuarios.create({
        data: {
            nome,
            email,
            senha,
            cpf,
            perfil_id
        }
    });
}

async function criarMedicos(cpf, crm, especialidade) {
    await prisma.medicos.create({
        data: {
            Usuarios: {
                connect: { cpf } 
            },
            crm: crm,
            especialidade: especialidade
        }
    });
}

export default { buscarUsuarios, criarUsuarios, criarMedicos };