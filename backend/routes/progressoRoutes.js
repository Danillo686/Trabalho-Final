/**
 * progressoRoutes.js — Rotas de progresso do estudante.
 *
 * Define os endpoints para gerenciar o histórico de tópicos concluídos:
 *   POST /progresso/:estudanteId → salva ou atualiza o resultado de um tópico
 *   GET  /progresso/:estudanteId → retorna o histórico completo do estudante
 */

import { Router } from 'express';
import { salvarProgresso, buscarHistorico } from '../controllers/progressoController.js';

const router = Router();

router.post('/progresso', salvarProgresso);
router.get('/progresso/:estudanteId', buscarHistorico);

export default router;
