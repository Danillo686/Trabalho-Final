import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../data/api";
import { useEstudante } from "../context/EstudanteContext";
import Loading from "../components/Loading";

export default function Painel() {
    const { estudante } = useEstudante();

    const [historico, setHistorico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // useEffect para buscar histórico ao montar a tela
    useEffect(() => {
        if (!estudante?.id) return;

        async function buscarHistorico() {
            try {
                setLoading(true);
                const res = await api.get(`/progresso/${estudante.id}`);
                setHistorico(res.data);
            } catch (err) {
                setError("Erro ao buscar histórico.");
            } finally {
                setLoading(false);
            }
        }

        buscarHistorico();
    }, [estudante]);

    return (
        <div className="page-container">
            <h1>Painel do Estudante</h1>
            <p>Olá, <strong>{estudante?.nome}</strong>! Veja seu histórico de desempenho abaixo.</p>

            {error && <p className="error-message">{error}</p>}

            {/* Renderização condicional: Loading enquanto busca */}
            {loading ? (
                <Loading />
            ) : historico.length === 0 ? (
                // Renderização condicional: lista vazia
                <div className="painel-vazio">
                    <p>Você ainda não completou nenhum tópico.</p>
                    <Link to="/diagnostico" className="btn-primary link-btn">
                        Começar Diagnóstico
                    </Link>
                </div>
            ) : (
                // Lista do histórico com .map() e key
                <div className="historico-lista">
                    <h2>Histórico de Tópicos</h2>
                    {historico.map((item) => {
                        const porcentagem = item.total > 0
                            ? Math.round((item.acertos / item.total) * 100)
                            : 0;

                        return (
                            <div key={item.id} className="historico-card">
                                <div>
                                    <h3>{item.topico_titulo}</h3>
                                    <p className="historico-data">
                                        {new Date(item.data).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <div className="historico-resultado">
                                    <span>{item.acertos}/{item.total}</span>
                                    <span className={`badge-nota ${porcentagem >= 70 ? "badge-aprovado" : "badge-reprovado"}`}>
                                        {porcentagem}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Link to="/lobby" className="link-voltar">← Voltar ao Lobby</Link>
        </div>
    );
}