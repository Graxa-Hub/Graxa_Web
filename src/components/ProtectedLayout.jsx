import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
