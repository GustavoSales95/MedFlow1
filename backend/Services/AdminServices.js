import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buscarUsuarios(cpf) {
    const usuario = await prisma.usuarios.findUnique({
        where: { cpf },
        include: {
            perfil: {
                select: {
                    tipo: true
                }
            }
        }
    });

    return usuario;
}

async function buscarUsuarioEmail(email) {
    const usuario = await prisma.usuarios.findUnique({
        where: { email }
    });
    return usuario;
}

async function buscarMedico(crm) {
    const usuario = await prisma.medicos.findUnique({
        where: { crm }
    });

    return usuario;
}

async function criarUsuarios(nome, email, senha, cpf, data_nascimento, id_perfis) {
    await prisma.usuarios.create({
        data: {
            nome,
            email,
            senha,
            cpf,
            data_nascimento: new Date(data_nascimento).toISOString(),
            perfil: {
                connect: { id_perfis } 
            }


        }
    });
}

async function criarMedicos(cpf, crm, especialidade, telefone) {
    await prisma.medicos.create({
        data: {
            Usuarios: {
                connect: { cpf } 
            },
            crm,
            especialidade, 
            telefone
        }
    });
}

export default { buscarUsuarios, buscarMedico, criarUsuarios, criarMedicos, buscarUsuarioEmail };