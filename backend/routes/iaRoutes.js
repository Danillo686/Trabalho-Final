/**
 * iaRoutes.js — Rotas da IA (Groq).
 *
 * Define os endpoints para interação com o modelo de linguagem:
 *   POST /ia/diagnostico → analisa respostas e identifica lacunas
 *   POST /ia/trilha      → gera trilha de tópicos com base nas lacunas
 *   POST /ia/questoes    → gera questões de múltipla escolha sobre um tópico
 *   POST /ia/avaliar     → avalia respostas e retorna feedback educacional
 */

import { Router } from 'express';
import {
    gerarDiagnostico,
    gerarTrilha,
    gerarQuestoes,
    avaliarRespostas,
} from '../controllers/iaController.js';

const router = Router();

router.post('/ia/diagnostico', gerarDiagnostico);
router.post('/ia/trilha', gerarTrilha);
router.post('/ia/questoes', gerarQuestoes);
router.post('/ia/avaliar', avaliarRespostas);

export default router;
