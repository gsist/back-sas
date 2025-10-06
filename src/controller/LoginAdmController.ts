// src/controller/LoginAdmController.ts
import { Request, Response } from "express";
import { LoginAdmService } from "../services/LoginAdmService";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import axios from "axios";

const loginAdmService = new LoginAdmService();

export default class LoginAdmController {
  // ==== Helpers internos (somente Controller) ====
  private logAuthAttempt({
    username,
    success,
    ip,
    reason,
  }: {
    username: string;
    success: boolean;
    ip: string;
    reason: string;
  }) {
    const logDir = path.join(__dirname, "../../logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path.join(logDir, "auth.log");
    const entry = `[${new Date().toISOString()}] [${ip}] [${username}] [${
      success ? "SUCCESS" : "FAIL"
    }] [${reason}]\n`;
    fs.appendFileSync(logFile, entry);
  }

  private generateToken(username: string) {
    const secret = process.env.TOKEN_SECRET_AD_GROUPS || "default-secret-key";
    return jwt.sign({ username }, secret, { expiresIn: "1d" });
  }

  // ==== Métodos Públicos (usados nas rotas) ====

  // 1. Login AD (primeira etapa)
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userIp =
      req.ip || req.headers["x-forwarded-for"] || (req.connection as any).remoteAddress;

    try {
      console.log(`🔐 Tentativa de login AD para: ${username}`);
      const pyApi = process.env.PYTHON_AUTH_API_GROUPS;
      if (!pyApi) throw new Error("URL da API Python não configurada");

      const result = await axios.post(pyApi, { username, password }, { timeout: 3000 });
      const data: any = result.data;

      if (!data.success || !data.username || !data.groups) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "Dados inválidos da API Python" });
        return res.status(401).json({ message: "Usuário ou senha inválidos." });
      }

      const hasAccess = data.groups.includes("GL_Drts_HostAdmin_MINHACASA");
      if (!hasAccess) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "Sem acesso ao grupo" });
        return res.status(403).json({ message: "Usuário sem permissão para acessar o sistema." });
      }

      // Verifica status 2FA
      const userStatus = await loginAdmService.getUser2FAStatus(username);

      if (userStatus.has2FA) {
        this.logAuthAttempt({ username, success: true, ip: userIp, reason: "Aguardando 2FA" });
        return res.json({
          message: "Autenticação AD OK. Verificação 2FA necessária.",
          requires2FA: true,
          username,
          userId: userStatus.userId,
        });
      } else if (userStatus.userId) {
        this.logAuthAttempt({ username, success: true, ip: userIp, reason: "2FA não configurado" });
        return res.json({
          message: "Autenticação AD OK. Configure o 2FA.",
          requires2FA: false,
          username,
          needs2FASetup: true,
          userId: userStatus.userId,
        });
      } else {
        this.logAuthAttempt({ username, success: true, ip: userIp, reason: "Usuário não encontrado no banco" });
        return res.json({
          message: "Autenticação AD OK. Usuário precisa ser registrado no sistema.",
          requires2FA: false,
          username,
          needsRegistration: true,
          needs2FASetup: true,
        });
      }
    } catch (err: any) {
      console.error("❌ Erro no login:", err.message);
      this.logAuthAttempt({ username, success: false, ip: userIp, reason: err.message });

      let errorMessage = "Falha na autenticação. Verifique seus dados e tente novamente";
      if (err.code === "ECONNREFUSED") errorMessage = "Serviço de autenticação indisponível";
      else if (err.response?.status === 401) errorMessage = "Usuário ou senha inválidos";

      return res.status(503).json({ errors: errorMessage, message: err.message });
    }
  }

  // 2. Setup 2FA
  async setup2FA(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ message: "Username é obrigatório" });

      const secretData = await loginAdmService.generate2FASecret(username);
      res.json({
        message: "Segredo 2FA gerado com sucesso",
        secret: secretData.secret,
        otpauth_url: secretData.otpauth_url,
        qrCodeUrl: secretData.qrCodeUrl,
        username,
      });
    } catch (error: any) {
      console.error("❌ Erro ao configurar 2FA:", error.message);
      res.status(500).json({ message: "Erro ao configurar 2FA", error: error.message });
    }
  }

  // 3. Verificar código 2FA
  async verify2FA(req: Request, res: Response) {
    const { username, code } = req.body;
    const userIp = req.ip || req.headers["x-forwarded-for"] || (req.connection as any).remoteAddress;

    try {
      const verified = await loginAdmService.verify2FACode(username, code);

      if (!verified) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "Código 2FA inválido" });
        return res.status(401).json({ message: "Código 2FA inválido" });
      }

      this.logAuthAttempt({ username, success: true, ip: userIp, reason: "2FA OK" });
      const token = this.generateToken(username);

      res.cookie("auth_admin", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({ message: "USUÁRIO LOGADO COM SUCESSO", token, username });
    } catch (error: any) {
      console.error(`❌ Erro na verificação 2FA para ${username}:`, error.message);
      this.logAuthAttempt({ username, success: false, ip: userIp, reason: error.message });
      return res.status(400).json({ message: error.message });
    }
  }

  // 4. Verificar status do 2FA
  async check2FARequired(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ message: "Username é obrigatório" });

      const userStatus = await loginAdmService.getUser2FAStatus(username);
      res.json({
        username: userStatus.username,
        userId: userStatus.userId,
        requires2FA: userStatus.has2FA,
        is2FASetup: userStatus.is2FASetup,
        needs2FASetup: userStatus.needs2FASetup,
        message: userStatus.has2FA
          ? "2FA necessário"
          : userStatus.needs2FASetup
          ? "Configure o 2FA"
          : "2FA não configurado",
      });
    } catch (error: any) {
      console.error("❌ Erro ao verificar 2FA:", error.message);
      res.status(500).json({ message: "Erro ao verificar 2FA", error: error.message });
    }
  }

  // 5. Logout
  async logout(req: Request, res: Response) {
    res.clearCookie("auth_admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ message: "Logout realizado com sucesso" });
  }

  // 6. Verificar usuário logado
  async checkUserAdmin(req: Request, res: Response) {
    const cookie_token = req.cookies?.auth_admin as string | undefined;
    try {
      if (!cookie_token) return res.status(401).json({ errors: "Token ausente" });

      const secret = process.env.TOKEN_SECRET_AD_GROUPS || "default-secret-key";
      const data = jwt.verify(cookie_token, secret) as { username: string };
      const { username } = data;
      const firstName = username.split(".")[0];
      return res.json({ name: firstName, username });
    } catch (error: any) {
      return res.status(401).json({ errors: "Token inválido" });
    }
  }

  // ==== Utilitário estático para Service ====
  static async verify2FACode(username: string, code: string): Promise<boolean> {
    return await loginAdmService.verify2FACode(username, code);
  }
}
