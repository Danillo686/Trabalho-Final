import { useCadastro } from "../hooks/useCadastro";
import { Link } from "react-router-dom";

export default function Cadastro() {
    // Puxa tudo o que o hook criou
    const {
        username,
        setUsername,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        loading,
        error,
        handleCadastro
    } = useCadastro();

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Faça o seu Cadastro!</h1>
                <p>Informe suas credenciais para continuar</p>
            
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleCadastro}>
                    <div className="form-group">
                        <label>Usuário</label>
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Senha</label>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirmar Senha</label>
                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
                <p className="auth-switch">
                    Já tem uma conta? Faça o seu <Link to="/">Login!</Link>
                </p>
            </div>
        </div>
    );
}