// src/config/multer.ts

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // pasta de destino
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`; // evita conflitos de nome
    cb(null, filename);
  },
});

export const upload = multer({ storage });
