// src/controller/NoticiaController.ts
import { Request, Response } from "express";
import NoticiaService, { CreateNoticiaData, UpdateNoticiaData } from "../services/NoticiaService";

export class NoticiaController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { titulo, conteudo } = req.body;
      if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ error: "Título é obrigatório em notícia" });
      }

      const url_img = req.file ? `/uploads/noticias/${req.file.filename}` : null;

      const noticiaData: CreateNoticiaData = {
        titulo: titulo.trim(),
        conteudo: conteudo ? conteudo.trim() : null,
        url_img,
      };

      const noticia = await NoticiaService.createNoticia(noticiaData);

      return res.status(201).json({ message: "Notícia criada com sucesso", data: noticia });
    } catch (error) {
      console.error("Erro ao criar notícia:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao criar notícia" });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const noticias = await NoticiaService.getAllNoticias(true);
      return res.status(200).json({
        message: "Notícias recuperadas com sucesso",
        data: noticias,
        total: noticias.length,
      });
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao buscar notícias" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(id, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const noticia = await NoticiaService.getNoticiaById(noticiaId);
      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

      return res.status(200).json({ message: "Notícia recuperada com sucesso", data: noticia });
    } catch (error) {
      console.error("Erro ao buscar notícia:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao buscar notícia" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const idParam = req.params.id;
      if (!idParam) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(idParam, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const { titulo, conteudo } = req.body;
      const updateData: UpdateNoticiaData = {};

      if (titulo !== undefined) {
        if (titulo.trim() === "") return res.status(400).json({ error: "Título não pode ser vazio" });
        updateData.titulo = titulo.trim();
      }

      if (conteudo !== undefined) {
        updateData.conteudo = conteudo.trim() === "" ? null : conteudo.trim();
      }

      if (req.file) {
        updateData.url_img = `/uploads/noticias/${req.file.filename}`;
      }

      const noticia = await NoticiaService.updateNoticia(noticiaId, updateData);
      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

      return res.status(200).json({ message: "Notícia atualizada com sucesso", data: noticia });
    } catch (error) {
      console.error("Erro ao atualizar notícia:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao atualizar notícia" });
    }
  }

  async arquivar(req: Request, res: Response): Promise<Response> {
    try {
      const idParam = req.params.id;
      if (!idParam) return res.status(400).json({ error: "ID é obrigatório" });

      const noticiaId = parseInt(idParam, 10);
      if (isNaN(noticiaId)) return res.status(400).json({ error: "ID inválido" });

      const noticia = await NoticiaService.toggleArquivarNoticia(noticiaId);
      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada" });

      return res.status(200).json({
        message: noticia.ativo ? "Notícia desarquivada com sucesso" : "Notícia arquivada com sucesso",
        data: noticia,
      });
    } catch (error) {
      console.error("Erro ao arquivar/desarquivar notícia:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao arquivar/desarquivar notícia" });
    }
  }
}

export default new NoticiaController();
