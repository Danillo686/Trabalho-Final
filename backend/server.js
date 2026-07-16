/**
 * server.js — Ponto de entrada do servidor Express.
 *
 * Inicializa o app, configura os middlewares globais (CORS e JSON)
 * e registra todas as rotas da aplicação antes de subir o servidor.
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import iaRoutes from './routes/iaRoutes.js';
import progressoRoutes from './routes/progressoRoutes.js';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Registro das rotas
app.use('/', authRoutes);
app.use('/', iaRoutes);
app.use('/', progressoRoutes);

// Porta vinda do .env ou padrão 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});