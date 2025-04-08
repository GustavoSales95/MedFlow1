import {
  Divider,
  Paper,
  styled,
  Typography,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Link
} from "@mui/material";
import React, { FormEvent, useContext, useState } from "react";
import { AppContext } from '../../shared/contexts/AppContext';
import logo from '../images/logosfbranca.png';
import illustration from '../images/relatorio.png';
import './login.css'

const Background = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: 'linear-gradient(135deg, #0d99ff 0%,#031d8c 100%)',
});

const Container = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
});

const LoginPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '10px',
  overflow: 'hidden',
  width: '900px',
  height: '500px',
  boxShadow: '30px 20px 40px rgba(0,0,0,.2)',
});

const LoginLeft = styled(Box)({
  flex: 1,
  background: 'linear-gradient(135deg, #1CB5E0, #000046)',
  color: '#fff',
  padding: '60px 40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const LoginRight = styled(Box)({
  flex: 1,
  backgroundColor: '#fff',
  padding: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Illustration = styled('img')({
  maxWidth: '100%',
  height: 'auto',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  '& input': {
    textAlign: 'center',
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: '#28d78c',
  color: 'white',
  padding: '12px 0',
  borderRadius: '10px',
  fontSize: '1rem',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#22bb78',
  },
});

const InputBox = styled(Box)({
  marginBottom: '20px',
  width: '100%',
});

export const Login = () => {
  const { logar } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogar = async (e: FormEvent) => {
    e.preventDefault();
    await logar(email, senha);
  };

  return (
    <Background>
      <Container>
        <LoginPaper>
          <LoginLeft>
            <Typography variant="h4" gutterBottom></Typography>
            <img 
            src = {logo} 
            alt = 'logo'
            className='logotipo'
            ></img> 
            <form onSubmit={handleLogar}>
  <InputBox>
    <StyledTextField
      id="email"
      placeholder="Usuario"
      type="email"
      variant="outlined"
      fullWidth
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
      }}
    />
  </InputBox>
  <InputBox>
    <StyledTextField
      id="senha"
      placeholder="Senha"
      type="password"
      variant="outlined"
      fullWidth
      value={senha}
      onChange={(e) => {
        setSenha(e.target.value);
      }}
    />
  </InputBox>
  <InputBox>
    <SubmitButton variant="contained" type="submit" fullWidth>
     Entrar
        </SubmitButton>
  </InputBox>
</form>

          </LoginLeft>
          <LoginRight>
            <Illustration src={illustration} alt="Login Illustration" />
          </LoginRight>
        </LoginPaper>
      </Container>
    </Background>
  );
};