import { Router } from "express";
import DestaqueController from "../controller/DestaqueController";
import { uploadDestaques } from "../config/multer";

const destaqueRouter = Router();

// Listar todos
destaqueRouter.get("/", DestaqueController.getAll);

// Buscar por ID
destaqueRouter.get("/:id", DestaqueController.getById);

// Criar com uploadDestaques de imagem
destaqueRouter.post("/", uploadDestaques.single("url_img"), DestaqueController.create);

// Atualizar com uploadDestaques de imagem
destaqueRouter.put("/:id", uploadDestaques.single("url_img"), DestaqueController.update);

export default destaqueRouter;
