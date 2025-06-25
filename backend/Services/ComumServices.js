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

    await prisma.prontuario.create({
        data: {
            Pacientes: {
                connect: {cpf}
            },
            alergias: "Não informado",
            tipo_sanguineo: "Não informado",
            medicamentos: "Não informado",
            cirurgias: "Não informado",
            doencas_infecciosas: "Não informado"
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

async function buscarMedicos(dia) {
    const medicos = await prisma.escala.findMany({
        where: { [dia]: "Escalado" },
        include: {
            Medico: {
                include: {
                    Usuarios: true,
                    Agendamentos: true
                }
            }
        }
    });

    return medicos
}

async function buscarMedico(crm) {
    const medico = await prisma.medicos.findUnique({
        where: { crm },
        include: { Agendamentos: true}
    });

    return medico
}

async function criarAgendamento(nome_paciente, data_hora, id_paciente, id_medico) {
    const agendamento = await prisma.agendamentos.create({
        data: {
            paciente: {
                connect: { id_paciente } 
            },
            medico: {
                connect: { id_medico }
            },
            nome_paciente,
            data_hora: new Date(data_hora)
        }
    });
    return agendamento;
}

async function criarConsulta(id_agendamento, id_paciente, data_hora) {
    await prisma.consultas.create({
        data: {
            agendamentos: {
                connect: { id_agendamento }
            },
            prontuario: { 
                connect: { paciente_id: id_paciente} 
            },
            descricao: '',
            receita: '',
            observacoes: '',
            data_consulta: new Date(data_hora)
        }
    });
}



export default { criarPacientes, buscarPacienteCpf, buscarPacienteSus, buscarMedicos, buscarMedico, criarAgendamento, criarConsulta }