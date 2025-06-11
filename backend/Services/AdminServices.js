import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Funções para garantir que os diferentes tipos de busca retornem o mesmo padrão JSON, assim evitando erros ao puxar os elementos no front-end
function normalizeUsuario(usuario) {
  if (!usuario) return null;

  return {
    id_usuario: usuario.id_usuario,
    nome: usuario.nome,
    email: usuario.email,
    cpf: usuario.cpf,
    data_nascimento: usuario.data_nascimento,
    data_Cadastro: usuario.data_Cadastro,
    perfil: usuario.perfil,
    medico: usuario.Medicos
      ? {
          id_medico: usuario.Medicos.id_medico,
          crm: usuario.Medicos.crm,
          especialidade: usuario.Medicos.especialidade,
          telefone: usuario.Medicos.telefone,
          escala: usuario.Medicos.Escala || null,
        }
      : null,
  };
}

function normalizeMedico(medico) {
  if (!medico) return null;

  return {
    id_usuario: medico.Usuarios.id_usuario,
    nome: medico.Usuarios.nome,
    email: medico.Usuarios.email,
    cpf: medico.Usuarios.cpf,
    data_nascimento: medico.Usuarios.data_nascimento,
    data_Cadastro: medico.Usuarios.data_Cadastro,
    perfil: null,
    medico: {
      id_medico: medico.id_medico,
      crm: medico.crm,
      especialidade: medico.especialidade,
      telefone: medico.telefone,
      escala: medico.Escala || null,
    },
  };
}

function normalizeEscala(escala) {
  const usuario = escala.Medico?.Usuarios;

  return {
    id_usuario: usuario ? usuario.id_usuario : null,
    nome: usuario ? usuario.nome : null,
    cpf: usuario ? usuario.cpf : null,
    medico: escala.Medico
      ? {
          id_medico: escala.Medico.id_medico,
          crm: escala.Medico.crm,
          escala: {
            id_escala: escala.id_escala,
            id_medico: escala.id_medico,
            segunda: escala.segunda,
            segunda_horario: escala.segunda_horario,
            terca: escala.terca,
            terca_horario: escala.terca_horario,
            quarta: escala.quarta,
            quarta_horario: escala.quarta_horario,
            quinta: escala.quinta,
            quinta_horario: escala.quinta_horario,
            sexta: escala.sexta,
            sexta_horario: escala.sexta_horario,
            sabado: escala.sabado,
            sabado_horario: escala.sabado_horario,
            domingo: escala.domingo,
            domingo_horario: escala.domingo_horario,
          },
        }
      : null,
  };
}

async function buscarUsuarios(cpf) {
  const usuario = await prisma.usuarios.findUnique({
    where: { cpf },
    include: {
      perfil: {
        select: { tipo: true },
      },
      Medicos: {
        include: {
          Escala: true,
        },
      },
    },
  });

  return normalizeUsuario(usuario);
}

async function buscarUsuarioEmail(email) {
  const usuario = await prisma.usuarios.findUnique({
    where: { email },
  });
  return usuario;
}

async function buscarMedico(crm) {
  const medico = await prisma.medicos.findUnique({
    where: { crm },
    include: {
      Usuarios: true,
      Escala: true,
    },
  });
  return normalizeMedico(medico);
}

async function buscarEscalas(dia) {
  const diasValidos = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
    "domingo",
  ];
  if (!diasValidos.includes(dia)) {
    throw new Error(
      "Dia inválido. Use valores válidos, por exemplo: 'segunda', 'terca', etc."
    );
  }

  const escalas = await prisma.escala.findMany({
    where: {
      [dia]: "Escalado",
    },
    include: {
      Medico: {
        include: {
          Usuarios: true,
        },
      },
    },
  });

  // Normaliza cada registro com base no dia informado
  return escalas.map((escala) => normalizeEscala(escala, dia));
}

async function criarUsuarios(
  nome,
  email,
  senha,
  cpf,
  data_nascimento,
  id_perfis
) {
  await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha,
      cpf,
      data_nascimento: new Date(data_nascimento).toISOString(),
      perfil: {
        connect: { id_perfis },
      },
    },
  });
}

async function criarMedicos(cpf, crm, especialidade, telefone) {
  await prisma.medicos.create({
    data: {
      Usuarios: {
        connect: { cpf },
      },
      crm,
      especialidade,
      telefone,
    },
  });
}

async function criarEscala(
  crm,
  segunda,
  terca,
  quarta,
  quinta,
  sexta,
  sabado,
  domingo
) {
  await prisma.escala.create({
    data: {
      Medico: {
        connect: { crm },
      },
      segunda,
      terca,
      quarta,
      quinta,
      sexta,
      sabado,
      domingo,
    },
  });
}

async function editarEscala(
  segunda,
  terca,
  quarta,
  quinta,
  sexta,
  sabado,
  domingo,
  segunda_horario,
  terca_horario,
  quarta_horario,
  quinta_horario,
  sexta_horario,
  sabado_horario,
  domingo_horario,
  id_medico
) {
  return await prisma.escala.update({
    where: { id_medico },
    data: {
      segunda,
      segunda_horario,
      terca,
      terca_horario,
      quarta,
      quarta_horario,
      quinta,
      quinta_horario,
      sexta,
      sexta_horario,
      sabado,
      sabado_horario,
      domingo,
      domingo_horario,
    },
  });
}

export default {
  buscarUsuarios,
  buscarMedico,
  buscarEscalas,
  criarUsuarios,
  criarMedicos,
  buscarUsuarioEmail,
  criarEscala,
  editarEscala,
};
