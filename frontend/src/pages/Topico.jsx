/**
 * Topico.jsx — Tela de estudo de um tópico específico.
 *
 * Ao entrar na página, busca automaticamente 3 questões de múltipla escolha
 * da IA para o tópico selecionado. O estudante responde e envia para avaliação.
 * Após a avaliação:
 *   - Exibe o feedback educacional da IA (FeedbackBox)
 *   - Salva o resultado no banco de dados (/progresso)
 *   - Atualiza o progresso no contexto global
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../data/api';
import { useEstudante } from '../context/EstudanteContext';
import Loading from '../components/Loading';
import QuestaoCard from '../components/QuestaoCard';
import FeedbackBox from '../components/FeedbackBox';

export default function Topico() {
    const { id } = useParams();
    const { estudante, trilha, setProgresso } = useEstudante();

    // Encontra o tópico atual na trilha pelo id da URL
    const topico = trilha.find((t) => t.id === id);

    const [questoes, setQuestoes] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [avaliacao, setAvaliacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAvaliar, setLoadingAvaliar] = useState(false);
    const [error, setError] = useState('');

    // Busca as questões da IA quando o componente monta ou o tópico muda
    useEffect(() => {
        if (!topico) return;

        async function buscarQuestoes() {
            try {
                setLoading(true);
                setAvaliacao(null);
                setRespostas({});
                const res = await api.post('/ia/questoes', { topico: topico.titulo });
                setQuestoes(res.data.questoes);
            } catch (err) {
                setError('Erro ao buscar questões. Tente recarregar a página.');
            } finally {
                setLoading(false);
            }
        }

        buscarQuestoes();
    }, [id]);

    // Guarda a resposta escolhida pelo estudante para uma questão (lifting state up)
    function handleResponder(questaoId, opcao) {
        setRespostas((anterior) => ({
            ...anterior,
            [questaoId]: opcao,
        }));
    }

    async function handleEnviar() {
        // Verifica se todas as questões foram respondidas
        if (Object.keys(respostas).length < questoes.length) {
            return setError('Responda todas as questões antes de enviar.');
        }

        setError('');

        try {
            setLoadingAvaliar(true);

            // Envia as respostas para a IA avaliar
            const res = await api.post('/ia/avaliar', {
                topico: topico?.titulo,
                questoes,
                respostas,
            });

            setAvaliacao(res.data);

            // Persiste o resultado no banco de dados
            await api.post('/progresso', {
                estudanteId: estudante?.id,
                topicoId: id,
                topicoTitulo: topico?.titulo,
                acertos: res.data.acertos,
                total: res.data.total,
            });

            // Atualiza o progresso no contexto global (substitui registro anterior se houver)
            setProgresso((anterior) => [
                ...anterior.filter((p) => p.topico_id !== id),
                { topico_id: id, acertos: res.data.acertos, total: res.data.total },
            ]);
        } catch (err) {
            setError('Erro ao avaliar respostas. Tente novamente.');
        } finally {
            setLoadingAvaliar(false);
        }
    }

    // Guarda de rota: tópico não encontrado na trilha atual
    if (!topico) {
        return (
            <div className="page-container">
                <h1>Tópico não encontrado</h1>
                <p>Volte à trilha e escolha um tópico válido.</p>
                <Link to="/trilha" className="btn-primary link-btn">Ver Trilha</Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>{topico.titulo}</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>{topico.descricao}</p>

            {error && <p className="error-message">{error}</p>}

            {loading ? (
                <Loading />
            ) : (
                <>
                    <h2>Questões de Avaliação</h2>

                    {questoes.map((questao) => (
                        <QuestaoCard
                            key={questao.id}
                            questao={questao}
                            respostaSelecionada={respostas[questao.id]}
                            onResponder={handleResponder}
                        />
                    ))}

                    {/* Botão de envio — só aparece antes da avaliação */}
                    {!avaliacao && (
                        <button
                            className="btn-primary"
                            onClick={handleEnviar}
                            disabled={loadingAvaliar}
                            style={{ marginTop: '16px' }}
                        >
                            {loadingAvaliar ? 'Avaliando...' : 'Enviar Respostas'}
                        </button>
                    )}

                    {/* Feedback da IA — exibido após a avaliação */}
                    {avaliacao && (
                        <FeedbackBox
                            feedback={avaliacao.feedback}
                            acertos={avaliacao.acertos}
                            total={avaliacao.total}
                        />
                    )}

                    {/* Botão de voltar — exibido após a avaliação */}
                    {avaliacao && (
                        <Link
                            to="/trilha"
                            className="btn-secondary link-btn"
                            style={{ marginTop: '16px', display: 'inline-block' }}
                        >
                            ← Voltar à Trilha
                        </Link>
                    )}
                </>
            )}
        </div>
    );
}