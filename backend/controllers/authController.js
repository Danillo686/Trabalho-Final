import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET;
//CADASTRAR
export async function cadastrar(req, res) {
    const { username, password, passwordConfirm } = req.body;

    //Verifica se todos os campos foram enviados
    if (!username || !password || !passwordConfirm) {
        return res.status(400).json({
            message: "Todos os campos são obrigatórios."
        });
    }

    //Verifica se as senhas são iguais
    if (password !== passwordConfirm) {
        return res.status(400).json({
            message: "As senhas não são iguais."
        })
    }

    try {

        //Procura usuários com o mesmo nome
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE name_user = ?',
            [username]
        );

        if (rows.length > 0) {
            return res.status(400).json({
                message: "Usuário já cadastrado."
            });
        }

        //Criptografa a senha
        const hashPassword = await bcrypt.hash(password, 10);

        //Salva o usuário 
        const [result] = await pool.query(
            'INSERT INTO usuarios (name_user, password_user) VALUES (?, ?)',
            [username, hashPassword]
        );

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: result.insertId,
                nome: username
            }
        });
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            message: "Erro interno do servidor"
        })
    }
}


//LOGIN
export async function login(req, res) {
    console.log(req.body);

    const { username, password } = req.body;

    //Verificação de se os campos foram enviados
    if (!username || !password) {
        return res.status(400).json({
            message: 'Usuário e senha são obrigatórios.'
        });
    }

    try {
        //Busca o usuário no bando de dados
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE name_user = ?',
            [username]
        );

        //Se não encontrar nenhuma linha, o usuário não existe
        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Usuário ou senha incorretos' //Messagem de erro padrão (nao deixar saber qual deu errado)
            })
        }


        const usuario = rows[0]
        //Compara a senha
        const senhaCorreta = await bcrypt.compare(password, usuario.password_user);

        if (!senhaCorreta)
            return res.status(401).json({
                message: 'Usuário ou senha incorretos'
            });

        //Gera o token (expira em 1 dia)
        const token = jwt.sign(
            { id: usuario.id, username: usuario.name_user },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        //Retorno de sucesso
        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.name_user
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Erro interno no servidor'
        });
    }
}