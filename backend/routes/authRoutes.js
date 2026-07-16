/**
 * authRoutes.js — Rotas de autenticação.
 *
 * Define os endpoints públicos de cadastro e login de usuários.
 *   POST /cadastro → cria um novo usuário
 *   POST /login    → autentica o usuário e retorna um token JWT
 */

import { Router } from 'express';
import { cadastrar, login } from '../controllers/authController.js';

const router = Router();

router.post('/cadastro', cadastrar);
router.post('/login', login);

export default router;
