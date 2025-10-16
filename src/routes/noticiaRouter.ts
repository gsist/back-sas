// src/routes/noticiaRouter.ts
import { Router } from "express";
import NoticiaController from "../controller/NoticiaController";
import { uploadNoticias } from "../config/multer";

const noticiaRouter = Router();

noticiaRouter.get("/", NoticiaController.getAll);
noticiaRouter.get("/search", NoticiaController.search);
noticiaRouter.get("/:id", NoticiaController.getById);

// Aqui: upload de uma imagem
noticiaRouter.post("/creat", uploadNoticias.single("imagem"), NoticiaController.create);
noticiaRouter.put("/:id", uploadNoticias.single("imagem"), NoticiaController.update);

export default noticiaRouter;
