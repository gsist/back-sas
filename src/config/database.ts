import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import * as models from '../models';

dotenv.config();

export const sequelize = new Sequelize({
  database: process.env.DATABASE as string,
  username: process.env.DATABASE_USERNAME as string,
  password: process.env.DATABASE_PASSWORD as string,
  host: process.env.DATABASE_HOST as string,
  port: Number(process.env.DATABASE_PORT) || 3306,
  dialect: 'mariadb',
  logging: false,
  models: Object.values(models),
  define: {
    timestamps: false,
    underscored: true,
  },
  dialectOptions: {
    allowPublicKeyRetrieval: true,
    connectTimeout: 10000, // Aumenta timeout para 10 segundos
  },
});

// Tenta autenticar e reconectar automaticamente se falhar
export const initDatabase = async (retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("✅ Conectado ao banco!");
      return;
    } catch (error) {
      console.error(`❌ Erro de conexão (tentativa ${i + 1}):`, error);
      if (i < retries - 1) {
        console.log(`⏳ Tentando reconectar em ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error("💥 Falha ao conectar após múltiplas tentativas.");
      }
    }
  }
};
