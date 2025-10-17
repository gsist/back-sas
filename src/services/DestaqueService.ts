// src/services/DestaqueService.ts
import { Destaque } from "../models/Destaque";

export interface CreateDestaqueData {
  titulo: string;
  url_img?: string | null;
}

export interface UpdateDestaqueData {
  titulo?: string;
  url_img?: string | null;
}

export class DestaqueService {
  async createDestaque(data: CreateDestaqueData): Promise<Destaque> {
    try {
      return await Destaque.create({
        titulo: data.titulo,
        url_img: data.url_img || null,
        dataCriacao: new Date(),
      });
    } catch (error) {
      throw new Error(`Erro ao criar destaque: ${error}`);
    }
  }

  async getAllDestaques(): Promise<Destaque[]> {
    try {
      return await Destaque.findAll({
        order: [["dataCriacao", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Erro ao buscar destaques: ${error}`);
    }
  }

  async getDestaqueById(id: number): Promise<Destaque | null> {
    try {
      const destaque = await Destaque.findByPk(id);
      if (!destaque) return null;

      if (destaque.url_img) {
        destaque.url_img = `${process.env.FRONTEND_URL || "http://localhost:3000"}${destaque.url_img}`;
      }

      return destaque;
    } catch (error) {
      throw new Error(`Erro ao buscar destaque: ${error}`);
    }
  }

  async updateDestaque(id: number, data: UpdateDestaqueData): Promise<Destaque | null> {
    try {
      const destaque = await Destaque.findByPk(id);
      if (!destaque) return null;

      await destaque.update(data);
      return destaque;
    } catch (error) {
      throw new Error(`Erro ao atualizar destaque: ${error}`);
    }
  }
}

export default new DestaqueService();
