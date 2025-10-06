// src/controller/PessoaController.ts
import { Request, Response } from "express";
import { PessoaService } from "../services/PessoaService";
import { CreatePessoaService } from "../services/CreatePessoaService";
import { UpdatePessoaStatusService } from "../services/UpdatePessoaStatusService";

const pessoaService = new PessoaService();
const createPessoaService = new CreatePessoaService();
const updatePessoaStatusService = new UpdatePessoaStatusService();

export class PessoaController {
  async getAll(req: Request, res: Response) {
    try {
      const pessoas = await pessoaService.getAll();
      res.json(pessoas);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pessoas", error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const pessoa = await pessoaService.getById(Number(req.params.id));
      if (!pessoa) {
        return res.status(404).json({ message: "Pessoa não encontrada" });
      }
      res.json(pessoa);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pessoa", error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const pessoa = await createPessoaService.create(req.body);
      res.status(201).json(pessoa);
    } catch (error: any) {
      console.error("❌ Erro detalhado ao criar pessoa:", error.message);

      if (
        error.message.includes("CPF já cadastrado") ||
        error.message.includes("NIS já cadastrado")
      ) {
        return res.status(400).json({ message: error.message });
      }

      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((e: any) => ({
          path: e.path,
          message: e.message,
          value: e.value,
        }));
        return res
          .status(400)
          .json({ message: "Erro de validação", details: validationErrors });
      }

      res
        .status(500)
        .json({ message: "Erro ao criar pessoa", error: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status)
        return res.status(400).json({ message: "Status é obrigatório" });

      const pessoa = await updatePessoaStatusService.updateStatus(
        Number(id),
        status
      );
      res.json(pessoa);
    } catch (error: any) {
      res
        .status(500)
        .json({
          message: "Erro ao atualizar status da pessoa",
          error: error.message,
        });
    }
  }
}
