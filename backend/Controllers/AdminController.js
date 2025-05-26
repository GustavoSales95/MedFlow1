import express from "express";
import service from "../Services/AdminServices.js";

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
    let { nome, email, senha, cpf, data_nascimento, id_perfis, crm, especialidade, telefone } = req.body;
    id_perfis = parseInt(id_perfis);

    if (id_perfis == 3) {
        await service.criarUsuarios(nome, email, senha, cpf, data_nascimento, id_perfis);

        await service.criarMedicos(cpf, crm, especialidade, telefone);

        resp.status(201).json(req.body);
    }

    await service.criarUsuarios(nome, email, senha, cpf, data_nascimento, id_perfis);

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


export default route;