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
      const noticias = await Noticia.findAll({
        order: [['created_at', 'DESC']]
      });
      
      return noticias;
    } catch (error) {
      throw new Error(`Erro ao buscar notícias: ${error}`);
    }
  }

  /**
   * Busca uma notícia por ID
   */
  async getNoticiaById(id: number): Promise<Noticia | null> {
    try {
      const noticia = await Noticia.findByPk(id);
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
      const noticias = await Noticia.findAll({
        where: {
          [Op.or]: [
            { titulo: { [Op.like]: `%${term}%` } },
            { conteudo: { [Op.like]: `%${term}%` } }
          ]
        },
        order: [['created_at', 'DESC']]
      });
      
      return noticias;
    } catch (error) {
      throw new Error(`Erro ao buscar notícias: ${error}`);
    }
  }
}

export default new NoticiaService();