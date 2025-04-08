import{
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard, Login, Marcacao, Cadastros, DashboardAdmin, CadastrosUsuarios} from "../pages";
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
      }
    ]
  },
  
]);
export default router;