import { useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Dashboard } from "./pages/Dashboard";
import { Local } from "./pages/Local";
import { Grupo } from "./pages/Grupo";
import { Shows } from "./pages/Shows";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/local" element={<Local />} />
      <Route path="/grupo" element={<Grupo />} />
      <Route path="/shows" element={<Shows />} />
    </Routes>
  );
}

export default App;
