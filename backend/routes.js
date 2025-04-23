import express from "express";
import comumController from "./Controllers/ComumController.js";
import adminController from "./Controllers/AdminController.js";

const routes = express();

routes.use("/",comumController)
routes.use("/Admin", adminController);


export default routes;