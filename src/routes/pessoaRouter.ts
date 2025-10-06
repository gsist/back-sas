// routes/pessoaRouter.ts
import { Router } from 'express';
import { PessoaController } from '../controller/PessoaController';

const router = Router();
const pessoaController = new PessoaController();

// Lista todas as pessoas
router.get('/', pessoaController.getAll.bind(pessoaController));

// Busca uma pessoa por ID
router.get('/:id', pessoaController.getById.bind(pessoaController));

// Cria uma nova pessoa
router.post('/', pessoaController.create.bind(pessoaController));

// Atualiza somente o status da pessoa
router.put('/:id/status', pessoaController.updateStatus.bind(pessoaController));

export default router;
