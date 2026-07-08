import { Router } from "express";
import {
    gerarDiagnostico,
    gerarTrilha,
    gerarQuestoes,
    avaliarRespostas,
} from "../controllers/iaController.js";

const router = Router();

router.post("/ia/diagnostico", gerarDiagnostico);
router.post("/ia/trilha", gerarTrilha);
router.post("/ia/questoes", gerarQuestoes);
router.post("/ia/avaliar", avaliarRespostas);

export default router;
