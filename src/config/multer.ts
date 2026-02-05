// src/config/multer.ts 

import multer from "multer";
import path from "path";
import fs from "fs";

function makeStorage(folderName: string) {
  const folderPath = path.join("src", "uploads", folderName);

  // garante que a pasta existe
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, folderPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });
}

export const uploadNoticias = multer({ storage: makeStorage("noticias") });
export const uploadDestaques = multer({ storage: makeStorage("destaques") });
