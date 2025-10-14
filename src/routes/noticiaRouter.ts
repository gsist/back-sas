// src/routes/noticiaRouter.ts
import { Router } from 'express';
import NoticiaController from '../controller/NoticiaController';

const noticiaRouter = Router();

noticiaRouter.get('/search', NoticiaController.search);
noticiaRouter.get('/', NoticiaController.getAll);
noticiaRouter.get('/:id', NoticiaController.getById);
noticiaRouter.post('/', NoticiaController.create);
noticiaRouter.put('/:id', NoticiaController.update);

export default noticiaRouter;