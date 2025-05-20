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

  if (!paciente) return null; 

  const prontuario = await prisma.prontuario.findUnique({
    where: { paciente_id: paciente.id_paciente },
  });

  return prontuario;
}

export default { buscarPaciente, buscarProntuario };
