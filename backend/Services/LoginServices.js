import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const loginService = {
  login: async (email, senha) => {
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
      include: { Medicos: true },
    });

    if (!usuario) {
      console.log("Usuário não encontrado");
      return [];
    }

    console.log("Usuário encontrado:", usuario);

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    console.log("Senha válida?", senhaValida);

    if (!senhaValida) {
      return [];
    }

    return [
      {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        perfil_id: usuario.perfil_id,
        crm: usuario.Medicos?.crm || null,
      },
    ];
  },
};
