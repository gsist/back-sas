import { Router } from "express";
import multer from "multer";
import path from "path";
import { NoticiaController } from "../controller/NoticiaController";

// Configuração do multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const router = Router();

router.get("/", NoticiaController.listar);
router.get("/:id", NoticiaController.buscarPorId);
router.delete("/:id", NoticiaController.deletar);

export default router;
