// src/server.ts
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize, initDatabase } from './src/config/database';
import routes from './src/routes';
import { QueryTypes } from 'sequelize';
import "./src/jobs/publicarNoticias";
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND;

app.use(helmet({
  contentSecurityPolicy: false,          
  crossOriginEmbedderPolicy: false,      
  crossOriginResourcePolicy: { policy: "cross-origin" }, 
  xFrameOptions: { action: 'deny' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Middleware para JSON
app.use(express.json());

// Configuração do CORS corrigida
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Lista de origens permitidas (com e sem barra)
    const allowedOrigins = [
      'https://assistenciasocial.jaboatao.pe.gov.br',
      'https://assistenciasocial.jaboatao.pe.gov.br/',
      process.env.CORS_ORIGIN || '*'
    ];
    
    // Verificar se a origem está na lista ou é undefined (para requisições locais)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development' || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS bloqueado para origem: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // 24 horas
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middleware para logging de CORS (opcional, para debug)
app.use((req, res, next) => {
  console.log('🔍 CORS Debug:', {
    origin: req.headers.origin,
    method: req.method,
    path: req.path,
    'user-agent': req.headers['user-agent']?.substring(0, 50)
  });
  next();
});

// Caminho absoluto para a pasta uploads
const uploadsPath = path.join(process.cwd(), "src", "uploads");
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
    console.log(`🔹 CORS configurado para origens: ['https://assistenciasocial.jaboatao.pe.gov.br', 'https://assistenciasocial.jaboatao.pe.gov.br/', '${process.env.CORS_ORIGIN || '*'}']`);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro de conexão:', error);
  }
}

startServer();