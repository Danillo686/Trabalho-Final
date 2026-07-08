// Server.JS é a inicialização do backend
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import iaRoutes from './routes/iaRoutes.js';
import progressoRoutes from './routes/progressoRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", iaRoutes);
app.use("/", progressoRoutes);

// Porta do servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`);
});