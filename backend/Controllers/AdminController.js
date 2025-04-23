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
    const { nome, email, senha, cpf, perfil_id, crm, especialidade } = req.body;

    await service.criarUsuarios(nome, email, senha, cpf, perfil_id);

    await service.criarMedicos(cpf, crm, especialidade);

    resp.status(201).json(req.body);
});


export default route;