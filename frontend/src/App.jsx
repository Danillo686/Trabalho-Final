// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Lobby from "./pages/Lobby.jsx";
import Diagnostico from "./pages/Diagnostico.jsx";
import Trilha from "./pages/Trilha.jsx";
import Topico from "./pages/Topico.jsx";
import Painel from "./pages/Painel.jsx";
import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/diagnostico" element={<Diagnostico />} />
      <Route path="/trilha" element={<Trilha />} />
      <Route path="/topico/:id" element={<Topico />} />
      <Route path="/painel" element={<Painel />} />
    </Routes>
  );
}

export default App;