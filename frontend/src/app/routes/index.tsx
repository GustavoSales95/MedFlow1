// src/app/routes.tsx
import React, { useContext } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../../App";
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
  Entrada,
} from "../pages";
import { AppContext } from "../shared/contexts/AppContext";

// PrivateRoute simples para verificar autenticação e role
const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { logado, usuario } = useContext(AppContext);

  if (!logado || !usuario) {
    // Usuário não está logado
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(usuario.typeUser)) {
    // Usuário não tem permissão para essa rota
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App já envolve o Outlet com AppProvider
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        element: <PrivateRoute allowedRoles={["comum"]} />,
        children: [
          {
            path: "Comum",
            element: <Dashboard />,
            children: [
              { index: true, element: <Marcacao /> },
              { path: "Cadastros", element: <Cadastros /> },
              { path: "ConsultarPessoas", element: <ConsultarPessoas /> },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "Admin",
            element: <DashboardAdmin />,
            children: [
              { path: "CadastrosUsuarios", element: <CadastrosUsuarios /> },
              { path: "ConsultarUsuarios", element: <ConsultarUsuarios /> },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["medico"]} />,
        children: [
          {
            path: "Medico",
            element: <DashboardMedico />,
            children: [
              {
                path: "ConsultarProntuarios",
                element: <ConsultarProntuario />,
              },
              { path: "AgendaDia", element: <AgendaDia /> },
            ],
          },
        ],
      },
      {
        element: <PrivateRoute allowedRoles={["admin"]} />, // Se quiser proteger o estoque só para admin
        children: [
          {
            path: "Estoque",
            element: <Estoque />,
            children: [
              { path: "Entrada", element: <Entrada /> },
              { path: "Editar", element: <Editar /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
