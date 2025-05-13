import express from "express";
import service from "../Services/MedicoServices.js";

const route = express.Router();

route.get("/ConsultarProntuarios", async (req, resp) => {
  const { cpf } = req.query;

  if (!cpf) {
    return resp.status(400).json({ error: "CPF não informado" });
  }

  const prontuario = await service.buscarProntuario(cpf);

  if (!prontuario) {
    return resp.status(204).json({ error: "Paciente não possui prontuário" });
  }

  return resp.status(200).json({ message: prontuario });
});

export default route;
