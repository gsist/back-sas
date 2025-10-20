// src/services/LoginAdmService.ts - CORRIGIDO
import { UsuarioAd } from "../models/UsuarioAd";
import * as speakeasy from "speakeasy";
import * as QRCode from 'qrcode';
import { Sequelize, QueryTypes } from 'sequelize';

export class LoginAdmService {
  async findOrCreateUser(username: string): Promise<UsuarioAd> {
    try {
      console.log(`🔍 Buscando usuário: ${username}`);
      
      let user = await UsuarioAd.findOne({ where: { username } });
      
      if (!user) {
        console.log(`📝 Criando novo usuário: ${username}`);
        
        const maxIdResult: any = await UsuarioAd.findOne({
          attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'maxId']],
          raw: true
        });
        
        const nextId = (maxIdResult?.maxId || 0) + 1;
        
        user = await UsuarioAd.create({
          id: nextId,
          username: username,
          nome: this.formatName(username),
          email: `${username}@minhacasa.com`,
          password: null,
          ch_ativo: 1,
          ativo_2fa: 0,
          hash_2fa: null,
          criado_em: new Date()
        } as any);
        
        console.log(`✅ Usuário criado com ID: ${user.id}`);
      } else {
        console.log(`✅ Usuário encontrado: ${user.username} (ID: ${user.id})`);
      }

      return user;
    } catch (error: any) {
      console.error('❌ Erro ao buscar/criar usuário:', error.message);
      if (error.message.includes("Field 'id' doesn't have a default value")) {
        return await this.createUserRaw(username);
      }
      throw new Error(`Erro ao buscar/criar usuário: ${error.message}`);
    }
  }

  private async createUserRaw(username: string): Promise<UsuarioAd> {
    try {
      console.log(`🛠️ Tentando criar usuário com query raw: ${username}`);
      
      const maxIdResult: any = await UsuarioAd.sequelize?.query(
        "SELECT MAX(id) as maxId FROM tbl_usuario",
        { type: QueryTypes.SELECT }
      );
      
      const nextId = (maxIdResult?.[0]?.maxId || 0) + 1;
      
      await UsuarioAd.sequelize?.query(
        `INSERT INTO tbl_usuario (id, username, nome, email, password, ch_ativo, ativo_2fa, hash_2fa, criado_em) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            nextId,
            username,
            this.formatName(username),
            `${username}@minhacasa.com`,
            null,
            1,
            0,
            null,
            new Date()
          ]
        }
      );
      
      const user = await UsuarioAd.findOne({ where: { username } });
      if (!user) {
        throw new Error("Falha ao criar usuário");
      }
      
      console.log(`✅ Usuário criado com ID: ${user.id} (via query raw)`);
      return user;
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário com query raw:', error.message);
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  private formatName(username: string): string {
    return username
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  async getUser2FAStatus(username: string) {
    try {
      console.log(`🔍 Verificando status 2FA para: ${username}`);
      
      let user = await UsuarioAd.findOne({ where: { username } });
      
      if (!user) {
        console.log(`📋 Usuário ${username} não encontrado, retornando status padrão`);
        return {
          has2FA: false,
          is2FASetup: false,
          needs2FASetup: true,
          username: username,
          userId: null
        };
      }
      
      const status = {
        has2FA: user.ativo_2fa === 1 && !!user.hash_2fa,
        is2FASetup: !!user.hash_2fa,
        needs2FASetup: user.ativo_2fa === 0 && !!user.hash_2fa,
        username: user.username,
        userId: user.id
      };
      
      console.log(`📊 Status 2FA para ${username}:`, status);
      return status;
    } catch (error: any) {
      console.error('❌ Erro ao verificar status 2FA:', error.message);
      return {
        has2FA: false,
        is2FASetup: false,
        needs2FASetup: true,
        username: username,
        userId: null
      };
    }
  }

  async generate2FASecret(username: string) {
    try {
      let user = await UsuarioAd.findOne({ where: { username } });
      
      if (!user) {
        user = await this.findOrCreateUser(username);
      }

      console.log(`🔐 Gerando segredo 2FA para: ${username}`);
      
      const secret = speakeasy.generateSecret({
        name: `SASC (${username})`,
        issuer: "SASC",
        length: 20
      });

      console.log(`📋 Segredo base32 gerado: ${secret.base32}`);

      user.hash_2fa = secret.base32;
      user.ativo_2fa = 0;
      await user.save();

      console.log(`✅ Segredo 2FA salvo no banco para: ${username}`);

      const otpauthUrl = secret.otpauth_url;
      console.log(`📱 URL OTPAuth: ${otpauthUrl}`);
      
      const qrCodeUrl = await QRCode.toDataURL(otpauthUrl || '');

      return {
        secret: secret.base32,
        otpauth_url: otpauthUrl,
        qrCodeUrl,
        username: username
      };
    } catch (error: any) {
      console.error('❌ Erro ao gerar segredo 2FA:', error.message);
      throw new Error(`Erro ao gerar segredo 2FA: ${error.message}`);
    }
  }

  async verify2FACode(username: string, code: string): Promise<boolean> {
    try {
      console.log(`🔍 Verificando código 2FA para: ${username}, código: ${code}`);
      
      const user = await UsuarioAd.findOne({ where: { username } });
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      if (!user.hash_2fa) {
        throw new Error("2FA não configurado para este usuário");
      }

      console.log(`📋 Segredo do usuário: ${user.hash_2fa}`);
      
      // CORREÇÃO: Aumentar window para 6 para cobrir atraso de tempo
      const verified = speakeasy.totp.verify({
        secret: user.hash_2fa,
        encoding: "base32",
        token: code,
        window: 6
      });

      console.log(`✅ Resultado verificação: ${verified}`);

      if (verified && user.ativo_2fa === 0) {
        console.log(`🎯 Ativando 2FA para: ${username}`);
        user.ativo_2fa = 1;
        await user.save();
        console.log(`✅ 2FA ativado com sucesso para: ${username}`);
      }

      return verified;
    } catch (error: any) {
      console.error('❌ Erro ao verificar código 2FA:', error.message);
      throw new Error(`Erro ao verificar código 2FA: ${error.message}`);
    }
  }
}