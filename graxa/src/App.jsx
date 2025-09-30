import { useState } from "react";
import "./index.css";
import { Login } from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { Cadastro } from "./pages/Cadastro";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/cadastro" element={<Cadastro />}></Route>
    </Routes>
  );
}

export default App;
