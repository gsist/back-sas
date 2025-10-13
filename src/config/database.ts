// src/config/database.ts

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
 // todos os modelos
  define: {
    timestamps: false,
    underscored: true,
  },
  dialectOptions: {
    allowPublicKeyRetrieval: true,
  },
});

// Testar conexão opcional
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco!");
  } catch (error) {
    console.error("❌ Erro de conexão:", error);
  }
};
