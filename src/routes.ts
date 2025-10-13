// src/routes.ts
import { Router, Request, Response } from 'express';
import pessoaRouter from './routes/pessoaRouter';
import adRouter from './routes/Ad';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({   
    message: "bem vindo a API do MCMV"
  });
});

// ROTAS
router.use('/api/pessoa', pessoaRouter);
router.use('/ad', adRouter);

export default router;