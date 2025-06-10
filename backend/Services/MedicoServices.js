import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buscarPaciente(cpf) {
  const paciente = await prisma.pacientes.findUnique({
    where: { cpf },
  });

  return paciente;
}

async function buscarMedico(crm) {
  const medico = await prisma.medicos.findUnique({
    where: { crm },
  });

  return medico;
}

async function buscarProntuario(cpf) {
  const paciente = await buscarPaciente(cpf);

  if (!paciente) return null;

  const prontuario = await prisma.prontuario.findUnique({
    where: { paciente_id: paciente.id_paciente },
  });

  return prontuario;
}

async function editarProntuario(
  paciente_id,
  alergias,
  tipo_sanguineo,
  medicamentos,
  cirurgias,
  doencas_infecciosas
) {
  return await prisma.prontuario.update({
    where: { paciente_id },
    data: {
      alergias,
      tipo_sanguineo,
      medicamentos,
      cirurgias,
      doencas_infecciosas,
    },
  });
}

async function buscarAgenda(crm) {
  const medico = await buscarMedico(crm);

  if (!medico) return null;

  const agendamentos = await prisma.agendamentos.findMany({
    where: { medico_id: medico.id_medico },
    include: { Consultas: true },
  });

  return agendamentos;
}

async function buscarConsulta(agendamento_id) {
  const id = Number(agendamento_id);

  const consulta = await prisma.consultas.findUnique({
    where: { agendamento_id: id },
    include: { agendamentos: true },
  });
  return consulta;
}

async function editarConsulta(descricao, receita, observacoes, id_consulta) {
  const consulta_editada = await prisma.consultas.update({
    where: { id_consulta },
    data: {
      descricao,
      receita,
      observacoes,
    },
  });

  const id_agendamento = consulta_editada.agendamento_id;
  const agendamento_editado = await prisma.agendamentos.update({
    where: { id_agendamento },
    data: {
      status: "Concluído",
    },
  });
  return { consulta_editada, agendamento_editado };
}

export async function criarReceita(cpf, crm, conteudo, orientacoes) {
  // Normalizar os dados para remover caracteres não numéricos ou espaços
  const cpfFormatado = cpf.replace(/\D/g, "").trim();
  const crmFormatado = crm.trim();

  // Buscar paciente pelo CPF formatado
  const paciente = await prisma.pacientes.findUnique({
    where: { cpf: cpfFormatado },
  });
  if (!paciente) {
    throw new Error("Paciente não encontrado.");
  }

  // Buscar médico pelo CRM formatado
  const medico = await prisma.medicos.findUnique({
    where: { crm: crmFormatado },
  });
  if (!medico) {
    throw new Error("Médico não encontrado.");
  }

  // Criar receita
  const receita = await prisma.receitas.create({
    data: {
      medico_id: medico.id_medico,
      paciente_id: paciente.id_paciente,
      data_emissao: new Date(),
      medicamentos: conteudo,
      orientacoes: orientacoes || "",
      produto_id: 1,
    },
  });
  return receita;
}
export default {
  criarReceita,
  buscarPaciente,
  buscarMedico,
  buscarProntuario,
  editarProntuario,
  buscarAgenda,
  buscarConsulta,
  editarConsulta,
};
