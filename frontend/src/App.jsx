/**
 * App.jsx — Definição das rotas da aplicação.
 *
 * Mapeia cada caminho de URL para o componente de página correspondente.
 * Utiliza o react-router-dom para gerenciar a navegação no lado do cliente (SPA).
 *
 * Rotas disponíveis:
 *   /             → Login
 *   /cadastro     → Cadastro
 *   /lobby        → Lobby (página inicial pós-login)
 *   /diagnostico  → Diagnóstico de conhecimento
 *   /trilha       → Trilha de estudos gerada pela IA
 *   /topico/:id   → Tópico específico com questões e avaliação
 *   /painel       → Painel de desempenho do estudante
 */

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Lobby from './pages/Lobby.jsx';
import Diagnostico from './pages/Diagnostico.jsx';
import Trilha from './pages/Trilha.jsx';
import Topico from './pages/Topico.jsx';
import Painel from './pages/Painel.jsx';

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