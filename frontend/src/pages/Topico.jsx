import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../data/api";
import { useEstudante } from "../context/EstudanteContext";
import Loading from "../components/Loading";
import QuestaoCard from "../components/QuestaoCard";
import FeedbackBox from "../components/FeedbackBox";

export default function Topico() {
    // useParams para ler o id da rota /topico/:id
    const { id } = useParams();

    const { estudante, trilha, setProgresso } = useEstudante();

    // Pega o tópico atual da trilha pelo id
    const topico = trilha.find((t) => t.id === id);

    // Estados locais
    const [questoes, setQuestoes] = useState([]);
    const [respostas, setRespostas] = useState({}); // estado elevado — guarda as respostas de todos os QuestaoCards
    const [avaliacao, setAvaliacao] = useState(null); // resultado da IA
    const [loading, setLoading] = useState(true);
    const [loadingAvaliar, setLoadingAvaliar] = useState(false);
    const [error, setError] = useState("");

    // useEffect com [id] como dependência — refaz a busca quando o tópico muda
    useEffect(() => {
        if (!topico) return;

        async function buscarQuestoes() {
            try {
                setLoading(true);
                setAvaliacao(null);
                setRespostas({});
                const res = await api.post("/ia/questoes", { topico: topico.titulo });
                setQuestoes(res.data.questoes);
            } catch (err) {
                setError("Erro ao buscar questões. Tente recarregar a página.");
            } finally {
                setLoading(false);
            }
        }

        buscarQuestoes();
    }, [id]);

    // Lifting state up: o QuestaoCard chama essa função, o Topico guarda a resposta
    function handleResponder(questaoId, opcao) {
        setRespostas((anterior) => ({
            ...anterior,
            [questaoId]: opcao,
        }));
    }

    async function handleEnviar() {
        if (Object.keys(respostas).length < questoes.length) {
            return setError("Responda todas as questões antes de enviar.");
        }

        setError("");

        try {
            setLoadingAvaliar(true);

            // Pede a avaliação da IA
            const res = await api.post("/ia/avaliar", {
                topico: topico?.titulo,
                questoes,
                respostas,
            });

            setAvaliacao(res.data);

            // Salva no histórico do banco de dados
            await api.post("/progresso", {
                estudanteId: estudante?.id,
                topicoId: id,
                topicoTitulo: topico?.titulo,
                acertos: res.data.acertos,
                total: res.data.total,
            });

            // Atualiza o progresso no Context
            setProgresso((anterior) => [
                ...anterior.filter((p) => p.topico_id !== id),
                { topico_id: id, acertos: res.data.acertos, total: res.data.total },
            ]);
        } catch (err) {
            setError("Erro ao avaliar respostas. Tente novamente.");
        } finally {
            setLoadingAvaliar(false);
        }
    }

    if (!topico) {
        return (
            <div className="page-container">
                <h1>Tópico não encontrado</h1>
                <p>Volte à trilha e escolha um tópico.</p>
                <Link to="/trilha" className="btn-primary link-btn">Ver Trilha</Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>{topico.titulo}</h1>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>{topico.descricao}</p>

            {error && <p className="error-message">{error}</p>}

            {/* Renderização condicional: Loading enquanto busca as questões */}
            {loading ? (
                <Loading />
            ) : (
                <>
                    <h2>Questões de Avaliação</h2>

                    {/* Lista de questões com .map() e key */}
                    {questoes.map((questao) => (
                        <QuestaoCard
                            key={questao.id}
                            questao={questao}
                            respostaSelecionada={respostas[questao.id]}
                            onResponder={handleResponder}
                        />
                    ))}

                    {/* Renderização condicional: botão só aparece se ainda não avaliou */}
                    {!avaliacao && (
                        <button
                            className="btn-primary"
                            onClick={handleEnviar}
                            disabled={loadingAvaliar}
                            style={{ marginTop: "16px" }}
                        >
                            {loadingAvaliar ? "Avaliando..." : "Enviar Respostas"}
                        </button>
                    )}

                    {/* Renderização condicional com &&: feedback só aparece depois de avaliar */}
                    {avaliacao && (
                        <FeedbackBox
                            feedback={avaliacao.feedback}
                            acertos={avaliacao.acertos}
                            total={avaliacao.total}
                        />
                    )}

                    {avaliacao && (
                        <Link to="/trilha" className="btn-secondary link-btn" style={{ marginTop: "16px", display: "inline-block" }}>
                            ← Voltar à Trilha
                        </Link>
                    )}
                </>
            )}
        </div>
    );
}