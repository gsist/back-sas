// src/database/index.ts
import { ModelStatic, Model } from 'sequelize';
import { sequelize as config } from '../config/database';
import { CondicaoSaude } from '../models/CondicaoSaude';
import { Contato } from '../models/Contato';
import { Escolaridade } from '../models/Escolaridade';
import { Genero } from '../models/Genero';
import { Parentesco } from '../models/Parentesco';
import { Pessoa } from '../models/Pessoa';
import { Programa } from '../models/Programa';
import { RacaCor } from '../models/RacaCor';
import { Renda } from '../models/Renda';
import { Endereco } from '../models/Endereco';
import { Familia } from '../models/Familia';
import { GrupoFamiliar } from '../models/GrupoFamiliar';
import { LoginAdm } from '../models/UsuarioAd'; 
const models: ModelStatic<Model>[] = [
  CondicaoSaude,
  Contato,
  Escolaridade,
  Genero,
  Parentesco,
  Pessoa,
  Programa,
  RacaCor,
  Renda,
  Endereco,
  Familia,
  GrupoFamiliar,
  LoginAdm, 
];

const connection = config;

export { connection, models };