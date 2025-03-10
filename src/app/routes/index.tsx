import{
  createBrowserRouter,
} from "react-router-dom";
import { Dashboard, Login } from "../pages";
const router = createBrowserRouter ([
  {
    path: "/",
    element: <Dashboard></Dashboard>,
  }, 
  {
    path: "/Login",
    element: <Login></Login>
  },
]);
export default router;