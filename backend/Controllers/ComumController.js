import express from "express";
import service from "../Services/ComumServices.js";

const route = express.Router();

route.post("/Cadastros", async (req, resp) => {
    const { nome, data_nascimento, telefone, cep, endereco, cpf, cartao_sus } = req.body;

    await service.criarPacientes( nome, data_nascimento, telefone, cep, endereco, cpf, cartao_sus );

    return resp.status(201).json(req.body);
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

route.get("/MedicosDisponiveis", async (req, resp) => {
    const { dia } = req.query;

    try {
        const medicos = await service.buscarMedicos(dia);

        return resp.status(200).json({ message: medicos});
    } catch (error) {
        return resp.status(400).json({ error: "Ocorreu um erro ao buscar os medicos" });
    }    
});

route.post("/", async (req, resp) => {
    const { nome_paciente, data_hora, cpf, crm } = req.body;
    try {
        const paciente = await service.buscarPacienteCpf(cpf);
        const id_paciente = paciente.id_paciente;

        const medico = await service.buscarMedico(crm);
        const id_medico = medico.id_medico; 

        const agendamento = await service.criarAgendamento(nome_paciente, data_hora, id_paciente, id_medico);
        const id_agendamento = agendamento.id_agendamento;

        await service.criarConsulta(id_agendamento, id_paciente, data_hora);

        return resp.status(201).json({ message: "Agendamento cadastrado com sucesso." });
    } catch (error) {
        console.error(error);
        return resp.status(400).json({ error: "Ocorreu um erro ao cadastrar o agendamento" });
    }
});

route.get("/", async (req, resp) => {
    const { cpf, crm } = req.query;

    const paciente = await service.buscarPacienteCpf(cpf);
    const medico = await service.buscarMedico(crm);

    return resp.status(200).json({medico, paciente});
});


export default route;