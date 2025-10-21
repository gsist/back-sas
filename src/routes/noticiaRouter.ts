// src/routes/noticiaRouter.ts
import { Router } from "express";
import NoticiaController from "../controller/NoticiaController";
import { uploadNoticias } from "../config/multer";

const noticiaRouter = Router();

// Buscar todas as notícias
noticiaRouter.get("/", NoticiaController.getAll);

// Buscar notícia por ID
noticiaRouter.get("/:id", NoticiaController.getById);

// Arquivar / Desarquivar notícia
noticiaRouter.put("/arquivar/:id", NoticiaController.arquivar);

// Criar notícia (com upload de imagem)
noticiaRouter.post("/create", uploadNoticias.single("imagem"), NoticiaController.create);

// Atualizar notícia (com upload de imagem opcional)
noticiaRouter.put("/:id", uploadNoticias.single("imagem"), NoticiaController.update);

export default noticiaRouter;
