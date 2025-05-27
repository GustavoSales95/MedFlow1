import express from "express";
import { loginService } from "../services/LoginServices.js";
import { generateToken } from "../utils/jwt.js";

const router = express.Router();

router.post("/", async (request, response) => {
  const { email, senha } = request.body;

  try {
    const login = await loginService.login(email, senha);

    if (login.length > 0) {
      const { id_usuario, nome, email, perfil_id } = login[0];

      // Gera o token JWT com dados seguros (sem senha!)
      const token = generateToken({ id: id_usuario, nome, email, perfil_id });

      return response.status(200).send({ token });
    } else {
      return response.status(401).send({ message: "Login inválido" });
    }
  } catch (err) {
    console.error(err);
    return response
      .status(500)
      .send({ message: `Houve um erro na requisição. ${err}` });
  }
});

export default router;
