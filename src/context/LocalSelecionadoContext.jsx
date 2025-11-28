import { createContext, useContext, useState, useEffect } from "react";

const LocalSelecionadoContext = createContext();

export function LocalSelecionadoProvider({ children }) {
  const [localSelecionado, setLocalSelecionado] = useState(null);

  // Limpa o contexto ao desmontar
  useEffect(() => {
    return () => setLocalSelecionado(null);
  }, []);

  return (
    <LocalSelecionadoContext.Provider value={{ localSelecionado, setLocalSelecionado }}>
      {children}
    </LocalSelecionadoContext.Provider>
  );
}

export function useLocalSelecionado() {
  return useContext(LocalSelecionadoContext);
}