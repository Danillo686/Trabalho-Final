/**
 * progressoController.js — Controller de progresso do estudante.
 *
 * Gerencia o histórico de tópicos concluídos pelo estudante.
 * Salva ou atualiza o resultado de cada tópico no banco de dados
 * e permite consultar todo o histórico de um estudante.
 */

import pool from '../db.js';

// POST /progresso — Salva ou atualiza o resultado de um tópico
export async function salvarProgresso(req, res) {
    const { estudanteId, topicoId, topicoTitulo, acertos, total } = req.body;

    if (!estudanteId || !topicoId) {
        return res.status(400).json({ message: 'estudanteId e topicoId são obrigatórios.' });
    }

    try {
        // Verifica se já existe registro para esse tópico e estudante
        const [existente] = await pool.query(
            'SELECT id FROM progresso WHERE estudante_id = ? AND topico_id = ?',
            [estudanteId, topicoId]
        );

        if (existente.length > 0) {
            // Atualiza o registro existente
            await pool.query(
                'UPDATE progresso SET acertos = ?, total = ?, data = NOW() WHERE estudante_id = ? AND topico_id = ?',
                [acertos, total, estudanteId, topicoId]
            );
        } else {
            // Insere um novo registro
            await pool.query(
                'INSERT INTO progresso (estudante_id, topico_id, topico_titulo, acertos, total, data) VALUES (?, ?, ?, ?, ?, NOW())',
                [estudanteId, topicoId, topicoTitulo, acertos, total]
            );
        }

        return res.status(200).json({ message: 'Progresso salvo com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar progresso:', err.message);
        return res.status(500).json({ message: 'Erro interno ao salvar progresso.' });
    }
}

// GET /progresso/:estudanteId — Retorna o histórico de tópicos do estudante
export async function buscarHistorico(req, res) {
    const { estudanteId } = req.params;

    try {
        const [rows] = await pool.query(
            'SELECT * FROM progresso WHERE estudante_id = ? ORDER BY data DESC',
            [estudanteId]
        );

        return res.status(200).json(rows);
    } catch (err) {
        console.error('Erro ao buscar histórico:', err.message);
        return res.status(500).json({ message: 'Erro interno ao buscar histórico.' });
    }
}
