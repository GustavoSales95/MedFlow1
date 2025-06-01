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
  let {
    nome,
    email,
    senha,
    cpf,
    data_nascimento,
    id_perfis,
    crm,
    especialidade,
    telefone,
    segunda,
    terca,
    quarta,
    quinta,
    sexta,
    sabado,
    domingo,
  } = req.body;
  id_perfis = parseInt(id_perfis);

  const senhaCriptografada = await bcrypt.hash(senha, 10); // 10 salt rounds

  // 👇 Substituindo a senha original pela criptografada
  senha = senhaCriptografada;

  if (id_perfis == 3) {
    await service.criarUsuarios(
      nome,
      email,
      senha,
      cpf,
      data_nascimento,
      id_perfis
    );

    await service.criarMedicos(cpf, crm, especialidade, telefone);

    await service.criarEscala(
      crm,
      segunda,
      terca,
      quarta,
      quinta,
      sexta,
      sabado,
      domingo
    );

    resp.status(201).json(req.body);
  }

  await service.criarUsuarios(
    nome,
    email,
    senha,
    cpf,
    data_nascimento,
    id_perfis
  );

  resp.status(201).json(req.body);
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

route.get("/EditarEscala", async (req, resp) => {
  const { cpf, crm, dia } = req.query;

  if (cpf) {
    const user = await service.buscarUsuarios(cpf);

    return resp.status(200).json({ message: user });
  }

  if (crm) {
    const user = await service.buscarMedico(crm);

    return resp.status(200).json({ message: user });
  }

  if (dia) {
    const users = await service.buscarEscalas(dia);

    return resp.status(200).json({ message: users });
  }

  return resp
    .status(400)
    .json({ error: "Um dos parâmetros (cpf, crm ou dia) é necessário." });
});

route.put("/EditarEscala", async (req, resp) => {
  const {
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
    id_medico,
  } = req.body;

  try {
    const nova_escala = await service.editarEscala(
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
    );

    return resp.status(200).json({ message: nova_escala });
  } catch (error) {
    return resp.status(400).json({ error: "Ocorreu um erro ao atualizar a escala" });
  }
});

export default route;
