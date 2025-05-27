import express from "express";
import service from "../Services/ComumServices.js";

const route = express.Router();

route.post("/Cadastros", async (req, resp) => {
    const { nome, data_nascimento, telefone, cep, endereco, cpf, cartao_sus } = req.body;

    await service.criarPacientes( nome, data_nascimento, telefone, cep, endereco, cpf, cartao_sus );

    resp.status(201).json(req.body);
});

route.get("/Cadastros", async (req, resp) => {
    const { cpf, cartao_sus } = req.query;

    const pacienteCpf = cpf ? await service.buscarPacienteCpf(cpf) : null;
    const pacienteSus = cartao_sus ? await service.buscarPacienteSus(cartao_sus) : null;

    if( !pacienteCpf && !pacienteSus) {
        return resp.status(204).end();
    }

    return resp.status(200).json({ pacienteCpf, pacienteSus });
});

route.get("/ConsultarPessoas", async (req, resp) => {
    const { cpf } = req.query;

    if (!cpf) {
        return resp.status(400).json({ error: "CPF não informado" });
    }

    const paciente = await service.buscarPacienteCpf(cpf);

    if (!paciente) {
        return resp.status(204).end();
    }
    return resp.status(200).json({ message: paciente });
});


export default route;