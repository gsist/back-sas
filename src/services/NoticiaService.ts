// src/services/NoticiaService.ts
import { Noticia } from '../models/Noticia';
import { Op } from 'sequelize';

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
  /**
   * Cria uma nova notícia
   */
  async createNoticia(data: CreateNoticiaData): Promise<Noticia> {
    try {
      const noticia = await Noticia.create({
        titulo: data.titulo,
        conteudo: data.conteudo || null,
        url_img: data.url_img || null,
        created_at: new Date()
      });
      
      return noticia;
    } catch (error) {
      throw new Error(`Erro ao criar notícia: ${error}`);
    }
  }

  /**
   * Busca todas as notícias
   */
  async getAllNoticias(): Promise<Noticia[]> {
  try {
    return await Noticia.findAll({
      order: [['dataCriacao', 'DESC']] // agora correto
    });
  } catch (error) {
    console.error("Erro getAllNoticias:", error);
    throw error;
  }
}

  /**
   * Busca uma notícia por ID
   */
  async getNoticiaById(id: number): Promise<Noticia | null> {
  try {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) return null;

    // Se quiser fornecer URL completa da imagem
    if (noticia.url_img) {
      noticia.url_img = `${process.env.FRONTEND_URL || 'http://localhost:3000'}${noticia.url_img}`;
    }

    return noticia;
  } catch (error) {
    throw new Error(`Erro ao buscar notícia: ${error}`);
  }
}


  /**
   * Atualiza uma notícia
   */
  async updateNoticia(id: number, data: UpdateNoticiaData): Promise<Noticia | null> {
    try {
      const noticia = await Noticia.findByPk(id);
      
      if (!noticia) {
        return null;
      }

      await noticia.update(data);
      return noticia;
    } catch (error) {
      throw new Error(`Erro ao atualizar notícia: ${error}`);
    }
  }


  /**
   * Busca notícias por termo no título ou conteúdo
   */
  async searchNoticias(term: string): Promise<Noticia[]> {
  try {
    return await Noticia.findAll({
      where: {
        [Op.or]: [
          { titulo: { [Op.like]: `%${term}%` } },
          { conteudo: { [Op.like]: `%${term}%` } }
        ]
      },
      order: [['dataCriacao', 'DESC']]
    });
  } catch (error) {
    console.error("Erro searchNoticias:", error);
    throw error;
  }
}
}

export default new NoticiaService();