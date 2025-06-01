import express from "express";
import service from "../Services/MedicoServices.js";

const route = express.Router();

route.get("/ConsultarProntuarios", async (req, resp) => {
  const { cpf } = req.query;

  if (!cpf) {
    return resp.status(400).json({ error: "CPF não informado" });
  }

  const paciente = await service.buscarPaciente(cpf);

  const prontuario = await service.buscarProntuario(cpf);

  if (!prontuario) {
    return resp.status(404).json({ error: "Paciente não possui prontuário" });
  }

  return resp.status(200).json({ message: prontuario, paciente});
});

route.put("/ConsultarProntuarios", async (req, resp) => {
  const { paciente_id, alergias, tipo_sanguineo, medicamentos, cirurgias, doencas_infecciosas } = req.body;

  try {
    const novo_prontuario = await service.editarProntuario(paciente_id, alergias, tipo_sanguineo, medicamentos, cirurgias, doencas_infecciosas);

    return resp.status(200).json({ message: novo_prontuario });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: "Ocorreu um erro ao atualizar o prontuário" });
  }
});

export default route;
