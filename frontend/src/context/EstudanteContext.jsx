/**
 * EstudanteContext.jsx — Contexto global do estudante.
 *
 * Provê para toda a aplicação o estado do estudante logado,
 * sua trilha de estudos e seu progresso nos tópicos.
 * Persiste o usuário no localStorage para manter a sessão após recarregar.
 *
 * Funções expostas:
 *   - login(usuario, token): salva o usuário e o token no estado e no localStorage
 *   - logout():              limpa o estado e o localStorage
 */

import { createContext, useContext, useState, useEffect } from 'react';

const EstudanteContext = createContext();

// Provider que envolve toda a aplicação (registrado em main.jsx)
export function EstudanteProvider({ children }) {
    const [estudante, setEstudante] = useState(null);
    const [progresso, setProgresso] = useState([]);
    const [trilha, setTrilha] = useState([]);

    // Salva o usuário e o token no estado e no localStorage ao fazer login
    function login(usuario, token) {
        setEstudante(usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('token', token);
    }

    // Remove o usuário e o token ao fazer logout
    function logout() {
        setEstudante(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
    }

    // Restaura o usuário do localStorage ao carregar a página
    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuario');
        if (usuarioSalvo) {
            setEstudante(JSON.parse(usuarioSalvo));
        }
    }, []);

    return (
        <EstudanteContext.Provider
            value={{
                estudante,
                progresso,
                setProgresso,
                trilha,
                setTrilha,
                login,
                logout,
            }}
        >
            {children}
        </EstudanteContext.Provider>
    );
}

// Hook de atalho para consumir o contexto nos componentes
export function useEstudante() {
    return useContext(EstudanteContext);
}