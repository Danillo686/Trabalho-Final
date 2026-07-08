import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";
import { useEstudante } from "../context/EstudanteContext";
import Loading from "../components/Loading";

// Perguntas fixas do diagnóstico
const PERGUNTAS = [
    {
        id: "q1",
        texto: "Como você se sente em relação à lógica de programação?",
        opcoes: ["Nunca ouvi falar", "Sei o básico", "Tenho boa prática", "Domino bem"],
    },
    {
        id: "q2",
        texto: "Qual é seu conhecimento em JavaScript?",
        opcoes: ["Nenhum", "Já vi alguns tutoriais", "Já fiz projetos simples", "Trabalho com JS"],
    },
    {
        id: "q3",
        texto: "Você já trabalhou com banco de dados?",
        opcoes: ["Não", "Só teoria", "Já fiz consultas SQL simples", "Sim, com projetos reais"],
    },
];

export default function Diagnostico() {
    // Guarda as respostas do estudante (formulário controlado)
    const [respostas, setRespostas] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { setTrilha } = useEstudante();

    // Lifting state up: atualiza a resposta de uma pergunta específica
    function handleResposta(perguntaId, opcao) {
        setRespostas((anterior) => ({
            ...anterior,
            [perguntaId]: opcao,
        }));
    }

    async function handleEnviar(e) {
        e.preventDefault();
        setError("");

        // Verifica se todas as perguntas foram respondidas
        if (Object.keys(respostas).length < PERGUNTAS.length) {
            return setError("Responda todas as perguntas antes de continuar.");
        }

        try {
            setLoading(true);

            // 1) Envia as respostas para a IA diagnosticar
            const resDiagnostico = await api.post("/ia/diagnostico", { respostas });
            const { lacunas, nivel } = resDiagnostico.data;

            // 2) Pede para a IA gerar a trilha com base nas lacunas
            const resTrilha = await api.post("/ia/trilha", { lacunas, nivel });
            const { topicos } = resTrilha.data;

            // 3) Salva a trilha no Context (estado global)
            setTrilha(topicos);

            navigate("/trilha");
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao processar diagnóstico.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="page-container">
                <Loading />
                <p style={{ textAlign: "center", color: "#64748b" }}>
                    A IA está analisando suas respostas e gerando sua trilha...
                </p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1>Diagnóstico de Conhecimento</h1>
            <p>Responda as perguntas abaixo para que a IA monte sua trilha personalizada.</p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleEnviar}>
                {PERGUNTAS.map((pergunta) => (
                    <div key={pergunta.id} className="diagnostico-questao">
                        <p className="questao-pergunta">{pergunta.texto}</p>
                        <div className="questao-opcoes">
                            {pergunta.opcoes.map((opcao) => (
                                <button
                                    key={opcao}
                                    type="button"
                                    className={`opcao-btn ${respostas[pergunta.id] === opcao ? "opcao-selecionada" : ""}`}
                                    onClick={() => handleResposta(pergunta.id, opcao)}
                                >
                                    {opcao}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}

                <button type="submit" className="btn-primary" style={{ marginTop: "20px" }}>
                    Gerar minha Trilha
                </button>
            </form>
        </div>
    );
}