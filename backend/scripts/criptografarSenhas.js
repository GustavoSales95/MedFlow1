import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function criptografarSenhas() {
  const usuarios = await prisma.usuarios.findMany();

  for (const usuario of usuarios) {
    // Verifica se a senha já está criptografada
    if (!usuario.senha.startsWith("$2a$")) {
      const hash = await bcrypt.hash(usuario.senha, 10);
      await prisma.usuarios.update({
        where: { id_usuario: usuario.id_usuario },
        data: { senha: hash },
      });
      console.log(`Senha do usuário ${usuario.email} atualizada!`);
    }
  }
  console.log("Todas as senhas foram atualizadas!");
}

criptografarSenhas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
