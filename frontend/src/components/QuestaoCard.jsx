/**
 * QuestaoCard.jsx — Componente de questão de múltipla escolha.
 *
 * Recebe uma questão por props e renderiza a pergunta com suas opções.
 * Ao clicar em uma opção, chama a função onResponder do componente pai
 * (lifting state up), que guarda a resposta no estado do Topico.jsx.
 */

export default function QuestaoCard({ questao, respostaSelecionada, onResponder }) {
    return (
        <div className="questao-card">
            <p className="questao-pergunta">{questao.pergunta}</p>
            <div className="questao-opcoes">
                {questao.opcoes.map((opcao) => (
                    <button
                        key={opcao}
                        className={`opcao-btn ${respostaSelecionada === opcao ? 'opcao-selecionada' : ''}`}
                        onClick={() => onResponder(questao.id, opcao)}
                    >
                        {opcao}
                    </button>
                ))}
            </div>
        </div>
    );
}
