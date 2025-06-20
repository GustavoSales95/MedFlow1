import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import routes from "./routes.js";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(3333, () => {
  console.log("servidor rodando na porta 3333");
});
