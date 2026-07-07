// Server.JS é a inicialização do backend
//Importações
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors())
app.use(express.json())
app.use("/", authRoutes);

//Porta do servidor
const PORT = 3000


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}`)
})