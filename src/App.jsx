import { useState } from "react";
import { useToast } from "./hooks/useToast";
import { ToastContainer } from "./components/organisms/ToastContainer";
import "./index.css";
import { Route, Routes, Navigate } from "react-router-dom";

import { Login } from "./components/pages/Login";
import { Cadastro } from "./components/pages/Cadastro";
import { HomeRedirect } from "./components/organisms/HomeRedirect";
import { ProtectedLayout } from "./components/organisms/ProtectedLayout";
import { ProtectedRouteByRole } from "./components/organisms/ProtectedRouteByRole";
import { Turne } from "./components/pages/Turne";
import { Artista } from "./components/pages/Artista";
import { AdicionandoUsuarios } from "./components/pages/AdicionandoUsuario";
import { VisaoEvento } from "./components/pages/VisaoEvento";
import { Calendario } from "./components/pages/Calendario";
import { RecuperarSenha } from "./components/pages/RecuperarSenha";
import { CriarEvento } from "./components/pages/CriarEvento";
import { CriarLogistica } from "./components/pages/CriarLogistica";
import { ConfiguracaoUsuario } from "./components/pages/ConfiguracaoUser";
import { RelatorioPage } from "./components/pages/RelatorioPage";

function App() {
  // Toast global, igual ao sistema de notificações
  const toast = useToast();

  return (
    <>
      {/* ToastContainer global, igual Modal de Notificação */}
      <ToastContainer
        toasts={toast.toasts}
        onRemoveToast={toast.removeToast}
        position="top-right"
      />
      <Routes>
        {/* Rota raiz - redireciona baseado na autenticação */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas protegidas */}
        <Route path="/calendario" element={<Calendario />} />
        
        {/* ⛔ Rotas apenas para produtores */}
        <Route
          path="/turne/:bandaId?"
          element={<ProtectedRouteByRole allowedRoles={['produtor']} element={<Turne />} />}
        />
        <Route
          path="/artista"
          element={<ProtectedRouteByRole allowedRoles={['produtor']} element={<Artista />} />}
        />
        <Route
          path="/criar-evento/:tipoEvento/:eventoId?"
          element={<ProtectedRouteByRole allowedRoles={['produtor']} element={<CriarEvento />} />}
        />
        <Route
          path="/criar-logistica"
          element={<ProtectedRouteByRole allowedRoles={['produtor']} element={<CriarLogistica />} />}
        />
        
        {/* Rotas públicas após login */}
        <Route path="/adicionando-usuario" element={<AdicionandoUsuarios />} />
        <Route path="/visao-evento/:tipoEvento/:id" element={<VisaoEvento />} />
        <Route path="/configuracao" element={<ConfiguracaoUsuario />} />
        <Route path="/relatorio/:id" element={<RelatorioPage />} />
        <Route element={<ProtectedLayout />}></Route>
        {/* Rota não encontrada - redireciona para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
