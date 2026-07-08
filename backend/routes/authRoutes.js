import { Router } from "express"

import {
    cadastrar, 
    login
} from "../controllers/authController.js";

const router = Router();

//Rotas de POST - Cadastro e Login
router.post('/cadastro', cadastrar);
router.post('/login', login);



export default router;
