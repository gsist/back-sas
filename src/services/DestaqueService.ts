// src/services/DestaqueService.ts

import { Destaque } from "../models/Destaque";

export interface CreateDestaqueData {
  titulo: string;
  url_img?: string | null;
}

export interface UpdateDestaqueData {
  titulo?: string;
  url_img?: string | null;
  arquivado?: boolean; // ✅ adicionamos aqui
}

export class DestaqueService {
  async createDestaque(data: CreateDestaqueData): Promise<Destaque> {
    return await Destaque.create({
      titulo: data.titulo,
      url_img: data.url_img || null,
      dataCriacao: new Date(),
      arquivado: false
    });
  }

  async getAllDestaques(): Promise<Destaque[]> {
    return await Destaque.findAll({
      order: [["dataCriacao", "DESC"]],
    });
  }

  async updateDestaque(id: number, data: UpdateDestaqueData): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    await destaque.update(data);
    return destaque;
  }

  async getById(id: number): Promise<Destaque | null> {
    return await Destaque.findByPk(id);
  }

  async toggleArquivarDestaque(id: number): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    destaque.arquivado = !destaque.arquivado;
    await destaque.save();
    return destaque;
  }
}

export default new DestaqueService();
