// src/routes/PrivateRoute.tsx
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../shared/contexts/AppContext";

interface PrivateRouteProps {
  allowedRoles?: string[]; // ex: ["admin", "medico", "comum"]
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { logado, usuario } = useContext(AppContext);

  if (!logado || !usuario) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.typeUser)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
