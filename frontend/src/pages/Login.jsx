import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Login() {
    // Puxa tudo o que o hook criou
    const {
        username, setUsername,
        password, setPassword,
        passwordConfirm, setPasswordConfirm,
        loading,
        error,
        handleLogin
    } = useAuth();

    return (
        <div>
            <h1>Bem-vindo ao Login!</h1>
            <p>Informe suas credenciais para continuar</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirmar senha"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Carregando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}
