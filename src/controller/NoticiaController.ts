import { Request, Response } from "express";
import { Noticia } from "../models/Noticia";
import path from "path";
import fs from "fs";

export class NoticiaController {
  // ✅ Criar nova notícia
  static async criar(req: Request, res: Response) {
    try {
      const { titulo, conteudo } = req.body;
      let imagemUrl: string | null = null;

      // se foi feito upload da imagem
      if (req.file) {
        imagemUrl = `/uploads/${req.file.filename}`;
      }

      const novaNoticia = await Noticia.create({
        titulo,
        conteudo,
        imagem: imagemUrl,
      });

      return res.status(201).json(novaNoticia);
    } catch (err: any) {
      console.error("Erro ao criar notícia:", err);
      return res.status(500).json({ error: "Erro ao criar notícia." });
    }
  }

  // ✅ Atualizar notícia existente
  static async atualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, conteudo } = req.body;

      const noticia = await Noticia.findByPk(id);
      if (!noticia) {
        return res.status(404).json({ error: "Notícia não encontrada." });
      }

      // Se veio nova imagem
      if (req.file) {
        // apaga a antiga se existir
        if (noticia.url_img) {
          const caminhoAntigo = path.join(__dirname, "../../", noticia.url_img);
          if (fs.existsSync(caminhoAntigo)) fs.unlinkSync(caminhoAntigo);
        }

        noticia.url_img = `/uploads/${req.file.filename}`;
      }

      noticia.titulo = titulo ?? noticia.titulo;
      noticia.conteudo = conteudo ?? noticia.conteudo;

      await noticia.save();

      return res.json(noticia);
    } catch (err: any) {
      console.error("Erro ao atualizar notícia:", err);
      return res.status(500).json({ error: "Erro ao atualizar notícia." });
    }
  }

  // ✅ Listar todas
  static async listar(req: Request, res: Response) {
    try {
      const noticias = await Noticia.findAll({ order: [["id", "DESC"]] });
      return res.json(noticias);
    } catch (err: any) {
      console.error("Erro ao listar notícias:", err);
      return res.status(500).json({ error: "Erro ao listar notícias." });
    }
  }

  // ✅ Buscar por ID
  static async buscarPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noticia = await Noticia.findByPk(id);

      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada." });

      return res.json(noticia);
    } catch (err: any) {
      console.error("Erro ao buscar notícia:", err);
      return res.status(500).json({ error: "Erro ao buscar notícia." });
    }
  }

  // ✅ Deletar (opcional)
  static async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const noticia = await Noticia.findByPk(id);

      if (!noticia) return res.status(404).json({ error: "Notícia não encontrada." });

      // remover imagem se existir
      if (noticia.url_img) {
        const caminho = path.join(__dirname, "../../", noticia.url_img);
        if (fs.existsSync(caminho)) fs.unlinkSync(caminho);
      }

      await noticia.destroy();

      return res.json({ message: "Notícia removida com sucesso." });
    } catch (err: any) {
      console.error("Erro ao deletar notícia:", err);
      return res.status(500).json({ error: "Erro ao deletar notícia." });
    }
  }
}
