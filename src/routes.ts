// src/routes.ts
import { Router, Request, Response } from 'express';
import adRouter from './routes/Ad';
import noticiaRouter from './routes/noticiaRouter';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({   
    message: "bem vindo a API do SASC"
  });
});

// ROTAS
router.use('/ad', adRouter);
router.use('/noticias', noticiaRouter);

export default router;