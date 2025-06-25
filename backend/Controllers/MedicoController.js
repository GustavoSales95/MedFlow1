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

  return resp.status(200).json({ message: prontuario, paciente });
});

route.put("/ConsultarProntuarios", async (req, resp) => {
  const {
    paciente_id,
    alergias,
    tipo_sanguineo,
    medicamentos,
    cirurgias,
    doencas_infecciosas,
  } = req.body;

  try {
    const novo_prontuario = await service.editarProntuario(
      paciente_id,
      alergias,
      tipo_sanguineo,
      medicamentos,
      cirurgias,
      doencas_infecciosas
    );

    return resp.status(200).json({ message: novo_prontuario });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: "Ocorreu um erro ao atualizar o prontuário" });
  }
});

route.get("/Agendamentos", async (req, resp) => {
  const { crm } = req.query;

  try {
    const agendamentos = await service.buscarAgenda(crm);

    return resp.status(200).json({ message: agendamentos });
  } catch (error) {
    return resp
      .status(404)
      .json({ error: "Ocorreu um erro ao buscar agendamentos" });
  }
});

route.get("/FinalizarConsulta", async (req, resp) => {
  const { agendamento_id } = req.query;

  try {
    const consulta = await service.buscarConsulta(agendamento_id);

    return resp.status(200).json({ message: consulta });
  } catch (error) {
    return resp
      .status(404)
      .json({ error: "Ocorreu um erro ao buscar a consulta" });
  }
});

route.put("/FinalizarConsulta", async (req, resp) => {
  const { descricao, receita, observacoes, id_consulta, agendamento_id } = req.body;
  try {
    const consulta = await service.editarConsulta(descricao, receita, observacoes, id_consulta, agendamento_id);

    return resp.status(200).json({ message: consulta});

  } catch (error) {
    return resp.status(404).json({ error: "Ocorreu um erro ao finalizar a consulta" });
  }
});
route.post("/CriarReceita", async (req, res) => {
  const { cpf, crm, conteudo, orientacoes } = req.body;

  try {
    const receita = await service.criarReceita(cpf, crm, conteudo, orientacoes);
    return res.status(201).json(receita);
  } catch (error) {
    console.error("Erro ao criar receita:", error.message);
    if (error.message === "Paciente não encontrado.") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Médico não encontrado.") {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});
route.get("/BuscarPacientePorCpf", async (req, res) => {
  const { cpf } = req.query;

  if (!cpf) {
    return res.status(400).json({ error: "CPF não informado" });
  }

  try {
    const paciente = await service.buscarPaciente(cpf);
    if (!paciente) {
      return res.status(404).json({ error: "Paciente não encontrado" });
    }

    return res.status(200).json(paciente);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar paciente." });
  }
});

route.get("/Consulta/:id_consulta", async (req, res) => {
  const { id_consulta } = req.params;

  try {
    const consulta = await service.buscarConsultaId(id_consulta)
    const medico = await service.buscarMedicoId(consulta.agendamentos.medico_id)

    return res.status(200).json({consulta: consulta, medico: medico})
  }  catch (error) {
    return res.status(500).json({ error: "Erro ao buscar consulta." });
  }
})

export default route;
