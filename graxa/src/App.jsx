import { useState } from "react";
import "./index.css";
import { Login } from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";
import { Dashboard } from "./pages/Dashboard";
import {CadastroLocal} from "./pages/CadastroLocal";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/cadastro" element={<Cadastro />}></Route>
      <Route path="/dashboard" element={<Dashboard />}></Route>    
      <Route path="/cadastroLocal" element={<CadastroLocal />}></Route>
    </Routes>
  );
}

export default App;
