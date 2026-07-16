/**
 * useLogin.jsx — Hook personalizado para a tela de login.
 *
 * Gerencia os estados do formulário (username, password), envia a requisição
 * de login ao backend e, em caso de sucesso, salva o usuário no contexto global
 * (via EstudanteContext) e redireciona para o Lobby.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../data/api';
import { useEstudante } from '../context/EstudanteContext';

export function useLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useEstudante();

    async function handleLogin(e) {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);

            const response = await api.post('/login', { username, password });

            // Salva o usuário e o token no contexto global e no localStorage
            login(response.data.usuario, response.data.token);

            navigate('/lobby');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao fazer login.');
        } finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    };
}