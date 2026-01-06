// back-sas/src/controller/PreCadastroController.ts
import { Request, Response } from "express";
import { UsuarioAd } from "../models/UsuarioAd";

export default class PreCadastroController {
  async listAll(req: Request, res: Response) {
    try {
      const usuarios = await UsuarioAd.findAll({
        order: [["id", "DESC"]],
      });
      res.json({ usuarios });
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  async listCargos(req: Request, res: Response) {
    try {
      const cargos = [
        { id: 1, cargo: "administrador" },
        { id: 2, cargo: "superadmin" }
      ];
      res.json({ cargos });
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar cargos" });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      console.log("Recebendo requisição:", req.body);
      
      const { username, cargo } = req.body;

      if (!username) {
        return res.status(400).json({ message: "Username é obrigatório" });
      }

      if (!cargo) {
        return res.status(400).json({ message: "Cargo é obrigatório" });
      }

      console.log("Username:", username, "Cargo:", cargo);

      const cargoNome = cargo === 1 ? "administrador" : "superadmin";
      console.log("Cargo convertido para:", cargoNome);

      const existing = await UsuarioAd.findOne({ where: { username } });
      if (existing) {
        return res.status(400).json({ message: "Username já existe" });
      }

      console.log("Criando novo usuário...");

      const novo = await UsuarioAd.create({
        username,
        cargo: cargoNome,
        ch_ativo: 1,
        ativo_2fa: 0,
        criado_em: new Date(),
      });

      console.log("Usuário criado com sucesso:", novo);
      return res.json({ message: "Usuário criado com sucesso", usuario: novo });
    } catch (err: any) {
      console.error("Erro detalhado ao criar usuário:", err.message);
      console.error("Stack:", err.stack);
      console.error("SQL Error:", err.sql);
      return res.status(500).json({ 
        message: "Erro interno ao criar usuário",
        error: err.message 
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { ch_ativo, cargo } = req.body;

      const user = await UsuarioAd.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (typeof ch_ativo !== 'undefined') {
        user.ch_ativo = ch_ativo;
      }

      if (cargo) {
        const cargoNome = cargo === 1 ? "administrador" : "superadmin";
        user.cargo = cargoNome;
      }

      await user.save();

      res.json({ message: "Usuário atualizado com sucesso", user });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      res.status(500).json({ message: "Erro ao atualizar usuário" });
    }
  }
}