import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_KEY = process.env.GROQ_API_KEY;

// Função auxiliar para chamar a Groq
async function chamarGroq(mensagem) {
    const resposta = await axios.post(
        GROQ_URL,
        {
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente pedagógico. Responda sempre em português. Responda APENAS com JSON válido, sem texto adicional, sem markdown, sem explicações.",
                },
                {
                    role: "user",
                    content: mensagem,
                },
            ],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        }
    );

    return resposta.data.choices[0].message.content;
}

// POST /ia/diagnostico
// Recebe as respostas do questionário e retorna as lacunas identificadas
export async function gerarDiagnostico(req, res) {
    const { respostas } = req.body;

    if (!respostas) {
        return res.status(400).json({ message: "Respostas são obrigatórias." });
    }

    try {
        const prompt = `
Analise as respostas de um estudante de programação e identifique as lacunas de conhecimento.

Respostas do estudante:
${JSON.stringify(respostas)}

Retorne um JSON neste formato exato:
{
  "lacunas": ["lacuna 1", "lacuna 2", "lacuna 3"],
  "nivel": "iniciante",
  "resumo": "Breve resumo do diagnóstico"
}
`;

        const textoResposta = await chamarGroq(prompt);

        // Tenta extrair o JSON da resposta
        const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("IA não retornou JSON válido");
        }

        const diagnostico = JSON.parse(jsonMatch[0]);
        return res.status(200).json(diagnostico);
    } catch (err) {
        console.error("Erro ao gerar diagnóstico:", err.message);
        return res.status(500).json({ message: "Erro ao processar diagnóstico com IA." });
    }
}

// POST /ia/trilha
// Recebe as lacunas e retorna uma trilha de tópicos
export async function gerarTrilha(req, res) {
    const { lacunas, nivel } = req.body;

    if (!lacunas) {
        return res.status(400).json({ message: "Lacunas são obrigatórias." });
    }

    try {
        const prompt = `
Crie uma trilha de aprendizagem para um estudante de programação com nível "${nivel || "iniciante"}".

Lacunas identificadas: ${lacunas.join(", ")}

Retorne um JSON neste formato exato:
{
  "topicos": [
    { "id": "1", "titulo": "Nome do Tópico", "descricao": "Breve descrição" },
    { "id": "2", "titulo": "Nome do Tópico", "descricao": "Breve descrição" },
    { "id": "3", "titulo": "Nome do Tópico", "descricao": "Breve descrição" }
  ]
}

Crie exatamente 4 tópicos relacionados às lacunas identificadas.
`;

        const textoResposta = await chamarGroq(prompt);

        const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("IA não retornou JSON válido");
        }

        const trilha = JSON.parse(jsonMatch[0]);
        return res.status(200).json(trilha);
    } catch (err) {
        console.error("Erro ao gerar trilha:", err.message);
        return res.status(500).json({ message: "Erro ao gerar trilha com IA." });
    }
}

// POST /ia/questoes
// Recebe o nome do tópico e retorna questões de múltipla escolha
export async function gerarQuestoes(req, res) {
    const { topico } = req.body;

    if (!topico) {
        return res.status(400).json({ message: "Nome do tópico é obrigatório." });
    }

    try {
        const prompt = `
Crie 3 questões de múltipla escolha sobre o tópico: "${topico}" para estudantes de programação iniciantes.

Retorne um JSON neste formato exato:
{
  "questoes": [
    {
      "id": "1",
      "pergunta": "Texto da pergunta?",
      "opcoes": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correta": "Opção A"
    }
  ]
}
`;

        const textoResposta = await chamarGroq(prompt);

        const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("IA não retornou JSON válido");
        }

        const questoes = JSON.parse(jsonMatch[0]);
        return res.status(200).json(questoes);
    } catch (err) {
        console.error("Erro ao gerar questões:", err.message);
        return res.status(500).json({ message: "Erro ao gerar questões com IA." });
    }
}

// POST /ia/avaliar
// Recebe as respostas do estudante e retorna feedback
export async function avaliarRespostas(req, res) {
    const { topico, questoes, respostas } = req.body;

    if (!questoes || !respostas) {
        return res.status(400).json({ message: "Questões e respostas são obrigatórias." });
    }

    try {
        // Calcula acertos
        let acertos = 0;
        questoes.forEach((q) => {
            if (respostas[q.id] === q.correta) {
                acertos++;
            }
        });

        const prompt = `
Um estudante respondeu questões sobre o tópico "${topico}".
Acertou ${acertos} de ${questoes.length} questões.

Questões e respostas:
${questoes.map((q) => `Pergunta: ${q.pergunta}\nResposta correta: ${q.correta}\nResposta do estudante: ${respostas[q.id] || "Não respondeu"}`).join("\n\n")}

Dê um feedback educacional em português, explicando os erros e parabenizando os acertos.
Retorne um JSON neste formato exato:
{
  "acertos": ${acertos},
  "total": ${questoes.length},
  "feedback": "Texto do feedback aqui"
}
`;

        const textoResposta = await chamarGroq(prompt);

        const jsonMatch = textoResposta.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("IA não retornou JSON válido");
        }

        const avaliacao = JSON.parse(jsonMatch[0]);
        return res.status(200).json(avaliacao);
    } catch (err) {
        console.error("Erro ao avaliar respostas:", err.message);
        return res.status(500).json({ message: "Erro ao avaliar respostas com IA." });
    }
}
