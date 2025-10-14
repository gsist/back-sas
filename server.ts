// src/server.ts
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize, initDatabase } from './src/config/database';
import routes from './src/routes';
import { QueryTypes } from 'sequelize';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 3001;

// Middleware para JSON
app.use(express.json());

// Configuração do CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Servir arquivos da pasta uploads
const uploadsPath = path.resolve(__dirname, process.env.NODE_ENV === "production" ? "./uploads" : "../src/uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("Servindo uploads em:", uploadsPath);

// Rotas da API
app.use(routes);

// Conecta ao banco e inicia servidor
async function startServer() {
  try {
    await initDatabase(); // Conecta ao banco
    console.log('✅ Modelos inicializados automaticamente via sequelize.models!');

    const versionResult = await sequelize.query<{ version: string }>(
      "SELECT VERSION() as version;",
      { type: QueryTypes.SELECT }
    );

    const versionString = (versionResult[0] as { version: string })?.version || "desconhecida";
    const dbType = versionString.toLowerCase().includes("mariadb") ? "MariaDB" : "MySQL";

    console.log(`🔹 Banco detectado: ${dbType}`);
    console.log(`🔹 Versão do banco: ${versionString}`);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
  }
}

startServer();
