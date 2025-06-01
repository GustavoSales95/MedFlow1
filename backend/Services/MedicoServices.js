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

async function editarProntuario( paciente_id, alergias, tipo_sanguineo, medicamentos, cirurgias, doencas_infecciosas ) {
  return await prisma.prontuario.update({
    where: { paciente_id },
    data: {
      alergias,
      tipo_sanguineo,
      medicamentos,
      cirurgias,
      doencas_infecciosas
    }
  }); 
}

export default { buscarPaciente, buscarProntuario, editarProntuario };
