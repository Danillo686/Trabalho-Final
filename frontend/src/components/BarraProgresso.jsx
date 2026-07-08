// src/components/BarraProgresso.jsx
// Recebe concluidos e total por props e exibe a barra de progresso
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
                ></div>
            </div>
        </div>
    );
}
