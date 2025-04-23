import { createContext, ReactNode, useState } from 'react';
type Usuario = {
  userName: string,
  idUser: Number,
  token: string,
  typeUser: string
}
type AppContextData = {
  usuario: Usuario | undefined,
  logado: boolean,
  logar:(email: string, password: string)=>Promise<string|null>,
  deslogar:()=> void,
}
type AppProviderData = {
  children: ReactNode
}
export const AppProvider = ({children}: AppProviderData)=>{
  const [usuario, setUsuario] = useState<Usuario>();
  
  
  const logado = Boolean(usuario);                          /*verificação para ver se o usuário esta logado*/
  
  
  const logar = async (email:string, senha: string)=>{               /*Função criada para logar o usuário*/
      alert("Chamou a função logar");
      return (null)
  
    }
  const deslogar = ()=>{
      alert("Você foi desconectado");
      return(null)
  
  }
  
  return(
    <AppContext.Provider value= {{logar,deslogar,logado,usuario /*valores passados para a aplicação*/ }}>
      {children}
    </AppContext.Provider>
  )
}
export const AppContext = createContext({} as AppContextData)
