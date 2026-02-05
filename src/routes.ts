// src/routes.ts
import { Router, Request, Response } from 'express';
import adRouter from './routes/Ad';
import noticiaRouter from './routes/noticiaRouter';
import destaqueRouter from './routes/destaqueRouter';
import PreCadastro from "./routes/PreCadastroRouter";

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({   
    message: "bem vindo a API do SASC"
  });
});

// ROTAS
router.use('/ad', adRouter);
router.use('/noticias', noticiaRouter);
router.use('/destaques', destaqueRouter);
router.use("/precadastro", PreCadastro);


export default router;