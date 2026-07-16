/**
 * useCadastro.jsx — Hook personalizado para a tela de cadastro.
 *
 * Gerencia os estados do formulário (username, password, passwordConfirm),
 * valida se as senhas conferem e envia a requisição de cadastro ao backend.
 * Redireciona o usuário para a tela de login após o cadastro bem-sucedido.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../data/api.js';

export function useCadastro() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    async function handleCadastro(e) {
        e.preventDefault();
        setError('');

        // Validação local antes de enviar ao servidor
        if (password !== passwordConfirm) {
            return setError('As senhas não conferem.');
        }

        try {
            setLoading(true);
            const response = await api.post('/cadastro', { username, password, passwordConfirm });
            alert(response.data.message);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao cadastrar.');
        } finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        loading,
        error,
        handleCadastro,
    };
}