/**
 * Login.jsx — Tela de login.
 *
 * Exibe o formulário de autenticação (usuário e senha).
 * Toda a lógica de estado e requisição é gerenciada pelo hook useLogin.
 * Em caso de sucesso, o usuário é redirecionado para o Lobby.
 */

import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin.jsx';

export default function Login() {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin,
    } = useLogin();

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Faça o seu Login!</h1>
                <p>Informe suas credenciais para continuar</p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Usuário</label>
                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Entrando...' : 'Login'}
                    </button>
                </form>

                <p className="auth-switch">
                    Não tem uma conta? Faça o seu <Link to="/cadastro">Cadastro!</Link>
                </p>
            </div>
        </div>
    );
}