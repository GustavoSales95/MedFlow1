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
} from "../pages";
//Import de medico
import { 
  ConsultarProntuario, 
  DashboardMedico,
  AgendaDia

} from '../pages';


// Import de Estoque
import { Editar } from "../pages/editar/editar";
import { Estoque } from "../pages/Estoque/Estoque";
import { Entrada } from "../pages/Entrada/Entrada_sai";

const router = createBrowserRouter([
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
        element: <ConsultarPessoas></ConsultarPessoas>,
      },
      {
        path: "/Entrada",
        element: <Entrada></Entrada>,
      },
      {
        path: "/estoque",
        element: <Estoque></Estoque>,
      },
      {
        path: "/editar",
        element: <Editar></Editar>,
      },
    ],
  },
  {
    path: "/Login",
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
  { 
    path: "/Estoque",
    element: <DashboardMedico></DashboardMedico>,
    children: [
      {
        path: "/Estoque/Registrar",
        element: <ConsultarProntuario></ConsultarProntuario>,
      },
      {
        path: "/Estoque/Atualizar",
        element: <AgendaDia></AgendaDia>,
      },
    ],
  }
]);
export default router;
