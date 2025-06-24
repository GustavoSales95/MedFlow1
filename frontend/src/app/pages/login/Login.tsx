import {
  Divider,
  Paper,
  styled,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import React, { FormEvent, useContext, useState } from "react";
import { AppContext } from "../../shared/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Console } from "console";

// Estilo do fundo com imagem
const Background = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundImage: "url('img/back.jpg')",
  backgroundSize: "cover",
  backgroundBlendMode: "darken",
  backgroundColor: "rgba(0,0,0,0.3)",
});

// Centraliza conteúdo na tela
const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

// Estilização do formulário
const LoginPaper = styled(Paper)({
  width: "100%",
  maxWidth: "400px",
  padding: "40px",
  textAlign: "center",
  borderRadius: "10px",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.6)",
});

const InputBox = styled(Box)({
  marginBottom: "15px",
});

export const Login = () => {
  const { logar } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogar = async (e: FormEvent) => {
    e.preventDefault();
    const usuario = await logar(email, senha);
    console.log("Resultado do logar:", usuario);

    if (!usuario) {
      setErro("Email ou senha inválidos");
    }
  };

  return (
    <Background>
      <Container>
       

        <LoginPaper>
          <Typography variant="h4" component="h1" color="textSecondary">
            LOGIN
          </Typography>

          <Divider style={{ margin: "20px 0px" }} />

          <form onSubmit={handleLogar}>
            <InputBox>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputBox>

            <InputBox>
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </InputBox>

            {erro && (
              <Typography color="error" sx={{ mb: 1 }}>
                {erro}
              </Typography>
            )}

            <InputBox>
              <Button variant="outlined" type="submit" fullWidth>
                Entrar
              </Button>
            </InputBox>
          </form>

          <Typography variant="body1" color="textSecondary">
            Se não possuir cadastro, contate o administrador do sistema.
          </Typography>
        </LoginPaper>
      </Container>
    </Background>
  );
};
