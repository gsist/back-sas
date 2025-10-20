// src/controller/DestaqueController.ts
import { Request, Response } from "express";
import DestaqueService, { CreateDestaqueData, UpdateDestaqueData } from "../services/DestaqueService";

export class DestaqueController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const titulo = req.body.titulo || req.body?.fields?.titulo;
      if (!titulo || titulo.trim() === "") {
        return res.status(400).json({ error: "Título é obrigatório em destaque" });
      }

      const url_img = req.file ? `/uploads/destaques/${req.file.filename}` : null;

      const destaqueData: CreateDestaqueData = { titulo: titulo.trim(), url_img };
      const destaque = await DestaqueService.createDestaque(destaqueData);

      return res.status(201).json({ message: "Destaque criado com sucesso", data: destaque });
    } catch (error) {
      console.error("Erro ao criar destaque:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao criar destaque" });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const destaques = await DestaqueService.getAllDestaques();
      return res.status(200).json({ message: "Destaques recuperados com sucesso", data: destaques });
    } catch (error) {
      console.error("Erro ao buscar destaques:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao buscar destaques" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const destaqueId = parseInt(id, 10);
      if (isNaN(destaqueId)) return res.status(400).json({ error: "ID inválido" });

      const titulo = req.body.titulo || req.body?.fields?.titulo;
      const updateData: UpdateDestaqueData = {};

      if (titulo !== undefined) {
        if (titulo.trim() === "") return res.status(400).json({ error: "Título não pode ser vazio" });
        updateData.titulo = titulo.trim();
      }

      if (req.file) {
        updateData.url_img = `/uploads/destaques/${req.file.filename}`;
      }

      const destaque = await DestaqueService.updateDestaque(destaqueId, updateData);
      if (!destaque) return res.status(404).json({ error: "Destaque não encontrado" });

      return res.status(200).json({ message: "Destaque atualizado com sucesso", data: destaque });
    } catch (error) {
      console.error("Erro ao atualizar destaque:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao atualizar destaque" });
    }
  }

  async arquivar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID é obrigatório" });

      const destaqueId = parseInt(id, 10);
      if (isNaN(destaqueId)) return res.status(400).json({ error: "ID inválido" });

      const destaque = await DestaqueService.toggleAtivoDestaque(destaqueId);
      if (!destaque) return res.status(404).json({ error: "Destaque não encontrado" });

      return res.status(200).json({
        message: `Destaque ${destaque.ativo ? "ativado" : "arquivado"} com sucesso`,
        data: destaque,
      });
    } catch (error) {
      console.error("Erro ao arquivar/desarquivar destaque:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao arquivar/desarquivar destaque" });
    }
  }
}

export default new DestaqueController();

