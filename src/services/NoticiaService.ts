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
}

export class NoticiaService {
  private getFullImageUrl(url_img?: string | null): string | null {
    if (!url_img) return null;
    const host =
      process.env.BACKEND_URL ||
      `http://localhost:${process.env.PORT_BACKEND || 3049}`;
    return `${host}${url_img}`;
  }

  async createNoticia(data: CreateNoticiaData): Promise<Noticia> {
    const noticia = await Noticia.create({
      titulo: data.titulo,
      conteudo: data.conteudo || null,
      url_img: data.url_img || null,
      ativo: true,
      dataCriacao: new Date(),
    });

    noticia.url_img = this.getFullImageUrl(noticia.url_img);
    return noticia;
  }

  async getAllNoticias(includeArchived = true): Promise<Noticia[]> {
    const whereClause = includeArchived ? {} : { ativo: true };

    const noticias = await Noticia.findAll({
      where: whereClause,
      order: [["dataCriacao", "DESC"]],
    });

    return noticias.map((n) => {
      n.url_img = this.getFullImageUrl(n.url_img);
      return n;
    });
  }

  async getNoticiaById(id: number): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;
    noticia.url_img = this.getFullImageUrl(noticia.url_img);
    return noticia;
  }

  async updateNoticia(id: number, data: UpdateNoticiaData): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    await noticia.update(data);
    noticia.url_img = this.getFullImageUrl(noticia.url_img);
    return noticia;
  }

  async toggleArquivarNoticia(id: number): Promise<Noticia | null> {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    const novoStatus = !noticia.ativo;
    await noticia.update({ ativo: novoStatus });

    noticia.url_img = this.getFullImageUrl(noticia.url_img);
    return noticia;
  }
}

export default new NoticiaService();
