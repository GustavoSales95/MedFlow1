import { createBrowserRouter } from "react-router-dom";
import React from "react";
import {
  Dashboard,
  Login,
  Marcacao,
  Cadastros,
  DashboardAdmin,
  CadastrosUsuarios,
  ConsultarUsuarios,
  ConsultarPessoas,
  ConsultarProntuario,
  DashboardMedico,
  AgendaDia,
  Editar,
  Estoque,
  Entrada
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/Estoque",
    element: <Estoque/>,
    children:[
      {
        path: "Estoque/entrada",
        element: <Entrada></Entrada>,
      },
      {
        path: "Estoque/editar",
        element: <Editar></Editar>,
      },
    ],
  },
  {
    path: "/Comum",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "Comum/",
        element: <Marcacao></Marcacao>,
      },
      {
        path: "Comum/cadastros",
        element: <Cadastros></Cadastros>,
      },
      {
        path: "Comum/ConsultarPessoas",
        element: <ConsultarPessoas></ConsultarPessoas>,
      },
    ],
  },
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/Admin",
    element: <DashboardAdmin></DashboardAdmin>,
    children: [
      {
        path: "/Admin/CadastrosUsuarios",
        element: <CadastrosUsuarios></CadastrosUsuarios>,
      },
      {
        path: "/Admin/ConsultarUsuarios",
        element: <ConsultarUsuarios></ConsultarUsuarios>,
      },
    ],
  },
  {
    path: "/Medico",
    element: <DashboardMedico></DashboardMedico>,
    children: [
      {
        path: "/Medico/ConsultarProntuarios",
        element: <ConsultarProntuario></ConsultarProntuario>,
      },
      {
        path: "/Medico/AgendaDia",
        element: <AgendaDia></AgendaDia>,
      },
    ],
  },
]);
export default router;
