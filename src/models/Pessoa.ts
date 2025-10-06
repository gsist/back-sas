// src/models/Pessoa.ts
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { Genero } from './Genero';
import { RacaCor } from './RacaCor';
import { Escolaridade } from './Escolaridade';
import { CondicaoSaude } from './CondicaoSaude';
import { Contato } from './Contato';
import { Renda } from './Renda';
import { Programa } from './Programa';

interface PessoaAttributes {
  id_pessoa: number;
  cpf?: string | undefined;
  nis?: string | undefined;
  rg?: string | undefined;
  nome_completo: string;
  data_nascimento: Date;
  id_genero: number;
  id_raca_cor: number;
  id_instrucao: number;
  id_programa?: number | undefined;
  ativo: boolean;
  status: 'aprovado' | 'rejeitado' | 'pendente';
}

interface PessoaCreationAttributes
  extends Optional<
    PessoaAttributes,
    'id_pessoa' | 'cpf' | 'nis' | 'rg' | 'id_programa' | 'status'
  > {}

@Table({
  tableName: 'tbl_pessoas',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: 'atualizado_em',
})
export class Pessoa extends Model<PessoaAttributes, PessoaCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.BIGINT)
  id_pessoa!: number;

  @Column({ type: DataType.CHAR(11), allowNull: true })
  cpf?: string;

  @Column({ type: DataType.CHAR(11), allowNull: true })
  nis?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  rg?: string;

  @Column({ type: DataType.STRING(255), allowNull: false })
  nome_completo!: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  data_nascimento!: Date;

  @ForeignKey(() => Genero)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_genero!: number;

  @ForeignKey(() => RacaCor)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_raca_cor!: number;

  @ForeignKey(() => Escolaridade)
  @Column({ type: DataType.INTEGER, allowNull: false })
  id_instrucao!: number;

  @ForeignKey(() => Programa)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_programa?: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  ativo!: boolean;

  @Column({
    type: DataType.ENUM('aprovado', 'rejeitado', 'pendente'),
    allowNull: false,
    defaultValue: 'pendente',
  })
  status!: 'aprovado' | 'rejeitado' | 'pendente';

  @BelongsTo(() => Genero)
  genero?: Genero;

  @BelongsTo(() => RacaCor)
  racaCor?: RacaCor;

  @BelongsTo(() => Escolaridade)
  escolaridade?: Escolaridade;

  @BelongsTo(() => Programa)
  programa?: Programa;

  @HasMany(() => CondicaoSaude)
  condicoesSaude?: CondicaoSaude[];

  @HasMany(() => Contato)
  contatos?: Contato[];

  @HasMany(() => Renda)
  rendas?: Renda[];
}
