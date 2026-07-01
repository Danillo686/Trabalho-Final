import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

app.use(express.json());
app.use(cors());

// ROTA DE CADASTRO (POST)
app.post('/cadastro', async (req, res) => {
    const { username, password, passwordConfirm } = req.body;

    // 1. Validação básica de campos vazios
    if (!username || !password || !passwordConfirm) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // 2. Validação se as senhas coincidem
    if (password !== passwordConfirm) {
        return res.status(400).json({ message: "As senhas não coincidem." });
    }

    try {
        // 3. Verifica se o usuário já existe no banco
        const [usuariosExistentes] = await pool.query(
            'SELECT * FROM usuarios WHERE name_user = ?',
            [username]
        );

        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ message: "Este usuário já está cadastrado." });
        }

        // 4. Faz APENAS UM INSERT no MySQL e pega o resultado direto dele
        const querySql = 'INSERT INTO usuarios (name_user, password_user, confirm_password) VALUES (?, ?, ?)';
        const [result] = await pool.query(querySql, [username, password, passwordConfirm]);
        
        // 5. Pega o ID gerado automaticamente pelo banco de dados
        const novoId = result.insertId; 

        // 6. Retorna o sucesso montando o objeto com as variáveis que você já tem no código!
        return res.status(201).json({
            message: "Sucesso!",
            usuario: {
                id: novoId,        // O ID gerado pelo MySQL
                nome: username     // O nome que veio lá do formulário do React
            }
        });

    } catch (error) {
        console.error("Erro no servidor:", error);
        return res.status(500).json({ message: "Erro interno no servidor ao cadastrar." });
    }
});

// Inicia o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
