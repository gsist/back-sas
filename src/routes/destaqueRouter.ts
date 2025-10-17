// src/routes/destaqueRouter.ts
import { Router } from "express";
import DestaqueController from "../controller/DestaqueController";
import { uploadDestaques } from "../config/multer";

const destaqueRouter = Router();

// Listar todos
destaqueRouter.get("/", DestaqueController.getAll);

// Buscar por ID
destaqueRouter.get("/:id", DestaqueController.getById);

// Criar com upload de imagem
destaqueRouter.post("/create", uploadDestaques.single("url_img"), DestaqueController.create); // Corrigido de /creat para /create

// Atualizar com upload de imagem
destaqueRouter.put("/:id", uploadDestaques.single("url_img"), DestaqueController.update);

export default destaqueRouter;