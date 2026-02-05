// back-sas/src/controller/NoticiaController.ts
import { Request, Response } from "express";
import NoticiaService, { CreateNoticiaData, UpdateNoticiaData } from "../services/NoticiaService";

export class NoticiaController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { titulo, conteudo, dataAgendada } = req.body;
      if (!titulo || titulo.trim() === "") return res.status(400).json({ error: "Título é obrigatório" });

      const url_img = req.file ? `/uploads/noticias/${req.file.filename}` : null;

      const noticiaData: CreateNoticiaData = {
        titulo: titulo.trim(),
        conteudo: conteudo ? conteudo.trim() : null,
        url_img,
        dataAgendada: dataAgendada || null,
      };

      const noticia = await NoticiaService.create(noticiaData);
      return res.status(201).json({ message: "Notícia criada", data: noticia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar notícia" });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { status } = req.query;
      const noticias = await NoticiaService.findAll(status as any);
      return res.status(200).json({ message: "Notícias recuperadas", data: noticias, total: noticias.length });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar notícias" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const noticia = await NoticiaService.findById(noticiaId);
      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

      return res.status(200).json({ message: "Notícia recuperada", data: noticia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar notícia" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const { titulo, conteudo, dataAgendada } = req.body;
      const updateData: UpdateNoticiaData = {};

      if (titulo !== undefined) {
        if (titulo.trim() === "") return res.status(400).json({ error: "Título não pode ser vazio" });
        updateData.titulo = titulo.trim();
      }

      if (conteudo !== undefined) {
        updateData.conteudo = conteudo.trim() === "" ? null : conteudo.trim();
      }

      if (dataAgendada !== undefined) {
        updateData.dataAgendada = dataAgendada;
      }

      if (req.file) {
        updateData.url_img = `/uploads/noticias/${req.file.filename}`;
      }

      const noticia = await NoticiaService.update(noticiaId, updateData);
      return res.status(200).json({ message: "Notícia atualizada", data: noticia });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar notícia" });
    }
  }

  async toggleArquivado(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const noticia = await NoticiaService.toggleArquivado(noticiaId);
      return res.status(200).json({
        message: noticia.status === "arquivado" ? "Notícia arquivada" : "Notícia desarquivada",
        data: noticia,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao arquivar/desarquivar" });
    }
  }
}

export default new NoticiaController();
