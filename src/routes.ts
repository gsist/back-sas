// src/routes.ts
import { Router, Request, Response } from 'express';
import adRouter from './routes/Ad';
import noticiaRouter from './routes/noticiaRouter';
import destaqueRouter from './routes/destaqueRouter';

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


export default router;