import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const HomeRedirect = () => {
  const { isAuthenticated } = useAuth();
  const ultimaRota = localStorage.getItem("ultimaRota");

  const destino = isAuthenticated
    ? ultimaRota || "/dashboard"
    : "/login";

  return <Navigate to={destino} replace />;
};
