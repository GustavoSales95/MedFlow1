import express from "express";
import comumController from "./Controllers/ComumController.js";
import adminController from "./Controllers/AdminController.js";
import medicoController from "./Controllers/MedicoController.js";
import loginController from "./Controllers/LoginController.js";
import estoqueController from "./Controllers/EstoqueController.js";
const routes = express();

routes.use("/Comum", comumController);
routes.use("/Admin", adminController);
routes.use("/Medico", medicoController);
routes.use("/login", loginController);
routes.use("/Estoque", estoqueController)

export default routes;
