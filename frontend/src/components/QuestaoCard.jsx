// src/components/QuestaoCard.jsx
// Recebe uma questão por props e avisa o pai quando o estudante responde (lifting state up)
export default function QuestaoCard({ questao, respostaSelecionada, onResponder }) {
    return (
        <div className="questao-card">
            <p className="questao-pergunta">{questao.pergunta}</p>
            <div className="questao-opcoes">
                {questao.opcoes.map((opcao) => (
                    <button
                        key={opcao}
                        className={`opcao-btn ${respostaSelecionada === opcao ? "opcao-selecionada" : ""}`}
                        onClick={() => onResponder(questao.id, opcao)}
                    >
                        {opcao}
                    </button>
                ))}
            </div>
        </div>
    );
}
