// src/controller/NoticiaController.ts
import { Request, Response } from 'express';
import NoticiaService, { CreateNoticiaData, UpdateNoticiaData } from '../services/NoticiaService';

export class NoticiaController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { titulo, conteudo, url_img } = req.body;

      if (!titulo || titulo.trim() === '') {
        return res.status(400).json({ error: 'Título é obrigatório' });
      }

      const noticiaData: CreateNoticiaData = {
        titulo: titulo.trim(),
        conteudo: conteudo ? conteudo.trim() : null,
        url_img: url_img ? url_img.trim() : null,
      };

      const noticia = await NoticiaService.createNoticia(noticiaData);

      return res.status(201).json({ message: 'Notícia criada com sucesso', data: noticia });
    } catch (error) {
      console.error('Erro ao criar notícia:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao criar notícia' });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const noticias = await NoticiaService.getAllNoticias();
      return res.status(200).json({ message: 'Notícias recuperadas com sucesso', data: noticias, total: noticias.length });
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao buscar notícias' });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' });
      }

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const noticia = await NoticiaService.getNoticiaById(noticiaId);
      if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });

      return res.status(200).json({ message: 'Notícia recuperada com sucesso', data: noticia });
    } catch (error) {
      console.error('Erro ao buscar notícia:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao buscar notícia' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ error: 'ID é obrigatório' });

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: 'ID inválido' });

      const { titulo, conteudo, url_img } = req.body;

      const updateData: UpdateNoticiaData = {};
      if (titulo !== undefined) {
        if (titulo.trim() === '') return res.status(400).json({ error: 'Título não pode ser vazio' });
        updateData.titulo = titulo.trim();
      }

      updateData.conteudo = conteudo !== undefined ? (conteudo ? conteudo.trim() : null) : undefined;
      updateData.url_img = url_img !== undefined ? (url_img ? url_img.trim() : null) : undefined;

      const noticia = await NoticiaService.updateNoticia(noticiaId, updateData);
      if (!noticia) return res.status(404).json({ error: 'Notícia não encontrada' });

      return res.status(200).json({ message: 'Notícia atualizada com sucesso', data: noticia });
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao atualizar notícia' });
    }
  }

  async search(req: Request, res: Response): Promise<Response> {
    try {
      const q = req.query.q;
      if (!q || typeof q !== 'string' || q.trim() === '') return res.status(400).json({ error: 'Termo de busca é obrigatório' });

      const noticias = await NoticiaService.searchNoticias(q.trim());
      return res.status(200).json({ message: 'Busca realizada com sucesso', data: noticias, total: noticias.length, term: q.trim() });
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return res.status(500).json({ error: 'Erro interno do servidor ao buscar notícias' });
    }
  }
}

export default new NoticiaController();
