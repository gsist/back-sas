import { Destaque } from "../models/Destaque";

export interface CreateDestaqueData {
  titulo: string;
  url_img?: string | null;
}

export interface UpdateDestaqueData {
  titulo?: string;
  url_img?: string | null;
  ativo?: boolean;
}

export class DestaqueService {
  async createDestaque(data: CreateDestaqueData): Promise<Destaque> {
    return await Destaque.create({
      titulo: data.titulo,
      url_img: data.url_img || null,
      ativo: true,
      dataCriacao: new Date(),
    });
  }

  async getAllDestaques(): Promise<Destaque[]> {
    return await Destaque.findAll({
      where: { ativo: true },
      order: [["dataCriacao", "DESC"]],
    });
  }

  async getDestaqueById(id: number): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque || !destaque.ativo) return null;

    if (destaque.url_img) {
      destaque.url_img = `${process.env.FRONTEND_URL || "http://localhost:3000"}${destaque.url_img}`;
    }
    return destaque;
  }

  async updateDestaque(id: number, data: UpdateDestaqueData): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    await destaque.update(data);
    return destaque;
  }

  // ✅ Novo método para alternar ativo/inativo
  async toggleAtivoDestaque(id: number): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    destaque.ativo = !destaque.ativo;
    await destaque.save();

    return destaque;
  }
}

export default new DestaqueService();
