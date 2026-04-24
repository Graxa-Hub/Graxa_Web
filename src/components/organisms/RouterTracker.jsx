import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const RouterTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const rotaAtual = location.pathname;

    const rotasPrivadas = ["/", "/login", "/cadastro"];
    if (!rotasPrivadas.includes(rotaAtual)) {
      localStorage.setItem("ultimaRota", rotaAtual);
    }
  }, [location]);

  return null;
};
