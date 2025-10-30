// back-sas/src/routes/noticiaRouter.ts
import { Router } from "express";
import NoticiaController from "../controller/NoticiaController";
import { uploadNoticias } from "../config/multer";

const noticiaRouter = Router();

noticiaRouter.get("/", (req, res) => NoticiaController.getAll(req, res));
noticiaRouter.get("/:id", (req, res) => NoticiaController.getById(req, res));
noticiaRouter.put("/arquivar/:id", (req, res) => NoticiaController.toggleArquivado(req, res));
noticiaRouter.post("/create", uploadNoticias.single("imagem"), (req, res) => NoticiaController.create(req, res));
noticiaRouter.put("/:id", uploadNoticias.single("imagem"), (req, res) => NoticiaController.update(req, res));

export default noticiaRouter;
