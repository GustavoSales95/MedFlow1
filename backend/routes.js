import express from "express";
import comumController from "./Controllers/ComumController.js";
import adminController from "./Controllers/AdminController.js";
import medicoController from "./Controllers/MedicoController.js";
import produtoController from "./Controllers/ProdutoController.js";

const routes = express();

routes.use("/", comumController)
routes.use("/Admin", adminController);
routes.use("/Medico", medicoController);
routes.use ("/Produto", produtoController);

export default routes;