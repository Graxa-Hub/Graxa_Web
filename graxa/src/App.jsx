import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./index.css";
import { Login } from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/Homepage";

function App() {
  const [count, setCount] = useState(0);

  return (
      <Routes>
        
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/home" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
  );
}

export default App;
