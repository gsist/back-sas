// src/services/LoginAdmService.ts
import { UsuarioAd } from "../models/UsuarioAd";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

export class LoginAdmService {

  async findUser(username: string): Promise<UsuarioAd | null> {
    try {
      return await UsuarioAd.findOne({ where: { username } });
    } catch {
      return null;
    }
  }

  async getUser2FAStatus(username: string) {
    const user = await this.findUser(username);

    if (!user) {
      return {
        error: "Usuário sem acesso",
        has2FA: false,
        is2FASetup: false,
        needs2FASetup: false,
        userId: null,
        username,
        isActive: null
      };
    }

    return {
      has2FA: user.ativo_2fa === 1 && !!user.hash_2fa,
      is2FASetup: !!user.hash_2fa,
      needs2FASetup: user.ativo_2fa === 0 && !!user.hash_2fa,
      userId: user.id,
      username: user.username,
      isActive: user.ch_ativo === 1
    };
  }

  async generate2FASecret(username: string) {
    const user = await this.findUser(username);

    if (!user) {
      return { error: "Usuário sem acesso" };
    }

    if (user.ch_ativo !== 1) {
      return { error: "Usuário inativo" };
    }

    const secret = speakeasy.generateSecret({
      name: `SASC (${username})`,
      issuer: "SASC",
      length: 20
    });

    user.hash_2fa = secret.base32;
    user.ativo_2fa = 0;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url || "");

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      qrCodeUrl,
      username
    };
  }

  async verify2FACode(username: string, code: string) {
    const user = await this.findUser(username);

    if (!user) return false;
    if (!user.hash_2fa) return false;

    const verified = speakeasy.totp.verify({
      secret: user.hash_2fa,
      encoding: "base32",
      token: code,
      window: 4
    });

    if (verified && user.ativo_2fa === 0) {
      user.ativo_2fa = 1;
      await user.save();
    }

    return verified;
  }
}
