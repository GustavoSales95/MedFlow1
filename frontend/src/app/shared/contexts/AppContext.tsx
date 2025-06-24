import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Tipagem do usuário
type Usuario = {
  userName: string;
  idUser: number;
  token: string;
  typeUser: string;
  crm?: string;
};

// Tipagem do contexto
type AppContextData = {
  usuario?: Usuario;
  logado: boolean;
  carregando: boolean;
  logar: (email: string, senha: string) => Promise<Usuario | null>;
  deslogar: () => void;
};

// Tipagem do provedor
type AppProviderData = {
  children: ReactNode;
};

// Criação do contexto
export const AppContext = createContext<AppContextData>({} as AppContextData);

// Provedor
export const AppProvider = ({ children }: AppProviderData) => {
  const [usuario, setUsuario] = useState<Usuario | undefined>(undefined);
  const [carregando, setCarregando] = useState(true);
  const logado = Boolean(usuario);
  const navigate = useNavigate();

  // Função para login
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
          crm: decoded.crm,
        };

        setUsuario(user);
        localStorage.setItem("token", response.data.token);

        // Redirecionar após login
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

  // Função para logout
  const deslogar = () => {
    localStorage.removeItem("token");
    setUsuario(undefined);
    navigate("/");
  };

  // Restaurar login ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        const agora = Date.now() / 1000;
        if (decoded.exp && decoded.exp < agora) {
          // Token expirado
          console.warn("Token expirado, removendo...");
          localStorage.removeItem("token");
          setUsuario(undefined);
        } else {
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
            token,
            typeUser,
            crm: decoded.crm,
          };

          setUsuario(user);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        setUsuario(undefined);
      }
    }

    setCarregando(false);
  }, []);

  if (carregando) {
    // Enquanto carrega o usuário, pode mostrar um loader ou nada
    return <div>Carregando...</div>;
  }

  return (
    <AppContext.Provider
      value={{ logar, deslogar, logado, usuario, carregando }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook para uso do contexto
export const useAppContext = () => useContext(AppContext);
