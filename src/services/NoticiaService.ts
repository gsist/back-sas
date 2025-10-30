// back-sas/src/services/NoticiaService.ts
import { Noticia } from "../models/Noticia";
import { Op } from "sequelize";

export interface CreateNoticiaData {
  titulo: string;
  conteudo?: string | null;
  url_img?: string | null;
  dataAgendada?: string | null;
}

export interface UpdateNoticiaData extends Partial<CreateNoticiaData> {
  status?: "arquivado" | "programado" | "postado";
}

export class NoticiaService {
  async create(data: CreateNoticiaData) {
    const status: "programado" | "postado" = data.dataAgendada ? "programado" : "postado";
    return await Noticia.create({ ...data, status });
  }

  async findAll(statusFilter?: "arquivado" | "programado" | "postado") {
    await this.publicarProgramadas();
    const where: any = {};
    if (statusFilter) where.status = statusFilter;
    return await Noticia.findAll({ where });
  }

  async findById(id: number) {
    await this.publicarProgramadas();
    return await Noticia.findByPk(id);
  }

  async update(id: number, data: UpdateNoticiaData) {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) throw new Error("Notícia não encontrada");

    if ("dataAgendada" in data) {
      data.status = data.dataAgendada ? "programado" : "postado";
    }

    return await noticia.update(data);
  }

  async toggleArquivado(id: number) {
    const noticia = await Noticia.findByPk(id);
    if (!noticia) throw new Error("Notícia não encontrada");

    const novoStatus: "arquivado" | "postado" = noticia.status === "arquivado" ? "postado" : "arquivado";
    await noticia.update({ status: novoStatus });
    return noticia;
  }

  async publicarProgramadas() {
    const agora = new Date();
    const noticias = await Noticia.findAll({
      where: {
        status: "programado",
        dataAgendada: { [Op.lte]: agora },
      },
    });

    for (const noticia of noticias) {
      await noticia.update({ status: "postado" });
    }
  }
}

export default new NoticiaService();
