/**
 * db.js — Configuração da conexão com o banco de dados MySQL.
 *
 * Cria e exporta um pool de conexões reutilizáveis para ser usado
 * em todos os controllers. As credenciais são lidas do arquivo .env.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexões: mais eficiente que abrir/fechar conexão a cada query
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'data_base',
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;