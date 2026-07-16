/**
 * BarraProgresso.jsx — Componente de barra de progresso.
 *
 * Recebe por props o número de tópicos concluídos e o total,
 * calcula a porcentagem e exibe uma barra de progresso visual.
 */

export default function BarraProgresso({ concluidos, total }) {
    const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return (
        <div className="barra-progresso-container">
            <div className="barra-progresso-info">
                <span>Progresso</span>
                <span>{concluidos} / {total} tópicos</span>
            </div>
            <div className="barra-progresso-fundo">
                <div
                    className="barra-progresso-fill"
                    style={{ width: `${porcentagem}%` }}
                />
            </div>
        </div>
    );
}
