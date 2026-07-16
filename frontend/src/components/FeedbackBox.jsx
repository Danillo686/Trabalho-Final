/**
 * FeedbackBox.jsx — Componente de exibição do feedback da IA.
 *
 * Recebe por props o texto de feedback gerado pela IA, a quantidade de acertos
 * e o total de questões, e os exibe de forma clara para o estudante.
 */

export default function FeedbackBox({ feedback, acertos, total }) {
    const porcentagem = total > 0 ? Math.round((acertos / total) * 100) : 0;

    return (
        <div className="feedback-box">
            <h3>Resultado</h3>
            <p className="feedback-placar">
                {acertos} de {total} acertos ({porcentagem}%)
            </p>
            <div className="feedback-texto">
                <p>{feedback}</p>
            </div>
        </div>
    );
}
