// back-sas/src/routes/PreCadastroRouter.ts
import { Router } from "express";
import PreCadastro from "../controller/PreCadastroController";

const router = Router();
const manager = new PreCadastro();

router.get("/cargos", manager.listCargos.bind(manager));
router.get("/usuarios", manager.listAll.bind(manager));
router.post("/usuario", manager.createUser.bind(manager));
router.put("/usuario/:id", manager.updateUser.bind(manager));

export default router;