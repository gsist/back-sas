// src/routes.ts
import { Router, Request, Response } from 'express';
import adRouter from './routes/Ad';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({   
    message: "bem vindo a API do MCMV"
  });
});

// ROTAS
router.use('/ad', adRouter);

export default router;