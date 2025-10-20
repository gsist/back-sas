// src/routes/destaqueRouter.ts
import { Router } from "express";
import DestaqueController from "../controller/DestaqueController";
import { uploadDestaques } from "../config/multer";

const destaqueRouter = Router();

// Listar todos os destaques
destaqueRouter.get("/", DestaqueController.getAll);

// Criar destaque com upload de imagem
destaqueRouter.post("/create", uploadDestaques.single("url_img"), DestaqueController.create);

// Atualizar destaque com upload de imagem
destaqueRouter.put("/:id", uploadDestaques.single("url_img"), DestaqueController.update);

// Arquivar / Desarquivar destaque
destaqueRouter.put("/arquivar/:id", DestaqueController.arquivar);

export default destaqueRouter;
