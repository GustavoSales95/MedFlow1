// src/app/routes.tsx
import React, { useContext } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import App from "../../App";
import {
  Dashboard,
  Login,
  Marcacao,
  Cadastros,
  MedicosDisponiveis,
  DashboardAdmin,
  CadastrosUsuarios,
  ConsultarUsuarios,
  EditarEscala,
  ConsultarPessoas,
  ConsultarProntuario,
  DashboardMedico,
  AgendaDia,
  Agendamentos,
  FinalizarConsulta,
  ConsultarEscala,
  Editar,
  CadastroEstoque,
  DashboardEstoque,
  Entrada,
  ProdutoEstoque,
  CriarReceita,
  ListaReceitas
} from "../pages";
import { AppContext } from "../shared/contexts/AppContext";

// PrivateRoute simples para verificar autenticação e role
const PrivateRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { logado, usuario } = useContext(AppContext);

  if (!logado || !usuario) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(usuario.typeUser)) {
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

      // Rotas para usuários "comum"
      {
        path: "Comum",
        element: <Dashboard />,
        children: [
          { index: true, element: <Marcacao /> },
          { path: "Cadastros", element: <Cadastros /> },
          { path: "ConsultarPessoas", element: <ConsultarPessoas /> },
          { path: "MedicosDisponiveis", element: <MedicosDisponiveis /> },
        ],
      },

      // Rotas para usuários "admin"
      {
        element: <PrivateRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "Admin",
            element: <DashboardAdmin />,
            children: [
              { path: "CadastrosUsuarios", element: <CadastrosUsuarios /> },
              { path: "ConsultarUsuarios", element: <ConsultarUsuarios /> },
              { path: "EditarEscala", element: <EditarEscala /> },
            ],
          },
        ],
      },

      // Rotas para usuários "medico"
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
              { path: "Agendamentos", element: <Agendamentos /> },
              { path: "FinalizarConsulta", element: <FinalizarConsulta /> },
              { path: "ConsultarEscala", element: <ConsultarEscala />},
              { path: "CriarReceita", element: <CriarReceita /> }
            ],
          },
        ],
      },

      // Rotas para o setor de Estoque
      {
        path: "Estoque",
        element: <DashboardEstoque />,
        children: [
          { path: "Cadastro", element: <CadastroEstoque /> },
          { path: "Entrada", element: <Entrada /> },
          { path: "Editar", element: <Editar /> },
          { path: "ListarReceitas", element: <ListaReceitas/>},
          { path: "ProdutoEstoque/:id_produto", element: <ProdutoEstoque /> },
        ],
      },
    ],
  },
]);

export default router;