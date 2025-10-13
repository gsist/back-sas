// src/database/index.ts
import { ModelStatic, Model } from 'sequelize';
import { sequelize as config } from '../config/database';
import { UsuarioAd, Destaque, Noticia } from "../models";

const models: ModelStatic<Model>[] =  [UsuarioAd, Destaque, Noticia];

const connection = config;

export { connection, models };