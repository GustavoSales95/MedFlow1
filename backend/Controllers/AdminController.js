import express from "express";
import service from "../Services/AdminServices.js";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const route = express.Router();

// GET: Consultar usuários por CPF
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

// POST: Cadastro de usuários (admin, comum, médico)
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

    async function criarUsuarios(
      nome,
      email,
      senhaHash,
      cpf,
      data_nascimento,
      perfil_id
    ) {
      await prisma.usuarios.create({
        data: {
          nome,
          email,
          senha: senhaHash, // aqui passa o hash
          cpf,
          data_nascimento: new Date(data_nascimento).toISOString(),
          perfil: {
            connect: { id_perfis: perfil_id },
          },
        },
      });
    }

    // chama a função para criar o usuário
    await criarUsuarios(
      nome,
      email,
      senhaHash,
      cpf,
      data_nascimento,
      perfil_id
    );

    // se for médico, cria entrada na tabela médicos
    if (perfil_id === 3) {
      if (!crm || !especialidade || !telefone) {
        return resp
          .status(400)
          .json({ error: "Dados médicos incompletos para perfil médico" });
      }

      await service.criarMedicos(cpf, crm, especialidade, telefone);
    }

    return resp.status(201).json({ message: "Usuário criado com sucesso" });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    return resp
      .status(500)
      .json({ error: err.message || "Erro ao cadastrar usuário" });
  }
});

// GET: Verificações de CPF/CRM/Email
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
