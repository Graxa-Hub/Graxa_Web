import { useState } from "react";
import "./index.css";
import { Route, Routes, Navigate } from "react-router-dom";

import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { HomeRedirect } from "./components/HomeRedirect";
// import { ProtectedLayout } from "./components/ProtectedLayout";
import { Turne } from "./pages/Turne";
import { ArtistaApp } from "./pages/ArtistaApp";
import { AdicionandoUsuarios } from "./pages/AdicionandoUsuario";
import { VisaoEvento } from "./pages/VisaoEvento";
import { Calendario } from "./pages/Calendario";
import { RecuperarSenha } from "./pages/RecuperarSenha";
import { CriarEvento } from "./pages/CriarEvento";
import { CriarLogistica } from "./pages/CriarLogistica";
import { RelatorioPage } from "./pages/RelatorioPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      {/* Rota raiz - redireciona baseado na autenticação */}
      <Route path="/" element={<HomeRedirect />} />
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/cadastro" element={<Cadastro />} />
      {/* Rotas protegidas */}
      {/* <Route element={<ProtectedLayout />}> */}
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/turne/:bandaId?" element={<Turne />} />
      <Route path="/adicionando-usuario" element={<AdicionandoUsuarios />} />
      <Route path="/artista" element={<ArtistaApp />} />
      <Route path="/visao-evento" element={<VisaoEvento />} />
      <Route path="/criar-evento" element={<CriarEvento />} />
      <Route path="/criar-logistica" element={<CriarLogistica />} />
      <Route path="/relatorio" element={<RelatorioPage />} />
      {/* </Route> */}
      {/* Rota não encontrada - redireciona para login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
