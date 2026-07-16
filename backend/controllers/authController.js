/**
 * authController.js — Controller de autenticação.
 *
 * Contém as funções de cadastro e login de usuários.
 * As senhas são criptografadas com bcrypt antes de serem salvas.
 * O login retorna um token JWT que deve ser usado nas requisições autenticadas.
 */

import pool from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// POST /cadastro — Cria um novo usuário no banco de dados
export async function cadastrar(req, res) {
    const { username, password, passwordConfirm } = req.body;

    // Verifica se todos os campos foram enviados
    if (!username || !password || !passwordConfirm) {
        return res.status(400).json({
            message: 'Todos os campos são obrigatórios.'
        });
    }

    // Verifica se as senhas são iguais
    if (password !== passwordConfirm) {
        return res.status(400).json({
            message: 'As senhas não são iguais.'
        });
    }

    try {
        // Verifica se já existe um usuário com esse nome
        const [rows] = await pool.query(
            'SELECT id FROM usuarios WHERE name_user = ?',
            [username]
        );

        if (rows.length > 0) {
            return res.status(400).json({
                message: 'Usuário já cadastrado.'
            });
        }

        // Criptografa a senha antes de salvar
        const hashPassword = await bcrypt.hash(password, 10);

        // Insere o novo usuário no banco
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
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
}

// POST /login — Autentica o usuário e retorna um token JWT
export async function login(req, res) {
    const { username, password } = req.body;

    // Verifica se os campos foram enviados
    if (!username || !password) {
        return res.status(400).json({
            message: 'Usuário e senha são obrigatórios.'
        });
    }

    try {
        // Busca o usuário no banco de dados
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE name_user = ?',
            [username]
        );

        // Mensagem genérica para não revelar qual campo está errado
        if (rows.length === 0) {
            return res.status(401).json({
                message: 'Usuário ou senha incorretos.'
            });
        }

        const usuario = rows[0];

        // Compara a senha enviada com o hash salvo no banco
        const senhaCorreta = await bcrypt.compare(password, usuario.password_user);

        if (!senhaCorreta) {
            return res.status(401).json({
                message: 'Usuário ou senha incorretos.'
            });
        }

        // Gera o token JWT com validade de 1 dia
        const token = jwt.sign(
            { id: usuario.id, username: usuario.name_user },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.name_user
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({
            message: 'Erro interno no servidor.'
        });
    }
}