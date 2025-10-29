// back-sas/src/services/NoticiaService.ts
import { Noticia } from "../models/Noticia";

export interface CreateNoticiaData {
  titulo: string;
  conteudo?: string | null;
  url_img?: string | null;
}

export interface UpdateNoticiaData {
  titulo?: string;
  conteudo?: string | null;
  url_img?: string | null;
  ativo?: boolean;
}

export class NoticiaService {
  async createNoticia(data: CreateNoticiaData): Promise<Noticia> {
    return await Noticia.create({
      titulo: data.titulo,
      conteudo: data.conteudo || null,
      url_img: data.url_img || null,
      ativo: true,
      dataCriacao: new Date(),
    });
  }

  async getAllNoticias(): Promise<Noticia[]> {
    return await Noticia.findAll({
      order: [["dataCriacao", "DESC"]],
    });
  }

  async getNoticiaById(id: number): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    // Remove a modificação da URL da imagem aqui
    // Deixa a URL como está no banco de dados
    return noticia;
  }

  async updateNoticia(id: number, data: UpdateNoticiaData): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    await noticia.update(data);
    return noticia;
  }

  async toggleAtivoNoticia(id: number): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    noticia.ativo = !noticia.ativo;
    await noticia.save();

    return noticia;
  }
}

export default new NoticiaService();