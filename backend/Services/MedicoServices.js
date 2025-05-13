import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function buscarPaciente(cpf) {
  const paciente = await prisma.pacientes.findUnique({
    where: { cpf },
  });

  return paciente;
}

async function buscarProntuario(cpf) {
  const paciente = await buscarPaciente(cpf);

  const prontuario = await prisma.prontuario.findUnique({
    where: { id_paciente: paciente.id_paciente },
  });

  return prontuario;
}

export default { buscarPaciente, buscarProntuario };
