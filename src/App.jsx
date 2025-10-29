import { useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Cadastro } from "./pages/Cadastro";
import { Dashboard } from "./pages/Dashboard";
import { Local } from "./pages/Local";
import { Grupo } from "./pages/Grupo";
import { Shows } from "./pages/Shows";
import { HomeRedirect } from "./components/HomeRedirect";
import { ProtectedLayout } from "./components/ProtectedLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/cadastro" element={<Cadastro />} /> */}
      {/* <Route element={<ProtectedLayout />}> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/local" element={<Local />} />
      <Route path="/grupo" element={<Grupo />} />
      <Route path="/shows" element={<Shows />} />
      {/* </Route> */}
    </Routes>
  );
}

export default App;
