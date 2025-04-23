import express from "express";
import service from "../Services/ComumServices.js";

const route = express.Router();

route.post("/Cadastros", async (req, resp) => {
    const { cpf, data_nascimento, telefone, endereco } = req.body;

    await service.criarPacientes( cpf, data_nascimento, telefone, endereco );

    resp.status(201).json(req.body);
});


export default route;