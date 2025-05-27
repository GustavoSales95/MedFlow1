import express from "express";
import service from "../Services/AdminServices.js";
import bcrypt from "bcryptjs";
const route = express.Router();

route.get("/ConsultarUsuarios", async (req, resp) => {
  const { cpf } = req.query;

  if (!cpf) {
    return resp.status(400).json({ error: "CPF não informado" });
  }

  const usuario = await service.buscarUsuarios(cpf);

  if (!usuario) {
    return resp.status(204).end();
  }
  return resp.status(200).json({ message: usuario });
});

route.post("/CadastrosUsuarios", async (req, resp) => {
  try {
    const {
      nome,
      email,
      senha,
      cpf,
      data_nascimento,
      perfil_id,
      crm,
      especialidade,
      telefone,
    } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    await service.criarUsuarios(
      nome,
      email,
      senhaHash,
      cpf,
      data_nascimento,
      perfil_id
    );

    if (perfil_id === 3) {
      if (!crm || !especialidade || !telefone) {
        return resp.status(400).json({ error: "Dados médicos incompletos" });
      }
      await service.criarMedicos(cpf, crm, especialidade, telefone);
    }

    resp.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    resp.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
});

route.get("/CadastrosUsuarios", async (req, resp) => {
  const { cpf, crm, email } = req.query;

  const usuario = cpf ? await service.buscarUsuarios(cpf) : null;
  const medico = crm ? await service.buscarMedico(crm) : null;
  const usuarioEmail = email ? await service.buscarUsuarioEmail(email) : null;

  if (!usuario && !medico && !usuarioEmail) {
    return resp.status(204).end();
  }

  return resp.status(200).json({ usuario, medico, usuarioEmail });
});

export default route;
