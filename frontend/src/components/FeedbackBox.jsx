// src/components/FeedbackBox.jsx
// Recebe o feedback da IA e os acertos por props e exibe para o estudante
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
