/**
 * Trilha.jsx — Tela da trilha de estudos gerada pela IA.
 *
 * Exibe a lista de tópicos recomendados pela IA após o diagnóstico.
 * Mostra uma barra de progresso com os tópicos já concluídos.
 * Se a trilha ainda não foi gerada, orienta o estudante a fazer o diagnóstico.
 */

import { Link } from 'react-router-dom';
import { useEstudante } from '../context/EstudanteContext';
import BarraProgresso from '../components/BarraProgresso';

export default function Trilha() {
    const { trilha, progresso } = useEstudante();

    // Conta quantos tópicos o estudante já concluiu
    const concluidos = progresso.length;

    // Guarda de rota: se não há trilha, pede para fazer o diagnóstico primeiro
    if (trilha.length === 0) {
        return (
            <div className="page-container">
                <h1>Sua Trilha de Estudos</h1>
                <p>Você ainda não fez o diagnóstico. Faça-o para gerar sua trilha personalizada!</p>
                <Link
                    to="/diagnostico"
                    className="btn-primary link-btn"
                    style={{ marginTop: '16px', display: 'inline-block' }}
                >
                    Fazer Diagnóstico
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Sua Trilha de Estudos</h1>
            <p>Aqui estão os tópicos recomendados pela IA para você estudar.</p>

            <BarraProgresso concluidos={concluidos} total={trilha.length} />

            <div className="trilha-lista">
                {trilha.map((topico) => {
                    const concluido = progresso.some((p) => p.topico_id === topico.id);

                    return (
                        <div
                            key={topico.id}
                            className={`trilha-card ${concluido ? 'trilha-card-concluido' : ''}`}
                        >
                            <div>
                                <h3>{topico.titulo}</h3>
                                <p>{topico.descricao}</p>
                            </div>
                            <div className="trilha-card-acao">
                                {concluido ? (
                                    <span className="badge-concluido">✓ Concluído</span>
                                ) : (
                                    <Link to={`/topico/${topico.id}`} className="btn-primary link-btn">
                                        Estudar
                                    </Link>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Link to="/lobby" className="link-voltar">← Voltar ao Lobby</Link>
        </div>
    );
}