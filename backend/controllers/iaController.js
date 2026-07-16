/**
 * iaController.js — Controller de integração com a IA (Groq).
 *
 * Expõe quatro endpoints que se comunicam com a API do Groq (modelo LLaMA):
 *   - gerarDiagnostico: analisa as respostas do estudante e identifica lacunas
 *   - gerarTrilha:      cria uma trilha de tópicos com base nas lacunas
 *   - gerarQuestoes:    gera questões de múltipla escolha sobre um tópico
 *   - avaliarRespostas: corrige as respostas e devolve um feedback educacional
 */

import axios from 'axios';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = process.env.GROQ_API_KEY;

// Função interna — envia um prompt para a API do Groq e retorna o texto da resposta
async function chamarGroq(mensagem) {
    const resposta = await axios.post(
        GROQ_URL,
        {
            model: 'llama3-8b-8192',
            messages: [
                {
                    role: 'system',
                    content:
                        'Você é um assistente pedagógico. Responda sempre em português. ' +
                        'Responda APENAS com JSON válido, sem texto adicional, sem markdown, sem explicações.',
                },
                {
                    role: 'user',
                    content: mensagem,
                },
            ],
            temperature: 0.7,
        },
        {
            headers: {
                Authorization: `Bearer ${GROQ_KEY}`,
                'Content-Type': 'application/json',
            },
            timeout: 30000,
        }
    );

    return resposta.data.choices[0].message.content;
}

// Extrai o primeiro objeto JSON encontrado em um texto
function extrairJSON(texto) {
    const match = texto.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('A IA não retornou um JSON válido.');
    return JSON.parse(match[0]);
}

// POST /ia/diagnostico — Analisa respostas do questionário e identifica lacunas
export async function gerarDiagnostico(req, res) {
    const { respostas } = req.body;

    if (!respostas) {
        return res.status(400).json({ message: 'Respostas são obrigatórias.' });
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
        const diagnostico = extrairJSON(textoResposta);
        return res.status(200).json(diagnostico);
    } catch (err) {
        console.error('Erro ao gerar diagnóstico:', err.message);
        return res.status(500).json({ message: 'Erro ao processar diagnóstico com IA.' });
    }
}

// POST /ia/trilha — Gera uma trilha de tópicos com base nas lacunas identificadas
export async function gerarTrilha(req, res) {
    const { lacunas, nivel } = req.body;

    if (!lacunas) {
        return res.status(400).json({ message: 'Lacunas são obrigatórias.' });
    }

    try {
        const prompt = `
Crie uma trilha de aprendizagem para um estudante de programação com nível "${nivel || 'iniciante'}".

Lacunas identificadas: ${lacunas.join(', ')}

Retorne um JSON neste formato exato:
{
  "topicos": [
    { "id": "1", "titulo": "Nome do Tópico", "descricao": "Breve descrição" },
    { "id": "2", "titulo": "Nome do Tópico", "descricao": "Breve descrição" },
    { "id": "3", "titulo": "Nome do Tópico", "descricao": "Breve descrição" },
    { "id": "4", "titulo": "Nome do Tópico", "descricao": "Breve descrição" }
  ]
}

Crie exatamente 4 tópicos relacionados às lacunas identificadas.
`;
        const textoResposta = await chamarGroq(prompt);
        const trilha = extrairJSON(textoResposta);
        return res.status(200).json(trilha);
    } catch (err) {
        console.error('Erro ao gerar trilha:', err.message);
        return res.status(500).json({ message: 'Erro ao gerar trilha com IA.' });
    }
}

// POST /ia/questoes — Gera questões de múltipla escolha sobre um tópico
export async function gerarQuestoes(req, res) {
    const { topico } = req.body;

    if (!topico) {
        return res.status(400).json({ message: 'Nome do tópico é obrigatório.' });
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
        const questoes = extrairJSON(textoResposta);
        return res.status(200).json(questoes);
    } catch (err) {
        console.error('Erro ao gerar questões:', err.message);
        return res.status(500).json({ message: 'Erro ao gerar questões com IA.' });
    }
}

// POST /ia/avaliar — Avalia as respostas do estudante e retorna feedback educacional
export async function avaliarRespostas(req, res) {
    const { topico, questoes, respostas } = req.body;

    if (!questoes || !respostas) {
        return res.status(400).json({ message: 'Questões e respostas são obrigatórias.' });
    }

    try {
        // Calcula a quantidade de acertos localmente
        let acertos = 0;
        questoes.forEach((q) => {
            if (respostas[q.id] === q.correta) acertos++;
        });

        const prompt = `
Um estudante respondeu questões sobre o tópico "${topico}".
Acertou ${acertos} de ${questoes.length} questões.

Questões e respostas:
${questoes
    .map(
        (q) =>
            `Pergunta: ${q.pergunta}\nResposta correta: ${q.correta}\nResposta do estudante: ${respostas[q.id] || 'Não respondeu'}`
    )
    .join('\n\n')}

Dê um feedback educacional em português, explicando os erros e parabenizando os acertos.
Retorne um JSON neste formato exato:
{
  "acertos": ${acertos},
  "total": ${questoes.length},
  "feedback": "Texto do feedback aqui"
}
`;
        const textoResposta = await chamarGroq(prompt);
        const avaliacao = extrairJSON(textoResposta);
        return res.status(200).json(avaliacao);
    } catch (err) {
        console.error('Erro ao avaliar respostas:', err.message);
        return res.status(500).json({ message: 'Erro ao avaliar respostas com IA.' });
    }
}
