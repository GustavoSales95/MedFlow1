import express, { request, response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from 'cors';
import dotenv from 'dotenv'; // Se estiver usando ES6 modules




dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env
// console.log(process.env.DATABASE_URL);  Verifica se a variável de ambiente está sendo lida corretamente


const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors())


app.get('/', async (request, response) => {

    const consulta = await prisma.consulta.findMany();

    response.status(200).json(consulta);
});

app.post('/', async (request, response) => {

    await prisma.consulta.create({
        data: {
            nome: request.body.nome,
            data: request.body.data,
            horario: request.body.hora,
            cpf: request.body.cpf,
            cartao_sus: request.body.sus
        }
    });

    response.status(201).json(request.body);
});

app.put('/:id', async (request, response) => {

    await prisma.consulta.update({
        where: {
            id_consulta: parseInt(request.params.id)
        },
        data: {
            nome: request.body.nome,
            horario: request.body.horario,
            cpf: request.body.cpf,
            cartao_sus: request.body.cartao_sus
        }
    });

    response.status(201).json(request.body);
});

app.delete('/:id', async (request, response) => {

    await prisma.consulta.delete({
        where: {
            id_consulta: parseInt(request.params.id)
        }
    });

    response.status(200).json({message: "Consulta deletado com sucesso"})
});

app.listen(3333);