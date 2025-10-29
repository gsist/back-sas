// back-sas/src/services/DestaqueService.ts
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
  // Criar destaque
  async createDestaque(data: CreateDestaqueData): Promise<Destaque> {
    return await Destaque.create({
      titulo: data.titulo,
      url_img: data.url_img || null,
      ativo: true,
      dataCriacao: new Date(),
    });
  }

  // Buscar todos os destaques (ativos e inativos)
  async getAllDestaques(): Promise<Destaque[]> {
    return await Destaque.findAll({
      order: [["dataCriacao", "DESC"]],
    });
  }

  // Buscar destaque por ID
  async getDestaqueById(id: number): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    if (destaque.url_img) {
      destaque.url_img = `${process.env.FRONTEND_URL }`;
    }
    return destaque;
  }

  // Atualizar destaque
  async updateDestaque(id: number, data: UpdateDestaqueData): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    await destaque.update(data);
    return destaque;
  }

  // Alternar ativo/inativo (arquivar/desarquivar)
  async toggleAtivoDestaque(id: number): Promise<Destaque | null> {
    const destaque = await Destaque.findByPk(id);
    if (!destaque) return null;

    destaque.ativo = !destaque.ativo;
    await destaque.save();

    return destaque;
  }
}

export default new DestaqueService();
