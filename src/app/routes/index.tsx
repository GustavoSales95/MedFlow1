import{
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard, Login, Marcacao, Cadastros } from "../pages";
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
]);
export default router;