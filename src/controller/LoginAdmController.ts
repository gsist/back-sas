// src/controller/LoginAdmController.ts
import { Request, Response } from "express";
import { LoginAdmService } from "../services/LoginAdmService";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import axios from "axios";

const loginAdmService = new LoginAdmService();

export default class LoginAdmController {

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
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
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

  /**
   * LOGIN AD + REGRA DE ACESSO + STATUS 2FA
   */
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    const userIp = req.ip || req.headers["x-forwarded-for"] || (req.connection as any).remoteAddress;

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

      const requiredGroup = process.env.GRUPO_AD;
      const hasAccess = data.groups.includes(requiredGroup);

      if (!hasAccess) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "Sem acesso ao grupo" });
        return res.status(403).json({ message: "Usuário sem permissão para acessar o sistema." });
      }

      const userStatus = await loginAdmService.getUser2FAStatus(username);

      // Usuário existe mas está inativo
      if (userStatus.userId && userStatus.isActive === false) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "Usuário inativado" });
        return res.status(403).json({ message: "Usuário inativado. Entre em contato com o administrador." });
      }

      // Usuário tem 2FA ativo
      if (userStatus.has2FA) {
        this.logAuthAttempt({ username, success: true, ip: userIp, reason: "Aguardando 2FA" });
        return res.json({
          message: "Autenticação AD OK. Verificação 2FA necessária.",
          requires2FA: true,
          username,
          userId: userStatus.userId,
        });
      }

      // Usuário existe mas ainda não configurou 2FA
      if (userStatus.userId) {
        this.logAuthAttempt({ username, success: true, ip: userIp, reason: "2FA não configurado" });
        return res.json({
          message: "Autenticação AD OK. Configure o 2FA.",
          requires2FA: false,
          needs2FASetup: true,
          username,
          userId: userStatus.userId,
        });
      }

      // Usuário NÃO existe no banco → permitir login AD, mas pedir cadastro interno
      this.logAuthAttempt({ username, success: true, ip: userIp, reason: "Usuário não encontrado no banco" });
      return res.json({
        message: "Autenticação AD OK. Usuário não possui cadastro interno.",
        requires2FA: false,
        needsRegistration: true,
        needs2FASetup: false,
        username
      });

    } catch (err: any) {
      console.error("❌ Erro no login:", err.message);
      this.logAuthAttempt({ username, success: false, ip: userIp, reason: err.message });

      let msg = "Falha na autenticação. Verifique seus dados e tente novamente";
      if (err.code === "ECONNREFUSED") msg = "Serviço de autenticação indisponível";
      else if (err.response?.status === 401) msg = "Usuário ou senha inválidos";

      return res.status(503).json({ errors: msg });
    }
  }

  /**
   * GERAR O SEGREDO 2FA
   * → Nunca retornar 500 se usuário não existir
   */
  async setup2FA(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ error: "Username é obrigatório" });

      const result = await loginAdmService.generate2FASecret(username);

      if (result.error) {
        return res.json({ error: result.error });
      }

      return res.json(result);

    } catch (error: any) {
      return res.json({ error: error.message });
    }
  }

  /**
   * VERIFICAR CÓDIGO 2FA
   */
  async verify2FA(req: Request, res: Response) {
    const { username, code } = req.body;
    const userIp = req.ip || req.headers["x-forwarded-for"] || (req.connection as any).remoteAddress;

    try {
      if (!code || code.length !== 6) {
        return res.json({ error: "Código deve ter 6 dígitos" });
      }

      const verified = await loginAdmService.verify2FACode(username, code);

      if (!verified) {
        this.logAuthAttempt({ username, success: false, ip: userIp, reason: "2FA inválido" });
        return res.json({ error: "Código 2FA inválido" });
      }

      this.logAuthAttempt({ username, success: true, ip: userIp, reason: "2FA OK" });

      const token = this.generateToken(username);

      res.cookie("auth_admin", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({ message: "USUÁRIO LOGADO COM SUCESSO", token });

    } catch (error: any) {
      return res.json({ error: error.message });
    }
  }

  /**
   * STATUS 2FA
   */
  async check2FARequired(req: Request, res: Response) {
    try {
      const { username } = req.body;
      if (!username) return res.json({ error: "Username é obrigatório" });

      const status = await loginAdmService.getUser2FAStatus(username);
      return res.json(status);

    } catch (error: any) {
      return res.json({ error: error.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("auth_admin");
    return res.json({ message: "Logout realizado com sucesso" });
  }

  async checkUserAdmin(req: Request, res: Response) {
    const cookie_token = req.cookies?.auth_admin as string | undefined;
    try {
      if (!cookie_token) return res.status(401).json({ errors: "Token ausente" });

      const secret = process.env.TOKEN_SECRET_AD_GROUPS || "default-secret-key";
      const data = jwt.verify(cookie_token, secret) as { username: string };
      return res.json({ username: data.username });

    } catch {
      return res.status(401).json({ errors: "Token inválido" });
    }
  }
}
