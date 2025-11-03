import { useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Dashboard } from "./pages/Dashboard";
import { HomeRedirect } from "./components/HomeRedirect";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Turne } from "./pages/Turne";
import { ArtistaApp } from "./pages/ArtistaApp";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route element={<ProtectedLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/turne" element={<Turne />} />
      <Route path="/artista" element={<ArtistaApp />} />
      </Route>
    </Routes>
  );
}

export default App;
