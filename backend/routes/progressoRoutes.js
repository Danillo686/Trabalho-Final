import { Router } from "express";
import {
    salvarProgresso,
    buscarHistorico,
} from "../controllers/progressoController.js";

const router = Router();

router.post("/progresso", salvarProgresso);
router.get("/progresso/:estudanteId", buscarHistorico);

export default router;
