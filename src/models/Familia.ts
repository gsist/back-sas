// src/models/Familia.ts
import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { GrupoFamiliar } from './GrupoFamiliar';
import { Parentesco } from './Parentesco';

@Table({
  tableName: 'tbl_familia',
  timestamps: false,
})
export class Familia extends Model<Familia> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => GrupoFamiliar)
  @Column({ type: DataType.BIGINT, allowNull: true })
  id_chefe_familia?: number;

  @Column({ type: DataType.STRING(255), allowNull: true })
  nome_parentesco?: string;

  @Column({ type: DataType.CHAR(11), allowNull: true })
  cpf_parentesco?: string;

  @ForeignKey(() => Parentesco)
  @Column({ type: DataType.INTEGER, allowNull: true })
  tipo_parentesco?: number;

  @BelongsTo(() => GrupoFamiliar)
  chefeFamilia?: GrupoFamiliar;

  @BelongsTo(() => Parentesco)
  parentesco?: Parentesco;
}