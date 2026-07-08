import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

async function criarTabela() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS progresso (
                id INT AUTO_INCREMENT PRIMARY KEY,
                estudante_id INT NOT NULL,
                topico_id VARCHAR(50) NOT NULL,
                topico_titulo VARCHAR(255),
                acertos INT DEFAULT 0,
                total INT DEFAULT 0,
                data DATETIME DEFAULT NOW()
            )
        `);
        console.log('Tabela progresso criada com sucesso!');
        process.exit(0);
    } catch (err) {
        console.error('Erro ao criar tabela:', err.message);
        process.exit(1);
    }
}

criarTabela();
