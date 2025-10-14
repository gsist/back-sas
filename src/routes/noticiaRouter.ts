// src/routes/noticiaRouter.ts
import { Router } from "express";
import NoticiaController from "../controller/NoticiaController";
import { upload } from "../config/multer"; // Isso aqui é pra cosiar a imagem certinho

const noticiaRouter = Router();

// Buscar notícias
noticiaRouter.get("/search", NoticiaController.search);
noticiaRouter.get("/", NoticiaController.getAll);
noticiaRouter.get("/:id", NoticiaController.getById);

// Criar notícia com upload de imagem
noticiaRouter.post("/", upload.single("imagem"), NoticiaController.create);

// Atualizar notícia (opcional: pode receber nova imagem)
noticiaRouter.put("/:id", upload.single("imagem"), NoticiaController.update);

export default noticiaRouter;
