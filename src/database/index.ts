// src/database/index.ts
import { ModelStatic, Model } from 'sequelize';
import { sequelize as config } from '../config/database';
import { LoginAdm } from '../models/UsuarioAd'; 
const models: ModelStatic<Model>[] = [
  LoginAdm, 
];

const connection = config;

export { connection, models };