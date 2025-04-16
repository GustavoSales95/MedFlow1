import{
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard, Login, Marcacao, Cadastros, DashboardAdmin, CadastrosUsuarios, ConsultarUsuarios, ConsultarPessoas} from "../pages";
// import admin

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/",
        element: <Marcacao></Marcacao>,
      },
      {
        path: "/cadastros",
        element: <Cadastros></Cadastros>,
      },
      {
        path: "/ConsultarPessoas",
        element: <ConsultarPessoas></ConsultarPessoas>
      }
    ]
  }, 
  {
    path: "/Login",
    element: <Login></Login>
  },
  {
    path: "/Admin",
    element: <DashboardAdmin></DashboardAdmin>,
    children: [
      {
        path: "/Admin/CadastrosUsuarios",
        element: <CadastrosUsuarios></CadastrosUsuarios>
      },
      {
        path: "/Admin/ConsultarUsuarios",
        element: <ConsultarUsuarios></ConsultarUsuarios>
      }
    ]
  },
  
]);
export default router;