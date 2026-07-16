/**
 * Lobby.jsx — Página inicial após o login.
 *
 * Dá boas-vindas ao estudante e oferece atalhos para as principais funcionalidades:
 * Fazer o Diagnóstico, Ver a Trilha de Estudos e Ver o Painel de desempenho.
 * Também disponibiliza o botão de logout.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useEstudante } from '../context/EstudanteContext';

export default function Lobby() {
    const { estudante, logout } = useEstudante();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="lobby-container">
            <header className="lobby-header">
                <h1>Bem-vindo, {estudante?.nome || 'Estudante'}!</h1>
                <button onClick={handleLogout} className="btn-logout">Sair</button>
            </header>

            <main className="lobby-content">
                <div className="lobby-card">
                    <h2>O que você quer fazer?</h2>
                    <div className="lobby-botoes">
                        <Link to="/diagnostico" className="btn-primary link-btn">
                            Fazer Diagnóstico
                        </Link>
                        <Link to="/trilha" className="btn-secondary link-btn">
                            Ver Trilha de Estudos
                        </Link>
                        <Link to="/painel" className="btn-secondary link-btn">
                            Ver meu Painel
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}