import React, { createContext, useState, ReactNode, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Defina seus tipos aqui
type Usuario = {
  userName: string;
  idUser: number;
  token: string;
  typeUser: string;
};

type AppContextData = {
  usuario?: Usuario;
  logado: boolean;
  logar: (email: string, senha: string) => Promise<Usuario | null>;
  deslogar: () => void;
};

type AppProviderData = {
  children: ReactNode;
};

export const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider = ({ children }: AppProviderData) => {
  const [usuario, setUsuario] = useState<Usuario | undefined>();
  const logado = Boolean(usuario);
  const navigate = useNavigate();

  const logar = async (
    email: string,
    senha: string
  ): Promise<Usuario | null> => {
    try {
      const response = await axios.post("http://localhost:3333/login", {
        email,
        senha,
      });

      if (response.data?.token) {
        const decoded: any = jwtDecode(response.data.token);
        console.log("Usuário logado:", decoded);

        const perfilMap: Record<number, string> = {
          1: "admin",
          2: "comum",
          3: "medico",
          4: "estoque",
        };

        const typeUser = perfilMap[decoded.perfil_id] || "comum";

        const user: Usuario = {
          idUser: decoded.id,
          userName: decoded.nome,
          token: response.data.token,
          typeUser,
        };

        setUsuario(user);

        // Redirecionar depois do login
        if (typeUser === "admin") navigate("/Admin");
        else if (typeUser === "medico") navigate("/Medico");
        else if (typeUser === "comum") navigate("/Comum");
        else if (typeUser === "estoque") navigate("/Estoque");
        else navigate("/");

        return user;
      }

      alert("Email ou senha inválidos");
      return null;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login");
      return null;
    }
  };

  const deslogar = () => {
    setUsuario(undefined);
    navigate("/");
  };

  return (
    <AppContext.Provider value={{ logar, deslogar, logado, usuario }}>
      {children}
    </AppContext.Provider>
  );
};
